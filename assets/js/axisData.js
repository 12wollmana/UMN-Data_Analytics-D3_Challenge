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