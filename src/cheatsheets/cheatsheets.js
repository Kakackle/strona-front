// schemat programu:
// 1. aktualne cheatsheety przechowywane sa w tabeli obiektow z linkiem, tytulem, tagami itp\
// 2. do tabeli mozemy dodawac nowe obiekty poprzez form / odp. pola na stronie
// 3. nastepnie istnieja renderery tych tablic, ktore beda przechodzily przez tablice
// i dla kazdego z obiektow w tablicy tworza nowe elementy w htmlu\
// 4. i potem mozemy filtrowac poprzez tworzenie tabeli nowych do renderowania
// powstajacych poprzez przefiltrowanie glownej wszystkich dodanych

let cheatsheets = [];
let tags = [];
let appliedTags = [];
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
const favCheckbox = document.querySelector(".add-fav-check");
const link_submit_button = document.querySelector(".submit-link");
const close_dropdown = document.querySelector(".close-drop");

//obszary do renderowania
const fav_area = document.querySelector(".fav-area");
const most_links = document.querySelector(".most-links");
const all_links = document.querySelector(".all-links");

const type_tags = document.querySelector(".type-tags");

const clearButton = document.querySelector(".clear-button");

//tag checkboxes
let tag_checkboxes = document.querySelectorAll(".tag-checkbox-box");
const filterButton = document.querySelector(".filter-button");

//searchbar
const fav_search = document.querySelector(".fav-search");

//obsluga widocznosci menu dodawania linkow
add_new_link.addEventListener("click", (e) => {
  e.preventDefault();
  add_dropdown.style.display = "flex";
});

close_dropdown.addEventListener("click", (e) => {
  e.preventDefault();
  add_dropdown.style.display = "none";
});

// ----------- krok 1. ----------
//dodawanie nowych obiektow cheatsheetow do tablicy z poziomu przegladarki

//event dodawania nowego cheatsheetu do tablicy i localstorage
const addNewCheatsheet = function () {
  let date = new Date();
  let cheat = {
    title: title_input.value,
    link: link_input.value,
    tags: [tag1_input.value, tag2_input.value],
    date: `${date.getDate()}:${date.getMonth() + 1}:${date.getFullYear()}`,
    clicks: 0,
    isFav: favCheckbox.checked,
  };
  console.log(favCheckbox.checked);
  // console.log(cheat);
  cheatsheets.push(cheat);
  localStorage.setItem("cheatsheets", JSON.stringify(cheatsheets));
};

//funkcje renderowania elementow z tablicy cheatsheetow na stronie
const renderAllLinksEntries = function (renderList) {
  all_links.innerHTML = `<li>
  <div class="li-div">
    <a
      class="link-copy most-div-head-long"
      href="https://www.youtube.com/playlist?list=PLc0mBJHoWgQNCvPh6Upf2JAjyQ9yb2Ouh"
      target="_blank"
      rel="noopener noreferrer"
      >INTERMEDIUM</a
    >
    <div class="most-link-tags most-link-short">
      <span>Tag1</span>
      <span>Tag2</span>
      <span>Tag3</span>
    </div>
    <p>276</p>
    <p>04-04-2023</p>
    <p>01-01-2023</p>
    <ion-icon class="all-delete" name="trash-bin"></ion-icon>
  </div>
  </li>`;
  renderList.forEach((cheat) => {
    const all_li = document.createElement("li");
    //element przechowujacy indeks elementu - do wykorzystania przy usuwaniu etc
    const counter_el = document.createElement("p");
    counter_el.classList.add("hidden");
    counter_el.classList.add("counter-el");
    counter_el.innerHTML = renderList.indexOf(cheat);
    all_li.appendChild(counter_el);
    const li_div = document.createElement("div");
    li_div.classList.add("li-div");
    const li_a = document.createElement("a");
    li_a.classList.add("link-copy");
    li_a.classList.add("most-div-head-long");
    li_a.setAttribute("href", cheat.link);
    li_a.setAttribute("target", "_blank");
    li_a.setAttribute("rel", "noopener noreferrer");
    li_a.innerHTML = cheat.title;
    li_div.appendChild(li_a);
    const most_delete = document.createElement("ion-icon");
    most_delete.classList.add("most-delete");
    most_delete.setAttribute("name", "trash-bin");
    li_div.appendChild(most_delete);
    const most_addfav = document.createElement("ion-icon");
    most_addfav.classList.add("most-addfav");
    most_addfav.setAttribute("name", "checkmark");
    li_div.appendChild(most_addfav);
    all_li.appendChild(li_div);
    all_links.appendChild(all_li);
    most_delete.addEventListener("click", (e) => {
      deleteEntryList(e);
    });
    most_addfav.addEventListener("click", (e) => {
      addFav(e);
    });
  });
};

