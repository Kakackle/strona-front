/* -------------------------------------------------------------------------- */
/*                        Plik z funkcjami filtrujacymi                       */
/* -------------------------------------------------------------------------- */
/**
 * @file filters.js - funkcje filtrujace listy, domyslnie pod timestamps.js
 * @author MM
 */

/**
 * Filter by list of categories (eg. from checkboxes)
 * @param {Array} unfiltered - input list
 * @param {Array} checkboxes - all DOM checkbox elements
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
 * @returns
 */
const applyFilters = function (unfiltered, checkboxes, queryEl) {
  let filtered = [];
  filtered = filterByCategory(unfiltered, checkboxes);
  filtered = filterBySearch(filtered, queryEl);
  return filtered;
};

export { filterByCategory, filterBySearch, applyFilters };
