//TODO: kwestia close-button i np czy moze po prostu zamykac parent parent node zamiast specyficznie
// mozna pisac export let = ... itd
// ale potem jak zaimportujesz * from module, to musisz pisac module.element
//zeby tego unikac, trzeba robic import {element1, element2, } itd, czyli named imports
// mozna tez tego omijac robiac export default ...
// ale na jeden plik moze byc tylko jeden export default

//TODO: kwestia wyboru days albo dates
//mozna moze sprawdzac czy jest cos wpisane w start i end date i jak tak to wersja dates
//albo latwiej z wykorzystaniem jakiegod dodatkowego checka obok wyboru czasu, ze korzystaj z dates..
//TODO: limit wybranych checkboxow:
// https://stackoverflow.com/questions/19001844/how-to-limit-the-number-of-selected-checkboxes
/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */

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
  renderGraphCheckboxes,
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
  submit_bar_graph_dates_button,
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
  bar_multi_cat_input,
  multi_days_input,
  multi_start_input,
  multi_end_input,
  pie_cat_input,
  pie_days_input,
  pie_start_input,
  pie_end_input,
} from "./dom_selectors.js";

import { createDropdownEvents } from "./dropdown_events.js";

import {
  testFunction,
  debugFunction,
  createTestItems,
} from "./test_functions.js";

import {
  getFromLocalStorage,
  clearLocalStorage,
  saveToLocalStorage,
} from "./storage_functions.js";

import { addNewCategory, addNewTimestamp } from "./add_new_functions.js";

import {
  createBarDailyGraph,
  setupBarDailyData,
  createPieDailyGraph,
} from "./bar_chart.js";

/* -------------------------------------------------------------------------- */
/*                                 global vars                                */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*                              obsluga dodawania                             */
/* -------------------------------------------------------------------------- */

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
  [categories, checkboxes] = addNewCategory(
    categories,
    checkboxes,
    selectedIcon
  );
});
submit_stamp_button.addEventListener("click", (e) => {
  e.preventDefault();
  [categories, timestamps] = addNewTimestamp(categories, timestamps);
});

//////////////////////
cat_icons.forEach((icon) => {
  icon.addEventListener("click", (e) => {
    getIcon(e);
  });
});
//////////////////////

search_input.addEventListener("input", (e) => {
  renderStamps = applyFilters(timestamps, checkboxes, search_input);
  renderWebsite();
});

/* -------------------------------------------------------------------------- */
/*                           main funkcja - on load                           */
/* -------------------------------------------------------------------------- */
const mainFunction = function () {
  getFromLocalStorage();
  renderStamps = timestamps;
  // renderCheckboxes(categories, filter_checkboxes, "CATEGORIES");
  renderAllCheckboxes();
  renderCatOptions(categories, stamp_cat_input);
  renderCatOptions(categories, bar_cat_input);
  renderWebsite();
  createEventListeners();
  createDropdownEvents();
};

mainFunction();