const renderFavLinksEntries = function (renderList) {
  //reset do stanu poczatkowego z predefiniowanym elementem na czas testow
  fav_area.innerHTML = `<div class="fav prog">
    <p class="fav-title">INTERMEDIUM</p>
    <p class="fav-link">
      <a
        class="link-copy"
        href="https://www.youtube.com/playlist?list=PLc0mBJHoWgQNCvPh6Upf2JAjyQ9yb2Ouh"
        target="_blank"
        rel="noopener noreferrer"
        >https://www.youtube.com/playlist?list=PLc0mBJHoWgQNCvPh6Upf2JAjyQ9yb2Ouh</a
      >
    </p>
    <div class="fav-applied-tags">
      <span class="fav-tag prog"> Prog </span>
      <span class="fav-tag"> Today </span>
      <span class="fav-tag network"> Network </span>
    </div>
    <span class="fav-date">04-04-2023</span>
    <span class="fav-clicks">276 clicks</span>
    <ion-icon class="fav-icon fav-delete" name="trash-bin"></ion-icon>
    <ion-icon class="fav-icon fav-remove" name="close"></ion-icon>
  </div>`;
  // fav_area.innerHTML = "";
  const favCheatsheets = renderList.filter((cheat) => cheat.isFav === true);
  favCheatsheets.forEach((cheat) => {
    const fav_div = document.createElement("div");
    fav_div.classList.add("fav"); //klasa glowna
    fav_div.classList.add(cheat.tags[0]); //prog / programming / diy etc - klasa kolor
    //element przechowujacy indeks elementu - do wykorzystania przy usuwaniu etc
    const counter_el = document.createElement("p");
    counter_el.classList.add("hidden");
    counter_el.classList.add("counter-el");
    counter_el.innerHTML = renderList.indexOf(cheat);
    fav_div.appendChild(counter_el);
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
    const fav_delete = document.createElement("ion-icon");
    fav_delete.classList.add("fav-icon");
    fav_delete.classList.add("fav-delete");
    fav_delete.setAttribute("name", "trash-bin");
    const fav_remove = document.createElement("ion-icon");
    fav_remove.classList.add("fav-icon");
    fav_remove.classList.add("fav-remove");
    fav_remove.setAttribute("name", "close");
    fav_div.appendChild(fav_delete);
    fav_div.appendChild(fav_remove);
    fav_area.appendChild(fav_div);
    // ------ funkcje przyciskow
    fav_delete.addEventListener("click", (e) => {
      deleteEntryFav(e);
    });
    fav_remove.addEventListener("click", (e) => {
      removeFav(e);
    });
  });
};
const renderMostClickedEntries = function (renderList) {
  most_links.innerHTML = `<li>
  <div class="li-div">
    <a
      class="link-copy most-div-head-long"
      href="https://www.youtube.com/playlist?list=PLc0mBJHoWgQNCvPh6Upf2JAjyQ9yb2Ouh"
      target="_blank"
      rel="noopener noreferrer"
      >INTERMEDIUM</a
    >
    <div class="most-link-tags most-link-short">
      <span>Tag1</span>
      <span>Tag2</span>
      <span>Tag3</span>
    </div>
    <p>276</p>
    <p>04-04-2023</p>
    <p>01-01-2023</p>
    <ion-icon class="most-delete" name="trash-bin"></ion-icon>
  </div>
</li>`;
  renderList.forEach((cheat) => {
    const most_li = document.createElement("li");
    //element przechowujacy indeks elementu - do wykorzystania przy usuwaniu etc
    const counter_el = document.createElement("p");
    counter_el.classList.add("hidden");
    counter_el.classList.add("counter-el");
    counter_el.innerHTML = renderList.indexOf(cheat);
    most_li.appendChild(counter_el);
    const li_div = document.createElement("div");
    li_div.classList.add("li-div");
    const li_a = document.createElement("a");
    li_a.classList.add("link-copy");
    li_a.classList.add("most-div-head-long");
    li_a.setAttribute("href", cheat.link);
    li_a.setAttribute("target", "_blank");
    li_a.setAttribute("rel", "noopener noreferrer");
    li_a.innerHTML = cheat.title;
    li_div.appendChild(li_a);
    const most_delete = document.createElement("ion-icon");
    most_delete.classList.add("most-delete");
    most_delete.setAttribute("name", "trash-bin");
    li_div.appendChild(most_delete);
    most_li.appendChild(li_div);
    most_links.appendChild(most_li);
    most_delete.addEventListener("click", (e) => {
      deleteEntryList(e);
    });
  });
};

//eventlistener tworzenia sheeta i renderowania na  stronie
link_submit_button.addEventListener("click", (e) => {
  addNewCheatsheet();
  title_input.value = "";
  link_input.value = "";
  tag1_input.value = "";
  tag2_input.value = "";
  renderFavLinksEntries(cheatsheets);
  renderMostClickedEntries(cheatsheets);
  renderAllLinksEntries(cheatsheets);
  renderTags();
});

