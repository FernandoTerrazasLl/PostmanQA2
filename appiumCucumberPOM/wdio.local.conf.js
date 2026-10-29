const path = require('node:path');
const fs = require('node:fs');
const { config } = require('./wdio.conf');
const app = process.env.APPIUM_APP_PATH;
if (!app || !fs.existsSync(app)) throw new Error('APPIUM_APP_PATH debe apuntar al APK de Reloj.');
exports.config = {
  ...config,
  hostname: '127.0.0.1', port: 4723, path: '/', protocol: 'http',
  services: [['appium', {
    args: { address: '127.0.0.1', port: 4723 },
    logPath: path.join(__dirname, 'reports', 'logs')
  }]],
  capabilities: [{
    platformName: 'Android', 'appium:automationName': 'UiAutomator2',
    'appium:udid': process.env.APPIUM_UDID || 'emulator-5580',
    'appium:app': path.resolve(app),
    'appium:appPackage': 'com.google.android.deskclock',
    'appium:appActivity': 'com.android.deskclock.DeskClock',
    'appium:language': 'en', 'appium:locale': 'US',
    'appium:autoGrantPermissions': true, 'appium:newCommandTimeout': 90
  }]
};
