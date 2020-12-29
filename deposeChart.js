class DeposeChart {
    constructor(ctx) {
        // Initialize chart. Must specify chart type here (, or error will throw).
        this.chart = new Chart(ctx, {type: 'bar'});

        // TODO: Read icon
        const icon1 = new Image(48,48);
        icon1.src = "/data/icons/2.png";
        this.chart.data = {
            labels: Array.from({length: 100}, () => 'man'),
            datasets: []
        }
    };

    render(labels, dataset) {
        this.chart.data.labels = labels;
        this.chart.data.datasets = this.chart.data.datasets.concat(dataset);
        this.chart.options = {
            tooltips: {
                callbacks: {
                    title: (tooltipItem) => {
                        return tooltipItem[0].label; // TODO: キャラクター名
                    },
                    label: (tooltipItem) => {
                        return ['foo', 'bar'];
                    }
                }
            },
            responsive: true,
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