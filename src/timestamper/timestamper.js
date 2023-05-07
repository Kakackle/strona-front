//TODO: kwestia close-button i np czy moze po prostu zamykac parent parent node zamiast specyficznie
// mozna pisac export let = ... itd
// ale potem jak zaimportujesz * from module, to musisz pisac module.element
//zeby tego unikac, trzeba robic import {element1, element2, } itd, czyli named imports
// mozna tez tego omijac robiac export default ...
// ale na jeden plik moze byc tylko jeden export default

//TODO: cleanup importow
//TODO: kolejnosc w tym pliku zmienic na czytelniejsza

//TODO: mam juz funkcje wyciagajace dane - teraz wykorzystac to w biblio do grafow
import {
  Category,
  Stamp,
  createNewCategory,
  createNewStamp,
} from "./timestamper_classes.js";

import {
  timeDiffString,
  timeSinceCat,
  getDateString,
  getHrsString,
  calcTimes,
  calcTimesDaily,
  calcTimesMulti,
  calcTimesMultiDaily,
  calcTimesDates,
  calcTimesMultiDates,
  dayDiff,
  getCatFromName,
} from "./stamp_tools.js";

import {
  renderCheckboxes,
  renderTimestamps,
  paginateTimestamps,
  renderCatOptions,
} from "./renderers.js";

import { filterByCategory, filterBySearch, applyFilters } from "./filters.js";

import {
  add_stamp_button,
  add_drop_stamp,
  submit_stamp_button,
  close_stamp_drop_button,
  add_cat_button,
  add_drop_cat,
  submit_cat_button,
  close_cat_drop_button,
  add_bar_one_button,
  add_bar_multi_button,
  add_pie_button,
  submit_bar_graph_button,
  submit_multi_graph_button,
  submit_pie_graph_button,
  close_bar_graph_button,
  close_multi_graph_button,
  close_pie_graph_button,
  bar_graph_container,
  bar_multi_container,
  pie_container,
  report_text,
  generate_report,
  get_local_button,
  clear_local_button,
  debug_button,
  test_button,
  test_items_button,
  stamp_cat_input,
  stamp_time_input,
  cat_name_input,
  cat_color_input,
  cat_icons,
  filter_checkboxes,
  stamps_container,
  stamp_pagination,
  search_input,
  bar_cat_input,
  bar_days_input,
  bar_start_input,
  bar_end_input,
} from "./dom_selectors.js";

import { createDropdownEvents } from "./dropdown_events.js";

import {
  testFunction,
  debugFunction,
  createTestItems,
} from "./test_functions.js";

import { getFromLocalStorage, clearLocalStorage } from "./storage_functions.js";

let pages = document.querySelectorAll(".page");
let checkboxes = document.querySelectorAll(".cat-filter");

/**
 * Full array of timestamp objects
 * @type {Array<Stamp>}
 */
let timestamps = [];
/**
 * Filtered/affected array of timestamp objects
 * @type {Array<Stamp>}
 */
let renderStamps = [];
let categories = new Set();
// let appliedFilters = [];
// let searchQuery = "";
//FIXME: brzydkie takie globalne przechowywanie ale poki co
let selectedIcon = "";
let selected_page = 1;
let pagination_amount = 10;

/**
 * Ustawia wybrana ikone selectedIcon na kliknieta oraz ustawia kolor wybranej
 * @param {*} e
 */
const getIcon = function (e) {
  selectedIcon = e.target.getAttribute("name");
  cat_icons.forEach((icon) => {
    icon.style.backgroundColor = "white";
  });
  e.target.style.backgroundColor = "#a2a2a2";
};

/**
 * nie mylic @see createNewCategory
 * funkcja submit tworzaca z inputow nowa kategorie (obiekt Category) na podstawie inputow ze strony i dodaje do setu
 * wykorzystujac do tego funkcje @see createNewCategory oraz sprawdzajac czy nazwa nie jest zajeta
 * oraz @see renderCheckboxes
 */
const addNewCategory = function () {
  const name = cat_name_input.value;
  const icon = selectedIcon;
  const color = cat_color_input.value;
  if (!name || !icon || !color) {
    alert("You must fill all input options");
    return;
  }
  const newCat = createNewCategory(name, icon, color);
  let createCat = 1;
  Array.from(categories).forEach((cat) => {
    if (newCat.name === cat.name) {
      alert(
        `category with ${cat.name} already exists, new category not created`
      );
      createCat = 0;
    }
  });
  if (createCat) {
    categories.add(newCat);
    renderCheckboxes(categories, filter_checkboxes, "CATEGORIES");
    renderCatOptions(categories, stamp_cat_input);
    renderCatOptions(categories, bar_cat_input);
    //Setu nie mozna JSON.stringify, tylko array
    const categoriesArray = Array.from(categories);
    saveToLocalStorage(categoriesArray, "categories");
    checkboxes = document.querySelectorAll(".cat-filter");
    createCheckboxEvents();
  }
};

