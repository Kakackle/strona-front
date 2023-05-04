//FIXME: kwestia do rozwazenia, majac klase close button, zawsze zamykajaca
//parenta, moze mozna przypisac do kazdego wystapienia klasy ten sam event listener
//zamkniecia parenta targetu
//gdzie koniecznie targetu zeby zamykalo tylko jeden a nie wiele? - maybe

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
  dayDiff,
} from "./stamp_tools.js";

import {
  renderCheckboxes,
  renderTimestamps,
  paginateTimestamps,
  renderCatOptions,
} from "./renderers.js";

import { filterByCategory, filterBySearch, applyFilters } from "./filters.js";

let timestamps = [];
let renderStamps = [];
let categories = new Set();
let icons = []; //TODO: chodzilo zeby gdyby grid ikon byl renderowany dynamicznie - co ma sens
// ale pozniej
// let appliedFilters = [];
// let searchQuery = "";
//FIXME: brzydkie takie globalne przechowywanie ale poki co
let selectedIcon = "";
let selected_page = 1;

/* -------------------------------------------------------------------------- */
/*                                   buttons                                  */
/* -------------------------------------------------------------------------- */

const add_stamp_button = document.querySelector(".add-stamp");
const add_drop_stamp = document.querySelector(".add-drop-stamp");
const submit_stamp_button = document.querySelector(".submit-stamp-button");
const close_stamp_drop_button = document.querySelector(".close-stamp-drop");
const add_cat_button = document.querySelector(".add-cat");
const add_drop_cat = document.querySelector(".add-drop-cat");
const submit_cat_button = document.querySelector(".submit-cat-button");
const close_cat_drop_button = document.querySelector(".close-cat-drop");
//////////////////////////////////////////////////////////////
const get_local_button = document.querySelector(".get-local");
const clear_local_button = document.querySelector(".clear-local");
const debug_button = document.querySelector(".debug");
const test_button = document.querySelector(".test");
const test_items_button = document.querySelector(".test-items");

///////////////////////////////////////////////////////////////

/* -------------------------------------------------------------------------- */
/*                                input fields                                */
/* -------------------------------------------------------------------------- */

const stamp_cat_input = document.querySelector(".stamp-cat-input");
const stamp_time_input = document.querySelector(".stamp-time-input");
const cat_name_input = document.querySelector(".cat-name-input");
const cat_color_input = document.querySelector(".cat-color-input");
const cat_icons = document.querySelectorAll(".cat-icon");

/* -------------------------------------------------------------------------- */
/*                  docelowe containery do renderu                            */
/* -------------------------------------------------------------------------- */
const filter_checkboxes = document.querySelector(".filter-checkboxes");
const stamps_container = document.querySelector(".stamps-container");
const stamp_pagination = document.querySelector(".stamp-pagination");
let pages = document.querySelectorAll(".page");

/* -------------------------------------------------------------------------- */
/*                                boxy i search                               */
/* -------------------------------------------------------------------------- */
let checkboxes = document.querySelectorAll(".cat-filter");
const search_input = document.querySelector(".search-input");

//TODO: side container
const getIcon = function (e) {
  selectedIcon = e.target.getAttribute("name");
  cat_icons.forEach((icon) => {
    icon.style.backgroundColor = "white";
  });
  e.target.style.backgroundColor = "#a2a2a2";
};

cat_icons.forEach((icon) => {
  icon.addEventListener("click", (e) => {
    getIcon(e);
  });
});
/**
 * funkcja tworzy nowa kategorie na podstawie inputow ze strony i dodaje do setu
 */
const addNewCategory = function () {
  const name = cat_name_input.value;
  const icon = selectedIcon;
  const color = cat_color_input.value;
  const newCat = createNewCategory(name, icon, color);
  categories.add(newCat);
  renderCheckboxes(categories, filter_checkboxes, "CATEGORIES");
  renderCatOptions(categories, stamp_cat_input);
  //Setu nie mozna JSON.stringify, tylko array
  const categoriesArray = Array.from(categories);
  saveToLocalStorage(categoriesArray, "categories");
  checkboxes = document.querySelectorAll(".cat-filter");
  createCheckboxEvents();
};

submit_cat_button.addEventListener("click", (e) => {
  e.preventDefault();
  addNewCategory();
  add_drop_cat.style.display = "none";
});

const addNewTimestamp = function () {
  const cat_input = stamp_cat_input.value;
  const cat = Array.from(categories).find((obj) => {
    return obj.name === cat_input;
  });
  const time_input = stamp_time_input.value;
  //TODO: !WAZNE! sam time input nie wystarczy? bo do obiektu chcemy podac cale date
  //wiec albo nowy html input type="date" albo jakos wyciagnac cale date tylko z time?
  //bo powiedzmy ze uzytnik moze ustawic tylko godzine dzisiaj, dzien automatycznie dzisiaj,
  //jesli godzina podana
  const dateStamp = new Date();
  const newStamp = createNewStamp(cat, dateStamp, timestamps);
  timestamps.unshift(newStamp);
  paginateTimestamps(
    timestamps,
    stamps_container,
    stamp_pagination,
    10,
    selected_page
  );
  createPageEvents();
};

submit_stamp_button.addEventListener("click", (e) => {
  e.preventDefault();
  addNewTimestamp();
  add_drop_stamp.style.display = "none";
});

/**
 * Funkcja do zapisu danych do localStorage
 * @param {*} arr - tablica do zapisania
 * @param {*} arr_name - nazwa pod jaka wpisac w local
 */
