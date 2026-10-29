const { Given, When, Then } = require('@wdio/cucumber-framework');
const assert = require('assert');
const StopwatchPage = require('../../pageObjects/stopwatchPage');

Given('Estoy en la pestaña de cronómetro', async () => {
  await StopwatchPage.open();
});

When('Inicio el cronómetro', async () => {
  await StopwatchPage.start();
});

When('Pauso el cronómetro', async () => {
  await StopwatchPage.pause();
});

When('Registro una vuelta del cronómetro', async () => {
  await StopwatchPage.registerLap();
});

Then('El cronómetro debería estar pausado', async () => {
  assert.strictEqual(await StopwatchPage.isPaused(), true, 'El cronómetro sigue en ejecución');
});

Then('La vuelta del cronómetro debería estar visible', async () => {
  assert.strictEqual(await StopwatchPage.hasLap(), true, 'No se registró la vuelta');
});
