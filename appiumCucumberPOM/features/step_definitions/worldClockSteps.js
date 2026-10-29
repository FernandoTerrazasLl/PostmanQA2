const { Given, When, Then } = require('@wdio/cucumber-framework');
const assert = require('assert');
const WorldClockPage = require('../../pageObjects/worldClockPage');

Given('Estoy en la pestaña de reloj mundial', async () => {
  await WorldClockPage.open();
});

Given('La ciudad {string} existe en el reloj mundial', async (city) => {
  if (!(await WorldClockPage.isCityDisplayed(city))) {
    await WorldClockPage.addCity(city);
  }
});

When('Agrego la ciudad {string} al reloj mundial', async (city) => {
  await WorldClockPage.addCity(city);
});

When('Elimino la ciudad {string} del reloj mundial', async (city) => {
  await WorldClockPage.removeCity(city);
});

Then('La ciudad {string} debería estar visible en el reloj mundial', async (city) => {
  assert.strictEqual(await WorldClockPage.isCityDisplayed(city), true, `No se muestra ${city}`);
});

Then('La ciudad {string} no debería existir en el reloj mundial', async (city) => {
  assert.strictEqual(await WorldClockPage.isCityDisplayed(city), false, `${city} todavía se muestra`);
});
