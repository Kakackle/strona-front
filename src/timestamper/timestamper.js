//TODO: kwestia close-button i np czy moze po prostu zamykac parent parent node zamiast specyficznie
//TODO: !WAZNE! przerzucic one-time selekcje (i moze eventlistenery open-close) do oddzielnego pliku
// i jesli by stworzyc udostepniany obiekt to trzeba by potem odnosic sie [obiekt].element
// ale mozna export default wszystkie elementy stworzone i po prostu importowac modul?
// otoz chuj, bo mozna pisac export let = ... itd
// ale potem jak zaimportujesz * from module, to musisz pisac module.element
//zeby tego unikac, trzeba robic import {element1, element2, } itd, czyli named imports
// mozna tez tego omijac robiac export default ...
// ale na jeden plik moze byc tylko jeden export default

//TODO: testy wszystkich wariacji calctimes na generate_report, bo widze ze bydzie debugowania sporo....
//TODO: zbadac mozliwosc zrobienia eventlistenerow w oddzielnym pliku i np spakowanai ich w jedna funkcje i eksportowanie jej
//a potem tylko importowanie i wywolywanie raz, dla tych one-time
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
} from "./stamp_tools.js";

import {
  renderCheckboxes,
  renderTimestamps,
  paginateTimestamps,
  renderCatOptions,
} from "./renderers.js";

import { filterByCategory, filterBySearch, applyFilters } from "./filters.js";

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
let test_items_created = 0;

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
//////////////// GRAPHS /////////////////
const add_bar_one_button = document.querySelector(".add-bar-one");
const add_bar_multi_button = document.querySelector(".add-bar-multi");
const add_pie_button = document.querySelector(".add-pie");
const submit_bar_graph_button = document.querySelector(".submit-bar-graph");
const submit_multi_graph_button = document.querySelector(".submit-multi-graph");
const submit_pie_graph_button = document.querySelector(".submit-pie-graph");
const close_bar_graph_button = document.querySelector(".close-bar-graph");
const close_multi_graph_button = document.querySelector(".close-multi-graph");
const close_pie_graph_button = document.querySelector(".close-pie-graph");
const bar_graph_container = document.querySelector(".bar-graph-container");
const bar_multi_container = document.querySelector(".bar-multi-container");
const pie_container = document.querySelector(".pie-container");
const report_text = document.querySelector(".report-text");
const generate_report = document.querySelector(".generate-report");

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

/* -------------------------------------------------------------------------- */
/*                                   graphs                                   */
/* -------------------------------------------------------------------------- */
const bar_cat_input = document.querySelector(".bar-cat-input");
const bar_days_input = document.querySelector(".bar-days-input");
const bar_start_input = document.querySelector(".bar-start-input");
const bar_end_input = document.querySelector(".bar-star-input");

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
  let cat_input = stamp_cat_input.value;
  let time_input = stamp_time_input.value;
  const timeNow = new Date();
  if (!cat_input) {
    const catArray = Array.from(categories);
    cat_input = catArray[0].name;
  }
  const cat = Array.from(categories).find((obj) => {
    return obj.name === cat_input;
  });
  if (!time_input) {
    time_input = `${timeNow.getHours()}:${timeNow.getMinutes()}:${timeNow.getSeconds()}`;
  }
  const timeArr = time_input.split(":");
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
  console.log(`timeH: ${timeH}, timeM: ${timeM}, timeS: ${timeS}`);
  const dateStamp = new Date(
    parseInt(timeNow.getFullYear()),
    parseInt(timeNow.getMonth()),
    parseInt(timeNow.getDate()),
    timeH,
    timeM,
    timeS
  );
  console.log(dateStamp);
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

/**
 * Funckja z locaStorage bioraca informacje o timestamps oraz kategoriach categories
 */
const getFromLocalStorage = function () {
  const localStamps = JSON.parse(localStorage.getItem("timestamps"));
  if (localStamps) timestamps = localStamps;
  else timestamps = [];
  const localCategories = JSON.parse(localStorage.getItem("categories"));
  if (localCategories) categories = new Set(localCategories);
  else categories = new Set();
};

const clearLocalStorage = function () {
  localStorage.clear();
  //also clear website
  timestamps = [];
  renderStamps = [];
  categories = new Set();
  renderCheckboxes(categories, filter_checkboxes, "CATEGORIES:");
  renderWebsite();
  renderCatOptions(categories, stamp_cat_input);
  renderCatOptions(categories, bar_cat_input);
};

const testFunction = function () {};

const debugFunction = function () {
  console.log(`timestamps: ${timestamps}`);
  console.log(`categories: ${categories}`);
};

/**
 * funkcja tworzaca kilka przykladowych timestampow oraz kategorii wykorzystujac
 * @see createNewStamp , @see createNewCategory
 * oraz renderujaca strone i tworzaca event listenery dla tych nowych obiektow
 */
