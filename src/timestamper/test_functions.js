/**
 * @file test_functions.js - funkcje testowania obiektow
 */

/**
 * Funkcja do testowania funkcji pod wygodnym przyciskiem
 * aktualnie testy funkcji obliczajacych dane pod raporty i grafy
 */

import { createNewCategory, createNewStamp } from "./timestamper_classes.js";
import {
  calcTimes,
  calcTimesDaily,
  calcTimesDates,
  calcTimesMulti,
  calcTimesMultiDaily,
  calcTimesMultiDates,
} from "./stamp_tools.js";
import { renderWebsite, createEventListeners } from "./timestamper.js";
import {
  renderCatOptions,
  renderCheckboxes,
  renderTimestamps,
} from "./renderers.js";

import {
  filter_checkboxes,
  stamp_cat_input,
  stamp_pagination,
  stamp_time_input,
  bar_cat_input,
} from "./dom_selectors.js";

let test_items_created = 0;
/**
 * Funkcja tworzaca przykladowe obiekty Stamp i Category i renderujaca
 * @param {*} cats - categories list
 * @param {*} stamps - stamps list
 * @returns {Array} [categories, timestamps] - listy do oddania
 */
const testFunction = function (cats, stamps) {
  const newCat1 = createNewCategory("test", "earth-outline", "#5699ff");
  const newCat2 = createNewCategory("test2", "airplane-outline", "#5699ff");
  const newCat3 = createNewCategory("test3", "disc-outline", "#5699ff");
  cats.add(newCat1);
  cats.add(newCat2);
  cats.add(newCat3);
  const newStamp1_1 = createNewStamp(newCat1, new Date(2023, 4, 7), stamps);
  stamps.unshift(newStamp1_1);
  const newStamp1_2 = createNewStamp(newCat1, new Date(2023, 4, 7), stamps);
  stamps.unshift(newStamp1_2);
  const newStamp2_1 = createNewStamp(newCat2, new Date(2023, 4, 7), stamps);
  stamps.unshift(newStamp2_1);
  const newStamp1_3 = createNewStamp(newCat1, new Date(2023, 4, 6), stamps);
  stamps.unshift(newStamp1_3);
  const newStamp1_4 = createNewStamp(newCat1, new Date(2023, 4, 5), stamps);
  stamps.unshift(newStamp1_4);
  const newStamp2_2 = createNewStamp(newCat2, new Date(2023, 4, 5), stamps);
  stamps.unshift(newStamp2_2);
  const newStamp3_1 = createNewStamp(newCat3, new Date(2023, 4, 6), stamps);
  stamps.unshift(newStamp3_1);
  console.log(`calcTimes start: ${calcTimes(newCat1, 1, stamps)}`);
  console.log(`calcTimesDaily: ${calcTimesDaily(newCat1, 2, stamps)}`);
  console.log(
    `calcTimesDate: ${calcTimesDates(
      newCat1,
      new Date(2023, 4, 5),
      new Date(2023, 4, 6),
      stamps
    )}`
  );
  console.log(
    `calcTimesMulti: ${calcTimesMulti([newCat1, newCat2, newCat3], 7, stamps)}`
  );
  console.log(
    `calcTimesMultiDaily: ${calcTimesMultiDaily(
      [newCat1, newCat2, newCat3],
      2,
      stamps
    )}`
  );
  console.log(
    `calcTimesMultiDates: ${calcTimesMultiDates(
      [newCat1, newCat2, newCat3],
      new Date(2023, 4, 5),
      new Date(2023, 4, 5),
      stamps
    )}`
  );
  renderWebsite();
  return [cats, stamps];
};

/**
 *
 * @param {*} cats - categories
 * @param {*} stamps - timestamps
 */
const debugFunction = function (cats, stamps) {
  console.log(`timestamps: ${stamps}`);
  console.log(`categories: ${cats}`);
};

/**
 * funkcja tworzaca kilka przykladowych timestampow oraz kategorii wykorzystujac
 * @see createNewStamp , @see createNewCategory
 * oraz renderujaca strone i tworzaca event listenery dla tych nowych obiektow
 * @param {*} cats - categories
 * @param {*} stamps - timestamps
 * @param {*} checks - checkboxes
 * @param {*} rstamps - renderstamps
 * @returns {*} [categories, timestamps, checkboxes] do odebrania
 *
 */
const createTestItems = function (cats, stamps, checks) {
  const newCat1 = createNewCategory(
    "Programming",
    "git-branch-outline",
    "#80D39B"
  );
  const newCat2 = createNewCategory(
    "Games",
    "game-controller-outline",
    "#FF6000"
  );
  const newCat3 = createNewCategory("DIY", "accessibility-outline", "#EDDEA4");
  const newCats = [newCat1, newCat2, newCat3];
  newCats.forEach((newcat) => {
    let createCat = 1;
    Array.from(cats).forEach((cat) => {
      if (newcat.name === cat.name) {
        createCat = 0;
      }
    });
    if (createCat) {
      cats.add(newcat);
    }
  });
  renderCheckboxes(cats, filter_checkboxes, "CATEGORIES");
  renderCatOptions(cats, stamp_cat_input);
  renderCatOptions(cats, bar_cat_input);
  const catArray = Array.from(cats);
  const newStamp4 = createNewStamp(
    catArray[2],
    new Date(2023, 5 - 1, 2, 9, 41, 2),
    stamps
  );
  stamps.unshift(newStamp4);
  const newStamp3 = createNewStamp(
    catArray[0],
    new Date(2023, 5 - 1, 3, 21, 7, 35),
    stamps
  );
  stamps.unshift(newStamp3);
  const newStamp2 = createNewStamp(
    catArray[1],
    new Date(2023, 5 - 1, 3, 14, 15, 0),
    stamps
  );
  stamps.unshift(newStamp2);
  const newStamp1 = createNewStamp(
    catArray[0],
    new Date(2023, 5 - 1, 4, 17, 29, 1),
    stamps
  );
  stamps.unshift(newStamp1);

  renderWebsite();
  checks = document.querySelectorAll(".cat-filter");
  createEventListeners();
  return [cats, stamps, checks];
};

export { testFunction, debugFunction, createTestItems };
