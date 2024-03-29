/**
 * @file cheatsheets_ref.js - main js file of the cheatshets subpage
 * @author MM
 * @see <a href="https://google.com"> Google </a>
 */

// elementy programu:
// 1. przechowywanie db linkow w postaci tabeli i w localstorage
// 2. tworzenie elementow DOM na podstawie tabeli
// 3. filtracja tablic przed renderem
// 4. obsluga zdarzen dodawania, usuwania, edycji linkow/obiektow

// TODO: po sortowaniu, fajnie by jeszcze dodac ikonki strzalek w gore albo w dol ale tak mi sie nie chce omg
// TODO: upiekszenie, bo teraz wyglada bardzo roboczo, nie chcialbym korzystac z tego, zbyt malo przejrzyste, zbite
// TODO: dodawanie z pliku json bezposrednio a nie przez tekst?
// FIXME: generalnie przydalby sie refactor z osobna od cheatsheets globalna lista renderowana
// zeby na nia mozna bylo nakladac zarowno filtracje jak i sortowania jak i inne
// bo aktualnie sie canceluja
// juz jest, w postaci filterRenderList, ale moze by to jakos lepiej, jak props/storage w pinia, idk, jedno zrodlo prawdy

/**
 * Arrays of cheatsheet objects - See {@tutorial general-tutorial}
 * @type {Array}
 */
let cheatsheets = []; //tablica linkow w systemie
let tags = []; //tablica tagow
let appliedTags = []; //tagi do filtracji
let appliedDateTags = [];
// let dateTags = [];
let dateTags = new Set();

//------------- elementy DOM -------------
//localStorage
const clearButton = document.querySelector(".clear-button");
const exampleButton = document.querySelector(".example-button");
const debugButton = document.querySelector(".debug-button");
const testButton = document.querySelector(".test-button");

//otworz sekcje dodawania linkow
const add_new_link = document.querySelector(".add-section-title");
const add_json = document.querySelector(".json-title");
//dropdown obszar wpisywania danych linkow
const add_dropdown = document.querySelector(".add-drop");
const add_json_dropdown = document.querySelector(".add-drop-json");
const title_input = document.querySelector(".add-title");
const link_input = document.querySelector(".add-link");
const tag1_input = document.querySelector(".add-tag1");
const tag2_input = document.querySelector(".add-tag2");
const tag3_input = document.querySelector(".add-tag3");
const favCheckbox = document.querySelector(".add-fav-check");
const json_text_input = document.querySelector(".json-text");
//submit dodawania
const link_submit_button = document.querySelector(".submit-link");
const submit_json = document.querySelector(".submit-json");
const close_dropdown = document.querySelector(".close-drop");
const close_drop_json = document.querySelector(".close-drop-json");

//obszary do renderowania
const fav_area = document.querySelector(".fav-area");
const most_links = document.querySelector(".most-links");
const all_links = document.querySelector(".all-links");

//wszystkie linki - do obslugi eventow na kliknieciu ich w dowolnym miejscu na stronie
let all_link_elements = [];
//obszar tagow
const type_tags = document.querySelector(".type-tags");
const time_tags = document.querySelector(".time-tags");
let tag_checkboxes = document.querySelectorAll(".tag-checkbox-box");
let datetag_checkboxes = document.querySelectorAll(".datetag-checkbox-box");
const filterButton = document.querySelector(".filter-button");

//lista po filtracji
let filterRenderList = [];

//searchbar
const fav_search = document.querySelector(".fav-search");

//wybor ilosci wyswietlanych most-clicked
let most_amount_choice = 5;
const most_amount = document.querySelectorAll(".most-amount span");

//paginacja
const all_pages_div = document.querySelector(".all-pages");

/**
 * Cheatsheet object
 * @typedef {Object} Cheat
 * @property {string} title - link title text
 * @property {string} link - link text
 * @property {Array<string>} tags - array of tags
 * @property {string} date - autogenerated date of creation
 * @property {string} dateLast - auto date of last interaction
 * @property {boolean} isFav - is link added to favs
 */
