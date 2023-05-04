/* -------------------------------------------------------------------------- */
/*                   Definicje klas do programu timestamper                   */
/* -------------------------------------------------------------------------- */
/**
 * @file timestamper_classes.js - class definitions for the timestamper project
 * @author MM
 */

import {
  timeDiffString,
  timeSinceCat,
  getDateString,
  getHrsString,
  calcTimes,
  dayDiff,
} from "./stamp_tools.js";

/**
 * Klasa tworzonych kategorii
 */
class Category {
  constructor(name, icon, color) {
    this.name = name;
    this.icon = icon;
    this.color = color;
  }
}

class Stamp {
  constructor(category, date, dateStr, hrsStr, interval, times) {
    this.category = category;
    this.date = date;
    this.dateStr = dateStr;
    this.hrsStr = hrsStr;
    this.interval = interval;
    this.times = times;
  }
  //do edycji
  setCategory(newCat) {
    this.category = newCat;
  }
  getCategory() {
    return this.category;
  }
  //TODO: wiecej setow i getow? zeby sepracja, bo poki co bralem date bezposrednie zamiast getDate
}

/**
 * Funkcja tworzaca i zwracajaca nowy obiekt klasy Category
 * @param {String} name
 * @param {*} icon
 * @param {*} color
 * @returns {Category} Category object
 */
const createNewCategory = function (name, icon, color) {
  // TODO: moze jakas walidacja danych przy tworzeniu nowej kategorii
  const newCat = new Category(name, icon, color);
  return newCat;
};

/**
 * Funkcja zwracajaca nowy obiekt Stamp, przyjmuje cat, date i tablice timestamps
 * @param {Category} category - obiekt kategori tworzonego stampu
 * @param {*} date - pelny obiekt Date
 * @param {*} table - tablica timestampow na podstawie ktorej obliczane beda interwaly i ilosci wystapien
 * @returns {Stamp} nowy obiekt Stamp
 */
const createNewStamp = function (category, date, table) {
  const interval = timeSinceCat(category, table, date);
  const times = calcTimes(category, 1, table); //1 bo times today
  const newStamp = new Stamp(
    category,
    date,
    getDateString(date),
    getHrsString(date),
    interval,
    times
  );
  return newStamp;
};

export { Category, Stamp, createNewCategory, createNewStamp };
