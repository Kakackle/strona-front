// TODO: poki co proste obslugi zachowan w tym pliku,
// potem kiedy bede tworzyl struktury poprzerzucac w wiele

//TODO: kwestia do rozwazenia, majac klase close button, zawsze zamykajaca
//parenta, moze mozna przypisac do kazdego wystapienia klasy ten sam event listener
//zamkniecia parenta targetu
//gdzie koniecznie targetu zeby zamykalo tylko jeden a nie wiele? - maybe

const add_stamp_button = document.querySelector(".add-stamp");
const add_drop_stamp = document.querySelector(".add-drop-stamp");
const submit_stamp_button = document.querySelector(".submit-stamp-button");
const close_stamp_drop_button = document.querySelector(".close-stamp-drop");
const add_cat_button = document.querySelector(".add-cat");
const add_drop_cat = document.querySelector(".add-drop-cat");
const submit_cat_button = document.querySelector(".submit-cat-button");
const close_cat_drop_button = document.querySelector(".close-cat-drop");

add_stamp_button.addEventListener("click", (e) => {
  add_drop_stamp.style.display = "flex";
});

submit_stamp_button.addEventListener("click", (e) => {
  add_drop_stamp.style.display = "none";
});

close_stamp_drop_button.addEventListener("click", (e) => {
  add_drop_stamp.style.display = "none";
});

add_cat_button.addEventListener("click", (e) => {
  add_drop_cat.style.display = "flex";
});

submit_cat_button.addEventListener("click", (e) => {
  add_drop_cat.style.display = "none";
});

close_cat_drop_button.addEventListener("click", (e) => {
  add_drop_cat.style.display = "none";
});

//TODO: start js
