/**
 * funkcja renderujaca liste checkboxow, przyjmuje liste obiektow do stworzenai i container gdzie stworzyc
 * @param {*} categories - lista kategorii do renderowania
 * @param {*} container - element DOM zawierajacy
 * @param {*} name - label grupy checkboxow
 */
const renderCheckboxes = function (table, container, name) {
  container.innerHTML = ``;
  let renderTemplate = `<span class="checkboxes-title">${name}:</span>`;
  table.forEach((cat) => {
    renderTemplate += `<div class="checkbox-style">
        <input type="checkbox" class="cat-filter" value="${cat.name}"/>
        <label for="cat-filter">${cat.name}</label>
      </div>
        `;
  });
  container.innerHTML = renderTemplate;
};

/**
 * Funkcja do renderu podanej tablicy timestamps (najpewniej po filtracji) z paginacja\
 * renderuje cyfry stron oraz dzieli podana tablice na strony po "amount" przedmiotow
 * @param {*} table - tablica elementow do renderowania
 * @param {*} container - docelowy kontener DOM timestampow
 * @param {*} page_container - kontener na cyfry stron
 * @param {*} amount - ile stampow zmiescic w jednej stronie paginacji
 * @param {*} selected_page - kliknieta strona paginacji
 */
const paginateTimestamps = function (
  table,
  container,
  page_container,
  amount,
  selected_page
) {
  //render Stron paginacji
  page_container = document.createElement("div");
  page_container.classList.add("stamp-pagination");
  page_container.innerHTML = ``;
  const length = Math.ceil(table.length / amount);
  let htmlElement = ``;
  if (length < 4) {
    for (let i = 1; i <= length; i++) {
      htmlElement += `<span data-page="${i}" class="page hover">${i}</span>`;
    }
  } else {
    if (selected_page === 1) {
      for (let i = 1; i <= 3; i++) {
        htmlElement += `<span data-page="${i}" class="page hover">${i}</span>`;
      }
    } else {
      htmlElement += `<span data-page="${
        selected_page - 1
      }" class="page hover">${selected_page - 1}</span>`;
      htmlElement += `<span data-page="${selected_page}" class="page curr-page-all hover">${selected_page}</span>`;
      htmlElement += `<span data-page="${
        selected_page + 1
      }" class="page hover">${selected_page + 1}</span>`;
    }
  }
  htmlElement += `<span class="page-dots">...</span>`;
  htmlElement += `<span data-page="${length}" class="page hover">${length}</span>`;
  //docelowy element zawierajacy
  page_container.innerHTML = htmlElement;

  //aplikacja klasy curr-page do wybranej strony
  let pages = page_container.querySelectorAll(".page");
  pages.forEach((apage) => {
    if (parseInt(apage.dataset.page) === selected_page) {
      apage.classList.add("curr-page");
    }
  });

  //i render listy w zaleznosci od wybranej strony
  if (selected_page === 1) {
    renderTimestamps(table.slice(0, amount), container, page_container);
  } else {
    if (table.length < selected_page * amount) {
      renderTimestamps(
        table.slice(amount * (selected_page - 1)),
        container,
        page_container
      );
    } else {
      renderTimestamps(
        table.slice(amount * (selected_page - 1), amount * selected_page),
        container,
        page_container
      );
    }
  }
};

/**
 * render wlasciwy elementow timestamps
 * @param {*} table
 * @param {*} container
 */
const renderTimestamps = function (table, container, page_container) {
  container.innerHTML = ``;
  table.forEach((item) => {
    const stamp_div = document.createElement("div");
    stamp_div.classList.add("stamp-div");
    //podstawowy element stamp - bez dodatkowego separatora
    stamp_div.innerHTML = `
    <p data-counter="${table.indexOf(item)}"
            class="hidden counter-el">${table.indexOf(item)}</p>
            <div class="stamp-left">
              <span class="stamp-date">${item.dateStr}</span>
              <span class="stamp-hour">${item.hrsStr}</span>
            </div>
            <div class="stamp-cat">
              <span
                ><ion-icon
                  name="${item.category.icon}"
                  class="stamp-icon hover"
                ></ion-icon
              ></span>
              <span class="stamp-cat-name">${item.category.name}</span>
            </div>
            <div class="stamp-right">
              <span class="stamp-interval">TIME SINCE LAST STAMP:</span>
              <span class="stamp-interval-time">${item.interval}</span>
              <span class="stamp-today">TIMES TODAY: ${item.times}</span>
            </div>
            <ion-icon
              name="trash-outline"
              class="close-button close-stamp hover"
            ></ion-icon>`;
    //jesli pierwszy element, renderuj z data
    if (table.indexOf(item) === 0) {
      stamp_div.innerHTML += `<span class="stamp-date-separator">${item.dateStr}</span>`;
      stamp_div.classList.add("date-separator");
    } else if (item.dateStr !== table[table.indexOf(item) - 1].dateStr) {
      stamp_div.innerHTML += `<span class="stamp-date-separator">${item.dateStr}</span>`;
      stamp_div.classList.add("date-separator");
    }
    container.appendChild(stamp_div);
    //aplikacja koloprow klasy na style elementow
    stamp_div.style.border = `5px solid ${item.category.color}`;
    stamp_div.style.backgroundColor = `${item.category.color}33`;
    stamp_div.querySelector(
      ".stamp-date"
    ).style.color = `${item.category.color}`;
    stamp_div.querySelector(
      ".stamp-hour"
    ).style.color = `${item.category.color}`;
  });
  container.appendChild(page_container);
};

/**
 * funckja renderowania opcji option do listy select (container) z podanej table (kategorii)
 * @param {*} table
 * @param {*} container - DOM container
 */
const renderCatOptions = function (table, container) {
  container.innerHTML = ``;
  table.forEach((cat) => {
    const optionEl = document.createElement("option");
    optionEl.value = cat.name;
    optionEl.text = cat.name;
    container.appendChild(optionEl);
  });
};

export {
  renderCheckboxes,
  renderTimestamps,
  paginateTimestamps,
  renderCatOptions,
};