/**
 * nie mylic @see createNewStamp
 * Funkcja submit tworzaca wykorzystujac inputy nowy obiekt Stamp @see createNewStamp
 * oraz dodajaca do listy @see timestamps
 * wywoluje render timestampow @see renderWebiste()
 */
const addNewTimestamp = function () {
  //obsluga inputow
  let cat_input = stamp_cat_input.value;
  let time_input = stamp_time_input.value;
  const timeNow = new Date();
  //jesli kategoria nie podana
  if (!cat_input) {
    const catArray = Array.from(categories);
    cat_input = catArray[0].name;
  }
  //konwertowanie nazwy na obiekt kategorii
  const cat = Array.from(categories).find((obj) => {
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
  const newStamp = createNewStamp(cat, dateStamp, timestamps);
  timestamps.unshift(newStamp);
  renderWebsite();
};

/**
 * Funkcja do zapisu danych do localStorage
 * @param {*} arr - tablica do zapisania
 * @param {*} arr_name - nazwa pod jaka wpisac w local
 */
const saveToLocalStorage = function (arr, arr_name) {
  localStorage.setItem(`${arr_name}`, JSON.stringify(arr));
};

/* -------------------------------------------------------------------------- */
/*                           main funkcja - on load                           */
/* -------------------------------------------------------------------------- */
const mainFunction = function () {
  getFromLocalStorage();
  renderStamps = timestamps;
  renderCheckboxes(categories, filter_checkboxes, "CATEGORIES:");
  renderCatOptions(categories, stamp_cat_input);
  renderCatOptions(categories, bar_cat_input);
  renderWebsite();
  createEventListeners();
  createDropdownEvents();
};

mainFunction();
/**
 * Funkcja renderujaca strone i dodajaca zdarzenia paginacji
 */
function renderWebsite() {
  paginateTimestamps(
    renderStamps,
    stamps_container,
    stamp_pagination,
    pagination_amount,
    selected_page
  );
  createPageEvents();
}
/**
 * Funkcja dodajaca eventlistenery do obiektow checkboxow filtrów
 */
function createCheckboxEvents() {
  checkboxes.forEach((check) => {
    check.addEventListener("change", (e) => {
      e.preventDefault();
      // renderStamps = filterByCategory(timestamps, checkboxes);
      renderStamps = applyFilters(timestamps, checkboxes, search_input);
      renderWebsite();
    });
  });
}
/**
 * Funkcja dodajaca eventlistenery do swiezo wyrenderowanych elementow paginacji
 */
function createPageEvents() {
  pages = document.querySelectorAll(".page");
  pages.forEach((page) => {
    page.addEventListener("click", (e) => {
      selected_page = parseInt(e.target.dataset.page);
      renderWebsite();
    });
  });
}

add_stamp_button.addEventListener("click", (e) => {
  const timeNow = new Date();
  stamp_cat_input.value = `${timeNow.getHours()}:${timeNow.getMinutes()}:${timeNow.getSeconds()}`;
  stamp_cat_input.setAttribute(
    "max",
    `${timeNow.getHours()}:${timeNow.getMinutes()}`
  );
});

submit_cat_button.addEventListener("click", (e) => {
  e.preventDefault();
  addNewCategory();
});
submit_stamp_button.addEventListener("click", (e) => {
  e.preventDefault();
  addNewTimestamp();
});

//////////////////////
cat_icons.forEach((icon) => {
  icon.addEventListener("click", (e) => {
    getIcon(e);
  });
});
//////////////////////

generate_report.addEventListener("click", (e) => {
  const cat_name = bar_cat_input.value;
  const cat = getCatFromName(cat_name, categories);
  const days = parseInt(bar_days_input.value);
  let number = calcTimesDaily(cat, days, timestamps);
  report_text.innerText = number;
});
////////////////////
search_input.addEventListener("input", (e) => {
  renderStamps = applyFilters(timestamps, checkboxes, search_input);
  renderWebsite();
});
/**
 * Funkcja dodajaca event listenery do aktualizujacych sie elementow typu checkboxy, paginacja
 */
function createEventListeners() {
  createCheckboxEvents();
  createPageEvents();
}

get_local_button.addEventListener("click", (e) => {
  [categories, timestamps] = getFromLocalStorage(categories, timestamps);
});
clear_local_button.addEventListener("click", (e) => {
  [timestamps, renderStamps, categories] = clearLocalStorage(
    timestamps,
    renderStamps,
    categories
  );
});
test_button.addEventListener("click", (e) => {
  [categories, timestamps] = testFunction(categories, timestamps);
});

debug_button.addEventListener("click", (e) => {
  debugFunction(categories, timestamps);
});
test_items_button.addEventListener("click", (e) => {
  [categories, timestamps, checkboxes] = createTestItems(
    categories,
    timestamps,
    checkboxes
  );
  renderStamps = applyFilters(timestamps, checkboxes, search_input);
  renderWebsite();
  createEventListeners();
});

export {
  clearLocalStorage,
  createEventListeners,
  getFromLocalStorage,
  renderWebsite,
};
