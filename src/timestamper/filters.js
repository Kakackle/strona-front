/* -------------------------------------------------------------------------- */
/*                        Plik z funkcjami filtrujacymi                       */
/* -------------------------------------------------------------------------- */
/**
 * @file filters.js - funkcje filtrujace listy, domyslnie pod timestamps.js
 * @author MM
 */

import { Stamp } from "./timestamper_classes.js";

/**
 * Filter by list of categories (eg. from checkboxes)
 * @param {Array<Stamp>} unfiltered - input list of Stamp objects
 * @param {Array<Node>} checkboxes - all DOM checkbox elements (NodeList)
 * @returns {Array<Stamp>} array of filtered objects
 */
const filterByCategory = function (unfiltered, checkboxes) {
  let appliedFilters = [];
  checkboxes.forEach((box) => {
    if (box.checked) appliedFilters.push(box.value);
  });
  let filtered = [];
  if (appliedFilters.length === 0) {
    filtered = unfiltered;
  } else {
    filtered = unfiltered.filter((stamp) => {
      return appliedFilters.includes(stamp.category.name);
    });
  }
  return filtered;
};
/**
 * Filter by searchquery, check for query in category name
 * @param {Array<Stamp>} unfiltered - input list of Stamp objects
 * @param {Array<Node>} checkboxes - all DOM checkbox elements (NodeList)
 * @returns {Array<Stamp>} array of filtered objects
 */
const filterBySearch = function (unfiltered, queryEl) {
  let query = queryEl.value;
  let filtered = [];
  if (!query) {
    filtered = unfiltered;
  } else {
    filtered = unfiltered.filter((stamp) =>
      stamp.category.name.toLowerCase().includes(query.toLowerCase())
    );
  }
  return filtered;
};

/**
 * Funkcja dostajaca liste do filtracji oraz container zawierajacy checkboxy i element input,
 * aplikuje dwie operacje filtracji - po checkboxach i z searchbaru
 * wywolywana przy zmianie w elementach
 * @param {*} unfiltered - input list, always full list
 * @param {*} checkboxes - list of checkbox DOM elements
 * @param {*} queryEl - filter query DOM element (input)
 * @returns {Array} array of filtered objects
 */
const applyFilters = function (unfiltered, checkboxes, queryEl) {
  let filtered = [];
  filtered = filterByCategory(unfiltered, checkboxes);
  filtered = filterBySearch(filtered, queryEl);
  return filtered;
};

export { filterByCategory, filterBySearch, applyFilters };
