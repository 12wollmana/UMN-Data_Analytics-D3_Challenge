/**
 * Aaron Wollman
 */

const elements = {
    divScatter: d3.select("#scatter"),
}

const filepaths = {
    dataCSV: "./assets/data/data.csv",
}

const dataColumns = {
    abbr: "abbr",
    age: "age",
    ageMoe: "ageMoe",
    healthcare: "healthcare",
    healthcareHigh: "healthcareHigh",
    healthcareLow: "healthcareLow",
    id: "id",
    income: "income",
    incomeMoe: "incomeMoe",
    obesity: "obesity",
    obesityHigh: "obesityHigh",
    obesityLow: "obesityLow",
    poverty: "poverty",
    povertyMoe: "povertyMoe",
    smokes: "smokes",
    smokesHigh: "smokesHigh",
    smokesLow: "smokesLow",
    state: "state"
}


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
    

    svg.addAxisX(povertyAxis);
    // svg.addAxisX(ageAxis);
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




class axisData{
    constructor(dataColumn, label) {
        this.label = label;
        this.dataColumn = dataColumn
        this.scalerMin = 1;
        this.scalerMax = 1;
    }

    setScalarMin(min){
        this.scalerMin = min;
    }

    setScalarMax(max){
        this.scalerMax = max;
    }

    getDomain(data){
        return [
            d3.min(data, 
                row => row[this.dataColumn]) * this.scalerMin,
            d3.max(data, 
                row => row[this.dataColumn]) * this.scalerMax,
        ]
    }
}

class graphSVG{
    constructor(
        height, 
        width,
        data
    ){
        this.height = height,
        this.width = width,
        this.margin = {
            top: 60,
            right: 60,
            bottom: 60,
            left: 60
        };
        this.chartHeight = this.height - this.margin.top - this.margin.bottom;
        this.chartWidth = this.width - this.margin.left - this.margin.right;
        this.xAxisList = [];
        this.yAxisList = [];
        this.selectAxisX = 0;
        this.selectAxisY = 0;
        this.offset = 20;
        this.data = data;
    }

    offsetLeft(pixels){
        this.margin.left = this.margin.left + pixels;
        this.chartWidth = this.width - this.margin.left - this.margin.right;
    }

    offsetBottom(pixels){
        this.margin.bottom = this.margin.bottom + pixels;
        this.chartHeight = this.height - this.margin.top - this.margin.bottom;
    }

    addAxisX(axis){
        this.xAxisList.push(axis);
        this.offsetBottom(this.offset/2);
    }

    addAxisY(axis){
        this.yAxisList.push(axis);
        this.offsetLeft(this.offset/2);
    }

    selectAxisX(axisIndex){
        this.selectAxisX = axisIndex;
        // TODO: Redraw
    }

    selectAxisY(axisIndex){
        this.selectAxisY = axisIndex;
        // TODO: Redraw
    }

    getSelectedAxisX(){
        return this.xAxisList[this.selectAxisX];
    }

    getSelectedAxisY(){
        return this.yAxisList[this.selectAxisY];
    }

    render(parentElement){
        const svgArea = parentElement.select("svg");
        if(!svgArea.empty()){
            svgArea.remove();
        }
        this.parentElement = parentElement;

        this.renderContainer();
        this.renderChartGroup();
        this.renderAxisX();
        this.renderAxisY();
        this.renderPoints();
    }

    renderContainer() {
        const svg = this.parentElement.append("svg")
            .attr("height", this.height)
            .attr("width", this.width)
            .classed("chart", true);
        
        this.svgContainer = svg;
    }

    renderChartGroup(){
        const chartGroup = this.svgContainer.append("g")
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

        this.chartGroup = chartGroup;
    }

    renderAxisX(){
        const selectedAxis = this.getSelectedAxisX();

        const scale = d3.scaleLinear()
            .domain(selectedAxis.getDomain(this.data))
            .range([0, this.chartWidth]);

        const bottomAxis = d3.axisBottom(scale);

        this.chartGroup.append("g")
            .attr("transform", `translate(0, ${this.chartHeight})`)
            .call(bottomAxis);

        this.axisScaleX = scale;
        this.renderLabelX();
    }

    renderLabelX(){
        const labelGroup = this.chartGroup.append("g")
            .attr("transform", `translate(${this.chartWidth / 2}, ${this.chartHeight + this.offset})`);

        this.xAxisList.forEach((axis, index) => {
            const label = labelGroup.append("text")
                .attr("x", 0)
                .attr("y", this.offset *(index + 1))
                .attr("value", index)
                .text(axis.label);

            if(index === this.selectAxisX){
                label.classed("active", true);
                label.classed("inactive", false);
            }
            else{
                label.classed("active", false);
                label.classed("inactive", true);
            }
        });
    }

    renderAxisY(){
        const selectedAxis = this.getSelectedAxisY();

        const scale = d3.scaleLinear()
            .domain(selectedAxis.getDomain(this.data))
            .range([this.chartHeight, 0]);
        

        console.log(selectedAxis.getDomain(this.data));
        const yAxis = d3.axisLeft(scale);

        this.chartGroup.append("g")
            .call(yAxis);

        this.axisScaleY = scale;
        this.renderLabelY();
    }

    renderLabelY(){
        const labelGroup = this.chartGroup.append("g");

        this.yAxisList.forEach((axis, index) => {
            const label = labelGroup.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - this.margin.left + (index * this.offset))
                .attr("x", 0 - (this.chartHeight / 2))
                .attr("dy", "1em")
                .attr("value", index)
                .text(axis.label);

            if(index === this.selectAxisY){
                label.classed("active", true);
                label.classed("inactive", false);
            }
            else{
                label.classed("active", false);
                label.classed("inactive", true);
            }
        });
    }

    renderPoints(){
        const selectedAxisX = this.getSelectedAxisX();
        const selectedAxisY = this.getSelectedAxisY();

        const xColumn = selectedAxisX.dataColumn;
        const yColumn = selectedAxisY.dataColumn;

        const scaleX = this.axisScaleX;
        const scaleY = this.axisScaleY;

        const pointsGroup = this.chartGroup.selectAll("g")
            .data(this.data)
            .enter()
            .append("g")
            .attr("transform", row =>
            `translate(
                ${scaleX(row[xColumn])},
                ${scaleY(row[yColumn])}
            )`);
        
        const radius = this.height / 30;
        pointsGroup.append("circle")
            .attr("r", radius)
            .attr("opacity", .5)
            .classed("stateCircle", true);
        
        pointsGroup.append("text")
            .text(row => row[dataColumns.abbr])
            .attr("text-anchor", "middle")
            .attr("dy", radius/2)
            .attr("font-size", radius)
            .classed("stateText", true);
    }
}