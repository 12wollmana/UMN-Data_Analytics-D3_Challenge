/**
 * @author @12wollmana - Aaron Wollman
 */

/**
 * This class contains all the logic for rendering 
 * a bubble plot using D3.js.
 */
class bubblePlotSVG{
    /**
     * @param {number} height 
     * The SVG height.
     * @param {number} width 
     * The SVG width.
     * @param {any[]} data 
     * Data to bind to.
     */
    constructor(
        parentElement,
        data
    ){
        this.parentElement = parentElement;
        this.xAxisList = [];
        this.yAxisList = [];
        this.selectAxisX = 0;
        this.selectAxisY = 0;
        this.offset = 20;
        this.data = data;
        this.transitionDuration = 1000;
        this.resetDimensions();
    }

    calcWidth(){
        const parentDimensions = 
            this.parentElement.node().getBoundingClientRect();
        return parentDimensions.width;
    }
    
    calcHeight(){
        return this.width * .6;
    }

    resetDimensions(){
        this.width = this.calcWidth();
        this.height = this.calcHeight();
        this.margin = {
            top: 60,
            right: 60,
            bottom: 60,
            left: 60
        };
        this.chartHeight = this.height - this.margin.top - this.margin.bottom;
        this.chartWidth = this.width - this.margin.left - this.margin.right;
        this.offsetLeftMargin(this.xAxisList.length * this.offset);
        this.offsetBottomMargin(this.yAxisList.length * this.offset);
    }

    /**
     * Offsets the left margin.
     * @param {number} pixels 
     * The number of pixels to offset.
     */
    offsetLeftMargin(pixels){
        this.margin.left = this.margin.left + pixels;
        this.chartWidth = this.width - this.margin.left - this.margin.right;
    }

    /**
     * Offsets the bottom margin.
     * @param {number} pixels 
     * The number of pixels to offset.
     */
    offsetBottomMargin(pixels){
        this.margin.bottom = this.margin.bottom + pixels;
        this.chartHeight = this.height - this.margin.top - this.margin.bottom;
    }

    /**
     * Adds an axis set to the X axis.
     * @param {axisData} axis 
     * The axis to add.
     */
    addAxisX(axis){
        this.xAxisList.push(axis);
        this.offsetBottomMargin( this.offset/2 );
    }

    /**
     * Adds an axis set to the Y axis.
     * @param {axisData} axis 
     * The axis to add.
     */
    addAxisY(axis){
        this.yAxisList.push(axis);
        this.offsetLeftMargin(this.offset/2);
    }

    /**
     * Selects a X axis to display.
     * @param {number} axisIndex 
     * The index of the axis to select.
     */
    updateAxisX(axisIndex, showAnimations){
        if(showAnimations){
            this.xAxisGroup
                .transition()
                .duration(this.transitionDuration / 2)
                .style("opacity", 0);
        }

        this.selectAxisX = axisIndex;

        if(showAnimations){
            setTimeout(() => {
                this.renderAxisX(true);
            }, this.transitionDuration / 2);
        }
        else {
            this.renderAxisX(false);
        }
        
        this.renderPoints(showAnimations);

        const labels = this.xLabelGroup.selectAll("text");
        labels
            .classed("active", (_d, index)=>{
                return index == this.selectAxisX;
            })
            .classed("inactive", (_d, index)=>{
                return index != this.selectAxisX;
            });
    }

    /**
     * Selects a Y axis to display.
     * @param {number} axisIndex 
     * The index of the axis to select.
     */
    updateAxisY(axisIndex, showAnimations){
        if(showAnimations){
            this.yAxisGroup
                .transition()
                .duration(this.transitionDuration / 2)
                .style("opacity", 0);
        }
        
        
        this.selectAxisY = axisIndex;

        if(showAnimations){
            setTimeout(() => {
                this.renderAxisY(true);
            }, this.transitionDuration / 2);
        }
        else {
            this.renderAxisY(false);
        }
        
        this.renderPoints(showAnimations);

        const labels = this.yLabelGroup.selectAll("text");
        labels
            .classed("active", (_d, index)=>{
                console.log(index, this.selectAxisY);
                return index == this.selectAxisY;
            })
            .classed("inactive", (_d, index)=>{
                return index != this.selectAxisY;
            });
    }

    /**
     * Returns the currently displayed X axis.
     */
    getSelectedAxisX(){
        return this.xAxisList[this.selectAxisX];
    }

    /**
     * Returns the currently displayed Y axis.
     */
    getSelectedAxisY(){
        return this.yAxisList[this.selectAxisY];
    }

    /**
     * Renders the bubble plot as an SVG.
     * @param {any} parentElement 
     * The parent element to display within.
     */
    render(showAnimations = false){
        const svgArea = this.parentElement.select("svg");
        if(!svgArea.empty()){
            svgArea.remove();
        }
        this.resetDimensions();

        this.renderContainer();
        this.renderChartGroup();

        this.initAxisX();
        this.renderAxisX(showAnimations);
        this.renderLabelX();

        this.initAxisY();
        this.renderAxisY(showAnimations);
        this.renderLabelY();

        this.initPoints();
        this.renderPoints(showAnimations);
    }

    /**
     * Renders the SVG container
     */
    renderContainer() {
        const svg = this.parentElement.append("svg")
            .attr("height", this.height)
            .attr("width", this.width)
            .classed("chart", true);
        
        this.svgContainer = svg;
    }

