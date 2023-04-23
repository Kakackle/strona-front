// elementy programu:
// 1. przechowywanie db linkow w postaci tabeli i w localstorage
// 2. tworzenie elementow DOM na podstawie tabeli
// 3. filtracja tablic przed renderem
// 4. obsluga zdarzen dodawania, usuwania, edycji linkow/obiektow

let cheatsheets = []; //tablica linkow w systemie
let tags = []; //tablica tagow
let appliedTags = []; //tagi do filtracji

//------------- elementy DOM -------------
//localStorage
const clearButton = document.querySelector(".clear-button");

//otworz sekcje dodawania linkow
const add_new_link = document.querySelector(".add-section-title");
//dropdown obszar wpisywania danych linkow
const add_dropdown = document.querySelector(".add-drop");
const title_input = document.querySelector(".add-title");
const link_input = document.querySelector(".add-link");
const tag1_input = document.querySelector(".add-tag1");
const tag2_input = document.querySelector(".add-tag2");
const tag3_input = document.querySelector(".add-tag3");
const favCheckbox = document.querySelector(".add-fav-check");
//submit dodawania
const link_submit_button = document.querySelector(".submit-link");
const close_dropdown = document.querySelector(".close-drop");

//obszary do renderowania
const fav_area = document.querySelector(".fav-area");
const most_links = document.querySelector(".most-links");
const all_links = document.querySelector(".all-links");

//obszar tagow
const type_tags = document.querySelector(".type-tags");
let tag_checkboxes = document.querySelectorAll(".tag-checkbox-box");
const filterButton = document.querySelector(".filter-button");

//searchbar
const fav_search = document.querySelector(".fav-search");

// ------------ 1. Obsluga dodawania i usuwania ----------

//tworzenie i zwracanie obiektu cheatsheetu
const createNewCheatsheet = function (title, link, tags, isFav) {
  const date = new Date();
  const cheat = {
    title: title,
    link: link,
    tags: tags,
    date: `${date.getDate()}:${date.getMonth() + 1}:${date.getFullYear()}`,
    dateLast: `${date.getDate()}:${date.getMonth() + 1}:${date.getFullYear()}`,
    clicks: 0,
    isFav: isFav,
  };
  return cheat;
};

//zapisz podana liste wraz z nazwa do localstorage
const saveToLocalStorage = function (arr, arr_name) {
  localStorage.setItem(`${arr_name}`, JSON.stringify(arr));
};

// czyszczenie localstorage
const clearStorage = function () {
  localStorage.clear();
};

const getFromLocal = function () {
  const localCheatsheets = JSON.parse(localStorage.getItem("cheatsheets"));
  if (localCheatsheets) cheatsheets = localCheatsheets;
  else cheatsheets = [];
  const localTags = JSON.parse(localStorage.getItem("cheatsheets"));
  if (localTags) tags = localTags;
  else tags = [];
};

//czyszczenie linkow i tagow
const clearObjects = function () {
  cheatsheets = [];
  tags = [];
};

//--------- obsluga dodania/usuwania elementow tablic --------
//TODO: strasznie na sline wszystko, przydaloby sie zuniweralizowac
//usuwanie elementow z tablicy i localstorage z roznych miejsc
//!!!!!!!powinno brac w argument jaki element chce usunac jakos
const deleteEntryList = function (e) {
  const counterIndex =
    e.target.parentNode.parentNode.querySelector(".counter-el").innerHTML;
  console.log(counterIndex);
  cheatsheets.splice(counterIndex, 1);
  renderWebsite();
  saveToLocalStorage(cheatsheets, "cheatsheets");
};
//zrobione na sline, bo w przypadku list target musi wyjsc do parent node 2 razy, w przypadku fav raz,
//bo tak ukryty jest przycisk w htmlu
const deleteEntryFav = function (e) {
  // console.log(e.target.parentNode);
  const counterIndex =
    e.target.parentNode.querySelector(".counter-el").innerHTML;
  console.log(counterIndex);
  cheatsheets.splice(counterIndex, 1);
  renderWebsite();
  saveToLocalStorage(cheatsheets, "cheatsheets");
};

//dodanie od fav poprzez zmienienie isFav, czyli aktualizacje obiektu z cheatsheets
//i tak samo usuniecie, przy czym usuniecie tylko na przycisku w sekcji fav, dodanie w listach
const removeFav = function (e) {
  const counterIndex =
    e.target.parentNode.querySelector(".counter-el").innerHTML;
  console.log(counterIndex);
  cheatsheets[counterIndex].isFav = false;
  renderFavLinksEntries(cheatsheets);
};
const addFav = function (e) {
  const counterIndex =
    e.target.parentNode.parentNode.querySelector(".counter-el").innerHTML;
  console.log(counterIndex);
  cheatsheets[counterIndex].isFav = true;
  renderFavLinksEntries(cheatsheets);
  createEventListeners();
};

