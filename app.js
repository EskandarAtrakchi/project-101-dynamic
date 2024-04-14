let key;
let iv;

async function generateKey() {
    try {
        key = await window.crypto.subtle.generateKey(
            { name: "AES-CBC", length: 128 },
            true,
            ["encrypt", "decrypt"]
        );
    } catch (error) {
        alert("Error generating key: " + error.message);
    }
}

async function encryptString(str) {
    try {
        const encodedString = new TextEncoder().encode(str);
        iv = window.crypto.getRandomValues(new Uint8Array(16));
        const encryptedData = await window.crypto.subtle.encrypt(
            { name: "AES-CBC", iv: iv },
            key,
            encodedString
        );

        return Array.prototype.map.call(new Uint8Array(encryptedData), x => ('00' + x.toString(16)).slice(-2)).join('');
    } catch (error) {
        alert("Error encrypting string: " + error.message);
    }
}

async function decryptString(encryptedData) {
    try {
        if (!key || !iv) {
            throw new Error("Key or IV is missing.");
        }

        const decryptedData = await window.crypto.subtle.decrypt(
            { name: "AES-CBC", iv: iv },
            key,
            encryptedData
        );
        return new TextDecoder().decode(decryptedData);
    } catch (error) {
        alert("Error decrypting string: " + error.message);
        console.error('Error decoding string: ', error);
        return null; // Return null to indicate decryption failure
        /**
         * Example: 
         * 0 ==> 0, 90
         * 3 ==> 7, 47
         * 13 ==> 2, 172
         * 5 ==> 3, 38
         */
    }
}

async function encrypt() {
    const inputValue = document.getElementById('input').value;
    if (inputValue == null || inputValue == undefined || inputValue == '') {
        alert('Please enter a value to encrypt.');
        return;
    } else {
        try {
            await generateKey();
            const input = document.getElementById('input').value;
            const encryptedHex = await encryptString(input);
    
            // Export the key to JWK format
            const exportedKey = await window.crypto.subtle.exportKey("jwk", key);
    
            // Create a Blob with the encrypted data, the IV, and the key
            const blob = new Blob([JSON.stringify({ encryptedData: encryptedHex, iv: Array.from(iv), key: exportedKey })], { type: 'application/json' });
    
            // Create a temporary URL for the Blob
            const url = window.URL.createObjectURL(blob);
    
            // Set the download link href and display it
            const downloadLink = document.getElementById('downloadLink');
            downloadLink.href = url;
            downloadLink.download = 'encrypted_data.txt';
            downloadLink.style.display = 'block';
    
            // Provide feedback to the user
            document.getElementById('output').innerText = "Encrypted data ready for download.";
            //alert for me, delete later 
            alert('The data has been successfully encrypted and is ready for download.');
        } catch (error) {
            alert("Error during encryption: " + error.message);
        }
    }
}

