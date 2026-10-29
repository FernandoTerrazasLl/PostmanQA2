const { Given, When, Then } = require('@wdio/cucumber-framework');
const AlarmPage = require('../../pageObjects/alarmPage.js');
const assert = require('assert');

Given('Estoy en la pestaña de alarmas', async () => {
    await AlarmPage.openAlarmTab();
    await browser.takeScreenshot();
});

When('Creo una alarma a las {string} horas y {string} minutos', async (hora, minuto) => {
    await AlarmPage.createAlarm(hora, minuto);
    await browser.takeScreenshot();
});

When('Cancelo la creación de una alarma a las {string} horas y {string} minutos', async (hora, minuto) => {
    await AlarmPage.cancelAlarm(hora, minuto);
    await browser.takeScreenshot();
});

Then('La alarma a las {string}:{string} debería estar visible', async (hora, minuto) => {
    const tiempo = `${hora}:${minuto}`;
    const estaVisible = await AlarmPage.isAlarmDisplayed(tiempo);
    assert.strictEqual(estaVisible, true, `La alarma a las ${tiempo} no está visible`);
    await browser.takeScreenshot();
});

When('Elimino la alarma a las {string}:{string}', async (hora, minuto) => {
    const tiempo = `${hora}:${minuto}`;
    await AlarmPage.deleteAlarm(tiempo);
    await browser.takeScreenshot();
});

Then('La alarma a las {string}:{string} no debería existir', async (hora, minuto) => {
    const tiempo = `${hora}:${minuto}`;
    let existe = true;
    try {
        existe = await AlarmPage.isAlarmDisplayed(tiempo);
    } catch (err) {
        existe = false;
    }
    assert.strictEqual(existe, false, `La alarma a las ${tiempo} todavía existe`);
    await browser.takeScreenshot();
});