const createTestItems = function () {
  if (test_items_created === 0) {
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
    const newCat3 = createNewCategory(
      "DIY",
      "accessibility-outline",
      "#EDDEA4"
    );
    categories.add(newCat1);
    categories.add(newCat2);
    categories.add(newCat3);
    renderCheckboxes(categories, filter_checkboxes, "CATEGORIES");
    renderCatOptions(categories, stamp_cat_input);
    renderCatOptions(categories, bar_cat_input);
    test_items_created = 1;
  }
  const catArray = Array.from(categories);
  const newStamp4 = createNewStamp(
    catArray[2],
    new Date(2023, 5 - 1, 2, 9, 41, 2),
    timestamps
  );
  timestamps.unshift(newStamp4);
  const newStamp3 = createNewStamp(
    catArray[0],
    new Date(2023, 5 - 1, 3, 21, 7, 35),
    timestamps
  );
  timestamps.unshift(newStamp3);
  const newStamp2 = createNewStamp(
    catArray[1],
    new Date(2023, 5 - 1, 3, 14, 15, 0),
    timestamps
  );
  timestamps.unshift(newStamp2);
  const newStamp1 = createNewStamp(
    catArray[0],
    new Date(2023, 5 - 1, 4, 17, 29, 1),
    timestamps
  );
  timestamps.unshift(newStamp1);

  renderWebsite();
  checkboxes = document.querySelectorAll(".cat-filter");
  createEventListeners();
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
  add_drop_stamp.style.display = "flex";
  const timeNow = new Date();
  stamp_cat_input.value = `${timeNow.getHours()}:${timeNow.getMinutes()}:${timeNow.getSeconds()}`;
  stamp_cat_input.setAttribute(
    "max",
    `${timeNow.getHours()}:${timeNow.getMinutes()}`
  );
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
////// GRAPHS ////////
add_bar_one_button.addEventListener("click", (e) => {
  bar_graph_container.style.display = "block";
});
close_bar_graph_button.addEventListener("click", (e) => {
  bar_graph_container.style.display = "none";
});
submit_bar_graph_button.addEventListener("click", (e) => {
  bar_graph_container.style.display = "none";
});
add_bar_multi_button.addEventListener("click", (e) => {
  bar_multi_container.style.display = "block";
});
close_multi_graph_button.addEventListener("click", (e) => {
  bar_multi_container.style.display = "none";
});
submit_multi_graph_button.addEventListener("click", (e) => {
  bar_multi_container.style.display = "none";
});
add_pie_button.addEventListener("click", (e) => {
  pie_container.style.display = "block";
});
close_pie_graph_button.addEventListener("click", (e) => {
  pie_container.style.display = "none";
});
submit_pie_graph_button.addEventListener("click", (e) => {
  pie_container.style.display = "none";
});

//////////////////////
cat_icons.forEach((icon) => {
  icon.addEventListener("click", (e) => {
    getIcon(e);
  });
});
//////////////////////
submit_cat_button.addEventListener("click", (e) => {
  e.preventDefault();
  addNewCategory();
  add_drop_cat.style.display = "none";
});
submit_stamp_button.addEventListener("click", (e) => {
  e.preventDefault();
  addNewTimestamp();
  add_drop_stamp.style.display = "none";
});
/////////////////////
get_local_button.addEventListener("click", (e) => {
  getFromLocalStorage();
});
clear_local_button.addEventListener("click", (e) => {
  clearLocalStorage();
});
test_button.addEventListener("click", (e) => {
  testFunction();
});
test_button.addEventListener("click", (e) => {
  testFunction();
});

debug_button.addEventListener("click", (e) => {
  debugFunction();
});
test_items_button.addEventListener("click", (e) => {
  createTestItems();
  createEventListeners();
});

generate_report.addEventListener("click", (e) => {
  console.log(`generating report...`);
  const cat_name = bar_cat_input.value;
  const cat = Array.from(categories).find((obj) => {
    return obj.name === cat_name;
  });
  //TODO: ogolna funkcja albo na klasie cat typu getCatFromName robiaco to co wyzej
  //a wyciaganie obiektu kategorii przyda sie zeby uzyskac z niej kolor, ikone itd do grafow
  //wiec czesto wykorzystywane
  const days = bar_days_input.value;
  let number = calcTimesDaily(cat, days, timestamps);
  report_text.innerText = number;
  //TODO: ustalic czy calcTimes zlicza tez z dzisiaj, bo chyba cos nie tak
});
////////////////////
search_input.addEventListener("input", (e) => {
  renderStamps = applyFilters(timestamps, checkboxes, search_input);
  renderWebsite();
});

function createEventListeners() {
  ////////////////////
  createCheckboxEvents();
  createPageEvents();
}