// ------------ 1. Obsluga dodawania i usuwania ----------

//tworzenie i zwracanie obiektu cheatsheetu
/**
 *
 * @param {string} title - the title of the link
 * @param {string} link - hyperlink in string format
 * @param {Array<string>} tags - array of 3 string values with link tags
 * @param {boolean} isFav - will link be added to favourites
 * @returns {Cheat} cheatsheet object with title, link, tags, date, dateLast, clicks and isFav fields
 */
const createNewCheatsheet = function (title, link, tags, isFav) {
  let date = new Date();
  date = new Date(date.toISOString());
  /**
   * @type {Cheat}
   */
  const cheat = {
    title: title,
    link: link,
    tags: tags,
    date: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
    dateLast: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
    dateObj: date,
    dateTag: `Today`,
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
  const localTags = JSON.parse(localStorage.getItem("tags"));
  if (localTags) tags = localTags;
  else tags = [];
  const localDateTags = JSON.parse(localStorage.getItem("dateTags"));
  if (localDateTags) dateTags = new Set(localDateTags);
  else dateTags = new Set();
};

//czyszczenie linkow i tagow
const clearObjects = function () {
  cheatsheets = [];
  tags = [];
};

//--------- obsluga dodania/usuwania elementow tablic --------

const deleteEntry = function (e) {
  const counterIndex =
    e.target.parentNode.querySelector(".counter-el").innerHTML;
  cheatsheets.splice(counterIndex, 1);
  callCreationFunctions(cheatsheets);
};

//dodanie od fav poprzez zmienienie isFav, czyli aktualizacje obiektu z cheatsheets
//i tak samo usuniecie, przy czym usuniecie tylko na przycisku w sekcji fav, dodanie w listach
const removeFav = function (e) {
  const counterIndex =
    e.target.parentNode.querySelector(".counter-el").innerHTML;
  cheatsheets[counterIndex].isFav = false;
  renderFavLinksEntries(cheatsheets);
};
const addFav = function (e) {
  const counterIndex =
    e.target.parentNode.parentNode.querySelector(".counter-el").innerHTML;
  cheatsheets[counterIndex].isFav = true;
  renderFavLinksEntries(cheatsheets);
  createEventListeners();
  saveToLocalStorage(cheatsheets, "cheatsheets");
};

//// zebranie istniejacych tagow, moze powinno byc wywolywane przy dodawaniu
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

const renderListEntries = function (renderList, list_container) {
  list_container.innerHTML = ``;
  renderList.forEach((cheat) => {
    const cont_li = document.createElement("li");
    cont_li.innerHTML = `
    <div class="li-div">
    <p data-count="${renderList.indexOf(cheat)}"
    class="hidden counter-el">${renderList.indexOf(cheat)}</p>
    <p class="list-title">
    <a
      class="link-copy most-div-head-long"
      href="${cheat.link}"
      target="_blank"
      rel="noopener noreferrer"
      >${cheat.title}</a
    >
    </p>
    <div class="most-link-tags most-link-short">
      <span>${cheat.tags[0]}</span>
      <span>${cheat.tags[1]}</span>
      <span>${cheat.tags[2]}</span>
    </div>
    <p class="click-counter">${cheat.clicks} cl.</p>
    <p>${cheat.date}</p>
    <p>${cheat.dateLast}</p>
    <ion-icon class="most-delete md hydrated" name="trash-bin" role="img" aria-label="trash bin"></ion-icon>
    <ion-icon class="most-addfav md hydrated" name="star" role="img" aria-label="checkmark"></ion-icon>
    </div>
    `;
    list_container.appendChild(cont_li);
  });
};

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

const renderFavLinksEntries = function (renderList) {
  //reset do stanu poczatkowego z predefiniowanym elementem na czas testow
  fav_area.innerHTML = ``;
  const favCheatsheets = renderList.filter((cheat) => cheat.isFav === true);
  favCheatsheets.forEach((cheat) => {
    const fav_div = document.createElement("div");
    fav_div.classList.add("fav"); //klasa glowna
    // cheat.tags.forEach((tag) => fav_div.classList.add(`${tag}`)); //klasy tagow
    //pierwszy tag jako definujacy wyglad?
    fav_div.classList.add(`${cheat.tags[0]}-border`);
    fav_div.innerHTML = `
    <p data-count="${renderList.indexOf(cheat)}"
    class="hidden counter-el">${renderList.indexOf(cheat)}</p>
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
      <span class="fav-clicks click-counter">${cheat.clicks} cl.</span>
      <ion-icon class="fav-icon fav-delete" name="trash-bin"></ion-icon>
      <ion-icon class="fav-icon fav-remove" name="close"></ion-icon>`;
    fav_area.appendChild(fav_div);
  });
};

const renderTags = function () {
  gatherTags();
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
    type_tags.appendChild(tag_checkbox);
  });
  //aktualizacja tag checkboxes
  tag_checkboxes = document.querySelectorAll(".tag-checkbox-box");
};

