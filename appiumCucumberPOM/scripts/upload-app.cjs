const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
(async () => {
  const { BROWSERSTACK_USERNAME: user, BROWSERSTACK_ACCESS_KEY: key } = process.env;
  if (!user || !key) throw new Error('Faltan las credenciales BrowserStack.');
  const app = process.env.APPIUM_APP_PATH || path.join(os.homedir(), 'Downloads/Clock.apk');
  const form = new FormData();
  form.append('file', new Blob([fs.readFileSync(app)]), 'Clock.apk');
  form.append('custom_id', 'qa-clock-ci');
  const response = await fetch('https://api-cloud.browserstack.com/app-automate/upload', {
    method: 'POST', headers: { Authorization: `Basic ${Buffer.from(`${user}:${key}`).toString('base64')}` },
    body: form, signal: AbortSignal.timeout(120000)
  });
  const data = await response.json();
  if (!response.ok || !data.app_url) throw new Error(`BrowserStack no permitió subir el APK (HTTP ${response.status}).`);
  console.log(data.app_url);
})().catch(error => { console.error(error.message); process.exitCode = 1; });
