const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const net = require('node:net');
const { spawn, execFileSync } = require('node:child_process');
const { setTimeout: delay } = require('node:timers/promises');
const root = path.resolve(__dirname, '..');
const sdk = process.env.ANDROID_HOME || path.join(os.homedir(), 'Library/Android/sdk');
const state = process.env.APPIUM_CI_HOME || path.join(os.homedir(), '.jenkins/appium-ci');
const avdHome = path.join(state, 'avd');
const avdDir = path.join(avdHome, 'Clock_CI.avd');
const adb = path.join(sdk, 'platform-tools/adb');
const emulator = path.join(sdk, 'emulator/emulator');
const serial = 'emulator-5580';
const app = process.env.APPIUM_APP_PATH || path.join(os.homedir(), 'Downloads/Clock.apk');
const image = 'system-images/android-37.1/google_apis_playstore_ps16k/arm64-v8a/';
let emulatorProcess;
let tests;
let stopping = false;
const env = { ...process.env, ANDROID_HOME: sdk, ANDROID_AVD_HOME: avdHome,
  APPIUM_UDID: serial, APPIUM_TARGET: 'local', APPIUM_APP_PATH: app };
function adbRun(args) {
  return execFileSync(adb, args, { env, timeout: 15000, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}
async function freePort(port) {
  await new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', () => reject(new Error(`Puerto ${port} ocupado; no se tocarán procesos ajenos.`)));
    server.listen(port, '127.0.0.1', () => server.close(resolve));
  });
}
async function cleanup() {
  if (stopping) return;
  stopping = true;
  if (tests?.pid) { try { process.kill(-tests.pid, 'SIGTERM'); } catch {} }
  if (emulatorProcess?.pid) {
    try { adbRun(['-s', serial, 'emu', 'kill']); } catch {}
    emulatorProcess.kill('SIGTERM');
    if (emulatorProcess.exitCode === null) {
      await Promise.race([new Promise(resolve => emulatorProcess.once('exit', resolve)), delay(10000)]);
      if (emulatorProcess.exitCode === null) emulatorProcess.kill('SIGKILL');
    }
  }
  const logs = path.join(root, 'reports/logs');
  fs.mkdirSync(logs, { recursive: true });
  if (fs.existsSync(path.join(state, 'emulator.log'))) fs.copyFileSync(path.join(state, 'emulator.log'), path.join(logs, 'emulator.log'));
}
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, async () => { await cleanup(); process.exit(130); });
(async () => {
  if (!fs.existsSync(app)) throw new Error(`No se encontró el APK: ${app}. Define APPIUM_APP_PATH.`);
  if (!fs.existsSync(path.join(sdk, image, 'system.img'))) throw new Error(`Falta la imagen Android ARM64: ${image}`);
  await freePort(4723);
  await freePort(5580);
  fs.mkdirSync(avdDir, { recursive: true });
  fs.writeFileSync(path.join(avdHome, 'Clock_CI.ini'), `avd.ini.encoding=UTF-8\npath=${avdDir}\ntarget=android-37.1\n`);
  fs.writeFileSync(path.join(avdDir, 'config.ini'), [
    'AvdId=Clock_CI', 'avd.ini.displayname=Clock CI', 'abi.type=arm64-v8a',
    'hw.cpu.arch=arm64', 'hw.cpu.ncore=2', 'hw.ramSize=3072', 'hw.lcd.width=1080',
    'hw.lcd.height=1920', 'hw.lcd.density=420', 'hw.gpu.enabled=yes', 'hw.gpu.mode=auto',
    'hw.keyboard=yes', 'hw.mainKeys=no', 'disk.dataPartition.size=4G',
    'tag.id=google_apis_playstore', 'PlayStore.enabled=true', `image.sysdir.1=${image}`
  ].join('\n') + '\n');
  const log = fs.openSync(path.join(state, 'emulator.log'), 'w');
  emulatorProcess = spawn(emulator, ['-avd', 'Clock_CI', '-port', '5580', '-no-window', '-no-audio', '-no-snapshot', '-no-boot-anim'], { env, stdio: ['ignore', log, log] });
  fs.closeSync(log);
  console.log('Esperando el emulador Clock_CI (máximo 180 segundos)…');
  const deadline = Date.now() + 180000;
  let booted = false;
  while (Date.now() < deadline) {
    if (emulatorProcess.exitCode !== null) throw new Error('El emulador terminó antes del arranque. Consulta reports/logs/emulator.log.');
    try { booted = adbRun(['-s', serial, 'shell', 'getprop', 'sys.boot_completed']) === '1'; } catch {}
    if (booted) break;
    await delay(2000);
  }
  if (!booted) throw new Error('El emulador no arrancó en 180 segundos.');
  for (const args of [
    ['shell', 'settings', 'put', 'system', 'time_12_24', '24'],
    ['shell', 'settings', 'put', 'global', 'window_animation_scale', '0'],
    ['shell', 'settings', 'put', 'global', 'transition_animation_scale', '0'],
    ['shell', 'settings', 'put', 'global', 'animator_duration_scale', '0']
  ]) adbRun(['-s', serial, ...args]);
  tests = spawn(process.execPath, [path.join(root, 'node_modules/@wdio/cli/bin/wdio.js'), 'run', path.join(root, 'wdio.local.conf.js'), ...process.argv.slice(2)], { cwd: root, env, stdio: 'inherit', detached: true });
  const code = await new Promise((resolve, reject) => { tests.once('error', reject); tests.once('exit', code => resolve(code ?? 1)); });
  await cleanup();
  process.exitCode = code;
})().catch(async error => { console.error(error.message); await cleanup(); process.exitCode = 1; });