//TODO: za 2, 3 dni sprawdz czy dziala
const renderDateTags = function () {
  //zebranie i render date tags na podstawie obliczen i grupowania
  let dateNow = new Date();
  // dateLast: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
  //ustawianie w kazdym z obiektow z cheatsheets odpowiedniego date tagu
  //i dodawanie do setu istniejacych
  // dateTags.clear();
  cheatsheets.forEach((cheat) => {
    dateNow = new Date(dateNow.toISOString());
    const dateDiff = Math.abs(dateNow - cheat.dateObj);
    const dateDiffDays = Math.floor(dateDiff / (1000 * 3600 * 24));
    if (dateDiffDays == 0) {
      cheat.dateTag = `Today`;
      dateTags.add(`Today`);
    }
    if (dateDiffDays == 1) {
      cheat.dateTag = `Yesterday`;
      dateTags.add(`Yesterday`);
    }
    if (dateDiffDays > 1 && dateDiffDays < 7) {
      cheat.dateTag = `<1 week`;
      dateTags.add(`<1 week`);
    }
    if (dateDiffDays > 7 && dateDiffDays < 31) {
      cheat.dateTag = `<1 month`;
      dateTags.add(`<1 month`);
    }
    if (dateDiffDays > 31) {
      cheat.dateTag = `>1 month`;
      dateTags.add(`>1 month`);
    }
  });
  //render checkboxow
  time_tags.innerHTML = `<p class="tag-sect-title">Time added/modded:</p>`;
  dateTags.forEach((tag) => {
    const tag_checkbox = document.createElement("div");
    tag_checkbox.classList.add("tag-checkbox");
    tag_checkbox.innerHTML = `<input
    class="datetag-checkbox-box"
    type="checkbox"
    id="${tag}"
    name="${tag}"
    value="${tag}"
  />
  <label class="tag-checkbox" for="${tag}"> ${tag} </label>
    `;
    time_tags.appendChild(tag_checkbox);
  });
  //aktualizacja tag checkboxes
  datetag_checkboxes = document.querySelectorAll(".datetag-checkbox-box");
  const dateTagsArray = Array.from(dateTags);
  saveToLocalStorage(dateTagsArray, "dateTags");
};

