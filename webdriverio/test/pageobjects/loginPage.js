import { $ } from '@wdio/globals';
import Page from './page.js';

class LoginPage extends Page {
    get inputUsername() { return $('#username'); }
    get inputPassword() { return $('#password'); }
    get btnLogin() { return $('button[type="submit"]'); }
    get flashMessage() { return $('#flash'); }

    async login(username, password) {
        await this.inputUsername.setValue(username);
        await this.inputPassword.setValue(password);
        await this.btnLogin.click();
    }

    async open() {
        await super.open('login');
    }
}

export default new LoginPage();
