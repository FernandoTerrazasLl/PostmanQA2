import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const reports = path.join(root, 'reports');

export const config = {
    runner: 'local',
    specs: ['./test/specs/**/*.js'],
    maxInstances: 1,
    injectGlobals: false,
    capabilities: [{
        browserName: 'chrome',
        'wdio:enforceWebDriverClassic': true,
        'goog:chromeOptions': {
            ...(process.env.CHROME_BINARY ? { binary: process.env.CHROME_BINARY } : {}),
            args: ['--headless=new', '--window-size=1440,1000', '--disable-dev-shm-usage']
        }
    }],
    baseUrl: 'https://the-internet.herokuapp.com',
    logLevel: 'warn',
    waitforTimeout: 15000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 2,
    framework: 'mocha',
    reporters: [
        'spec',
        ['junit', {
            outputDir: path.join(reports, 'junit'),
            outputFileFormat: ({ cid }) => `wdio-${cid}.xml`
        }],
        ['allure', {
            outputDir: path.join(reports, 'allure-results'),
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: false,
            addConsoleLogs: true,
            reportedEnvironmentVars: {
                NODE_VERSION: process.version,
                BROWSER: 'chrome'
            }
        }]
    ],
    mochaOpts: { ui: 'bdd', timeout: 60000 },
    async onPrepare() {
        await rm(reports, { recursive: true, force: true });
        await mkdir(path.join(reports, 'junit'), { recursive: true });
        await mkdir(path.join(reports, 'allure-results'), { recursive: true });
        await mkdir(path.join(reports, 'screenshots'), { recursive: true });
    },
    async afterTest(test, context, { passed }) {
        if (!passed) {
            const { browser } = await import('@wdio/globals');
            const name = test.title.replace(/[^a-zA-Z0-9_-]/g, '_');
            try {
                await browser.saveScreenshot(path.join(reports, 'screenshots', `${name}-${Date.now()}.png`));
            } catch (error) {
                console.warn(`No se pudo guardar la captura: ${error.message}`);
            }
        }
    }
};