//create event listeners on links in tables
const createEventListeners = function () {
  const mostDeleteList = document.querySelectorAll(".most-delete");
  mostDeleteList.forEach((most_delete) => {
    most_delete.addEventListener("click", (e) => {
      deleteEntry(e);
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
      deleteEntry(e);
    });
  });
  const favRemoveList = document.querySelectorAll(".fav-remove");
  favRemoveList.forEach((fav_remove) => {
    fav_remove.addEventListener("click", (e) => {
      removeFav(e);
    });
  });
  collectLinks();
  all_link_elements.forEach((link_elem) => {
    link_elem.addEventListener("click", (e) => {
      e.stopPropagation();
      countClick(e);
      renderMostClicked(cheatsheets);
    });
  });
  addEditEvents();
  all_pages.forEach((page) => {
    page.addEventListener("click", (e) => {
      selectPage(e);
    });
  });
};

//render wszystkich grup obiektow na stronie
const renderWebsite = function (renderList) {
  renderFavLinksEntries(renderList);
  // renderListEntries(renderList, all_links);
  paginateAll(renderList);
  // renderListEntries(renderList, most_links);
  renderMostClicked(renderList);
  renderTags();
  renderDateTags();
};

//reset inputow dodawania
const resetAddInputs = function () {
  title_input.value = "";
  link_input.value = "";
  tag1_input.value = "";
  tag2_input.value = "";
  tag3_input.value = "";
};

// collect all link elements for event listeners
const collectLinks = function () {
  // let fav_links = document.querySelectorAll(".fav-link");
  // let table_links = document.querySelectorAll(".link-copy");
  // all_link_elements = fav_links.concat(table_links);
  all_link_elements = document.querySelectorAll(".fav-link, .link-copy");
};

//zliczanie klikniecia i aktualizacja tekstu
const countClick = function (e) {
  //selekcja obiektu
  const counterIndex =
    e.target.parentNode.parentNode.querySelector(".counter-el").innerHTML;
  cheatsheets[counterIndex].clicks += 1;
  //wszystkie wystapienia
  const elems = collectByCounter(counterIndex);
  //aktualizacja tekstu
  elems.forEach((el) => {
    el.parentNode.querySelector(
      ".click-counter"
    ).textContent = `${cheatsheets[counterIndex].clicks} cl.`;
  });
  //aktualizacja daty ostatniej interakcji, przy okazji zliczania klikania bo juz obslguje event klikniecia wszedzie
  const dateNow = new Date();
  cheatsheets[counterIndex].dateObj = new Date(dateNow.toISOString());
  cheatsheets[counterIndex].dateLast = `${dateNow.getDate()}/${
    dateNow.getMonth() + 1
  }/${dateNow.getFullYear()}`;
  saveToLocalStorage(cheatsheets, "cheatsheets");
};

//collect and actualize all fav-clicks elements by data value
const collectByCounter = function (count) {
  const elems = document.querySelectorAll(`[data-count="${count}"]`);
  return elems;
};

//#region
/* -------------------------------------------------------------------------- */
/*                     obsluga edycji elementow na stronie                    */
/* -------------------------------------------------------------------------- */

//wybor wszystkich elementow tytulu
const getTitleElements = function () {
  const title_els = document.querySelectorAll(".fav-title, .list-title a");
  return title_els;
};
//wybor wszystkich tagow
const getTagElements = function () {
  const tag_els = document.querySelectorAll(
    ".most-link-tags span, .fav-applied-tags span"
  );
  return tag_els;
};

//selekcja elementu z counterem na podstawie tytulu
const selectCounterByTitle = function (title_el) {
  const counterEl = title_el.parentNode.querySelector(".counter-el");
  //const counterIndex = counterEl.dataset.count;
  const counterIndex = counterEl.innerHTML;
  return counterIndex;
};
//selekcja elementu z counterem na podstawie tagu
const selectCounterByTag = function (title_el) {
  const counterEl = title_el.parentNode.parentNode.querySelector(".counter-el");
  //const counterIndex = counterEl.dataset.count;
  const counterIndex = counterEl.innerHTML;
  return counterIndex;
};

