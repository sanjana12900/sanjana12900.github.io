let API_key="";
//if you have an API key, replace star in the following string and uncomment the next line, while commenting the first line
//let API_key = "?registrationkey=*";

const supersector = {
    "00": "Total nonfarm",
    "05": "Total private",
    "06": "Goods-producing",
    "07": "Service-providing",
    "08": "Private service-providing",
    "10": "Mining and logging",
    "20": "Construction",
    "30": "Manufacturing",
    "31": "Durable Goods",
    "32": "Nondurable Goods",
    "40": "Trade, transportation, and utilities",
    "41": "Wholesale trade",
    "42": "Retail trade",
    "43": "Transportation and warehousing",
    "44": "Utilities",
    "50": "Information",
    "55": "Financial activities",
    "60": "Professional and business services",
    "65": "Education and health services",
    "70": "Leisure and hospitality",
    "80": "Other services",
    "90": "Government"
}
let supersectorKey = Object.keys(supersector);
let responseCount = 0;

const CHART_COLORS = {
    red: 'rgb(255,0,0)',
    purple: 'rgb(128,0,128)',
    fuchsia: 'rgb(255,0,255)',
    green: 'rgb(0,128,0)',
    yellow: 'rgb(255,255,0)',
    navy: 'rgb(0,0,128)',
    aqua: 'rgb(0,255,255',
    lavender: 'rgb(230,230,250)',
    lawngreen: 'rgb(124,252,0)',
    mediumpurple: 'rgb(147,112,219)',
    mediumvioletred: 'rgb(199,21,133)',
    goldenrod: 'rgb(218,165,32)',
    orange: 'rgb(255,165,0)',
    olive: 'rgb(128,128,0)',
    peru: 'rgb(205,133,63)',
    pink: 'rgb(255, 192, 203)',
    slategrey: 'rgb(112, 128,144)',
    wheat: 'rgb(245, 222, 179)',
    lightcoral: 'rgb(240,128,128)',
    indigo: 'rgb(75,0,130)',
    darksalmon: 'rgb(233,150,122)',
    black: 'rgb(0,0,0)'
};
const CHART_COLORS_50_Percent = {
    red: 'rgba(255,0,0, 0.5)',
    purple: 'rgba(128,0,128, 0.5)',
    fuchsia: 'rgba(255,0,255, 0.5)',
    green: 'rgba(0,128,0, 0.5)',
    yellow: 'rgba(255,255,0, 0.5)',
    navy: 'rgba(0,0,128, 0.5)',
    aqua: 'rgba(0,255,255 , 0.5)',
    lavender: 'rgba(230,230,250 , 0.5)',
    lawngreen: 'rgba(124,252,0, 0.5)',
    mediumpurple: 'rgba(147,112,219, 0.5)',
    mediumvioletred: 'rgba(199,21,133, 0.5)',
    goldenrod: 'rgba(218,165,32, 0.5)',
    orange: 'rgba(255,165,0, 0.5)',
    olive: 'rgba(128,128,0, 0.5)',
    peru: 'rgba(205,133,63, 0.5)',
    pink: 'rgba(255, 192, 203, 0.5)',
    slategrey: 'rgba(112, 128,144, 0.5)',
    wheat: 'rgba(245, 222, 179, 0.5)',
    lightcoral: 'rgba(240,128,128, 0.5)',
    indigo: 'rgba(75,0,130, 0.5)',
    darksalmon: 'rgba(233,150,122, 0.5)',
    black: 'rgba(0,0,0, 0.5)'
};

let colorKeys = Object.keys(CHART_COLORS);

const data = {
    labels: [],
    datasets: []
};
const config = {
    type: 'line',
    data: data,
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Number of Employees in Thousands'
            }
        }
    }
};

function drawChart() {
    const myChart = new Chart(
        document.getElementById('myChart'),
        config);
}

function responseReceivedHandler() {
    let graphline = {
        label: 'Super Sector Name',
        data: [],
        borderColor: CHART_COLORS[colorKeys],
        backgroundColor: CHART_COLORS_50_Percent,
        hidden: true
    };
    if (this.status == 200) {
        let dataArray = this.response.Results.series[0].data;
        let seriesID = this.response.Results.series[0].seriesID;
        let supersectorcode = seriesID.substring(3, 5)
        graphline.label = supersector[supersectorcode]
        graphline.borderColor = CHART_COLORS[colorKeys[responseCount]];
        graphline.backgroundColor = CHART_COLORS_50_Percent[colorKeys[responseCount]];
        for (let i = dataArray.length - 1; i >= 0; i--) {
            if (responseCount === 0) {
                data.labels.push(dataArray[i].periodName + " " + dataArray[i].year);
            }
            graphline.data.push(dataArray[i].value)
        }
        console.log(this.response);
        data.datasets.push(graphline)
        responseCount++;
    } else {
        console.log("error");
    }
    if (responseCount == supersectorKey.length) {
        drawChart();
    }
}
for (let i = 0; i < supersectorKey.length; i++) {
    let startQuery = "https://api.bls.gov/publicAPI/v2/timeseries/data/CEU"
    let endQuery = "00000001" + API_key;

    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", responseReceivedHandler);
    xhr.responseType = "json";
    xhr.open("GET", startQuery + supersectorKey[i] + endQuery);
    xhr.send();
}