/* -------------------------------------------------------------------------- */
/*  obsluga dynamicznego renderowania strony i event listenerow               */
/* -------------------------------------------------------------------------- */

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
function renderAllCheckboxes() {
  renderCheckboxes(categories, filter_checkboxes, "CATEGORIES");
  renderGraphCheckboxes(categories, bar_multi_cat_input, "multi-bar-cat");
  renderGraphCheckboxes(categories, pie_cat_input, "pie-cat");
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

/**
 * Funkcja dodajaca event listenery do aktualizujacych sie elementow typu checkboxy, paginacja
 */
function createEventListeners() {
  createCheckboxEvents();
  createPageEvents();
}

/* -------------------------------------------------------------------------- */
/*                               obsluga grafow                               */
/* -------------------------------------------------------------------------- */

generate_report.addEventListener("click", (e) => {
  const cat_name = bar_cat_input.value;
  const cat = getCatFromName(cat_name, categories);
  const days = parseInt(bar_days_input.value);
  let number = calcTimesDaily(cat, days, timestamps);
  report_text.innerText = number;
  const catArray = Array.from(categories);
  let data = undefined;
  let y_max = 0;
  [data, y_max] = setupBarDailyData(catArray, days, timestamps);
  //reading chosen graph type
  const one_radios = document.querySelectorAll(".graph-type-radio-one");
  let one_type = "bar";
  one_radios.forEach((radio) => {
    if (radio.checked) one_type = radio.value;
  });
  //clearing canvas in case a graph already exists
  const bar_graph_background = document.getElementsByClassName(
    "bar-graph-background"
  );
  console.log(bar_graph_background);
  // bar_graph_background[0].innerHTML = ``;
  bar_graph_background[0].innerHTML = `<canvas id="bar-graph-background"></canvas>`;
  //creating new chart
  const bar_graph_canvas = document.getElementById("bar-graph-background");
  createBarDailyGraph(data, bar_graph_canvas, y_max, one_type);
});

submit_bar_graph_button.addEventListener("click", (e) => {
  const cat_name = bar_cat_input.value;
  const cat = getCatFromName(cat_name, categories);
  const days = parseInt(bar_days_input.value);
  let data = undefined;
  let y_max = 0;
  [data, y_max] = setupBarDailyData([cat], days, timestamps);
  //reading chosen graph type
  const one_radios = document.querySelectorAll(".graph-type-radio-one");
  let one_type = "bar";
  one_radios.forEach((radio) => {
    if (radio.checked) one_type = radio.value;
  });
  //clearing canvas in case a graph already exists
  const bar_graph_background = document.getElementsByClassName(
    "bar-graph-background"
  );
  console.log(bar_graph_background);
  // bar_graph_background[0].innerHTML = ``;
  bar_graph_background[0].innerHTML = `<canvas id="bar-graph-background"></canvas>`;
  //creating new chart
  const bar_graph_canvas = document.getElementById("bar-graph-background");
  createBarDailyGraph(data, bar_graph_canvas, y_max, one_type);
});

//TODO: tu robione submit dates graph
submit_bar_graph_dates_button.addEventListener("click", (e) => {
  const cat_name = bar_cat_input.value;
  const cat = getCatFromName(cat_name, categories);
  const days = parseInt(bar_days_input.value);
  let data = undefined;
  let y_max = 0;
  [data, y_max] = setupBarDailyData([cat], days, timestamps);
});

submit_multi_graph_button.addEventListener("click", (e) => {
  // const cat_name = bar_cat_input.value;
  // const cat = getCatFromName(cat_name, categories);
  let cats = [];
  bar_multi_cat_input.querySelectorAll(".multi-bar-cat").forEach((cat) => {
    console.log(`cat: ${cat}`);
    if (cat.checked) {
      cats.push(getCatFromName(cat.value, categories));
    }
  });
  console.log(`cats: ${cats}`);
  const days = parseInt(multi_days_input.value);
  let data = undefined;
  let y_max = 0;
  [data, y_max] = setupBarDailyData(cats, days, timestamps);
  //reading chosen graph type
  const multi_radios = document.querySelectorAll(".graph-type-multi");
  let multi_type = "bar";
  multi_radios.forEach((radio) => {
    if (radio.checked) multi_type = radio.value;
  });
  //clearing canvas in case a graph already exists
  const multi_graph_background = document.getElementsByClassName(
    "multi-graph-background"
  );
  // bar_graph_background[0].innerHTML = ``;
  multi_graph_background[0].innerHTML = `<canvas id="multi-graph-background"></canvas>`;
  //creating new chart
  const multi_graph_canvas = document.getElementById("multi-graph-background");
  createBarDailyGraph(data, multi_graph_canvas, y_max, multi_type);
});

submit_pie_graph_button.addEventListener("click", (e) => {
  // const cat_name = bar_cat_input.value;
  // const cat = getCatFromName(cat_name, categories);
  let cats = [];
  pie_cat_input.querySelectorAll(".pie-cat").forEach((cat) => {
    console.log(`cat: ${cat}`);
    if (cat.checked) {
      cats.push(getCatFromName(cat.value, categories));
    }
  });
  console.log(`cats: ${cats}`);
  const days = parseInt(pie_days_input.value);
  //clearing canvas in case a graph already exists
  const pie_graph_background = document.getElementsByClassName(
    "pie-graph-background"
  );
  // bar_graph_background[0].innerHTML = ``;
  pie_graph_background[0].innerHTML = `<canvas id="pie-graph-background"></canvas>`;
  //creating new chart
  const pie_graph_canvas = document.getElementById("pie-graph-background");
  createPieDailyGraph(cats, pie_graph_canvas, days, timestamps);
});

/* -------------------------------------------------------------------------- */
/*                    obsluga przyciskow testowych i local                    */
/* -------------------------------------------------------------------------- */

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
  renderCatOptions(categories, stamp_cat_input);
  renderCatOptions(categories, bar_cat_input);
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
  createCheckboxEvents,
  createPageEvents,
  renderAllCheckboxes,
};