async function decrypt() {
    try {
        // Retrieve the encrypted data from the file input
        const fileInput = document.getElementById('fileInput');
        const file = fileInput.files[0];

        if (!file) {
            alert("Please select a file.");
            return;
        }

        const reader = new FileReader();

        reader.onload = async function () {
            
            try {
                const data = JSON.parse(reader.result);
                const encryptedHex = data.encryptedData;
                const encryptedData = new Uint8Array(encryptedHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

                // Import the key from the file
                key = await window.crypto.subtle.importKey(
                    "jwk",
                    data.key,
                    { name: "AES-CBC", length: 128 },
                    true,
                    ["encrypt", "decrypt"]
                );

                // Retrieve the IV from the file
                iv = new Uint8Array(data.iv);

                const decryptedString = await decryptString(encryptedData);
                document.getElementById('output').innerText = "Decrypted: " + decryptedString;
                
            } catch (error) {
                alert("Error during decryption: " + error.message);
            }
        };

        reader.readAsText(file);
    } catch (error) {
        alert("Error during decryption: " + error.message);
    }
}

function checkingInternetStatus () {

    if (navigator.onLine == false) {

        alert('You are offline!');

    } else if (navigator.onLine == true) {

        alert('You are online!');

    } else {
        alert ('Cannot detect if you are online or offline!');
    }

}

function calcSequanceNode () {
    let per = prompt ('Enter the percentage:');
    per = per / 100;
    let n = prompt ('Number of trades?:');
    let amount = prompt ('Enter the amount:');

    let divisionAdd = amount / n;
    let dividedNumber = amount / n;
    
    for (let i = 1; i <= n; i++) {
        dividedNumber = dividedNumber * per;

        alert(dividedNumber);
        dividedNumber = dividedNumber + divisionAdd;
    }
    dividedNumber = dividedNumber - divisionAdd;
    alert('The total profit you will make is: ' + (dividedNumber - amount));
}

function calcDividedEqually () {

    let per = prompt ('Enter the percentage:');
    per = per / 100;
    let n = prompt ('Number of trades?:');
    let amount = prompt ('Enter the amount:');

    let dividedNumber = amount / n;
    let node = dividedNumber;
    let divisionAdd;
    let remainingNodes = n;

    for (let i = 1; i <= n; i++) {//will run n times only 
        dividedNumber = dividedNumber * per; //dividedNumber now is assigned to the growth

        alert(dividedNumber);//will run n times only
        remainingNodes --;//decrement the nodes 
        divisionAdd = dividedNumber / remainingNodes;//counter means the number of the remaining nodes 
        
        dividedNumber = node + divisionAdd;
        node = dividedNumber; 
    }
}
//Dark mode button 

function darkMode() {
    const toggleBtn = document.getElementById("toggleBtn");
    const body = document.body;

    // Check if dark mode is enabled in local storage
    const isDarkMode = localStorage.getItem("darkMode") === "true";

    // Set initial mode based on local storage
    if (isDarkMode) {
        body.classList.add("dark-mode");
    }

    // Toggle dark mode class on body and save mode to local storage
    toggleBtn.addEventListener("click", function () {
        body.classList.toggle("dark-mode");
        const isDarkModeEnabled = body.classList.contains("dark-mode");
        // Save mode to local storage
        localStorage.setItem("darkMode", isDarkModeEnabled);
    });
}

function w3_open() {
  document.getElementById("mySidebar").style.display = "block";
}

function w3_close() {
  document.getElementById("mySidebar").style.display = "none";
}


function openPage(pageName,elmnt,color) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
    }
    document.getElementById(pageName).style.display = "block";
    elmnt.style.backgroundColor = color;
}

    
let totalValue = 0;
let totalAmount = 0;
let transactions = [];

function addTransaction() {
    const coinAmount = parseFloat(document.getElementById('coinAmount').value);
    const coinPrice = parseFloat(document.getElementById('coinPrice').value);

    if (!isNaN(coinAmount) && !isNaN(coinPrice)) {
        const transactionValue = coinAmount * coinPrice;
        totalValue += transactionValue;
        totalAmount += coinAmount;

        transactions.push({ amount: coinAmount, price: coinPrice, transactionValue: transactionValue});

        document.getElementById('transactions').innerHTML += `<p>Amount: ${coinAmount}, Price: ${coinPrice}</p>`;
        updateAveragePrice();
    } else {
        alert("Please enter valid numbers for both fields.");
    }
}

function updateAveragePrice() {
    if (totalAmount === 0) {
        document.getElementById('averagePrice').innerText = `Average Buying Price Per Coin: N/A`;
    } else {
        const averagePrice = totalValue / totalAmount;
        const totalSum = totalAmount * averagePrice;
        document.getElementById('averagePrice').innerText = `Average Buying Price Per Coin: ${averagePrice.toFixed(2)} \n Total $ value: ${totalSum.toFixed(2)}`;
    }
}


