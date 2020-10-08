/**
 * Aaron Wollman
 */
async function init() {
    const data = await getData(filepaths.dataCSV);
    console.log(data);

    plotData(data);
}

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

function plotData(data){
    // Get parent container dimensions
    const divScatter = elements.divScatter;

    // Create SVG
    const svg = createSVG(divScatter, data);

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

    const obesityAxis = new axisData(
        dataColumns.obesity, 
        "Obesity (%)"
    );
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
    
    svg.addAxisX(povertyAxis);
    //svg.addAxisX(ageAxis);
    // svg.addAxisX(incomeAxis);

    // svg.addAxisY(obesityAxis);
    // svg.addAxisY(smokeAxis);
    svg.addAxisY(healthcareAxis);

    svg.render(divScatter);
}

function createSVG(parentElement, data){
    const parentDimensions = 
        parentElement.node().getBoundingClientRect();

    const svgWidth = parentDimensions.width;
    const svgHeight = svgWidth * .6;

    return new graphSVG(svgHeight, svgWidth, data);
}

init();

d3.select(window).on("resize",init);