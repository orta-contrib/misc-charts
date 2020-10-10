var ctx = document.getElementById('myChart').getContext('2d');

var icon1 = new Image(64, 64);
icon1.src = "/sample-data/images/icon1.png";

function toData(data, i) {
    var icon = new Image(64, 64);
    icon.src = `/sample-data/images/icon${data[0]}.png`;
    return {
        label: data[1],
        data: data[i],
        marker: icon
    };
}

function renderChart(arrays) {
    const ingredients = document.querySelectorAll('div#data-selector input');
    const checked = Array.from(ingredients).filter(i => i.checked).map(i => Number(i.getAttribute('value')));
    const renderedData = checked.map(c => arrays.slice(1).map(d => toData(d, c)));
    if (renderedData.length == 0) {
        return;
    }

    const labels = renderedData[0].map(d => d.label);
    const datasets = renderedData.map(data => {
        return {
            label: 'test',
            data: data.map(d => d.data),
            pointStyle: data.map(d => d.marker)
        };
    });
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets,
        },
        options: {
            elements: {
                line: {
                    tension: 0
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

function readCSVFile() {
    Papa.parse(this.files[0], {
        complete: function (results) {
            const headers = results.data[0];
            headers.forEach((e, i) => {
                const label = document.createElement('label');
                const input = document.createElement('input');
                input.setAttribute('type', 'checkbox');
                input.setAttribute('name', e);
                input.setAttribute('value', i);
                input.setAttribute('id', `data-${i}`);
                input.addEventListener('change', (event) => {
                    renderChart(results.data);
                })
                label.appendChild(input);
                label.appendChild(document.createTextNode(e));

                document.getElementById('data-selector').appendChild(label);
            });
            renderChart(results.data);
        }
    });
}

document.getElementById("input").addEventListener("change", readCSVFile, false);
/*
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            pointStyle: ['', icon1, '', '', '', '']
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});
*/