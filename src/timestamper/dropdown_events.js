/**
 * @file dropdown_events.js - jednorazowo tworzone eventy otwierania i zamykania elementow
 */
import {
  createEventListeners,
  getFromLocalStorage,
  clearLocalStorage,
} from "./timestamper.js";

import {
  debugFunction,
  testFunction,
  createTestItems,
} from "./test_functions.js";

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

const createDropdownEvents = function () {
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

  submit_cat_button.addEventListener("click", (e) => {
    add_drop_cat.style.display = "none";
  });
  submit_stamp_button.addEventListener("click", (e) => {
    add_drop_stamp.style.display = "none";
  });
};

export { createDropdownEvents };
