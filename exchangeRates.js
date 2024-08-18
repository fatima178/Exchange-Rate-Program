const apiKey = '0731f355df2c06138ed0f549'; // Replace with your API key
const fromCurrencySelect = document.getElementById('from-currency');
const toCurrencySelect = document.getElementById('to-currency');
const resultDiv = document.getElementById('result');
const resultsPerPage = 20;
let currentPage = 1;
let totalResults = 0;
let rates = {};

// Function to populate currency dropdowns
async function populateCurrencyOptions() {
    const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`; // Use USD as the base for fetching available currencies

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.result === 'success') {
            const rates = data.conversion_rates;

            // Populate the 'From' currency dropdown
            for (const currency in rates) {
                const optionFrom = document.createElement('option');
                optionFrom.value = currency;
                optionFrom.text = currency;
                fromCurrencySelect.appendChild(optionFrom);

                // Populate the 'To' currency dropdown
                const optionTo = document.createElement('option');
                optionTo.value = currency;
                optionTo.text = currency;
                toCurrencySelect.appendChild(optionTo);
            }
        } else {
            console.error('API returned an error:', data);
            fromCurrencySelect.innerHTML = '<option>Failed to load currencies</option>';
            toCurrencySelect.innerHTML = '<option>Failed to load currencies</option>';
        }
    } catch (error) {
        console.error('Error fetching currencies:', error);
        fromCurrencySelect.innerHTML = '<option>Error loading currencies</option>';
        toCurrencySelect.innerHTML = '<option>Error loading currencies</option>';
    }
}

// Function to convert currency
async function convertCurrency() {
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    const amount = parseFloat(document.getElementById('amount').value);

    if (!fromCurrency || !toCurrency || isNaN(amount)) {
        resultDiv.innerHTML = 'Please select currencies and enter an amount.';
        return;
    }

    const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.result === 'success') {
            const rate = data.conversion_rates[toCurrency];
            const convertedAmount = (amount * rate).toFixed(2);
            resultDiv.innerHTML = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
        } else {
            resultDiv.innerHTML = 'Failed to fetch conversion rate.';
        }
    } catch (error) {
        console.error('Error fetching conversion rate:', error);
        resultDiv.innerHTML = 'Error fetching conversion rate.';
    }
}

// Populate currency options when the page loads
populateCurrencyOptions();
