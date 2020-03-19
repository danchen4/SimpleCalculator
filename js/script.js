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
one.addEventListener('click',numClick);
two.addEventListener('click',numClick);
three.addEventListener('click',numClick);
four.addEventListener('click',numClick);
five.addEventListener('click',numClick);
six.addEventListener('click',numClick);
seven.addEventListener('click',numClick);
eight.addEventListener('click',numClick);
nine.addEventListener('click',numClick);
zero.addEventListener('click',numClick);
decimal.addEventListener('click',numClick);

// Operator click Events
add.addEventListener('click',operatorClick);
subtract.addEventListener('click',operatorClick);
multiply.addEventListener('click',operatorClick);
divide.addEventListener('click',operatorClick);
squareRoot.addEventListener('click',squareRootClick);

equal.addEventListener('click',equate);

// Change displayed numbers
percent.addEventListener('click',numClick);
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

    // Clear displayNumbers;
    static clearDisplayNumbers() {
        displayNumbers = '';
    }

    // Clear display
    static clearDisplay() {
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
            // console.log(`numbers[] before Shift: ${numbers}`);

            let variable1 = Number(numbers.shift());
            // console.log(`Variable1: ${variable1}`);

            let variable2 = Number(numbers.shift());
            // console.log(`Variable2: ${variable2}`);

            let operate = operator.shift();

            // console.log(`numbers[] after Shift: ${numbers}`);
            // console.log(`operator[] after Shift: ${operator}`);

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
            numberIsTotal = true;
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
    // console.log(e.key);
    
    // Only display numbers 
    if (!isNaN(e.key)) {
        displayNumbers += `${e.key}`;
        UI.displayNumber(displayNumbers);  
    }

    // console.log(numbers.displayNumbers);
    // console.log(operator.length);

    // There should always be an odd items of operators and even number of numbers to prevent adding multiple operators
        switch (e.key) {            
            case '+':
            case '-':
            case '*':
            case 'x':
            case '÷':
            case '/':    
                // Dont' store blank spaces in array if hitting operator buttons first
                if (displayNumbers !== '') {     
                    UI.storeNumbers(displayNumbers);
                    UI.clearDisplay();
                };               
                
                //  If operators are keyed first, then don't store in operators[] array
                UI.storeOperator(e.key);
                
                break;
            case 'Enter':
            case '=':
                // Dont' store blank spaces in array if hitting Enter/Equal button first.
                // Don't      
                console.log(`displayNumbers: ${displayNumbers}`);
                console.log(`operator.length : ${operator.length}`);
                
                if (displayNumbers !== '') {  
                    UI.storeNumbers(displayNumbers);
                    UI.clearDisplay();
                };
             
                // If hitting 'Enter' or 'equal' sign sequentially, don't recalculate and display
                if (operator.length > 0) {
                    UI.displayNumber(mathCalc.calculate());
                }
                break;
        }
}

// Num clicks
function numClick (e) {
     // Everytime a number is clicked, append to var_displayNumbers
    if (!displayNumbers.includes('%')) { //Don't allow multiple '%'s to be appended
        displayNumbers += `${e.target.innerText}`;
        UI.displayNumber(displayNumbers);
    } 
}

// All basic math (+,-,x,/) operator click 
function operatorClick (e) {
    // Store what's in displayNumbers into numbers[] array if not blank
    if (displayNumbers !== '') {
        console.log(`displayNumbers BBB: ${displayNumbers}`);
        UI.storeNumbers(displayNumbers);
    }

    // Clear display
    UI.clearDisplay();

    // Clear displayNumbers
    UI.clearDisplayNumbers();
    
    // There should always be an odd items of operators and even number of numbers to prevent adding multiple operators
    UI.storeOperator(e.target.innerText);
    
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
function equate(e) {
    // Need to store Numbers from last entry
    if (displayNumbers !== '') {  
        UI.storeNumbers(displayNumbers);
        UI.clearDisplay();
        UI.clearDisplayNumbers();
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
    UI.clearDisplayNumbers();
}

// Clear All
function clearA(e) {
    UI.clearDisplay();
    UI.clearDisplayNumbers();
    UI.clearArrays();
}