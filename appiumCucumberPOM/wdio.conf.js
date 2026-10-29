const fs = require('node:fs');
const path = require('node:path');
const reports = path.join(__dirname, 'reports');
const appId = 'com.google.android.deskclock';

exports.config = {
  runner: 'local', specs: [['./features/**/*.feature']], maxInstances: 1,
  logLevel: 'warn', waitforTimeout: 15000,
  connectionRetryTimeout: 120000, connectionRetryCount: 0, specFileRetries: 0,
  framework: 'cucumber',
  cucumberOpts: {
    require: ['./features/step_definitions/*.js'], timeout: 60000,
    tags: process.env.APPIUM_SUITE === 'smoke' ? '@pausarCronometro' : '', strict: true
  },
  reporters: [
    'spec',
    ['junit', { outputDir: path.join(reports, 'junit'), outputFileFormat: ({ cid }) => `appium-${cid}.xml` }],
    ['allure', {
      outputDir: path.join(reports, 'allure-results'),
      disableWebdriverStepsReporting: true, disableWebdriverScreenshotsReporting: false,
      useCucumberStepReporter: true,
      reportedEnvironmentVars: { APPIUM_TARGET: process.env.APPIUM_TARGET || 'local', APP: 'Google Clock' }
    }]
  ],
  onPrepare() {
    fs.rmSync(reports, { recursive: true, force: true });
    for (const dir of ['junit', 'allure-results', 'screenshots', 'logs']) {
      fs.mkdirSync(path.join(reports, dir), { recursive: true });
    }
  },
  async before() {
    // Clock redraws continuously; the normal idle wait adds ten seconds per command.
    await browser.updateSettings({ waitForIdleTimeout: 100, waitForSelectorTimeout: 1000 });
  },
  async beforeScenario() {
    await browser.terminateApp(appId).catch(() => {});
    await browser.execute('mobile: clearApp', { appId });
    await browser.activateApp(appId);
  },
  async afterScenario(world, result) {
    if (!result.passed) {
      const name = world.pickle.name.replace(/[^a-zA-Z0-9_-]/g, '_');
      await browser.saveScreenshot(path.join(reports, 'screenshots', `${name}-${Date.now()}.png`)).catch(() => {});
      fs.writeFileSync(path.join(reports, 'logs', `${name}.xml`), await browser.getPageSource().catch(() => 'Unavailable'));
    }
  }
};
