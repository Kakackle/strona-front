const start = document.querySelector(".start-button");
const pause = document.querySelector(".pause-button");
const stopb = document.querySelector(".stop-button");
const lapb = document.querySelector(".lap-button");
const timer_text = document.querySelector(".timer-time");
const lap_list = document.querySelector(".lap-list");
const timer_title = document.querySelector(".timer-title");
const timer_div = document.querySelector(".timer");

const start_count = document.querySelector(".start-button-count");
const pause_count = document.querySelector(".pause-button-count");
const stopb_count = document.querySelector(".stop-button-count");
const lapb_count = document.querySelector(".lap-button-count");
const count_text = document.querySelector(".count-time");
const count_title = document.querySelector(".count-title");

const startTime = performance.now();
let currTime = 0;
let seconds = 0;
let lap_index = 1;

let countTime = 0;

let timerInterval = setInterval(() => {
  seconds += 1;
  updateTimerText();
}, 1000);

clearInterval(timerInterval);

let countInterval = setInterval(() => {
  seconds += 1;
  updateCountText();
}, 1000);

clearInterval(countInterval);

function updateTimerText() {
  let seconds_text = "";
  let minutes_text = "";
  let hours_text = "";
  let secs = seconds % 60;
  let mins = Math.floor(seconds / 60);
  let hrs = Math.floor(mins / 60);
  if (secs < 10) seconds_text = `0${secs}`;
  else seconds_text = `${secs}`;
  if (mins < 10) minutes_text = `0${mins}`;
  else minutes_text = `${mins}`;
  if (hrs < 10) hours_text = `0${hrs}`;
  else hours_text = `${hrs}`;

  timer_text.innerHTML = `${hours_text}:${minutes_text}:${seconds_text}`;
}

function updateCountText() {
  let countSeconds = countTime * 60 - seconds;
  let seconds_text = "";
  let minutes_text = "";
  let hours_text = "";
  let secs = countSeconds % 60;
  let mins = Math.floor(countSeconds / 60);
  let hrs = Math.floor(mins / 60);
  if (secs < 10) seconds_text = `0${secs}`;
  else seconds_text = `${secs}`;
  if (mins < 10) minutes_text = `0${mins}`;
  else minutes_text = `${mins}`;
  if (hrs < 10) hours_text = `0${hrs}`;
  else hours_text = `${hrs}`;

  count_text.innerHTML = `${hours_text}:${minutes_text}:${seconds_text}`;
}

function startTimer() {
  timerInterval = setInterval(() => {
    seconds += 1;
    updateTimerText();
  }, 1000);
}

function startCount() {
  console.log;
  countTime = parseInt(count_text.innerHTML);
  countInterval = setInterval(() => {
    seconds += 1;
    updateCountText();
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
}

function pauseCount() {
  clearInterval(countInterval);
}

function stopTimer() {
  clearInterval(timerInterval);
  seconds = 0;
  updateTimerText();
}

function stopCount() {
  clearInterval(countInterval);
  seconds = 0;
  updateCountText();
}

function addLap() {
  let lap = document.createElement("li");
  lap.classList.add("lap");
  lap.appendChild(document.createTextNode(timer_text.innerHTML));
  lap_list.appendChild(lap);
}

start.addEventListener("click", (e) => {
  e.preventDefault();
  startTimer();
});

start_count.addEventListener("click", (e) => {
  e.preventDefault();
  startCount();
});

pause.addEventListener("click", (e) => {
  e.preventDefault();
  pauseTimer();
});

pause_count.addEventListener("click", (e) => {
  e.preventDefault();
  pauseCount();
});

stopb.addEventListener("click", (e) => {
  e.preventDefault();
  stopTimer();
  //clear laps
  lap_list.innerHTML = "";
});

stopb_count.addEventListener("click", (e) => {
  e.preventDefault();
  stopCount();
  //clear laps
  //lap_list.innerHTML = "";
});

lapb.addEventListener("click", (e) => {
  e.preventDefault();
  addLap();
});

timer_title.addEventListener("dblclick", (e) => {
  e.preventDefault();
  e.target.setAttribute("contenteditable", "true");
});

timer_title.addEventListener("mouseleave", (e) => {
  e.preventDefault();
  timer_title.setAttribute("contenteditable", "false");
});

count_text.addEventListener("dblclick", (e) => {
  e.preventDefault();
  e.target.setAttribute("contenteditable", "true");
});

count_text.addEventListener("mouseleave", (e) => {
  e.preventDefault();
  count_text.setAttribute("contenteditable", "false");
});
