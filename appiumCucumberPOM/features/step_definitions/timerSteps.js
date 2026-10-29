const { Given, When, Then } = require('@wdio/cucumber-framework');
const assert = require('assert');
const TimerPage = require('../../pageObjects/timerPage');

Given('Estoy en la pestaña de temporizador', async () => {
  await TimerPage.open();
});

When('Configuro un temporizador de un minuto', async () => {
  await TimerPage.configureOneMinute();
});

When('Inicio el temporizador', async () => {
  await TimerPage.start();
});

When('Pauso el temporizador', async () => {
  await TimerPage.pause();
});

Then('El temporizador debería estar pausado', async () => {
  assert.strictEqual(await TimerPage.isPaused(), true, 'El temporizador sigue en ejecución');
});
