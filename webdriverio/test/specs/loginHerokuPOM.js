import { browser, expect } from '@wdio/globals';
import LoginPage from '../pageobjects/loginPage.js';
import SecurePage from '../pageobjects/securePage.js';

describe('Login en HerokuApp con POM', () => {
    beforeEach(async () => {
        await browser.deleteCookies();
        await LoginPage.open();
    });

    it('Debe iniciar sesión exitosamente con credenciales válidas', async () => {
        await LoginPage.login('tomsmith', 'SuperSecretPassword!');
        await expect(browser).toHaveUrl(expect.stringContaining('/secure'));
        await SecurePage.isMessageDisplayed('You logged into a secure area!');
        await expect(SecurePage.logoutLink).toBeDisplayed();
    });

    it('Debe fallar el login con credenciales inválidas', async () => {
        await LoginPage.login('usuario_invalido', 'clave_invalida');
        await expect(browser).toHaveUrl(expect.stringContaining('/login'));
        await expect(LoginPage.flashMessage).toHaveText(expect.stringContaining('Your username is invalid!'));
        await expect(LoginPage.inputUsername).toBeDisplayed();
    });
});
