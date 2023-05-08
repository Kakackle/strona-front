// import Chart from 'chart.js/auto'

import { calcTimesDaily, calcTimesMulti } from "./stamp_tools.js";

//TODO: tutaj robione
/**
 * funkcja zbierajaca i formujaca dane do generacji bar chartu
 * dla jednej lub wiele kategorii (for cat in cats)
 * bo labels beda te same - dni od today w przeszlosc o days
 * zgodnie z przykladem data:https://www.chartjs.org/docs/latest/samples/bar/vertical.html
 * i generalnie https://www.chartjs.org/docs/latest/getting-started/usage.html
 * @param {Array} cats - Array of categories names
 * @param {*} days - number of days in the past
 * @param {*} table - timestamps
 * @returns {Array} [data, y_max] data - object with data for a bar graph with labels and cats.length datasets
 */
//TODO: dailydates
//TODO: wgl odbior danych z wszystkich pol, bo poki co tylko testowe robione
function setupBarDailyData(cats, days, table) {
  let labels = [];
  for (let i = 0; i <= days; i++) {
    // let dateOffset = (24*60*60*1000) * i;
    let today = new Date();
    today.setDate(today.getDate() - i);
    let dateStr = `${today.getDate()}/${
      today.getMonth() + 1
    }/${today.getFullYear()}`;
    labels.push(dateStr);
  }

  labels = labels.reverse();

  let data = {
    labels: labels,
    datasets: [],
  };
  let y_max = 0;
  cats.forEach((cat) => {
    let obj = {
      label: `${cat.name}`,
      data: calcTimesDaily(cat, days, table),
      borderColor: `${cat.color}`,
      backgroundColor: `${cat.color}55`,
      borderWidth: 2,
    };
    // let obj_max = [calcTimesDaily].reduce((a, b) => Math.max(a, b), -Infinity);
    let obj_max = Math.max(...calcTimesDaily(cat, days, table));
    y_max = Math.max(y_max, obj_max);
    data.datasets.push(obj);
  });
  return [data, y_max];
}

//TODO: tu robione data graph dates
//kwestia generacja dates miedzy dwoma datami

/**
 * Funkcja tworzaca bar graph dla daily wystapien kategorii z dataIn
 * tworzony we wskazanym elemencie typu <canvas>
 * @param {*} dataIn - data stworzona pod graf z @see setupBarDailyData
 * @param {*} canvas - miejsce do renderu
 * @param {*} y_max - max y-axis value
 * @param {*} chart_type - "line" or "bar"
 */
function createBarDailyGraph(dataIn, canvas, y_max, chart_type) {
  new Chart(canvas, {
    type: chart_type,
    options: {
      animation: false,
      plugins: {
        legend: {
          display: true,
        },
        tooltip: {
          enabled: false,
        },
      },
      scales: {
        y: {
          max: y_max + 1,
        },
      },
      maintainAspectRatio: false,
    },
    data: dataIn,
  });
}
/**
 *
 * @param {*} cats - chosen categories
 * @param {*} canvas - pie canvas
 * @param {*} days - pie days
 * @param {*} table - timestamps
 */
function createPieDailyGraph(cats, canvas, days, table) {
  let data = {
    labels: [],
    datasets: [
      {
        label: "Times",
        data: [],
        backgroundColor: [],
        hoverOffset: 4,
      },
    ],
  };
  //labels
  cats.forEach((cat) => {
    data.labels.push(cat.name);
  });
  //data
  data.datasets[0].data = calcTimesMulti(cats, days, table);
  //colors
  cats.forEach((cat) => {
    data.datasets[0].backgroundColor.push(cat.color);
  });

  new Chart(canvas, {
    type: "doughnut",
    options: {
      maintainAspectRatio: false,
    },
    data: data,
  });
}

export { setupBarDailyData, createBarDailyGraph, createPieDailyGraph };
