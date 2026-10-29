class ClockTabsPage {
  get worldClockTab() { return $('id=com.google.android.deskclock:id/tab_menu_clock'); }
  get stopwatchTab() { return $('id=com.google.android.deskclock:id/tab_menu_stopwatch'); }
  get timerTab() { return $('id=com.google.android.deskclock:id/tab_menu_timer'); }

  async open(tab) {
    await tab.waitForDisplayed({ timeout: 5000 });
    if (!(await tab.isSelected())) {
      await tab.click();
    }
  }

  async openWorldClock() { await this.open(this.worldClockTab); }
  async openStopwatch() { await this.open(this.stopwatchTab); }
  async openTimer() { await this.open(this.timerTab); }
}

module.exports = new ClockTabsPage();