function downloadTransactions() {
    const data = JSON.stringify(transactions, null, 3);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'crypto_transactions.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function walletTrack() {
    const walletAddressInput = document.getElementById("wallet-address").value;
    if (walletAddressInput === "" || walletAddressInput === null || walletAddressInput === undefined || walletAddressInput === " ") {
        alert("Please enter a wallet address");
        return;
    } else {
        document.getElementById('netWorthAnimation').style.display = 'block';
    }
}

var currentNumber = 0; // Variable to hold the current number

var currentNumber = 0; // Variable to hold the current number

function incrementNumber() {
    var numberInput = document.getElementById("numberInput").value;
    var percentageInput = document.getElementById("percentageInput").value;

    // Convert inputs to numbers
    var number = parseFloat(numberInput);
    var percentage = parseFloat(percentageInput);

    // If either input is not a valid number, return
    if (isNaN(number) || isNaN(percentage) || number < 0 || percentage < 0) {
        alert("Please enter valid numbers.");
        return;
    }

    // If this is the first increment, set the current number
    if (currentNumber === 0) {
        currentNumber = number;
    }

    // Calculate the increment amount based on the current number
    var incrementAmount = (percentage / 100) * currentNumber;

    // Increment the current number
    currentNumber += incrementAmount;

    // Display the result
    document.getElementById("result").innerText = "Result: " + currentNumber.toFixed(4);
}

//===================================

// function number 7 to show the fear index and hide the greed index 

//===================================
function showFearIndex() {
    document.getElementById('fearIndex').style.display = 'inline';
    document.getElementById('greedIndex').style.display = 'none';
    document.getElementById('fearBTN').innerHTML = '';
    document.getElementById('fearBTN').innerHTML = 'Fear Index Shown!';
    document.getElementById('greedBTN').innerHTML = '';
    document.getElementById('greedBTN').innerHTML = 'Show Green Index?';
}

//===================================

// function number 8 to show the greed index and hide the fear index

//===================================

function showGreedIndex() {
    document.getElementById('fearIndex').style.display = 'none';
    document.getElementById('greedIndex').style.display = 'inline';
    document.getElementById('fearBTN').innerHTML = '';
    document.getElementById('fearBTN').innerHTML = 'Show Fear Index?';
    document.getElementById('greedBTN').innerHTML = '';
    document.getElementById('greedBTN').innerHTML = 'Greed Index Shown!';
}

/**
 * Fetches and loads fear and greed index data from the specified URL.
 * Displays the data in a div element with the id "fearAndGreedDiv".
 * @param {string} url - The URL to fetch the data from.
 * @returns {Promise<void>} - A promise that resolves when the data is loaded and displayed.
 */
//===================================

//function number 1 fetching data for fear and greed index 

//===================================
async function loadFearAndGreedData(url) {
    var div = "<div>";
    var response = await fetch(url);//wait for the API to respond
    var data = await response.json();// wait for the API to return data
  
    div += "<div>Name: " + data["name"] + "</div>";
  
    if (data["data"] && data["data"].length > 0) {//if statement to check if there is data
      for (let i = 0; i < data["data"].length; i++) { // for loop to iterate through the data
        div += "<div>Value: " + data["data"][i]["value"] + "</div>";//display the data in the div
        div += "<div>Classification: " + data["data"][i]["value_classification"] + "</div>";// display the data in the div
        div += "<div>Timestamp: " + new Date(data["data"][i]["timestamp"] * 1000).toLocaleString() + "</div>";// display the data in the div
  
        if (data["data"][i]["time_until_update"]) {// if statement to check if there is data for time until update
            div += "<div>Minutes Until Next Update: " + parseInt(data["data"][i]["time_until_update"] / 60) + "</div>";//display the Date in the div
            //The data retrieved is divided on 60 to get the minutes instead of the seconds
            //the data retrieved is parsed so that there is no decimal
            
        }
  
        div += "<hr>";//adding hr
      }
      
    } else {//otherwise 
      div += "<div>No data available</div>";
    }

    div += "</div>";
    //attach the div to element #fearAndGreedDiv
    document.getElementById("fearAndGreedDiv").innerHTML = div;
  }
  
