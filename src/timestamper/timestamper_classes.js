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
 * Category class object
 * @typedef {Object} Category
 * @param {String} name - category name string
 * @param {String} icon - icon name
 * @param {String}  color - color string in hex format
 */
class Category {
  constructor(name, icon, color) {
    this.name = name;
    this.icon = icon;
    this.color = color;
  }
  toString() {
    return `Cat; name: ${this.name}`;
  }
}

/**
 * Category class object
 * @typedef {Object} Stamp
 * @param {Category} category - supplied Category object
 * @param {Date} date - set or automatic Date object
 * @param {String}  dateStr - date in string format (DD:MM:YY)
 * @param {String}  dateHrs - hour part of date in string format (HH:MM:SS)
 * @param {String} interval - time in string format since last instance of object with category
 * @param {Number} times - number of category instance objects in timestamps today (getDate)
 */
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
  toString() {
    return `[Stamp; cat: ${this.category.name}, dateStr: ${this.dateStr}]`;
  }
}

/**
 * Funkcja tworzaca i zwracajaca nowy obiekt klasy Category
 * @param {String} name
 * @param {*} icon
 * @param {*} color
 * @returns {Category} Category object
 */
const createNewCategory = function (name, icon, color) {
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
  // console.log(`creating stamp of category: ${category.name}
  // with date: ${date}, calcTimes result: ${times} table: ${table}`);
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
