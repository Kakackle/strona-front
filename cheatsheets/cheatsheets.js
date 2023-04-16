// schemat programu:
// 1. aktualne cheatsheety przechowywane sa w tabeli obiektow z linkiem, tytulem, tagami itp\
// 2. do tabeli mozemy dodawac nowe obiekty poprzez form / odp. pola na stronie
// 3. nastepnie istnieja renderery tych tablic, ktore beda przechodzily przez tablice
// i dla kazdego z obiektow w tablicy tworza nowe elementy w htmlu\
// 4. i potem mozemy filtrowac poprzez tworzenie tabeli nowych do renderowania
// powstajacych poprzez przefiltrowanie glownej wszystkich dodanych

let cheatsheets = [];
// przykladowy obiekt
// pola: title, link, tags, date, clicks,

// let date = new Date();
// let cheat1 = {
//   title: "Javascript array of objects",
//   link: "https://www.freecodecamp.org/news/javascript-array-of-objects-tutorial-how-to-create-update-and-loop-through-objects-using-js-array-methods/",
//   tags: ["programming", "javascript"],
//   date: `${date.getDate()}:${date.getMonth() + 1}:${date.getFullYear()}`,
//   clicks: 0,
// };

// cheatsheets.push(cheat1);
// console.log(cheatsheets);

// ------- umieszczanie w localstorage -------
// localStorage.setItem("cheatsheets", JSON.stringify(cheatsheets));
// ------- wyciaganie z local ------
// const retrievedLocal = JSON.parse(localStorage.getItem("cheatsheets"));
// console.log(retrievedLocal);
// ------- usuwanie z local:  localStorage.removeItem('name)
// ------- czyszczenie local: localStorage.clear()

// ----------- krok 0. elementy ---------
const add_new_link = document.querySelector(".add-section-title");
const add_dropdown = document.querySelector(".add-drop");
const title_input = document.querySelector(".add-title");
const link_input = document.querySelector(".add-link");
const tag1_input = document.querySelector(".add-tag1");
const tag2_input = document.querySelector(".add-tag2");
const link_submit_button = document.querySelector(".submit-link");
const close_dropdown = document.querySelector(".close-drop");

const fav_area = document.querySelector(".fav-area");

add_new_link.addEventListener("click", (e) => {
  e.preventDefault();
  add_dropdown.style.display = "flex";
});

close_dropdown.addEventListener("click", (e) => {
  e.preventDefault();
  add_dropdown.style.display = "none";
});

const addNewCheatsheet = function () {
  let date = new Date();
  let cheat = {
    title: title_input.value,
    link: link_input.value,
    tags: [tag1_input.value, tag2_input.value],
    date: `${date.getDate()}:${date.getMonth() + 1}:${date.getFullYear()}`,
    clicks: 0,
  };
  console.log(cheat);
  cheatsheets.push(cheat);
  localStorage.setItem("cheatsheets", JSON.stringify(cheatsheets));
};

const renderAllLinksEntries = function () {};
const renderFavLinksEntries = function () {
  cheatsheets.forEach((cheat) => {
    const fav_div = document.createElement("div");
    fav_div.classList.add("fav"); //klasa glowna
    fav_div.classList.add(cheat.tags[0]); //prog / programming / diy etc - klasa kolor
    const fav_title = document.createElement("p");
    fav_title.classList.add("fav-title");
    fav_title.innerHTML = cheat.title;
    fav_div.appendChild(fav_title);
    const fav_link = document.createElement("p");
    fav_link.classList.add("fav-link");
    const fav_link_a = document.createElement("a");
    fav_link_a.classList.add("link-copy");
    fav_link_a.setAttribute("href", cheat.link);
    fav_link_a.setAttribute("target", "_blank");
    fav_link_a.setAttribute("rel", "noopener noreferrer");
    fav_link_a.innerHTML = cheat.link;
    fav_link.appendChild(fav_link_a);
    fav_div.appendChild(fav_link);
    fav_area.append(fav_div);
  });
};
const renderMostClickedEntries = function () {};

link_submit_button.addEventListener("click", (e) => {
  addNewCheatsheet();
  title_input.value = "";
  link_input.value = "";
  tag1_input.value = "";
  tag2_input.value = "";
  renderFavLinksEntries();
});

// ----------- krok 1. ----------
//dodawanie nowych obiektow cheatsheetow do tablicy z poziomu przegladarki

//odebranie zapisanej w localStorage tablicy
// localStorage.clear();
// cheatsheets = JSON.parse(localStorage.getItem("cheatsheets"));
console.log(cheatsheets);
