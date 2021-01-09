
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