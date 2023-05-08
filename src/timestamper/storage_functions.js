/**
 * @file storage_functions.js - funkcje oblusgi localStorage albo innego typu storage
 * wygodnie miec w osobnym pliku
 */

/**
 * Funckja z locaStorage bioraca informacje o timestamps oraz kategoriach categories
 */

import {
  filter_checkboxes,
  stamp_cat_input,
  bar_cat_input,
} from "./dom_selectors.js";

import { renderCatOptions, renderCheckboxes } from "./renderers.js";
import { renderWebsite } from "./timestamper.js";

function getFromLocalStorage(stamps, cats) {
  const localStamps = JSON.parse(localStorage.getItem("timestamps"));
  if (localStamps) stamps = localStamps;
  else stamps = [];
  const localCategories = JSON.parse(localStorage.getItem("categories"));
  if (localCategories) cats = new Set(localCategories);
  else cats = new Set();
  return [cats, stamps];
}

function clearLocalStorage(stamps, rstamps, cats) {
  localStorage.clear();
  //also clear website
  stamps = [];
  rstamps = [];
  cats = new Set();
  renderCheckboxes(cats, filter_checkboxes, "CATEGORIES:");
  renderWebsite();
  renderCatOptions(cats, stamp_cat_input);
  renderCatOptions(cats, bar_cat_input);
  return [stamps, rstamps, cats];
}

/**
 * Funkcja do zapisu danych do localStorage
 * @param {*} arr - tablica do zapisania
 * @param {*} arr_name - nazwa pod jaka wpisac w local
 */
const saveToLocalStorage = function (arr, arr_name) {
  localStorage.setItem(`${arr_name}`, JSON.stringify(arr));
};

export { getFromLocalStorage, clearLocalStorage, saveToLocalStorage };
