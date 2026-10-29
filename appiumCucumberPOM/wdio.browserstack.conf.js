const { config } = require('./wdio.conf');
const fs = require('node:fs');
const path = require('node:path');
let sessionId;
for (const name of ['BROWSERSTACK_USERNAME', 'BROWSERSTACK_ACCESS_KEY', 'BROWSERSTACK_APP_ID']) {
  if (!process.env[name]) throw new Error(`${name} es obligatorio para BrowserStack.`);
}
exports.config = {
  ...config,
  user: process.env.BROWSERSTACK_USERNAME, key: process.env.BROWSERSTACK_ACCESS_KEY,
  hostname: 'hub.browserstack.com', port: 443, path: '/wd/hub', protocol: 'https',
  services: [['browserstack', { browserstackLocal: false, testObservability: false }]],
  async before(...args) {
    sessionId = browser.sessionId;
    await config.before(...args);
  },
  async afterSession() {
    if (!sessionId) return;
    try {
      const auth = Buffer.from(`${process.env.BROWSERSTACK_USERNAME}:${process.env.BROWSERSTACK_ACCESS_KEY}`).toString('base64');
      const response = await fetch(`https://api-cloud.browserstack.com/app-automate/sessions/${sessionId}.json`, {
        headers: { Authorization: `Basic ${auth}` }, signal: AbortSignal.timeout(15000)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const { automation_session: session } = await response.json();
      const summary = { sessionId, url: session.browser_url, status: session.status, duration: session.duration };
      fs.writeFileSync(path.join(__dirname, 'reports/browserstack-session.json'), JSON.stringify(summary, null, 2));
      console.log(`BrowserStack: ${summary.url}`);
    } catch (error) {
      console.warn(`No se pudo consultar el enlace de la sesión BrowserStack: ${error.message}`);
    }
  },
  capabilities: [{
    platformName: 'Android', 'appium:automationName': 'UiAutomator2',
    'appium:app': process.env.BROWSERSTACK_APP_ID,
    'appium:language': 'en', 'appium:locale': 'US',
    'bstack:options': {
      deviceName: 'Google Pixel 8', osVersion: '14.0',
      projectName: 'Proyecto QA',
      buildName: `Newman_Example Appium #${process.env.BUILD_NUMBER || 'local'}`,
      sessionName: 'Reloj Cucumber POM', local: false, debug: true, video: true
    }
  }]
};
