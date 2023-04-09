const nav_top = document.querySelector(".nav-top");
const nav = document.querySelector(".nav");
const nav_bot = document.querySelector(".nav-bot");
nav_top.addEventListener("mouseover", (e) => {
  console.log(`hey! ${e.target}`);
  nav_bot.classList.remove("hidden");
});
nav_bot.addEventListener("mouseover", (e) => {
  nav_bot.classList.remove("hidden");
});
nav_bot.addEventListener("mouseout", (e) => {
  console.log(`hey! ${e.target}`);
  nav_bot.classList.add("hidden");
});
