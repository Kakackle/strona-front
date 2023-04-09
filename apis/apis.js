// ---------------- fetch way -------------
// const fetchPromise = fetch(
//   "https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json"
// );

// fetchPromise
//   .then((response) => response.json())
//   .then((data) => {
//     console.log(data[0].name);
//   });

// ----------------- with error catching ------------

// const fetchPromiseErr = fetch(
//   "bad-scheme://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json"
// );

// fetchPromiseErr
//   .then((response) => {
//     if (!response.ok) {
//       throw new Error(`HTTP error: ${response.status}`);
//     }
//     return response.json();
//   })
//   .then((data) => {
//     console.log(data[0].name);
//   })
//   .catch((error) => {
//     console.error(`Could not get products: ${error}`);
//   });

// ------------- async await way -----------

async function getAsync(url) {
  //api request
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    //parsing data from response to json
    const data = await response.json();
    // console.log("await:");
    // console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
}

// getAsync("https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json");

// ---------------- actual APIs ----------------
const joke_button = document.querySelector(".joke-button");
const joke_text = document.querySelector(".joke");

const kanye_button = document.querySelector(".kanye-button");
const quote_text = document.querySelector(".quote");

const nation_button = document.querySelector(".nation-button");
const nation_text = document.querySelector(".nation");
const nation_input = document.querySelector("#name-input");

const link_button = document.querySelector(".link-button");
const linktitle_text = document.querySelector(".linktitle");
const link_input = document.querySelector("#link-input");
const link_icon = document.querySelector(".link-icon");

const drink_button = document.querySelector(".drink-button");
const drink_text = document.querySelector(".drink");
const drink_input = document.querySelector("#drink-input");
const drink_ingredients = document.querySelector(".drink-ingredients");

const dog_button = document.querySelector(".dog-button");
const dog_img = document.querySelector(".dog-img");

const loader_joke = document.querySelector(".loader-joke");
const loader_kanye = document.querySelector(".loader-kanye");
const loader_nation = document.querySelector(".loader-nation");
const loader_linktitle = document.querySelector(".loader-linktitle");
const loader_drink = document.querySelector(".loader-drink");

const displayJoke = async function () {
  // alert("button clicked!");
  loader_joke.style.display = "inline-block";
  joke_text.innerText = "Loading...";
  const joke_data = await getAsync("https://icanhazdadjoke.com/");
  console.log("received joke data:");
  console.log(joke_data);
  loader_joke.style.display = "none";
  const joke = joke_data.joke;
  console.log(joke);
  joke_text.innerText = joke;
};

const displayQuote = async function () {
  // alert("button clicked!");
  loader_kanye.style.display = "inline-block";
  quote_text.innerText = "Loading...";
  const quote_data = await getAsync("https://api.kanye.rest/");
  console.log("received kanye data:");
  console.log(quote_data);
  loader_kanye.style.display = "none";
  const quote = quote_data.quote;
  console.log(quote);
  quote_text.innerText = quote;
};

const displayNation = async function () {
  // alert("button clicked!");
  loader_nation.style.display = "inline-block";
  nation_text.innerText = "Loading...";
  const input_name = nation_input.value;
  const nation_data = await getAsync(
    `https://api.nationalize.io/?name=${input_name}`
  );
  console.log("received nation data:");
  console.log(nation_data);
  loader_nation.style.display = "none";
  const nation = nation_data.country[0].country_id;
  const prob = nation_data.country[0].probability;
  console.log(nation);
  nation_text.innerText = `${nation} prob: ${prob}`;
};

const displayLinktitle = async function () {
  // alert("button clicked!");
  loader_linktitle.style.display = "inline-block";
  linktitle_text.innerText = "Loading...";
  const input_link = link_input.value;
  const link_data = await getAsync(
    `https://api.microlink.io/meta?url=${input_link}`
  );
  console.log("received link data:");
  console.log(link_data);
  loader_linktitle.style.display = "none";
  // const link = link_data.country[0].country_id;
  // const prob = link_data.country[0].probability;
  const linktitle = link_data.data.title;
  console.log(linktitle);
  link_icon.style.background = `url("${link_data.data.logo.url}")`;
  linktitle_text.innerText = `${linktitle}`;
};

function getRandomInt(max) {
  return Math.floor(Math.random() * max); //0 to max
}

const displayDrink = async function () {
  // alert("button clicked!");
  loader_drink.style.display = "inline-block";
  drink_text.innerText = "Loading...";
  const input_drink = drink_input.value;
  const drink_data = await getAsync(
    `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${input_drink}`
  );
  console.log("received drink data (by ingredient):");
  console.log(drink_data);
  loader_drink.style.display = "none";
  const drink = drink_data.drinks[getRandomInt(5)];
  console.log("Chosen drink:");
  console.log(drink);
  drink_text.innerText = `${drink.strDrink}`;
  displayDrinkIngredients(drink);
};

const displayDrinkIngredients = async function (drink) {
  // drink.idDrink
  //usuwanie poprzednich li
  drink_ingredients.innerHTML = "";

  loader_drink.style.display = "inline-block";
  const ingredient_data = await getAsync(
    `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drink.idDrink}`
  );
  console.log("received ingredient data:");
  console.log(ingredient_data);
  loader_drink.style.display = "none";
  let ingredients = [];
  for (let i = 1; i <= 4; i++) {
    ingredients[i] = ingredient_data.drinks[0][`strIngredient${i}`];
    console.log(`ingr ${i}: ${ingredients[i]}`);
    let node = document.createElement("li");
    node.appendChild(document.createTextNode(ingredients[i]));
    drink_ingredients.appendChild(node);
  }
};

const displayDog = async function () {
  dog_img.src = "";
  dog_img.style.backgroundColor = "#000000";
  const dog_data = await getAsync("https://dog.ceo/api/breeds/image/random");
  console.log("received dog data:");
  console.log(dog_data);
  dog_img.style.backgroundColor = "#fefefe";
  const dogUrl = dog_data.message;
  console.log(dogUrl);
  dog_img.src = dogUrl;
};

joke_button.addEventListener("click", function (e) {
  e.preventDefault();
  displayJoke();
});
kanye_button.addEventListener("click", function (e) {
  e.preventDefault();
  displayQuote();
});
nation_button.addEventListener("click", function (e) {
  e.preventDefault();
  displayNation();
});
link_button.addEventListener("click", function (e) {
  e.preventDefault();
  displayLinktitle();
});
drink_button.addEventListener("click", function (e) {
  e.preventDefault();
  displayDrink();
});
dog_button.addEventListener("click", function (e) {
  e.preventDefault();
  displayDog();
});

const encodedParams = new URLSearchParams();
encodedParams.append("source_language", "en");
encodedParams.append("target_language", "es");
encodedParams.append("text", "Where is the train station?");

const options = {
  method: "POST",
  headers: {
    "content-type": "application/x-www-form-urlencoded",
    "X-RapidAPI-Key": "57c16c9db8mshf0dc14819bbd10bp135d9ejsn81856cd2076e",
    "X-RapidAPI-Host": "text-translator2.p.rapidapi.com",
  },
  body: encodedParams,
};

fetch("https://text-translator2.p.rapidapi.com/translate", options)
  .then((response) => response.json())
  .then((response) => console.log(response))
  .catch((err) => console.error(err));
