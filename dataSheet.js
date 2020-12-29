class DataSheet {
    constructor(dataArray, sheetName) {
        const workbook = XLSX.read(dataArray, {type: "array"});
        if (!sheetName) {
            sheetName = workbook.SheetNames[0];
        }
        const worksheet = workbook.Sheets[sheetName];
        this.data = XLSX.utils.sheet_to_json(worksheet, {header: "A"});
    }

    readAsDataset(rowNames, startCol) {
        const dataToRender = [];
        for (var i = 0; i < this.data.length; i++) {
            if (typeof rowNames == 'string') {
                dataToRender.push(this.data[i][rowNames]);
            } else if (rowNames instanceof Array) {
                const tmp = [];
                for (var j = 0; j < rowNames.length; j++) {
                    tmp.push(this.data[i][rowNames[j]]);
                }
                dataToRender.push(tmp);
            } else {
                dataToRender.push({});
            }
        }
        dataToRender.splice(0, startCol);
        return dataToRender;
    }

    loadIconImage(url) {
        // TODO: Make default icon
        const defaultIcon = new Image(48,48);
        return new Promise((resolve, reject) => {
            const icon = new Image(48,48);
            icon.onload = () => resolve(icon);
            icon.onerror = (err) => resolve(defaultIcon);
            icon.src = url;
        })
    }
    async readAsIconDataset(rowName, startCol) {
        return this.data.slice(startCol).map(async col => {
            return await this.loadIconImage(`/data/icons/${col[rowName]}.png`);
        });
    }
}

class ChartModel {
    constructor() {
        // TODO: parameterize
        this.iconRow = "A";
        this.labelRow = "C";
        this.renderRows = [
            {type: "bar", row: ["BS", "BU"]},
            {type: "line", row: "BT"}
        ];
        this.startCol = 4;
    }

    async render(chart, sheet) {
        // Initialize
        chart.clear();

        const labels = sheet.readAsDataset(this.labelRow, this.startCol);
        const datasets = this.renderRows.map(rrow => {
            const dataToRender = sheet.readAsDataset(rrow.row, this.startCol);
            return {
                type: rrow.type,
                data: dataToRender
            };
        });
        chart.render(labels, datasets);

        // Icons will renader after rendering charts, because loading icons would take time 
        const icons = await sheet.readAsIconDataset(this.iconRow, this.startCol);
        Promise.all(icons).then(values => {
            chart.append({
                type: "line",
                data: Array.from({length: icons.length}, () => 0),
                pointStyle: values
            });
        });
    }
}