//umozliw edycje i na podstawie countera elementu zapisz to do bazy danych
// funkcja do dodania do ustawiania event listenerow
const addEditEvents = function () {
  const title_elems = getTitleElements();
  const tag_elems = getTagElements();
  //dodanie obu eventow - na dblclick umozliw edycje, na wyjscie wylacz i zapisz zmiany
  title_elems.forEach((title) => {
    //event start edycji
    title.addEventListener("dblclick", (e) => {
      e.preventDefault();
      e.target.setAttribute("contenteditable", "true");
    });
    //event koniec edycji
    title.addEventListener("mouseleave", (e) => {
      e.preventDefault();
      //prewencja odpalania eventu za kazdym razem jak myszka wyjdzie, tylko po edycji\
      if (title.getAttribute("contenteditable") === "true") {
        title.setAttribute("contenteditable", "false");
        const newTitle = title.innerHTML;
        const countIndex = selectCounterByTitle(title);
        cheatsheets[countIndex].title = newTitle;
        const dateNow = new Date();
        cheatsheets[countIndex].dateObj = new Date(dateNow.toISOString());
        cheatsheets[countIndex].dateLast = `${dateNow.getDate()}/${
          dateNow.getMonth() + 1
        }/${dateNow.getFullYear()}`;
        callCreationFunctions(cheatsheets);
      }
    });
  });
  //
  tag_elems.forEach((tag) => {
    let newTag = "";
    let oldTag = "";
    //event start edycji
    tag.addEventListener("dblclick", (e) => {
      e.preventDefault();
      oldTag = e.target.textContent.trim();
      e.target.setAttribute("contenteditable", "true");
    });
    //event koniec edycji
    tag.addEventListener("mouseleave", (e) => {
      e.preventDefault();
      //prewencja odpalania eventu za kazdym razem jak myszka wyjdzie, tylko po edycji\
      if (tag.getAttribute("contenteditable") === "true") {
        tag.setAttribute("contenteditable", "false");
        newTag = tag.textContent.trim();
        const countIndex = selectCounterByTag(tag);
        cheatsheets[countIndex].tags.forEach((el_tag) => {
          if (el_tag === oldTag) {
            // el_tag = newTag;
            cheatsheets[countIndex].tags[
              cheatsheets[countIndex].tags.indexOf(el_tag)
            ] = newTag;
            const dateNow = new Date();
            cheatsheets[countIndex].dateObj = new Date(dateNow.toISOString());
            cheatsheets[countIndex].dateLast = `${dateNow.getDate()}/${
              dateNow.getMonth() + 1
            }/${dateNow.getFullYear()}`;
          }
        });
        callCreationFunctions(cheatsheets);
      }
    });
  });
};

//#endregion

//obsluga elementow nawigacji list - most oraz paginacja
const selectMostAmount = function () {
  most_amount.forEach((choice) => {
    choice.addEventListener("click", (e) => {
      most_amount_choice = e.target.dataset.amount;
      most_amount.forEach((most) => {
        most.classList.remove("most-selected");
      });
      choice.classList.add("most-selected");
      renderMostClicked(cheatsheets);
    });
  });
};

// -------- paginacja --------
// w odpowiedniej kolejnosci:
// 1. obliczyc ile jest stron wgl [ ceiling(length/10) ]
// 2. domyslnie wybrany jest pej = 1
// 3. na podstawie ilosci dynamicznie wyrenderowac liste stron, z wybrana domyslnie pierwsza
// 4. na podstawie pej = 1 wyrenderowac pierwsze 10 elementow listy poprzez podanie wycinka listy
// ---- event listeners ----
// 5. kazdy z peji ma event listener i dataset-pej, przy klinieciu:
//  jesli data=1, renderuj 1 2 3 itd
//  jesli jesli data = 2 itd, to renderuj schematem n-1 i n+1 peje i wywoluj renderowanie listy z odpowiednim wycinkiem
//  przy czym peje renderuj w juz istniejacym divie na nie
// i kwestia bez event listenera na kropkach - po prostu klasa do wyboru nie na kropkach
// i musi tez zbierac za kazdym razem dlugosc cheatsheets by wiedziec jak dzialac

