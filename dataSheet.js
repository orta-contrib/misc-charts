class DataSheet {
    constructor(dataArray, sheetName) {
        const workbook = XLSX.read(dataArray, {type: "array"});
        if (!sheetName) {
            sheetName = workbook.SheetNames[0];
        }
        this.worksheet = workbook.Sheets[sheetName];
    }

    readAsChartModel(range) {
        const data = XLSX.utils.sheet_to_json(this.worksheet, {range: range, header: "A"});
        return data.map(d => new ChartModel(d));
    }
}

class ChartModel {
    constructor(sheetJson) {
        this.data = sheetJson;
    }

    toDataset(rowNames) {
        if (typeof rowNames == 'string') {
            return this.data[rowNames];
        } else if (rowNames instanceof Array) {
            const tmp = [];
            for (var j = 0; j < rowNames.length; j++) {
                tmp.push(this.data[rowNames[j]]);
            }
            return tmp
        }
        return -1;
    }
}