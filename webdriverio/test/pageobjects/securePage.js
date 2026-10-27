import { $, expect } from '@wdio/globals';
import Page from './page.js';

class SecurePage extends Page {
    get flashAlert() { return $('#flash'); }
    get logoutLink() { return $('a[href="/logout"]'); }

    async isMessageDisplayed(expectedText) {
        await expect(this.flashAlert).toBeDisplayed();
        await expect(this.flashAlert).toHaveText(expect.stringContaining(expectedText));
    }
}

export default new SecurePage();
