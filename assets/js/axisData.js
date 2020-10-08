/**
 * @author @12wollmana - Aaron Wollman
 */

/**
 *  This class holds information regarding an axis.
 */
class axisData{
    /**
     * @param {string} dataColumn 
     * The column within the data to bind the axis to.
     * @param {string} label 
     * The label to use for the axis.
     */
    constructor(dataColumn, label) {
        this.label = label;
        this.dataColumn = dataColumn
        this.scalerMin = 1;
        this.scalerMax = 1;
    }

    /**
     * Sets a scaler value to apply to the minimum
     * value on the axis.
     * @param {number} scaler 
     * The scaler value.
     */
    setScalarMin(scaler){
        this.scalerMin = scaler;
    }

    /**
     * Sets a scaler value to apply to the maximum
     * value on the axis.
     * @param {number} scaler 
     * The scaler value.
     */
    setScalarMax(scaler){
        this.scalerMax = scaler;
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