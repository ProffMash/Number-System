let history = [];
let voiceOutputEnabled = true;

function convertNumber() {
    const inputNumber = document.getElementById('inputNumber').value;
    const inputSystem = document.getElementById('inputSystem').value;
    const outputSystem = document.getElementById('outputSystem').value;
    const outputElement = document.getElementById('output');

    if (!inputNumber) {
        outputElement.textContent = 'Please enter a number.';
        return;
    }

    let decimalValue;

    // Convert input number to decimal
    try {
        switch (inputSystem) {
            case 'binary':
                decimalValue = parseInt(inputNumber, 2);
                break;
            case 'octal':
                decimalValue = parseInt(inputNumber, 8);
                break;
            case 'decimal':
                decimalValue = parseInt(inputNumber, 10);
                break;
            case 'hexadecimal':
                decimalValue = parseInt(inputNumber, 16);
                break;
            case 'roman':
                decimalValue = romanToDecimal(inputNumber);
                break;
            default:
                decimalValue = NaN;
        }

        if (isNaN(decimalValue)) {
            outputElement.textContent = 'Invalid input number.';
            return;
        }

        // Convert decimal value to output system
        let result;
        switch (outputSystem) {
            case 'binary':
                result = decimalValue.toString(2);
                break;
            case 'octal':
                result = decimalValue.toString(8);
                break;
            case 'decimal':
                result = decimalValue.toString(10);
                break;
            case 'hexadecimal':
                result = decimalValue.toString(16).toUpperCase();
                break;
            case 'roman':
                result = decimalToRoman(decimalValue);
                break;
            default:
                result = '';
        }

        // outputElement.textContent = `Result: ${result}`;
        addToHistory(inputNumber, inputSystem, result, outputSystem);

        // Voice output if enabled
        if (voiceOutputEnabled) {
            speak(`The result is ${result}`);
        }
    } catch (error) {
        outputElement.textContent = 'Error in conversion.';
    }
}

function addToHistory(inputNumber, inputSystem, result, outputSystem) {
    const conversion = `${inputNumber} (${inputSystem}) → ${result} (${outputSystem})`;
    history.push(conversion);
    displayHistory();
}

function displayHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';

    history.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = item;
        historyList.appendChild(listItem);
    });
}

function resetConverter() {
    document.getElementById('inputNumber').value = '';
    document.getElementById('output').textContent = '';
}

function clearHistory() {
    history = [];
    displayHistory();
}

function searchHistory() {
    const searchTerm = document.getElementById('historySearch').value.toLowerCase();
    const filteredHistory = history.filter(item => item.toLowerCase().includes(searchTerm));
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';

    filteredHistory.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = item;
        historyList.appendChild(listItem);
    });
}

function toggleTheme() {
    document.body.classList.toggle('dark');
}

function toggleVoice() {
    voiceOutputEnabled = !voiceOutputEnabled;
    const button = document.getElementById('toggleVoiceButton');
    button.textContent = voiceOutputEnabled ? 'Disable Voice Output' : 'Enable Voice Output';
}

function speak(text) {
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
}

function romanToDecimal(roman) {
    const romanNumerals = {
        'I': 1,
        'V': 5,
        'X': 10,
        'L': 50,
        'C': 100,
        'D': 500,
        'M': 1000
    };
    
    let decimal = 0;
    let prevValue = 0;

    for (let char of roman) {
        const value = romanNumerals[char.toUpperCase()];
        if (!value) {
            throw new Error('Invalid Roman numeral');
        }
        if (value > prevValue) {
            decimal += value - 2 * prevValue; // Adjust for previous value
        } else {
            decimal += value;
        }
        prevValue = value;
    }
    return decimal;
}

function decimalToRoman(num) {
    const romanNumerals = [
        { value: 1000, numeral: 'M' },
        { value: 900, numeral: 'CM' },
        { value: 500, numeral: 'D' },
        { value: 400, numeral: 'CD' },
        { value: 100, numeral: 'C' },
        { value: 90, numeral: 'XC' },
        { value: 50, numeral: 'L' },
        { value: 40, numeral: 'XL' },
        { value: 10, numeral: 'X' },
        { value: 9, numeral: 'IX' },
        { value: 5, numeral: 'V' },
        { value: 4, numeral: 'IV' },
        { value: 1, numeral: 'I' },
    ];

    let roman = '';
    for (const { value, numeral } of romanNumerals) {
        while (num >= value) {
            roman += numeral;
            num -= value;
        }
    }
    return roman;
}