//paginacja listy all, let poniewaz beda sie zmieniac
let all_pages = document.querySelectorAll(".all-pages .page");
let selected_page = 1; //wybrana strona

const paginateAll = function (renderList) {
  const length = Math.ceil(renderList.length / 10);
  //renderowanie stron bez wybranej, dopiero initial render
  let htmlElement = ``;
  if (length < 4) {
    for (i = 1; i <= length; i++) {
      htmlElement += `<span data-page="${i}" class="page">${i}</span>`;
    }
  } else {
    if (selected_page === 1) {
      for (i = 1; i <= 3; i++) {
        htmlElement += `<span data-page="${i}" class="page">${i}</span>`;
      }
    } else {
      htmlElement += `<span data-page="${selected_page - 1}" class="page">${
        selected_page - 1
      }</span>`;
      htmlElement += `<span data-page="${selected_page}" class="page curr-page-all">${selected_page}</span>`;
      htmlElement += `<span data-page="${selected_page + 1}" class="page">${
        selected_page + 1
      }</span>`;
    }
  }
  htmlElement += `<span>...</span>`;
  htmlElement += `<span data-page="${length}" class="page">${length}</span>`;
  all_pages_div.innerHTML = htmlElement;

  //teraz nalozenie klasy curr page wybranej strony
  all_pages = document.querySelectorAll(".all-pages .page");
  all_pages.forEach((apage) => {
    if (parseInt(apage.dataset.page) === selected_page) {
      apage.classList.add("curr-page-all");
    }
  });

  //i render listy w zaleznosci od wybranej strony
  if (selected_page === 1) {
    renderListEntries(renderList.slice(0, 10), all_links);
  } else {
    if (renderList.length < selected_page * 10) {
      renderListEntries(renderList.slice(10 * (selected_page - 1)), all_links);
    } else {
      renderListEntries(
        renderList.slice(10 * (selected_page - 1), 10 * selected_page),
        all_links
      );
    }
  }
  //TODO: / FIXME: kwestia jest, ze aktualnie numery w liscie ustawiane sa po lewo zgodnie z numeracja <li>
  //czyli zawsze od 1 do 10, co jest okej w przypadku most clicked
  // ale w przypadku all_links, nie sprawdza sie, bo niewazne ktora strone klikniesz, idzie 1-10
  // a powinno isc 11-20, 21-30 itd dla dalszych
  // co mozna by rozwiazac poprzez zamiast numeracji <li> dodawac numeracje wlasna na podstawie counter-el
  // ale wtedy most_often numerki by byly losowe
  // wiec trzeba by tam zrobic oddzielnie, ze zliczaniem li i bez countera
  // i to duzo roboty, wiec moze na start wylacz zliczanie i chuj
  // all_pages_div
  // "curr-page-all"
};

const selectPage = function (e) {
  selected_page = parseInt(e.target.dataset.page);
  paginateAll(filterRenderList);
  createEventListeners();
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
        appliedTags.includes(cheat.tags[1]) ||
        appliedTags.includes(cheat.tags[2])
    );
  }
  return renderList;
};

const filterByDateTags = function (inputList) {
  appliedDateTags = [];
  datetag_checkboxes.forEach((tag) => {
    if (tag.checked) appliedDateTags.push(tag.value);
  });
  let renderList = [];
  if (appliedDateTags.length === 0) {
    renderList = inputList;
  } else {
    renderList = inputList.filter((cheat) =>
      appliedDateTags.includes(cheat.dateTag)
    );
  }
  return renderList;
};

