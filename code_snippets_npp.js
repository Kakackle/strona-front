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