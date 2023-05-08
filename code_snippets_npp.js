timer_title.addEventListener("dblclick", (e) => {
  e.preventDefault();
  e.target.setAttribute("contenteditable", "true");
});

timer_title.addEventListener("mouseleave", (e) => {
  e.preventDefault();
  timer_title.setAttribute("contenteditable", "false");
});

const renderMostClicked = function (renderList) {
  let mostList = [];
  mostList = renderList.toSorted((a, b) => {
    if (a.clicks > b.clicks) return -1; //a bedzie przed b
    if (a.clicks < b.clicks) return 1;
    return 0;
  });
  if (mostList.length < most_amount_choice)
    renderListEntries(mostList, most_links);
  else renderListEntries(mostList.slice(0, most_amount_choice), most_links);
};

date: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
dateLast: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
  let date = new Date();
  date = new Date(date.toISOString());
dateObj

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


export const add_stamp_button = document.querySelector(".add-stamp");
export const add_drop_stamp = document.querySelector(".add-drop-stamp");
export const submit_stamp_button = document.querySelector(
  ".submit-stamp-button"
);
export const close_stamp_drop_button =
  document.querySelector(".close-stamp-drop");
export const add_cat_button = document.querySelector(".add-cat");
export const add_drop_cat = document.querySelector(".add-drop-cat");
export const submit_cat_button = document.querySelector(".submit-cat-button");
export const close_cat_drop_button = document.querySelector(".close-cat-drop");
//////////////// GRAPHS /////////////////
export const add_bar_one_button = document.querySelector(".add-bar-one");
export const add_bar_multi_button = document.querySelector(".add-bar-multi");
export const add_pie_button = document.querySelector(".add-pie");
export const submit_bar_graph_button =
  document.querySelector(".submit-bar-graph");
export const submit_multi_graph_button = document.querySelector(
  ".submit-multi-graph"
);
export const submit_pie_graph_button =
  document.querySelector(".submit-pie-graph");
export const close_bar_graph_button =
  document.querySelector(".close-bar-graph");
export const close_multi_graph_button =
  document.querySelector(".close-multi-graph");
export const close_pie_graph_button =
  document.querySelector(".close-pie-graph");
export const bar_graph_container = document.querySelector(
  ".bar-graph-container"
);
export const bar_multi_container = document.querySelector(
  ".bar-multi-container"
);
export const pie_container = document.querySelector(".pie-container");
export const report_text = document.querySelector(".report-text");
export const generate_report = document.querySelector(".generate-report");

//////////////////////////////////////////////////////////////
export const get_local_button = document.querySelector(".get-local");
export const clear_local_button = document.querySelector(".clear-local");
export const debug_button = document.querySelector(".debug");
export const test_button = document.querySelector(".test");
export const test_items_button = document.querySelector(".test-items");

///////////////////////////////////////////////////////////////

/* -------------------------------------------------------------------------- */
/*                                input fields                                */
/* -------------------------------------------------------------------------- */

export const stamp_cat_input = document.querySelector(".stamp-cat-input");
export const stamp_time_input = document.querySelector(".stamp-time-input");
export const cat_name_input = document.querySelector(".cat-name-input");
export const cat_color_input = document.querySelector(".cat-color-input");
export const cat_icons = document.querySelectorAll(".cat-icon");

/* -------------------------------------------------------------------------- */
/*                  docelowe containery do renderu                            */
/* -------------------------------------------------------------------------- */
export const filter_checkboxes = document.querySelector(".filter-checkboxes");
export const stamps_container = document.querySelector(".stamps-container");
export const stamp_pagination = document.querySelector(".stamp-pagination");
export let pages = document.querySelectorAll(".page");

/* -------------------------------------------------------------------------- */
/*                                boxy i search                               */
/* -------------------------------------------------------------------------- */
export let checkboxes = document.querySelectorAll(".cat-filter");
export const search_input = document.querySelector(".search-input");

/* -------------------------------------------------------------------------- */
/*                                   graphs                                   */
/* -------------------------------------------------------------------------- */
export const bar_cat_input = document.querySelector(".bar-cat-input");
export const bar_days_input = document.querySelector(".bar-days-input");
export const bar_start_input = document.querySelector(".bar-start-input");
export const bar_end_input = document.querySelector(".bar-star-input");