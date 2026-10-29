const ClockTabsPage = require('./clockTabsPage');

class WorldClockPage {
  get addCityButton() { return $('id=com.google.android.deskclock:id/fab'); }
  get searchField() { return $('id=com.google.android.deskclock:id/open_search_view_edit_text'); }
  get deleteAction() { return $('id=com.google.android.deskclock:id/action_delete'); }
  get removeButton() { return $('android=new UiSelector().textMatches("(?i)remove|delete")'); }

  city(city) {
    return $(`android=new UiSelector().resourceId("com.google.android.deskclock:id/city_name").text("${city}")`);
  }

  citySearchResult(city) {
    const label = city === 'La Paz' ? 'La Paz, Bolivia' : city;
    return $(`android=new UiSelector().resourceId("com.google.android.deskclock:id/city_name").text("${label}")`);
  }

  async open() {
    await ClockTabsPage.openWorldClock();
    await this.addCityButton.waitForDisplayed({ timeout: 5000 });
  }

  async isCityDisplayed(city) {
    return this.city(city).isDisplayed().catch(() => false);
  }

  async removeCityIfPresent(city) {
    if (await this.isCityDisplayed(city)) {
      await this.removeCity(city);
    }
  }

  async addCity(city) {
    await this.removeCityIfPresent(city);
    await this.addCityButton.click();
    await this.searchField.waitForDisplayed({ timeout: 5000 });
    await this.searchField.setValue(city);
    const result = this.citySearchResult(city);
    await result.waitForDisplayed({ timeout: 5000 });
    await result.click();
    await this.city(city).waitForDisplayed({ timeout: 5000 });
  }

  async removeCity(city) {
    const cityElement = await this.city(city);
    await cityElement.waitForDisplayed({ timeout: 5000 });
    const location = await cityElement.getLocation();
    const { width } = await browser.getWindowSize();
    await browser.execute('mobile: swipeGesture', {
      left: Math.round(width * 0.1), top: location.y,
      width: Math.round(width * 0.8), height: 80, direction: 'left', percent: 0.9
    });

    await cityElement.waitForDisplayed({ reverse: true, timeout: 5000 });
  }
}

module.exports = new WorldClockPage();
