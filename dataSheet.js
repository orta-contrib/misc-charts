class DataSheet {
    constructor(dataArray, sheetName) {
        const workbook = XLSX.read(dataArray, {type: "array"});
        if (!sheetName) {
            sheetName = workbook.SheetNames[0];
        }
        this.worksheet = workbook.Sheets[sheetName];
        this.data = XLSX.utils.sheet_to_json(this.worksheet, {header: "A"});
    }

    getRows() {
        const elems = this.worksheet['!ref'].split(':')
        if (elems.length != 2) {
            return [];
        }
        const range = (start, end) => [...Array((end-start) + 1)].map((_, i) => start + i);

        const start = elems[0].replace( /\d+/g, ''); // A1 -> A
        const end = elems[1].replace( /\d+/g, '');
        if (end.length == 1) {
            return range(start.charCodeAt(0), end.charCodeAt(0)).map(i => String.fromCharCode(i));
        }
        const ret = range(start.charCodeAt(0), 'Z'.charCodeAt(0)).map(i => String.fromCharCode(i));
        const alphabets = range('A'.charCodeAt(0), 'Z'.charCodeAt(0) + 1).map(i => String.fromCharCode(i));
        for (var i = 0; i < alphabets.length; i++) {
            for (var j = 0; j < alphabets.length; j++) {
                const row = alphabets[i] + alphabets[j];
                ret.push(row);            
                if (row === end) {
                    return ret;
                }
            }
        }
        return ret;
    }

    fetchDataFunc(rowNames) {
        if (typeof rowNames == 'string') {
            return (col) => col[rowNames];
        } else if (rowNames instanceof Array) {
            return (col) => rowNames.map(row => col[row]);
        } else {
            return (col) => -1;
        }
    }

    readAsDataset(rowNames, startCol) {
        return this.data.slice(startCol).map(this.fetchDataFunc(rowNames));
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
    constructor(settings) {
        if (!settings) {
            settings = this.getDefaultSettings();
        }
        this.iconRow = settings.icon;
        this.labelRow = settings.name;
        this.barChart = {type: "bar", row: [settings.barMin, settings.barMax]};
        this.lineChart = {type: "line", row: settings.line};
        this.startCol = 4;
    }
    getDefaultSettings() {
        return {
            icon: "A",
            name: "C",
            barMin: "BS",
            barMax: "BU",
            line:"BT"
        }
    }

    toJSON() {
        return {
            icon: this.iconRow,
            label: this.labelRow,
            barChart: this.barChart.row,
            lineChart: this.lineChart.row,
            startCol: this.startCol
        };
    }

    async render(chart, sheet) {
        // Initialize
        chart.clear();

        const labels = sheet.readAsDataset(this.labelRow, this.startCol);
        const datasets = [
            {type: this.barChart.type, data: sheet.readAsDataset(this.barChart.row, this.startCol), backgroundColor: labels.map(this.stringToColor)},
            {type: this.lineChart.type, data: sheet.readAsDataset(this.lineChart.row, this.startCol), backgroundColor: 'rgba(0,0,0,0)', borderColor: 'rgba(0,0,0,0.4)'}
        ];
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

    stringToColor(str) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        var color = "rgba(";
        for (var i = 0; i < 3; i++) {
            var value = (hash >> (i * 8)) & 0xFF;
            color += value + ",";
        }
        color += "0.2)";
        console.log(color);
        return color;
    };

}