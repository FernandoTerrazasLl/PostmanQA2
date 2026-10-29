const ClockTabsPage = require('./clockTabsPage');

class StopwatchPage {
  get startButton() { return $('~Start'); }
  get pauseButton() { return $('~Pause'); }
  get lapButton() { return $('~Lap'); }
  get resetButton() { return $('~Reset'); }
  get lapList() { return $('id=com.google.android.deskclock:id/laps_list'); }

  async open() {
    await ClockTabsPage.openStopwatch();
    await this.resetIfNecessary();
  }

  async resetIfNecessary() {
    if (await this.pauseButton.isDisplayed().catch(() => false)) {
      await this.pauseButton.click();
    }
    if (await this.resetButton.isDisplayed().catch(() => false)) {
      await this.resetButton.click();
    }
  }

  async start() {
    await this.startButton.waitForDisplayed({ timeout: 3000 });
    await this.startButton.click();
  }

  async pause() {
    // El mismo botón cambia de "Start" a "Pause" al iniciar. No se espera
    // tiempo de cronómetro: se pulsa inmediatamente para mantener la prueba corta.
    await this.pauseButton.click();
  }

  async registerLap() {
    await this.lapButton.click();
    await this.lapList.waitForDisplayed({ timeout: 3000 });
  }

  async isPaused() {
    return this.startButton.isDisplayed().catch(() => false);
  }

  async hasLap() {
    return this.lapList.isDisplayed().catch(() => false);
  }
}

module.exports = new StopwatchPage();
