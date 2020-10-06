/**
 * Aaron Wollman
 */

 const elements = {
    divScatter: d3.select("#scatter"),
 }

 const filepaths = {
     dataCSV: "./assets/data/data.csv",
 }


 async function main() {
    const data = await getData(filepaths.dataCSV);
    console.log(data);
 }

 async function getData(filepath) {
    let data = await d3.csv(filepath);

    const numericCols = [
        "age",
        "ageMoe",
        "healthcare",
        "healthcareHigh",
        "healthcareLow",
        "income",
        "incomeMoe",
        "obesity",
        "obesityHigh",
        "obesityLow",
        "smokes",
        "smokesHigh",
        "smokesLow"
    ];

    numericCols.forEach(column => {
        data[column] = +data[column];
    });

    return data;
 }

 main();