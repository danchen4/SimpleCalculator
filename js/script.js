let display = document.getElementById('display');

// Numpad IDs
let one = document.getElementById('one');
let two = document.getElementById('two');
let three = document.getElementById('three');
let four = document.getElementById('four');
let five = document.getElementById('five');
let six = document.getElementById('six');
let seven = document.getElementById('seven');
let eight = document.getElementById('eight');
let nine = document.getElementById('nine');
let zero = document.getElementById('zero');
let decimal = document.getElementById('decimal');

// Operator IDs
let clearEntry = document.getElementById('clearEntry');
let clearAll = document.getElementById('clearAll');
let divide = document.getElementById('divide');
let multiply = document.getElementById('multiply');
let subtract = document.getElementById('subtract');
let add = document.getElementById('add');
let equal = document.getElementById('equal');
let changeBit = document.getElementById('changeBit');
let percent = document.getElementById('percent');
let squareRoot = document.getElementById('squareRoot');

// Keypad presses
window.addEventListener('keyup',keyRouting);

// Number clicks
one.addEventListener('click',(e)=>{numberInput(e.target.innerText)});
two.addEventListener('click',(e)=>{numberInput(e.target.innerText)});
three.addEventListener('click',(e)=>{numberInput(e.target.innerText)});
four.addEventListener('click',(e)=>{numberInput(e.target.innerText)});
five.addEventListener('click',(e)=>{numberInput(e.target.innerText)});
six.addEventListener('click',(e)=>{numberInput(e.target.innerText)});
seven.addEventListener('click',(e)=>{numberInput(e.target.innerText)});
eight.addEventListener('click',(e)=>{numberInput(e.target.innerText)});
nine.addEventListener('click',(e)=>{numberInput(e.target.innerText)});
zero.addEventListener('click',(e)=>{numberInput(e.target.innerText)});
decimal.addEventListener('click',(e)=>{numberInput(e.target.innerText)});

// Operator click Events
add.addEventListener('click',(e)=>{operatorInput(e.target.innerText)});
subtract.addEventListener('click',(e)=>{operatorInput(e.target.innerText)});
multiply.addEventListener('click',(e)=>{operatorInput(e.target.innerText)});
divide.addEventListener('click',(e)=>{operatorInput(e.target.innerText)});
squareRoot.addEventListener('click',(e)=>{operatorInput(e.target.innerText)});

equal.addEventListener('click',equate);

// Change displayed numbers
percent.addEventListener('click',(e)=>{numberInput(e.target.innerText)});
changeBit.addEventListener('click',changeBitClick)


clearEntry.addEventListener('click',clearE);
clearAll.addEventListener('click',clearA);


// UI class for UI functions
class UI {

    // Displays numpad buttons in #display
    static displayNumber (disp) {
        display.textContent = disp;
    }

    // Stores numbers in numbers[]
    static storeNumbers (item) {

        if ((numbers.length === 0 && operator.length === 0) || numbers.length === operator.length) {//When both numbers[] and operator[] are empty or equal in length then store
            if (item.includes('%')) { //If displayed number contains a '%' then convert to percentage
                numbers.unshift(parseFloat(item)/100);
            } else {
                numbers.unshift(parseFloat(item));
            }
        } 

        // If number is Total from previous answer, then replace Total in case of '+/-' or %
        if (numberIsTotal) {
            if (item.includes('%')) {
                numbers.splice(0,1,parseFloat(item)/100)
            } else {
                numbers.splice(0,1,item)
            }
            numberIsTotal = false;
        }
        console.log(`numbers[] after store: ${numbers}`);
    }

    // Stores operator in operator[]
    static storeOperator (item) {
            if (operator.length < numbers.length) { // Dont' store operators if numbers[] is empty
            operator.unshift(item);
        } else if (operator.length !== 0){ // If pressing/clicking operators in succession, take the most recent press/click and store
            operator.splice(0,1,item);
        }
        console.log(`operator[] after store: ${operator}`);
    }

    // Clear display and displayNumbers;
    static clearDisplay() {
        displayNumbers = '';
        display.innerHTML = '';
    }