//// zebranie istniejacych tagow, moze powinno byc wywolywane przy dodawaniu
//TODO: dodawanie tagow przy dodawaniu obiektu a nie po fakcie
const gatherTags = function () {
  cheatsheets.forEach((cheat) => {
    cheat.tags.forEach((tag) => {
      if (!tags.includes(tag)) tags.push(tag);
    });
  });
  saveToLocalStorage(tags, "tags");
};

// --------- 2. render elementow tabel ---------

//tabela linkow wszystkich template
//TODO: all i most sa praktycznie identyczne w tym momencie, kod ten sam
//  ale moze mozna wymyslic jakies roznice
const renderAllLinksEntries = function (renderList) {
  all_links.innerHTML = ``;
  renderList.forEach((cheat) => {
    const all_li = document.createElement("li");
    all_li.innerHTML = `
    <p class="hidden counter-el">${renderList.indexOf(cheat)}</p>
    <div class="li-div">
    <a
      class="link-copy most-div-head-long"
      href="${cheat.link}"
      target="_blank"
      rel="noopener noreferrer"
      >${cheat.title}</a
    >
    <div class="most-link-tags most-link-short">
      <span>${cheat.tags[0]}</span>
      <span>${cheat.tags[1]}</span>
      <span>${cheat.tags[2]}</span>
    </div>
    <p>${cheat.clicks}</p>
    <p>${cheat.date}</p>
    <p>${cheat.dateLast}</p>
    <ion-icon class="most-delete md hydrated" name="trash-bin" role="img" aria-label="trash bin"></ion-icon>
    <ion-icon class="most-addfav md hydrated" name="checkmark" role="img" aria-label="checkmark"></ion-icon>
    </div>
    `;
    all_links.appendChild(all_li);
  });
};

const renderMostClickedEntries = function (renderList) {
  most_links.innerHTML = ``;
  renderList.forEach((cheat) => {
    const most_li = document.createElement("li");
    most_li.innerHTML = `
    <p class="hidden counter-el">${renderList.indexOf(cheat)}</p>
    <div class="li-div">
      <a
        class="link-copy most-div-head-long"
        href="${cheat.link}"
        target="_blank"
        rel="noopener noreferrer"
        >${cheat.title}</a
      >
      <div class="most-link-tags most-link-short">
        <span>${cheat.tags[0]}</span>
        <span>${cheat.tags[1]}</span>
        <span>${cheat.tags[2]}</span>
      </div>
      <p>${cheat.clicks}</p>
      <p>${cheat.date}</p>
      <p>${cheat.dateLast}</p>
      <ion-icon class="most-delete md hydrated" name="trash-bin" role="img" aria-label="trash bin"></ion-icon>
      <ion-icon class="most-addfav md hydrated" name="checkmark" role="img" aria-label="checkmark"></ion-icon>
    </div>`;
    most_links.appendChild(most_li);
  });
};

const renderFavLinksEntries = function (renderList) {
  //reset do stanu poczatkowego z predefiniowanym elementem na czas testow
  fav_area.innerHTML = ``;
  const favCheatsheets = renderList.filter((cheat) => cheat.isFav === true);
  favCheatsheets.forEach((cheat) => {
    const fav_div = document.createElement("div");
    fav_div.classList.add("fav"); //klasa glowna
    cheat.tags.forEach((tag) => fav_div.classList.add(`${tag}`)); //klasy tagow
    fav_div.innerHTML = `
    <p class="hidden counter-el">${renderList.indexOf(cheat)}</p>
    <p class="fav-title">${cheat.title}</p>
      <p class="fav-link">
        <a
          class="link-copy"
          href="${cheat.link}"
          target="_blank"
          rel="noopener noreferrer"
          >${cheat.link}</a
        >
      </p>
      <div class="fav-applied-tags">
        <span class="fav-tag ${cheat.tags[0]}"> ${cheat.tags[0]} </span>
        <span class="fav-tag ${cheat.tags[1]}"> ${cheat.tags[1]} </span>
        <span class="fav-tag ${cheat.tags[2]}"> ${cheat.tags[2]} </span>
      </div>
      <span class="fav-date">${cheat.date}</span>
      <span class="fav-clicks">${cheat.clicks} clicks</span>
      <ion-icon class="fav-icon fav-delete" name="trash-bin"></ion-icon>
      <ion-icon class="fav-icon fav-remove" name="close"></ion-icon>`;
    fav_area.appendChild(fav_div);
  });
};

const renderTags = function () {
  type_tags.innerHTML = `<p class="tag-sect-title">Link type:</p>`;
  tags.forEach((tag) => {
    const tag_checkbox = document.createElement("div");
    tag_checkbox.classList.add("tag-checkbox");
    tag_checkbox.innerHTML = `<input
    class="tag-checkbox-box"
    type="checkbox"
    id="${tag}"
    name="${tag}"
    value="${tag}"
  />
  <label class="tag-checkbox" for="${tag}"> ${tag} </label>
    `;
  });
  //aktualizacja tag checkboxes
  tag_checkboxes = document.querySelectorAll(".tag-checkbox-box");
};

