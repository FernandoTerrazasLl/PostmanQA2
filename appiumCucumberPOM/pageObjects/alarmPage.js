class AlarmPage {
  get alarmTab() { return $('id=com.google.android.deskclock:id/tab_menu_alarm'); }
  get addButton() { return $('~Add alarm'); }
  get okBtn() { return $('id=com.google.android.deskclock:id/material_timepicker_ok_button'); }
  get cancelBtn() { return $('id=com.google.android.deskclock:id/material_timepicker_cancel_button'); }
  get hourSelector() { return $('id=com.google.android.deskclock:id/material_hour_tv'); }
  get minuteSelector() { return $('id=com.google.android.deskclock:id/material_minute_tv'); }
  get clockFace() { return $('id=com.google.android.deskclock:id/material_clock_face'); }

  // Limita la búsqueda a la carátula para no confundir el valor mostrado en
  // la cabecera (por ejemplo, "10") con un número seleccionable del reloj.
  clockValue(value) {
    return this.clockFace.$(`android=new UiSelector().text("${value}")`);
  }

  alarmWithTime(time) {
    return $(`android=new UiSelector().resourceId("com.google.android.deskclock:id/digital_clock").textContains("${time}")`);
  }

  async openAlarmTab() {
    // Recupera la pantalla base si un escenario anterior dejó un diálogo abierto.
    if (await this.cancelBtn.isDisplayed().catch(() => false)) {
      await this.cancelBtn.click();
    }

    await this.alarmTab.waitForDisplayed({ timeout: 5000 });
    if (!(await this.alarmTab.isSelected())) {
      await this.alarmTab.click();
    }
    await this.addButton.waitForDisplayed({ timeout: 5000 });
  }

  async selectTime(hour, minute) {
    await this.hourSelector.click();
    await this.clockValue(hour).waitForDisplayed({ timeout: 5000 });
    await this.clockValue(hour).click();

    // No depende de la transición automática de hora a minutos.
    await this.minuteSelector.click();
    await this.clockValue(minute).waitForDisplayed({ timeout: 5000 });
    await this.clockValue(minute).click();
  }

  async createAlarm(hour, minute) {
    await this.addButton.waitForDisplayed({ timeout: 5000 });
    await this.addButton.click();
    await this.selectTime(hour, minute);
    await this.okBtn.click();
  }

  async isAlarmDisplayed(time) {
    const alarm = this.alarmWithTime(time);
    await alarm.waitForDisplayed({ timeout: 5000 });
    return alarm.isDisplayed();
  }

  async cancelAlarm(hour, minute) {
    await this.addButton.waitForDisplayed({ timeout: 5000 });
    await this.addButton.click();
    await this.selectTime(hour, minute);
    await this.cancelBtn.click();
  }

  async deleteAlarm(time) {
    const alarm = this.alarmWithTime(time);
    await alarm.waitForDisplayed({ timeout: 5000 });

    const expandButton = $(`android=new UiSelector().resourceId("com.google.android.deskclock:id/arrow").descriptionContains("${time}")`);
    await expandButton.waitForDisplayed({ timeout: 5000 });

    if ((await expandButton.getAttribute('content-desc')).startsWith('Expand')) {
      await expandButton.click();
    }

    const deleteButton = $('id=com.google.android.deskclock:id/delete');
    await deleteButton.waitForDisplayed({ timeout: 5000 });
    await deleteButton.click();
  }
}

module.exports = new AlarmPage();