    /**
     * Renders the SVG Chart Group
     */
    renderChartGroup(){
        const chartGroup = this.svgContainer.append("g")
            .attr("transform", 
            `translate(${this.margin.left}, ${this.margin.top})`);

        this.chartGroup = chartGroup;
    }

    /**
     * Gets the X axis scale.
     */
    getScaleX(){
        const selectedAxis = this.getSelectedAxisX();

        const scale = d3.scaleLinear()
            .domain(selectedAxis.getDomain(this.data))
            .range([0, this.chartWidth]);

        return scale;
    }

    /**
     * Initializes the X axis.
     */
    initAxisX(){
        this.xAxisGroup = this.chartGroup.append("g")
            .attr("transform", `translate(0, ${this.chartHeight})`);
    }

    /**
     * Renders the X axis.
     */
    renderAxisX(showAnimations){
        const scale = this.getScaleX();

        const bottomAxis = d3.axisBottom(scale);
        if(showAnimations){
            this.xAxisGroup
                .style("opacity", 0);
        
            this.xAxisGroup
                .transition()
                .duration(this.transitionDuration / 2)
                .style("opacity", 1);
        }
        this.xAxisGroup.call(bottomAxis);
        
        this.axisScaleX = scale;
    }

    /**
     * Renders the labels for the X axis.
     */
    renderLabelX(){
        const labelGroup = this.chartGroup.append("g")
            .attr("transform", `translate(${this.chartWidth / 2}, ${this.chartHeight + this.offset})`);

        this.xAxisList.forEach((axis, index) => {
            const label = labelGroup.append("text")
                .attr("x", 0)
                .attr("y", this.offset *(index + 1))
                .attr("value", index)
                .text(axis.label);

            if(index == this.selectAxisX){
                label.classed("active", true);
                label.classed("inactive", false);
            }
            else{
                label.classed("active", false);
                label.classed("inactive", true);
            }

            label.on("click", (_d, i, nodes) =>{
                const label = d3.select(nodes[i]);
                const value = label.attr("value");

                if(value != this.selectAxisX)
                {
                    this.updateAxisX(value, true);
                }
            });
        });

        this.xLabelGroup = labelGroup;
    }

    /**
     * Initializes the Y axis.
     */
    initAxisY(){
        this.yAxisGroup = this.chartGroup.append("g");
    }

    /**
     * Gets the Y axis scale.
     */
    getScaleY(){
        const selectedAxis = this.getSelectedAxisY();

        const scale = d3.scaleLinear()
            .domain(selectedAxis.getDomain(this.data))
            .range([this.chartHeight, 0]);

        return scale;
    }

    /**
     * Renders the Y Axis.
     */
    renderAxisY(showAnimations){
        const scale = this.getScaleY();
         
        const yAxis = d3.axisLeft(scale);

        if(showAnimations){
            this.yAxisGroup
                .style("opacity", 0);

            this.yAxisGroup
                .transition()
                .duration(this.transitionDuration / 2)
                .style("opacity", 1);
        }
        this.yAxisGroup.call(yAxis);

        this.axisScaleY = scale;
    }

    /**
     * Renders the labels for the Y Axis.
     */
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

            if(index == this.selectAxisY){
                label.classed("active", true);
                label.classed("inactive", false);
            }
            else{
                label.classed("active", false);
                label.classed("inactive", true);
            }

            label.on("click", (_d, i, nodes) =>{
                const label = d3.select(nodes[i]);
                const value = label.attr("value");
                
                if(value != this.selectAxisY)
                {
                    this.updateAxisY(value, true);
                }
            });
        });

        this.yLabelGroup = labelGroup;
    }

    /**
     * Initializes the data points.
     */
    initPoints(){
        const allPointsGroup = this.chartGroup.append("g");
        
        const pointGroup = allPointsGroup.selectAll("g")
            .data(this.data)
            .enter()
            .append("g")
        
        this.pointGroup = pointGroup;
    }

    /**
     * Renders all of the data points as bubbles.
     */
    renderPoints(showAnimations){
        const selectedAxisX = this.getSelectedAxisX();
        const selectedAxisY = this.getSelectedAxisY();

        const xColumn = selectedAxisX.dataColumn;
        const yColumn = selectedAxisY.dataColumn;

        const scaleX = this.getScaleX();
        const scaleY = this.getScaleY();

        const pointGroup = this.pointGroup;
        
        if(showAnimations){
            pointGroup.transition()
                .duration(this.transitionDuration)
                .attr("transform", row =>
                `translate(
                    ${scaleX(row[xColumn])},
                    ${scaleY(row[yColumn])}
                )`);
        } 
        else {
            pointGroup
                .attr("transform", row =>
                `translate(
                    ${scaleX(row[xColumn])},
                    ${scaleY(row[yColumn])}
                )`);
        }
        

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
        
        const tooltip = this.renderTooltip();
        pointGroup.on("mouseover", tooltip.show);
        pointGroup.on("mouseout", tooltip.hide);
        pointGroup.call(tooltip);
    }

    /**
     * Renders the tooltip for each data point.
     */
    renderTooltip(){
        return d3.tip()
            .attr("class", "d3-tip")
            .html(d => {
                const state = d[dataColumns.state];

                const xAxis = this.getSelectedAxisX();
                const xLabel = xAxis.label;
                const xValue = d[xAxis.dataColumn];

                const yAxis = this.getSelectedAxisY();
                const yLabel = yAxis.label;
                const yValue = d[yAxis.dataColumn];

                return (`
                <strong>${state}</strong>
                <hr>
                ${xLabel}: ${xValue}
                <br>
                ${yLabel}: ${yValue}
                `);
            });
    }
}