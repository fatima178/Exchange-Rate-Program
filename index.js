const apiKey = '0731f355df2c06138ed0f549'; // Replace with your API key
const baseCurrencySelect = document.getElementById('base-currency');
const exchangeRatesDiv = document.getElementById('exchange-rates');
const paginationControls = document.getElementById('pagination-controls');
const resultsPerPage = 20;
let currentPage = 1;
let totalResults = 0;
let rates = {};

// Function to populate the base currency dropdown
async function populateBaseCurrencyOptions() {
    const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.result === 'success') {
            const rates = data.conversion_rates;

            for (const currency in rates) {
                const option = document.createElement('option');
                option.value = currency;
                option.text = currency;
                baseCurrencySelect.appendChild(option);
            }
        } else {
            console.error('API returned an error:', data);
            baseCurrencySelect.innerHTML = '<option>Failed to load currencies</option>';
        }
    } catch (error) {
        console.error('Error fetching currencies:', error);
        baseCurrencySelect.innerHTML = '<option>Error loading currencies</option>';
    }
}

// Function to fetch and display exchange rates based on selected currency
async function fetchExchangeRates() {
    const selectedCurrency = baseCurrencySelect.value || 'USD';
    const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${selectedCurrency}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.result === 'success') {
            rates = data.conversion_rates;
            totalResults = Object.keys(rates).length;
            displayExchangeRates();
            paginationControls.style.display = 'flex'; // Show pagination controls
        } else {
            exchangeRatesDiv.innerHTML = '<p>Failed to load exchange rates.</p>';
            paginationControls.style.display = 'none'; // Hide pagination controls if failed
        }
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        exchangeRatesDiv.innerHTML = '<p>Error fetching exchange rates.</p>';
        paginationControls.style.display = 'none'; // Hide pagination controls on error
    }
}

// Function to display exchange rates in a table with pagination
function displayExchangeRates() {
    exchangeRatesDiv.innerHTML = '';

    const table = document.createElement('table');
    table.className = 'rate-table'; // Ensure table uses the class for styling

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th>Currency</th>
        <th>Rate</th>
    `;
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = Math.min(startIndex + resultsPerPage, totalResults);

    const currencies = Object.entries(rates).slice(startIndex, endIndex);
    currencies.forEach(([currency, rate]) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${currency}</td>
            <td>${rate}</td>
        `;
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    exchangeRatesDiv.appendChild(table);

    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = endIndex >= totalResults;

    // Update page numbers display
    document.getElementById('page-numbers').textContent = `Page ${currentPage}`;
}

// Function to change the page
function changePage(direction) {
    currentPage += direction;
    displayExchangeRates();
}

// Populate base currency options when the page loads
populateBaseCurrencyOptions();
