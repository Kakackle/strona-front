const nav_section = document.querySelector(".nav-section");
const banners = document.querySelectorAll(".banner");
const dots = document.querySelectorAll(".dot");

//test transition miedzy bannerami - znikniecie poprzedniego (0) opoznione o 1s wzgledem nast (1)

// nav_section.addEventListener("click", function (e) {
//   e.preventDefault();
//   banners[1].classList.remove("banner-off");
//   banners[1].classList.add("banner-active");
//   setTimeout(() => {
//     banners[0].classList.remove("banner-active");
//     banners[0].classList.add("banner-off");
//   }, 1000);
// });

let bannerIndex = 0;
let bannerIndexNext = 1;
let dotSelectAvailable = 1;

fillBar();

const swapBanners = function (banners) {
  //dlugosc tablicy bannerow do petlowania
  const length = banners.length;

  //sprawdanie poprawnosci indeksu nastepnego banneru
  if (bannerIndex + 1 < length) bannerIndexNext = bannerIndex + 1;
  else bannerIndexNext = 0;

  bannerIndex = updateBanners(bannerIndex, bannerIndexNext);
};

let bannerTimer = setInterval(() => {
  swapBanners(banners);
}, 5000);

dots.forEach((dot) =>
  dot.addEventListener("click", function (e) {
    e.preventDefault();
    if (dotSelectAvailable) {
      //   dotSelectAvailable = 0;

      //aktualizacja wybranego banneru
      bannerIndexNext = dot.dataset.dot;

      //reset timera poprzez usuniecie i dodanie spowrotem
      clearInterval(bannerTimer);
      // bannerTimer = null;

      bannerIndex = updateBanners(bannerIndex, bannerIndexNext);
      // console.log(`dot data: wychodzimy z update`);

      bannerTimer = setInterval(() => {
        swapBanners(banners);
      }, 5000);
    }
  })
);

const updateBanners = function (bannerIndex, bannerIndexNext) {
  //aktywacja nastepnego banneru
  console.log(`bannerIndexNext przy aktualizacji wygladu: ${bannerIndexNext}`);
  banners[bannerIndexNext].classList.remove("banner-off");
  banners[bannerIndexNext].classList.add("banner-active");

  //------------updating the dots ----------
  [].forEach.call(dots, function (el) {
    el.classList.remove("dot-active");
  });
  dots[bannerIndexNext].classList.add("dot-active");

  //updating the progress bar
  fillBar();

  //wylaczenie starego banneru

  let currBanner = banners[bannerIndex];
  console.log(`bannerIndex przy aktualizacji wygladu: ${bannerIndex}`);
  setTimeout(() => {
    currBanner.classList.remove("banner-active");
    currBanner.classList.add("banner-off");
  }, 1000);

  bannerIndex = bannerIndexNext;

  return bannerIndex;
};

function fillBar() {
  var i = 0;
  if (i == 0) {
    i = 1;
    var elem = document.querySelector(".progBar");
    var width = 10;
    var id = setInterval(frame, 55);
    function frame() {
      if (width >= 100) {
        clearInterval(id);
        i = 0;
      } else {
        width++;
        elem.style.width = width + "%";
      }
    }
  }
}
