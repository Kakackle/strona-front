import {
  cat_name_input,
  cat_color_input,
  filter_checkboxes,
  stamp_cat_input,
  bar_cat_input,
  stamp_time_input,
} from "./dom_selectors.js";

import { createNewCategory, createNewStamp } from "./timestamper_classes.js";

import { renderCheckboxes, renderCatOptions } from "./renderers.js";
import { createCheckboxEvents, renderWebsite } from "./timestamper.js";
import { saveToLocalStorage } from "./storage_functions.js";

/**
 * nie mylic @see createNewCategory
 * funkcja submit tworzaca z inputow nowa kategorie (obiekt Category) na podstawie inputow ze strony i dodaje do setu
 * wykorzystujac do tego funkcje @see createNewCategory oraz sprawdzajac czy nazwa nie jest zajeta
 * oraz @see renderCheckboxes
 * @param {*} cats - categories
 * @param {*} checks - checkboxes
 * @param {*} selIcon - selectedIcon
 * @return {Array} - returns updated [categories, checkboxes]
 */
const addNewCategory = function (cats, checks, selIcon) {
  const name = cat_name_input.value;
  const icon = selIcon;
  const color = cat_color_input.value;
  if (!name || !icon || !color) {
    alert("You must fill all input options");
    return;
  }
  const newCat = createNewCategory(name, icon, color);
  let createCat = 1;
  Array.from(cats).forEach((cat) => {
    if (newCat.name === cat.name) {
      alert(
        `category with ${cat.name} already exists, new category not created`
      );
      createCat = 0;
    }
  });
  if (createCat) {
    cats.add(newCat);
    renderCheckboxes(cats, filter_checkboxes, "CATEGORIES");
    renderCatOptions(cats, stamp_cat_input);
    renderCatOptions(cats, bar_cat_input);
    //Setu nie mozna JSON.stringify, tylko array
    const categoriesArray = Array.from(cats);
    saveToLocalStorage(categoriesArray, "categories");
    checks = document.querySelectorAll(".cat-filter");
    createCheckboxEvents();
  }
  return [cats, checks];
};

/**
 * nie mylic @see createNewStamp
 * Funkcja submit tworzaca wykorzystujac inputy nowy obiekt Stamp @see createNewStamp
 * oraz dodajaca do listy @see timestamps
 * wywoluje render timestampow @see renderWebiste()
 * @param {*} cats - categories
 * @param {*} stamps - timestamps
 * @return {Array} - returns updated [categories, timestamps]
 */
const addNewTimestamp = function (cats, stamps) {
  //obsluga inputow
  let cat_input = stamp_cat_input.value;
  let time_input = stamp_time_input.value;
  const timeNow = new Date();
  //jesli kategoria nie podana
  if (!cat_input) {
    const catArray = Array.from(cats);
    cat_input = catArray[0].name;
  }
  //konwertowanie nazwy na obiekt kategorii
  const cat = Array.from(cats).find((obj) => {
    return obj.name === cat_input;
  });
  //jesli czas nie podany, podaj czas teraz
  if (!time_input) {
    time_input = `${timeNow.getHours()}:${timeNow.getMinutes()}:${timeNow.getSeconds()}`;
  }
  const timeArr = time_input.split(":");
  //format usuwajacy 0 sprzed pojedynczych cyfr
  let timeH = timeArr[0];
  if (timeH[0] === "0") timeH = parseInt(timeH[1]);
  else {
    timeH = parseInt(timeH);
  }
  let timeM = timeArr[1];
  if (timeM[0] === "0") timeM = parseInt(timeM[1]);
  else {
    timeM = parseInt(timeM);
  }
  let timeS = timeArr[2];
  if (timeS[0] === "0") timeS = parseInt(timeS[1]);
  else {
    timeS = parseInt(timeS);
  }
  //tworzenie obiektu Stamp
  const dateStamp = new Date(
    parseInt(timeNow.getFullYear()),
    parseInt(timeNow.getMonth()),
    parseInt(timeNow.getDate()),
    timeH,
    timeM,
    timeS
  );
  const newStamp = createNewStamp(cat, dateStamp, stamps);
  stamps.unshift(newStamp);
  renderWebsite();
  return [cats, stamps];
};

export { addNewCategory, addNewTimestamp };