const saveToLocalStorage = function (arr, arr_name) {
  localStorage.setItem(`${arr_name}`, JSON.stringify(arr));
};

const getFromLocalStorage = function () {
  const localStamps = JSON.parse(localStorage.getItem("timestamps"));
  if (localStamps) timestamps = localStamps;
  else timestamps = [];
  const localCategories = JSON.parse(localStorage.getItem("categories"));
  if (localCategories) categories = new Set(localCategories);
  else categories = new Set();
};

get_local_button.addEventListener("click", (e) => {
  getFromLocalStorage();
});

const clearLocalStorage = function () {
  localStorage.clear();
  //also clear website
  timestamps = [];
  renderStamps = [];
  categories = new Set();
  renderCheckboxes(categories, filter_checkboxes, "CATEGORIES:");
  paginateTimestamps(
    renderStamps,
    stamps_container,
    stamp_pagination,
    15,
    selected_page
  );
  renderCatOptions(categories, stamp_cat_input);
};

clear_local_button.addEventListener("click", (e) => {
  clearLocalStorage();
});

const testFunction = function () {};

test_button.addEventListener("click", (e) => {
  testFunction();
});

const debugFunction = function () {
  console.log(`timestamps: ${timestamps}`);
  console.log(`categories: ${categories}`);
};

test_button.addEventListener("click", (e) => {
  testFunction();
});

debug_button.addEventListener("click", (e) => {
  debugFunction();
});

const createTestItems = function () {
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
  categories.add(newCat1);
  categories.add(newCat2);
  categories.add(newCat3);
  renderCheckboxes(categories, filter_checkboxes, "CATEGORIES:");
  renderCatOptions(categories, stamp_cat_input);
  const newStamp4 = createNewStamp(
    newCat3,
    new Date(2023, 5 - 1, 2, 9, 41, 2),
    timestamps
  );
  timestamps.unshift(newStamp4);
  const newStamp3 = createNewStamp(
    newCat1,
    new Date(2023, 5 - 1, 3, 21, 7, 35),
    timestamps
  );
  timestamps.unshift(newStamp3);
  const newStamp2 = createNewStamp(
    newCat2,
    new Date(2023, 5 - 1, 3, 14, 15, 0),
    timestamps
  );
  timestamps.unshift(newStamp2);
  const newStamp1 = createNewStamp(
    newCat1,
    new Date(2023, 5 - 1, 4, 17, 29, 1),
    timestamps
  );
  timestamps.unshift(newStamp1);

  paginateTimestamps(
    timestamps,
    stamps_container,
    stamp_pagination,
    10,
    selected_page
  );
  checkboxes = document.querySelectorAll(".cat-filter");
  createCheckboxEvents();
  createPageEvents();
};

test_items_button.addEventListener("click", (e) => {
  createTestItems();
});

/* -------------------------------------------------------------------------- */
/*                           main funkcja - on load                           */
/* -------------------------------------------------------------------------- */
const mainFunction = function () {
  getFromLocalStorage();
  renderCheckboxes(categories, filter_checkboxes, "CATEGORIES:");
  renderCatOptions(categories, stamp_cat_input);
  paginateTimestamps(
    timestamps,
    stamps_container,
    stamp_pagination,
    10,
    selected_page
  );
  createCheckboxEvents();
  createPageEvents();
  renderStamps = timestamps;
  createEventListeners();
};

mainFunction();

function createCheckboxEvents() {
  checkboxes.forEach((check) => {
    check.addEventListener("change", (e) => {
      e.preventDefault();
      // renderStamps = filterByCategory(timestamps, checkboxes);
      renderStamps = applyFilters(timestamps, checkboxes, search_input);
      paginateTimestamps(
        renderStamps,
        stamps_container,
        stamp_pagination,
        10,
        selected_page
      );
      createPageEvents();
    });
  });
}

search_input.addEventListener("input", (e) => {
  renderStamps = applyFilters(timestamps, checkboxes, search_input);
  paginateTimestamps(
    renderStamps,
    stamps_container,
    stamp_pagination,
    10,
    selected_page
  );
  createPageEvents();
});

function createPageEvents() {
  pages = document.querySelectorAll(".page");
  pages.forEach((page) => {
    page.addEventListener("click", (e) => {
      selected_page = parseInt(e.target.dataset.page);
      renderWebsite();
    });
  });
}

function renderWebsite() {
  paginateTimestamps(
    renderStamps,
    stamps_container,
    stamp_pagination,
    10,
    selected_page
  );
  pages = document.querySelectorAll(".page");
  pages.forEach((page) => {
    page.addEventListener("click", (e) => {
      selected_page = parseInt(e.target.dataset.page);
      renderWebsite();
    });
  });
}

//TODO: refactor renderu i eventlisteners etc
//przy kazdym renderze timestamps z paginacja, dodawalo eventlistenery
//przy kazdym renderze boxow tak samo odpowiednie rendedy
//i kiedy potrzeba wszystkiego to tez pod jedna funkcja

function createEventListeners() {
  add_stamp_button.addEventListener("click", (e) => {
    add_drop_stamp.style.display = "flex";
  });
  close_stamp_drop_button.addEventListener("click", (e) => {
    add_drop_stamp.style.display = "none";
  });
  add_cat_button.addEventListener("click", (e) => {
    add_drop_cat.style.display = "flex";
  });
  close_cat_drop_button.addEventListener("click", (e) => {
    add_drop_cat.style.display = "none";
  });
}
