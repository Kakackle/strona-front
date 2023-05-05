/**
 * Funkcja obliczania interwalu miedzy dwoma datami
 * @param {*} date1
 * @param {*} date2
 * @returns {String} data w postaci stringu HH:MM:SS
 */
const timeDiffString = function (date1, date2) {
  const diff = Math.abs(date1 - date2);
  let diffSecs = Math.floor((diff / 1000) % 60);
  let diffMins = Math.floor((diff / (1000 * 60)) % 60);
  let diffHrs = Math.floor(diff / (1000 * 60 * 60));
  //jesli w postaci tekstu
  diffSecs = diffSecs < 10 ? "0" + diffSecs : diffSecs;
  diffMins = diffMins < 10 ? "0" + diffMins : diffMins;
  diffHrs = diffHrs < 10 ? "0" + diffHrs : diffHrs;

  return diffHrs + ":" + diffMins + ":" + diffSecs;
};
/**
 * Zwraca roznice dni miedzy dwoma datami w postaci liczby
 * @param {*} date1
 * @param {*} date2
 * @returns {number}
 */
const dayDiff = function (date1, date2) {
  const diff = Math.abs(date1 - date2);
  let diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * funckja wyciagajaca godziny w ladnej postaci z daty w brzydkiej (ISO)
 * @param {Date} date - date object
 * @returns {String} - date in 'HH:MM:SS'
 */
//FIXME: troche psuje zasade SOLID, ale to modulo 24...
//also kompletnie zbyteczne, jest przeciez .getHours() itd... ja pierdole
const getHrsString = function (date) {
  const dateS = new Date(date.getTime());
  let secs = Math.floor((dateS / 1000) % 60);
  let mins = Math.floor((dateS / (1000 * 60)) % 60);
  let hrs = Math.floor((dateS / (1000 * 60 * 60)) % 24);
  secs = secs < 10 ? "0" + secs : secs;
  mins = mins < 10 ? "0" + mins : mins;
  hrs = hrs < 10 ? "0" + hrs : hrs;
  return hrs + ":" + mins + ":" + secs;
};

/**
 * Funkcja wyciagajaca z obiektu Date postac String "DD:MM:YY"
 * @param {Date} date
 * @returns {String}
 */
const getDateString = function (date) {
  const dateS = new Date(date.getTime());
  let days = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  days = days < 10 ? "0" + days : days;
  month = month < 10 ? "0" + month : month;
  return days + "." + month + "." + year;
  // return `${date.getDate()}:${date.getMonth() + 1}:${date.getFullYear()}`;
};

/**
 * Funkcja obliczajaca ilosc wystapien kategorii cat w ostatnich days dniach
 * z podanej tablicy table, najpewniej timestamps
 *  @param {*} cat
 * @param {Number} days
 * @param {Array} table
 * @returns {Number} times - ilosc razy
 */
const calcTimes = function (cat, days, table) {
  let times = 0;
  let today = new Date();
  table.forEach((item) => {
    //musi sprawdzic czy miesci sie w dniach i nalezy do kategorii
    if (item.getCategory() === cat) {
      if (dayDiff(item.date, today) < days) {
        times += 1;
      }
    }
  });
  return times;
};

/**
 * Czas od ostateniego wystapienia kategorii cat w stringu HH:MM:SS
 * @param {*} cat
 * @param {*} table
 * @returns {String} time diff string
 */
const timeSinceCat = function (cat, table, stampDate) {
  let latestStamp = undefined;
  // let today = new Date();
  let diff = `00:00:00`;
  if (table.length > 1) {
    latestStamp = table.find((stamp) => {
      return stamp.getCategory() === cat;
    });
    if (latestStamp) {
      diff = timeDiffString(latestStamp.date, stampDate);
    }
  }
  return diff;
};

export {
  timeDiffString,
  timeSinceCat,
  getDateString,
  getHrsString,
  calcTimes,
  dayDiff,
};
