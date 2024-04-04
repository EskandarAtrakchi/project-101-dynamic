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

function darkMode () {

    document.getElementById("toggleBtn").addEventListener("click", function() {
        // Toggle dark mode class on body
        document.body.classList.toggle("dark-mode");
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