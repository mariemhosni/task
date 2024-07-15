
document.addEventListener("DOMContentLoaded",function () {
    const apiUrl = "https://jsonplaceholder.typicode.com";
    const transactionTable = document.getElementById("transactionTable");
    const searchInput = document.getElementById("searchInput");
    const chartContainer = document.getElementById("chartContainer");
    const transactionChart = document.getElementById("transactionChart").getContext('2d');

    let customers = [];
    let transactions = [];
    let chart;

    
    const fetchData = async function () {
        try {
            const [customersResponse, transactionsResponse] = await Promise.all([
                fetch(`${apiUrl}/users`),
                fetch(`${apiUrl}/posts`)
            ]);

            customers = await customersResponse.json();
            transactions = await transactionsResponse.json();

            renderTable(transactions);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    
    const renderTable = (data) => {
        transactionTable.innerHTML = data.map(transaction => {
            const customer = customers.find(cust => cust.id === transaction.userId);
            return `
                <tr>
                    <td >${customer ? customer.name : 'Unknown'}</td>
                    <td>${Math.floor(Math.random() * 100)}</td>
                    <td><button class="btn btn-light rounded-pill" onclick="showChart(${transaction.userId})">View</button></td>
                </tr>
            `;
        }).join('');
    };

    // Filter table
    searchInput.addEventListener("input", (e) => {
        const value = e.target.value.toLowerCase();
        const filteredTransactions = transactions.filter(transaction => {
            const customer = customers.find(cust => cust.id === transaction.userId);
            return (
                (customer && customer.name.toLowerCase().includes(value)) ||
                transaction.body.toLowerCase().includes(value)
            );
        });
        renderTable(filteredTransactions);
    });

    // Show chart
    window.showChart = (userId) => {
        const customerTransactions = transactions.filter(transaction => transaction.userId === userId);
        const labels = customerTransactions.map((_, index) => `Day ${index + 1}`);
        const data = customerTransactions.map(transaction => Math.floor(Math.random() * 1000));

        if (chart) {
            chart.destroy();
        }

        chart = new Chart(transactionChart, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Transactions',
                    data: data,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false
                }]
            },
            options: {
                scales: {
                    x: {
                        beginAtZero: true
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        chartContainer.style.display = 'block';
        window.scrollTo(0, chartContainer.offsetTop);
    };

    fetchData();
});

