    // Clear all arrays
    static clearArrays() {
        numbers.length = 0;
        operator.length = 0;
    }
}

// Math class functions 
class mathCalc {
    static calculate () {
        let total = 0;

        if (numbers.length > 0 ) { //Make sure numbers[] has at least 1 item, or else infinite loop
            while (numbers.length > 1) {  // Since var_total is unshifted to inputs, length will be minimum 1

            // Create variable to store running total
            let variable1 = Number(numbers.shift());
            let variable2 = Number(numbers.shift());
            let operate = operator.shift();

            switch (operate) {
                case '+': 
                    total = variable1 + variable2;
                    break;
                case '-':
                    total = variable2 - variable1;
                    break;
                case 'x':
                case '*':
                    total = variable1 * variable2;
                    break;    
                case '÷':
                case '/':    
                    total = variable2 / variable1;
                    break; 
                default:
                    total = variable1;
            }

            numbers.unshift(total);
            numberIsTotal = true;  //When total is stored, then sit the flag to true (to handle +/-)
            }
        }
        console.log(total);
        return total;
    }
}

const numbers = [];
const operator = [];
const inputs = [];
let displayNumbers = '';  // Storing display
let numberIsTotal = false;  //Track to see if number in numbers[] is the total from previous equation

// Events

// 
function keyRouting (e) {

    console.log(e.key);
   
    // If a number is keyed then call function
    if (!isNaN(e.key) || e.key === '%' || e.key ==='.') {
        numberInput(e.key);  
    }

    // There should always be an odd items of operators and even number of numbers to prevent adding multiple operators
    switch (e.key) {            
        case '+':
        case '-':
        case '*':
        case 'x':
        case '÷':
        case '/':   
            // Dont' store blank spaces in array if hitting operator buttons first
            operatorInput (e.key);
            break;
        case 'Enter':
        case '=':
            equate (e.key);
            break;
        case 'Backspace':
            clearE();
            break;
        case 'Delete':
            clearA();
            break;
    }
}

// Handles number inputs and % and .
function numberInput (input) {
       // Everytime a number is clicked, append to var_displayNumbers
    if (!displayNumbers.includes('%')) { //Don't allow multiple '%'s to be appended
        displayNumbers += `${input}`;
        UI.displayNumber(displayNumbers);
    } 
}

// Handles math operator inputs: +,-,*,/
function operatorInput (input) {
    // Store what's in displayNumbers into numbers[] array if not blank
    if (displayNumbers !== '') {
        UI.storeNumbers(displayNumbers);
    }
    // Clear display
    UI.clearDisplay();
    
    // There should always be an odd items of operators and even number of numbers to prevent adding multiple operators
    UI.storeOperator(input);
    
}

function changeBitClick (e) {
    if (displayNumbers !== '') { 
        let array = displayNumbers.split('');
        if (!displayNumbers.includes('-')) {  
            array.unshift('-');
            displayNumbers = array.join('');
            UI.displayNumber(displayNumbers);
            if (numberIsTotal) {  // If number in numbers[] is total from previous equation, then need to change sign in numbers[]
                numbers.splice(0,1,numbers[0] * -1);
            }
        } else if (displayNumbers.includes('-')) {
            array.shift();
            displayNumbers = array.join('');
            UI.displayNumber(displayNumbers);
        }
    }
}

    function squareRootClick (e) {
            displayNumbers = Math.sqrt(displayNumbers).toString();  //Math.sqrt will convert to number
            UI.displayNumber(displayNumbers);
        }
    
// Equal sign click
function equate() {
    // Need to store Numbers from last entry
    if (displayNumbers !== '') {  
        UI.storeNumbers(displayNumbers);
        UI.clearDisplay();
    };

    // Calcuate arithmetic operation based on sequence of inputs[] and operator[] arrays
    if (operator.length > 0) {
        displayNumbers = mathCalc.calculate().toString();  //Need to keep the displayNumbers equal to solution of previous euation
        UI.displayNumber(displayNumbers); 
    }
}

// Clear Entry
function clearE(e) {
    UI.clearDisplay();
}

// Clear All
function clearA(e) {
    UI.clearDisplay();
    UI.clearArrays();
}