const filterBySearch = function (inputList) {
  let searchterm = fav_search.value.toLowerCase();
  console.log(searchterm);
  let renderList = [];
  //sprawdzanie po skladowych tagow
  let includesTag = 0;
  inputList.forEach((cheat) => {
    cheat.tags.forEach((tag) => {
      if (tag.toLowerCase().includes(searchterm)) {
        includesTag = 1;
      }
    });
  });
  //sprawdzanie czy zawiera tag w calosci
  // cheat.tags.includes(searchterm)

  renderList = inputList.filter(
    (cheat) =>
      cheat.title.toLowerCase().includes(searchterm) ||
      cheat.link.toLowerCase().includes(searchterm) ||
      includesTag
  );
  return renderList;
};

//------------ sortowanie --------------
const sortByTitle = function (unsorted) {
  const sorted = unsorted.toSorted((a, b) => {
    if (a.title > b.title) return 1;
    if (a.title < b.title) return -1;
    return 0;
  });
  return sorted;
};

const sortByDate = function (unsorted) {
  const sorted = unsorted.toSorted((a, b) => {
    a = new Date(a.dateObj).getTime();
    b = new Date(b.dateObj).getTime();
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
  });
  return sorted;
};

const addSortEvents = function () {
  const title_head_all = document.querySelector(".title-head-all");
  title_head_all.addEventListener("click", (e) => {
    //jesli sortowanie zaaplikowane, wylacz
    if (title_head_all.classList.contains("sorted")) {
      // renderListEntries(cheatsheets, all_links);
      paginateAll(filterRenderList);
      createEventListeners();
      title_head_all.classList.remove("sorted");
    } else {
      // renderListEntries(sortByTitle(cheatsheets), all_links);
      paginateAll(sortByTitle(filterRenderList));
      createEventListeners();
      title_head_all.classList.add("sorted");
    }
  });
  const title_head_most = document.querySelector(".title-head-most");
  title_head_most.addEventListener("click", (e) => {
    //jesli sortowanie zaaplikowane, wylacz
    if (title_head_most.classList.contains("sorted")) {
      renderMostClicked(filterRenderList);
      title_head_most.classList.remove("sorted");
    } else {
      renderMostClicked(sortByTitle(filterRenderList));
      title_head_most.classList.add("sorted");
    }
  });
  const dateLast_head_all = document.querySelector(".dateLast-head-all");
  dateLast_head_all.addEventListener("click", (e) => {
    //jesli sortowanie zaaplikowane, wylacz
    if (dateLast_head_all.classList.contains("sorted")) {
      // renderListEntries(cheatsheets, all_links);
      paginateAll(filterRenderList);
      createEventListeners();
      dateLast_head_all.classList.remove("sorted");
    } else {
      // renderListEntries(sortByTitle(cheatsheets), all_links);
      paginateAll(sortByDate(filterRenderList));
      createEventListeners();
      dateLast_head_all.classList.add("sorted");
    }
  });
  const dateLast_head_most = document.querySelector(".dateLast-head-most");
  dateLast_head_most.addEventListener("click", (e) => {
    //jesli sortowanie zaaplikowane, wylacz
    if (dateLast_head_most.classList.contains("sorted")) {
      renderMostClicked(filterRenderList);
      dateLast_head_most.classList.remove("sorted");
    } else {
      renderMostClicked(sortByDate(filterRenderList));
      dateLast_head_most.classList.add("sorted");
    }
  });
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

add_json.addEventListener("click", (e) => {
  e.preventDefault();
  add_json_dropdown.style.display = "flex";
});

close_drop_json.addEventListener("click", (e) => {
  e.preventDefault();
  add_json_dropdown.style.display = "none";
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
  //dodawanie tagow przy tworzeniu
  cheat.tags.forEach((tag) => {
    if (!tags.includes(tag)) tags.push(tag);
  });
  callCreationFunctions(cheatsheets);
});

const getJsonInput = function () {
  //parse wartosci z pola
  //stworzenie nowych obiektow moze wykorzystujac createnewcheatsheet?
  //zapisywanie tych obiektow do tablicy
  //na koniec do localstorage i render
  //--- kwestie: ---
  //przy czym uzytnik nie podaje wszystkich informacji w tekscie
  //wiec najlepiej wykorzystac gotowa funkcje create
  //a tekst wpakowac w nowy obiekt, a wlasciwie tablice obiektow
  //i potem foreach i wyciagac z niej i wpakowywac w funkcje create
  let json_text = JSON.parse(json_text_input.value);
  json_text.forEach((item) => {
    const cleanedTitle = item.title.replace(/<\/?[^>]+(>|$)/g, "");
    const cheat = createNewCheatsheet(
      cleanedTitle,
      item.link,
      [item.tag1, item.tag2, item.tag3],
      item.isFav
    );
    cheatsheets.push(cheat);
    cheat.tags.forEach((tag) => {
      if (!tags.includes(tag)) tags.push(tag);
    });
  });
  callCreationFunctions(cheatsheets);
};

submit_json.addEventListener("click", (e) => {
  getJsonInput();
});

//filtracja
fav_search.addEventListener("input", (e) => {
  e.preventDefault();
  callCreationFunctions(filterBySearch(filterRenderList));
});

filterButton.addEventListener("click", (e) => {
  e.preventDefault();
  // callCreationFunctions(filterByTags());
  filterRenderList = filterByTags();
  filterRenderList = filterByDateTags(filterRenderList);
  filterRenderList = filterBySearch(filterRenderList);
  renderFavLinksEntries(filterRenderList);
  // renderListEntries(filterRenderList, all_links);
  paginateAll(filterRenderList);
  // renderListEntries(renderList, most_links);
  renderMostClicked(filterRenderList);
});

clearButton.addEventListener("click", (e) => {
  e.preventDefault();
  clearStorage(); //czysci pamiec
  getFromLocal(); //aktualizuje wewnetrzne dane
  renderWebsite(cheatsheets); //renderuje strone
  collectLinks();
});

exampleButton.addEventListener("click", (e) => {
  addTestObjects();
});

debugButton.addEventListener("click", (e) => {
  debugFunction();
});

//funkcja zbierajaca funkcje zwiazane z tworzeniem nowych cheatsheetow, bo powtarzaja sie
const callCreationFunctions = function (renderList) {
  saveToLocalStorage(cheatsheets, "cheatsheets");
  saveToLocalStorage(tags, "tags");
  renderWebsite(renderList);
  paginateAll(renderList);
  createEventListeners();
  collectLinks();
};

// ---------- call at load -------------
const mainFunc = function () {
  getFromLocal();
  filterRenderList = filterByTags();
  filterRenderList = filterByDateTags(filterRenderList);
  filterRenderList = filterBySearch(filterRenderList);
  renderWebsite(cheatsheets);
  paginateAll(cheatsheets);
  createEventListeners();
  selectMostAmount();
  addSortEvents();
  testButton.addEventListener("click", (e) => {
    renderDateTags();
  });
};

mainFunc();

// ---------- tests -----------
// predefiniowany obiekt do testow
const addTestObjects = function () {
  const cheat1 = createNewCheatsheet(
    "10 ways to hide elements in CSS",
    "https://www.sitepoint.com/hide-elements-in-css/",
    ["prog", "css", "howto"],
    true
  );
  const cheat2 = createNewCheatsheet(
    "Curated CSS gradients",
    "https://gradients.shecodes.io/ ",
    ["prog", "css", "resources"],
    false
  );
  cheatsheets.push(cheat1);
  cheatsheets.push(cheat2);
  callCreationFunctions(cheatsheets);
};

const debugFunction = function () {
  console.log(`------- new debug -------`);
  const countElems = document.querySelectorAll(".counter-el");
  countElems.forEach((count) => {
    const countIndex = count.innerHTML;
    console.log(
      `cheatsheets:`,
      "\n",
      `${countIndex}: ${JSON.stringify(cheatsheets[countIndex])}`
    );
  });
};
