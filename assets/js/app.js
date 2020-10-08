/**
 * Main Application Logic
 * 
 * @author 
 * @12wollmana - Aaron Wollman
 */

/**
 * Initializes the application
 */
async function init() {
    const data = await getData(filepaths.dataCSV);
    console.log(data);

    const xAxisData = createAxisDataX();
    const yAxisData = createAxisDataY();

    createBubblePlot(data, xAxisData, yAxisData);
}

/**
 * Parses the data from a CSV.
 * @param {string} filepath 
 * The filepath for the data. Should be a CSV.
 */
async function getData(filepath) {
    let data = await d3.csv(filepath);

    const numericCols = [
        dataColumns.age,
        dataColumns.ageMoe,
        dataColumns.healthcare,
        dataColumns.healthcareHigh,
        dataColumns.healthcareLow,
        dataColumns.income,
        dataColumns.incomeMoe,
        dataColumns.obesity,
        dataColumns.obesityHigh,
        dataColumns.obesityLow,
        dataColumns.poverty,
        dataColumns.povertyMoe,
        dataColumns.smokes,
        dataColumns.smokesHigh,
        dataColumns.smokesLow
    ];

    data.forEach(row => {
        numericCols.forEach(column => {
            row[column] = +row[column];
        });
    })
    

    return data;
}

/**
 * Creates an array of X axis datasets to display.
 */
function createAxisDataX(){
    const povertyAxis = new axisData(
        dataColumns.poverty,
        "In Poverty (%)"
    );
    povertyAxis.setScalarMin(.9);

    const incomeAxis = new axisData(
        dataColumns.income,
        "Household Income (Median)"
    );

    const ageAxis= new axisData(
        dataColumns.age,
        "Age (Median)"
    );

    return [
        povertyAxis,
        incomeAxis,
        ageAxis
    ];
}

/**
 * Creates an array of Y axis datasets to display.
 */
function createAxisDataY(){
    const obesityAxis = new axisData(
        dataColumns.obesity, 
        "Obesity (%)"
    );
    obesityAxis.setScalarMin(.9);
    obesityAxis.setScalarMax(1.05);

    const smokeAxis = new axisData(
        dataColumns.smokes,
        "Smokes (%)"
    );

    const healthcareAxis = new axisData(
        dataColumns.healthcare,
        "Lacks Healthcare (%)"
    );
    healthcareAxis.setScalarMin(.5);

    return [
        obesityAxis,
        smokeAxis,
        healthcareAxis
    ];
}

/**

 */
/**
 * Creates and displays a bubble plot.
 * @param {any[]} data 
 * The data to plot.
 * @param {axisData[]} xAxisData 
 * The X axis data.
 * @param {axisData[]} yAxisData 
 * The Y axis data.
 */
function createBubblePlot(data, xAxisData, yAxisData){
    // Get parent container dimensions
    const divScatter = elements.divScatter;

    // Create SVG
    const svg = createSVG(divScatter, data);
    
    xAxisData.forEach(axis => svg.addAxisX(axis));
    yAxisData.forEach(axis => svg.addAxisY(axis));

    svg.render(divScatter);
}

/**
 * Creates an SVG using the parent element's dimensions.
 * @param {any} parentElement 
 * The parent element to append the SVG to.
 * @param {any[]} data
 * The data to bind the SVG to. 
 */
function createSVG(parentElement, data){
    const parentDimensions = 
        parentElement.node().getBoundingClientRect();

    const svgWidth = parentDimensions.width;
    const svgHeight = svgWidth * .6;

    return new bubblePlotSVG(svgHeight, svgWidth, data);
}

init();

d3.select(window).on("resize", init);