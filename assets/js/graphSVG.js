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

        const allPointsGroup = this.chartGroup.append("g");
        
        const pointGroup = allPointsGroup.selectAll("g")
            .data(this.data)
            .enter()
            .append("g")
            .attr("transform", row =>
            `translate(
                ${scaleX(row[xColumn])},
                ${scaleY(row[yColumn])}
            )`);

        const radius = this.height / 30;
        pointGroup.append("circle")
            .attr("r", radius)
            .attr("opacity", .5)
            .classed("stateCircle", true);
        
        pointGroup.append("text")
            .text(row => row[dataColumns.abbr])
            .attr("text-anchor", "middle")
            .attr("dy", radius / 2)
            .attr("font-size", radius)
            .classed("stateText", true);
    }
}