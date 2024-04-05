document.addEventListener("DOMContentLoaded", function() {
    // Function to create a new chart
    function createChart(canvasId, initialData,label,color) {
        return new Chart(canvasId, {
            type: 'line',
            data: {
                labels: Array.from({ length: initialData.length }, (_, i) => ''),
                datasets: [{
                    label: label,
                    backgroundColor: color,
                    borderColor: color,
                    data: initialData,
                }]
            },
            options: {
                scales: {
                    x: {
                        ticks: {
                            maxTicksLimit: 20, // Adjust this value to control the number of labels displayed
                            callback: function(value, index, values) {
                                // Customize x-axis label format as needed
                                return index % 2 === 0 ? value : ''; // Display every other label
                            }
                        }
                    },
                    y: {

                        suggestedMin: 0, // Set the minimum value of the y-axis
                        suggestedMax: 100, // Set the maximum value of the y-axis
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Function to update chart data
    function updateChartData(chart, newData) {
        const now = new Date();
        const time = now.toLocaleTimeString();

        // Update chart data
       
        chart.data.labels.push(time);
        chart.data.datasets[0].data.push(newData);

        // Limit the number of data points to 10 for better visualization
        const maxDataPoints = 300;
        if (chart.data.labels.length > maxDataPoints) {
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
        }

        // Update the chart
        chart.update();
    }

    // Function to fetch data from Blynk API and update charts
    async function fetchDataAndUpdateCharts(charts, url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            
            charts[0].data.labels.push(new Date().toLocaleTimeString()); // Assuming the time remains the same for all data points
            charts[0].data.datasets[0].data.push(data['v0']); // Update chart 1 with v0 data
    
            charts[1].data.labels.push(new Date().toLocaleTimeString()); // Assuming the time remains the same for all data points
            charts[1].data.datasets[0].data.push(data['v1']); // Update chart 2 with v1 data
    
            charts[2].data.labels.push(new Date().toLocaleTimeString()); // Assuming the time remains the same for all data points
            charts[2].data.datasets[0].data.push(data['v2']); // Update chart 3 with v2 data
    
            // Limit the number of data points for better visualization
            const maxDataPoints = 300;
            charts.forEach(chart => {
                if (chart.data.labels.length > maxDataPoints) {
                    chart.data.labels.shift();
                    chart.data.datasets[0].data.shift();
                }
                chart.update();
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Create charts for each widget
    const initialData = Array.from({ length: 10 }, () => 0); // Initial data for each chart
   // Create charts for each widget
const chart1 = createChart(document.getElementById('chart1'), [],'Moisture','rgb(20, 59, 127)');
const chart2 = createChart(document.getElementById('chart2'), [],'Temperature','rgb(193, 8, 57)');
const chart3 = createChart(document.getElementById('chart3'), [],'Humidity','rgb(10, 169, 79)');

// Store the charts in an array
const charts = [chart1, chart2, chart3];

    // URL for fetching data from Blynk API
    const apiUrl = 'https://blr1.blynk.cloud/external/api/getAll?token=YC8igcH6u9M0RKexheZB2xk5aW8kt_9R';

    // Update charts with data from Blynk API every 1 second
    setInterval(() => fetchDataAndUpdateCharts(charts, apiUrl), 5000);
});

// Function to handle toggle button press event
document.getElementById('toggleButton').addEventListener('change', function() {
    if (this.checked) {
        // If toggle button is checked (pressed), make API call 1
        makeAPI1Call();
    } else {
        // If toggle button is unchecked (released), make API call 2
        makeAPI2Call();
    }
});

// Function to make API call 1
function makeAPI1Call() {
    const apiUrl = 'https://blr1.blynk.cloud/external/api/update?token=YC8igcH6u9M0RKexheZB2xk5aW8kt_9R&V3=1'; // Replace with your API endpoint 1
    // Add your code to make the API call using fetch or any other method
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to make API call');
            }
            return response.json();
        })
        .then(data => {
            console.log('API call 1 successful:', data);
            // Handle the response data as needed
        })
        .catch(error => {
            console.error('Error making API call:', error);
        });
}

// Function to make API call 2
function makeAPI2Call() {
    const apiUrl = 'https://blr1.blynk.cloud/external/api/update?token=YC8igcH6u9M0RKexheZB2xk5aW8kt_9R&V3=0'; // Replace with your API endpoint 2
    // Add your code to make the API call using fetch or any other method
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to make API call');
            }
            return response.json();
        })
        .then(data => {
            console.log('API call 2 successful:', data);
            // Handle the response data as needed
        })
        .catch(error => {
            console.error('Error making API call:', error);
        });
}
