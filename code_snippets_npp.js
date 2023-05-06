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