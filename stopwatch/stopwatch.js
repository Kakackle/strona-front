const start = document.querySelector(".start-button");
const pause = document.querySelector(".pause-button");
const stopb = document.querySelector(".stop-button");
const lapb = document.querySelector(".lap-button");
const timer_text = document.querySelector(".timer-time");
const lap_list = document.querySelector(".lap-list");
const timer_title = document.querySelector(".timer-title");
const timer_div = document.querySelector(".timer");

const startTime = performance.now();
let currTime = 0;
let seconds = 0;
let lap_index = 1;

let timerInterval = setInterval(() => {
  seconds += 1;
  updateTimerText();
}, 1000);

clearInterval(timerInterval);

function exampleChange() {
  // I do absolutely fucking nothing fuck you vscode
}

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

function startTimer() {
  timerInterval = setInterval(() => {
    seconds += 1;
    updateTimerText();
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
}

function stopTimer() {
  clearInterval(timerInterval);
  seconds = 0;
  updateTimerText();
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

pause.addEventListener("click", (e) => {
  e.preventDefault();
  pauseTimer();
});

stopb.addEventListener("click", (e) => {
  e.preventDefault();
  stopTimer();
  //clear laps
  lap_list.innerHTML = "";
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