//usuwanie elementow z tablicy i localstorage z roznych miejsc
//!!!!!!!powinno brac w argument jaki element chce usunac jakos
const deleteEntryList = function (e) {
  const counterIndex =
    e.target.parentNode.parentNode.querySelector(".counter-el").innerHTML;
  console.log(counterIndex);
  cheatsheets.splice(counterIndex, 1);
  renderMostClickedEntries(cheatsheets);
  renderAllLinksEntries(cheatsheets);
  renderFavLinksEntries(cheatsheets);
};
//zrobione na sline, bo w przypadku list target musi wyjsc do parent node 2 razy, w przypadku fav raz,
//bo tak ukryty jest przycisk w htmlu
const deleteEntryFav = function (e) {
  // console.log(e.target.parentNode);
  const counterIndex =
    e.target.parentNode.querySelector(".counter-el").innerHTML;
  console.log(counterIndex);
  cheatsheets.splice(counterIndex, 1);
  renderMostClickedEntries(cheatsheets);
  renderAllLinksEntries(cheatsheets);
  renderFavLinksEntries(cheatsheets);
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
};

// -------- zbieranie i generacja tagow -------
//wywolywane przy dodawaniu nowych sheetow, bo uzytnik moze dodawac tagi przez wpisywanie
const renderTags = function () {
  //reset pola
  type_tags.innerHTML = `
  <p class="tag-sect-title">Link type:</p>
  <div class="tag-checkbox">
    <input
      class="tag-checkbox-box"
      type="checkbox"
      id="prog"
      name="prog"
      value="prog"
    />
    <label class="tag-checkbox" for="prog"> Prog </label>
  </div>`;

  //zebranie istniejacych tagow
  cheatsheets.forEach((cheat) => {
    cheat.tags.forEach((tag) => {
      if (!tags.includes(tag)) tags.push(tag);
    });
  });
  //i zapiswyane w localStorage, chociaz moze zbyteczne
  localStorage.setItem("tags", JSON.stringify(tags));

  //i renderowanie
  tags.forEach((tag) => {
    const tag_checkbox = document.createElement("div");
    tag_checkbox.classList.add("tag-checkbox");
    const tag_input = document.createElement("input");
    tag_input.classList.add("tag-checkbox-box");
    tag_input.setAttribute("type", "checkbox");
    tag_input.setAttribute("id", `${tag}`);
    tag_input.setAttribute("name", `${tag}`);
    tag_input.setAttribute("value", `${tag}`);
    tag_checkbox.appendChild(tag_input);
    const tag_label = document.createElement("label");
    tag_label.classList.add("tag-checkbox");
    tag_label.setAttribute("for", `${tag}`);
    tag_label.innerHTML = `${tag}`;
    tag_checkbox.appendChild(tag_label);
    type_tags.appendChild(tag_checkbox);
  });

  //tag checkboxes
  tag_checkboxes = document.querySelectorAll(".tag-checkbox-box");
};

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
  renderAllLinksEntries(renderList);
  renderFavLinksEntries(renderList);
  renderMostClickedEntries(renderList);
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
  renderFavLinksEntries(renderList);
};

// const checkSearch = function()

fav_search.addEventListener("input", (e) => {
  e.preventDefault();
  filterBySearch();
});

filterButton.addEventListener("click", (e) => {
  e.preventDefault();
  filterByTags();
});

//odebranie zapisanej w localStorage tablicy
// localStorage.clear();
// cheatsheets = JSON.parse(localStorage.getItem("cheatsheets"));
// console.log(cheatsheets);

const localCheatsheets = JSON.parse(localStorage.getItem("cheatsheets"));
if (localCheatsheets) cheatsheets = localCheatsheets;
else cheatsheets = [];

renderMostClickedEntries(cheatsheets);
renderAllLinksEntries(cheatsheets);
renderFavLinksEntries(cheatsheets);
renderTags();

//------- czyszczenie localstorage na przycisku
const clearStorage = function () {
  localStorage.clear();
  cheatsheets = [];
  tags = [];
  renderMostClickedEntries(cheatsheets);
  renderAllLinksEntries(cheatsheets);
  renderFavLinksEntries(cheatsheets);
  renderTags();
};

clearButton.addEventListener("click", (e) => {
  e.preventDefault();
  clearStorage();
});

//----------predefiniowany obiekt
const addTestObj = function () {
  let date = new Date();
  let cheat1 = {
    title: "Javascript array of objects",
    link: "https://www.freecodecamp.org/news/javascript-array-of-objects-tutorial-how-to-create-update-and-loop-through-objects-using-js-array-methods/",
    tags: ["programming", "javascript"],
    date: `${date.getDate()}:${date.getMonth() + 1}:${date.getFullYear()}`,
    clicks: 0,
    isFav: true,
  };
  cheatsheets.push(cheat1);
};