//===================================

//===================================

//function number 3 fetch, load and display ticker data along with a bar chart

//===================================

/**
 * Loads ticker data based on user input and displays it in a table and chart.
 * @returns {Promise<void>} A promise that resolves when the ticker data is loaded and displayed.
 */
async function loadTickerData() {
    //grab the element search Input
    var searchInput = document.getElementById('searchInput');
    //then get its value 
    var userInput = searchInput.value;
    if (userInput === '') {//then if statement if the search input is empty 
        //if it is then alert this 
        alert('Please input crypto coins or tokens to retrieve the data.\nExample: BTC, SOL, XRP, NEAR etc.');
    } else {//otherwise 
        try {

            //inform the user about what the data retrieved 
            document.getElementById('tickerPricesTextInfo').innerHTML = 'This is the retrieved data, you can request multiple coins or tokens by separating them with a space.\nExample; XRP NEAR BTC ETH';
            document.getElementById('tickerChartInfo').innerHTML = 'Data retrieved from the API is represented here in a bar chart.';

            const response = await fetch('https://project-101-dynamic.onrender.com/charts.html');// Fetch data from server-side proxy
            const result = await response.json();// JSON response from server-side proxy
            const data = result && result.length ? result : [];// JSON response from server-side proxy and data length is not specified here 

            // Get user input from the search bar
            const searchInput = document.getElementById('searchInput');
            //if the user switch their input to caps and lowers an error or no data will be retrieved 
            //just change it to lower case to retrieve the data despite users type case (lower or upper) 
            const userInput = searchInput.value.toLowerCase();

            //make the tickerDataDiv empty if there are data represented already 
            const tickerDataDiv = document.getElementById('tickerDataDiv');
            tickerDataDiv.innerHTML = '';

            // Split the user input into an array of symbols
            const symbols = userInput.split(' ');

            // Create a table
        const table = document.createElement('table');
            table.border = '1';

            // Create table header
            const headerRow = table.insertRow();
            //specifying what content should the header contain
            headerRow.innerHTML = '<th>Coin</th><th>Symbol</th><th>ID</th><th>Price USD</th><th>24h Volume USD</th><th>Market Cap USD</th><th>Percent Change (1h)</th><th>Percent Change (24h)</th><th>Percent Change (7d)</th><th>Last Updated</th>';

            //to achieve retrieving data successfully I need to 
            /*
            1. Iterates over an array of `symbols`.
            2. Filters `data` array to find objects where the lowercase `symbol` property matches the current `symbol`.
            3. Stores the filtered data in the `filteredData` variable for each symbol.
            */
            symbols.forEach(symbol => {
                const filteredData = data.filter(crypto => crypto.symbol.toLowerCase() === symbol);

                if (filteredData.length > 0) {//if there are any symbols in the data that matches the user input
                    // Create a table row
                    const row = table.insertRow();

                    // Populate table cells
                    row.innerHTML = `
                    <td>${filteredData[0].name}</td>
                    <td>${filteredData[0].symbol}</td>
                    <td>${filteredData[0].id}</td>
                    <td>${parseFloat(filteredData[0].price_usd).toFixed(2)}$</td>
                    <td>${parseFloat(filteredData[0]['24h_volume_usd']).toFixed(2)}$</td>
                    <td>${parseFloat(filteredData[0].market_cap_usd).toFixed(2)}$</td>
                    <td>${parseFloat(filteredData[0].percent_change_1h).toFixed(2)}%</td>
                    <td>${parseFloat(filteredData[0].percent_change_24h).toFixed(2)}%</td>
                    <td>${parseFloat(filteredData[0].percent_change_7d).toFixed(2)}%</td>
                    <td>${new Date(filteredData[0].last_updated * 1000).toLocaleDateString()} ${new Date(filteredData[0].last_updated * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    `;

                    //finally attache the row to the table
                    table.appendChild(row);
                } else {//otherwise 
                    //there is no symbol that matches the user input
                    alert(`No data found for ${symbol}`);
                    // Create a table row for no data found
                    const noDataRow = table.insertRow();
                    const noDataCell = noDataRow.insertCell(0);
                    noDataCell.colSpan = 10;
                    noDataCell.innerHTML = `No data found for ${symbol}`;
                }
            });

            tickerDataDiv.appendChild(table);

            // Get the existing chart instance
            const existingChart = Chart.getChart('tickerChart');

            // If a chart exists, destroy it before creating a new one
            //the same as I did in listing API method above 
            if (existingChart) {
                existingChart.destroy();
            }

            // Create a new bar chart with a logarithmic scale for the y-axis
            //source: https://stackoverflow.com/questions/60558243/chart-js-logarithmic-x-axis 
            const ctxTicker = document.getElementById('tickerChart').getContext('2d');
            const tickerChart = new Chart(ctxTicker, {
                type: 'bar',
                data: {
                    labels: symbols,
                    datasets: symbols.map(symbol => {
                        const filteredData = data.filter(crypto => crypto.symbol.toLowerCase() === symbol);
                        return {
                            label: `${symbol} Price (USD)`,
                            data: filteredData.length > 0 ? [parseFloat(filteredData[0].price_usd).toFixed(2)] : [0],
                            backgroundColor: 'rgba(75, 192, 192, 0.7)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        };
                    })
                },
                options: {
                    scales: {
                        y: {
                            type: 'logarithmic',
                            position: 'left',
                            beginAtZero: true,
                        }
                    }
                }
            });
        } catch (error) {
            alert('Error fetching data: ' + error.toString());
        }
    }
}

function startLoadingTickerData() {
    // Get the current time
    const currentTime = new Date().toLocaleTimeString();

    // Log the current time
    console.log(`Fetching data at ${currentTime}`);
    document.getElementById('time-reload').innerHTML = `Last Update Price At: ${currentTime}`;

    // Call the function immediately
    loadTickerData();

    // Then call the function every 60 seconds (60000 milliseconds)
    setInterval(() => {
        // Get the current time
        const currentTime = new Date().toLocaleTimeString();

        // Log the current time
        console.log(`Fetching data at ${currentTime}`);
        
        document.getElementById('time-reload').innerHTML = `Prices Last Update At: ${currentTime}`;
        // Call the function
        loadTickerData();
    }, 90000);
}

//example: {"supply":"19682380.49276744","type":"calculated"}
function fetchingBTCCirculationSupply () {
    // Fetch data from local server
    fetch('https://project-101-dynamic.onrender.com/coins')
    .then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
    })
    .then(data => {
        populateTable(data, 'coinsTable');
    })
    .catch(error => {
    console.log('Fetch failed: ', error);
    });
}

function fetchingBTCHalvingData () {
    //example: {"nextHalvingIndex":4,"nextHalvingBlock":840000,"nextHalvingSubsidy":"3.125","blocksUntilNextHalving":783,"timeUntilNextHalving":"5 days, 7 hours","nextHalvingEstimatedDate":"2024-04-20T00:13:57.784Z"}
    fetch('https://project-101-dynamic.onrender.com/next-halving')
    .then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
    })
    .then(data => {
        populateTable(data, 'halvingTable');
    })
    .catch(error => {
    console.log('Fetch failed: ', error);
    });
}

function populateTable(data, tableId) {
    const table = document.getElementById(tableId);
    const tbody = table.querySelector('tbody');

    // Clear existing rows
    tbody.innerHTML = '';

    // Populate table with data
    for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
            const value = data[key];
            const row = `<tr><td>${key}</td><td>${value}</td></tr>`;
            tbody.insertAdjacentHTML('beforeend', row);
        }
    }
}