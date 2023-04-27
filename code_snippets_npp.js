timer_title.addEventListener("dblclick", (e) => {
  e.preventDefault();
  e.target.setAttribute("contenteditable", "true");
});

timer_title.addEventListener("mouseleave", (e) => {
  e.preventDefault();
  timer_title.setAttribute("contenteditable", "false");
});

