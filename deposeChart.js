class DeposeChart {
    constructor(ctx) {
        // Initialize chart. Must specify chart type here (, or error will throw).
        this.chart = new Chart(ctx, {type: 'bar'});
    };

    render(labels, dataset) {
        this.chart.data.labels = labels;
        this.chart.data.datasets = this.chart.data.datasets.concat(dataset);
        this.chart.options = {
            maintainAspectRatio: false
        };
        this.chart.canvas.parentNode.style.width = (48 * this.chart.data.labels.length) + 'px';
        this.chart.update();
        this.chart.resize();
    }

    append(dataset) {
        this.chart.data.datasets.push(dataset);
        this.chart.update();
        this.chart.resize();
    }

    clear() {
        this.chart.clear();
    }
}