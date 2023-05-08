// import Chart from 'chart.js/auto'

import { calcTimesDaily } from "./stamp_tools.js";

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
//TODO: odbior typu grafu z boxow graph-type-box
//TODO: dailydates
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

/**
 * Funkcja tworzaca bar graph dla daily wystapien kategorii z dataIn
 * tworzony we wskazanym elemencie typu <canvas>
 * @param {*} dataIn - data stworzona pod graf z @see setupBarDailyData
 * @param {*} canvas - miejsce do renderu
 * @param {*} y_max - max y-axis value
 */
function createBarDailyGraph(dataIn, canvas, y_max) {
  new Chart(canvas, {
    type: "bar",
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

function createTestGraph() {
  const data = [
    { year: 2010, count: 10 },
    { year: 2011, count: 20 },
    { year: 2012, count: 15 },
    { year: 2013, count: 25 },
    { year: 2014, count: 22 },
    { year: 2015, count: 30 },
    { year: 2016, count: 28 },
  ];

  new Chart(document.getElementById("bar-graph-background"), {
    type: "bar",
    options: {
      animation: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
    },
    data: {
      labels: data.map((row) => row.year),
      datasets: [
        {
          label: "Test bar graph",
          data: data.map((row) => row.count),
        },
      ],
    },
  });
}

export { createTestGraph, setupBarDailyData, createBarDailyGraph };
