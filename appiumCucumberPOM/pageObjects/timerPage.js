const ClockTabsPage = require('./clockTabsPage');

class TimerPage {
  get startButton() { return $('~Start'); }
  get pauseButton() { return $('~Pause'); }
  get resetButton() { return $('~Reset'); }
  get deleteButton() { return $('~Delete'); }

  digitButton(digit) {
    return $(`id=com.google.android.deskclock:id/timer_setup_digit_${digit}`);
  }

  async open() {
    await ClockTabsPage.openTimer();
    await this.clearExistingTimer();
  }

  async clearExistingTimer() {
    if (await this.pauseButton.isDisplayed().catch(() => false)) {
      await this.pauseButton.click();
    }
    if (await this.resetButton.isDisplayed().catch(() => false)) {
      await this.resetButton.click();
    }
    if (await this.deleteButton.isDisplayed().catch(() => false)) {
      await this.deleteButton.click();
    }
  }

  async configureOneMinute() {
    // El teclado acepta mm:ss; 0100 representa un minuto exacto.
    for (const digit of ['0', '1', '0', '0']) {
      await this.digitButton(digit).click();
    }
  }

  async start() {
    await this.startButton.waitForDisplayed({ timeout: 3000 });
    await this.startButton.click();
  }

  async pause() {
    // Se pausa inmediatamente; no se deja correr el minuto configurado.
    await this.pauseButton.click();
  }

  async isPaused() {
    return this.startButton.isDisplayed().catch(() => false);
  }
}

module.exports = new TimerPage();