//create event listeners on links in tables
const createEventListeners = function () {
  const mostDeleteList = document.querySelectorAll(".most-delete");
  mostDeleteList.forEach((most_delete) => {
    most_delete.addEventListener("click", (e) => {
      deleteEntryList(e);
    });
  });
  const mostAddFavList = document.querySelectorAll(".most-addfav");
  mostAddFavList.forEach((most_addfav) => {
    most_addfav.addEventListener("click", (e) => {
      addFav(e);
    });
  });
  const favDeleteList = document.querySelectorAll(".fav-delete");
  favDeleteList.forEach((fav_delete) => {
    fav_delete.addEventListener("click", (e) => {
      deleteEntryFav(e);
    });
  });
  const favRemoveList = document.querySelectorAll(".fav-remove");
  favRemoveList.forEach((fav_remove) => {
    fav_remove.addEventListener("click", (e) => {
      removeFav(e);
    });
  });
};

//render wszystkich grup obiektow na stronie
const renderWebsite = function () {
  renderMostClickedEntries(cheatsheets);
  renderAllLinksEntries(cheatsheets);
  renderFavLinksEntries(cheatsheets);
  renderTags();
};

//reset inputow dodawania
const resetAddInputs = function () {
  title_input.value = "";
  link_input.value = "";
  tag1_input.value = "";
  tag2_input.value = "";
  tag3_input.value = "";
};

// ----------- filtracja -------------
// aplikacja filtrow z tagow
const filterByTags = function () {
  appliedTags = [];
  tag_checkboxes.forEach((tag) => {
    if (tag.checked) appliedTags.push(tag.value);
  });
  let renderList = [];
  if (appliedTags.length === 0) {
    renderList = cheatsheets;
  } else {
    renderList = cheatsheets.filter(
      (cheat) =>
        appliedTags.includes(cheat.tags[0]) ||
        appliedTags.includes(cheat.tags[1])
    );
  }
  return renderList();
};

const filterBySearch = function () {
  let searchterm = fav_search.value;
  console.log(searchterm);
  let renderList = [];
  //sprawdzanie po skladowych tagow
  let includesTag = 0;
  cheatsheets.forEach((cheat) => {
    cheat.tags.forEach((tag) => {
      if (tag.includes(searchterm)) includesTag = 1;
    });
  });

  //sprawdzanie czy zawiera tag w calosci
  // cheat.tags.includes(searchterm)

  renderList = cheatsheets.filter(
    (cheat) =>
      cheat.title.includes(searchterm) ||
      cheat.link.includes(searchterm) ||
      cheat.tags.includes(searchterm)
  );
  console.log(cheatsheets[0].tags);
  console.log(cheatsheets[0].tags.includes(searchterm));
  return renderList;
};

// ------------ 4. EventListeners ----------

//obsluga widocznosci menu dodawania linkow
add_new_link.addEventListener("click", (e) => {
  e.preventDefault();
  add_dropdown.style.display = "flex";
});

close_dropdown.addEventListener("click", (e) => {
  e.preventDefault();
  add_dropdown.style.display = "none";
});

//tworzenie nowych elementow z wypelnionych pol
link_submit_button.addEventListener("click", (e) => {
  const cheat = createNewCheatsheet(
    title_input.value,
    link_input.value,
    [tag1_input.value, tag2_input.value, tag3_input.value],
    favCheckbox.checked
  );
  resetAddInputs();
  cheatsheets.push(cheat);
  saveToLocalStorage(cheatsheets, "cheatsheets");
  renderWebsite();
  createEventListeners();
});

//filtracja
fav_search.addEventListener("input", (e) => {
  e.preventDefault();
  renderWebsite(filterBySearch());
});

filterButton.addEventListener("click", (e) => {
  e.preventDefault();
  renderWebsite(filterByTags());
});

clearButton.addEventListener("click", (e) => {
  e.preventDefault();
  clearStorage(); //czysci pamiec
  getFromLocal(); //aktualizuje wewnetrzne dane
  renderWebsite(); //renderuje strone
});

// ---------- call at load -------------
const mainFunc = function () {
  getFromLocal();
  renderWebsite();
  createEventListeners();
};

mainFunc();

// --------- tests -----------
// predefiniowany obiekt do testow
const addTestObj = function () {
  const date = new Date();
  const cheat1 = {
    title: "Javascript array of objects",
    link: "https://www.freecodecamp.org/news/javascript-array-of-objects-tutorial-how-to-create-update-and-loop-through-objects-using-js-array-methods/",
    tags: ["programming", "javascript"],
    date: `${date.getDate()}:${date.getMonth() + 1}:${date.getFullYear()}`,
    clicks: 0,
    isFav: true,
  };
  cheatsheets.push(cheat1);
};
