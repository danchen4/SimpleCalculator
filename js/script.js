
// UI class for UI functions
class UI {

    // Displays numpad buttons in #display
    static displayNumber(disp) {
        // Do not display more than 6 places places past decimal
        if (disp.includes('.')) {
            let modifiedText = disp.substr(0,disp.indexOf('.') + 6);
            display.textContent = modifiedText;
        } else {
            display.textContent = disp;
        }
    }

    // Stores numbers in numbers[]
    static storeNumbers(item) {

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
                numbers.splice(0,1,parseFloat(item)/100);
            } else {
                numbers.splice(0,1,item);
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

    static storeVariables (input) {
        if (displayNumbers !== '') {
            if (displayNumbers.includes('%')) { //If displayed number contains a '%' then convert to percentage
                variableObj[input] = parseFloat(displayNumbers)/100;
            } else {
                variableObj[input] = parseFloat(displayNumbers);
            }
        }

        UI.displayVariablesOnButton(input);
        console.log(variableObj);   
    }

    static getVariables (variable) {
        UI.clearDisplay;
        UI.storeNumbers(variableObj[variable].toString());
        UI.displayNumber(variableObj[variable].toString());
    }

    static displayVariablesOnButton (variable) {
        let parent = document.getElementById(variable);
        
        // Need to remove decimals places past 2 and append '..' if 3 or more decimal places; 
        if (displayNumbers.includes('.')) {
            let modifiedText = displayNumbers.substr(0,displayNumbers.indexOf('.') + 3);
            if (displayNumbers.length - displayNumbers.indexOf('.') > 3) {
                // newdiv.textContent = `${modifiedText}..`;
                parent.innerHTML =`
                    variable ${variable}<br>
                    <span class="variable">${modifiedText}..</span>
                `;
            } else {
                // newdiv.textContent = modifiedText;
                parent.innerHTML = `
                    variable ${variable}<br>
                    <span class="variable">${modifiedText}</span>
                `;
            }
        } else {
            // newdiv.textContent = displayNumbers;
            parent.innerHTML = `
                variable ${variable}<br>
                <span class="variable">${displayNumbers}</span>
            `;
        }

        // parent.insertBefore(newdiv,div);
    }

    static async animateButton (element) {
        clickSound.play(); // Play sound
        element.style.margin = '2px -2px -2px 2px';
        element.style.boxShadow = 'none';
        await setTimeout(()=>{
            element.style.margin = '0';
            element.style.boxShadow = '4px 4px 4px -5px rgba(0, 0, 0, 0.4)';   
        },150)
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
let displayNumbers = '';  // Stores display text
let numberIsTotal = false;  //Flag to check if item in numbers[] is the total from previous equation
let variableObj = {};

// Calculator sound on clicks and Keyboard presses
let clickSound = new Audio();
clickSound.src='../media/audio/office-calculator-single-button-press.mp3';

//DOM Items
let display = document.getElementById('display');

// Numpad IDs
let one = document.getElementById('1');
let two = document.getElementById('2');
let three = document.getElementById('3');
let four = document.getElementById('4');
let five = document.getElementById('5');
let six = document.getElementById('6');
let seven = document.getElementById('7');
let eight = document.getElementById('8');
let nine = document.getElementById('9');
let zero = document.getElementById('0');
let decimal = document.getElementById('.');

// Operator IDs
let clearEntry = document.getElementById('clearEntry');
let clearAll = document.getElementById('clearAll');
let divide = document.getElementById('/');
let multiply = document.getElementById('*');
let subtract = document.getElementById('-');
let add = document.getElementById('+');
let equal = document.getElementById('=');
let changeBit = document.getElementById('changeBit');
let percent = document.getElementById('%');
let squareRoot = document.getElementById('S');

// Variable IDs
let variableA = document.getElementById('A');
let variableB = document.getElementById('B');
let variableC = document.getElementById('C');
let variableD = document.getElementById('D');

// Keyboard presses
window.addEventListener('keyup',keyBoardRouting);

// Number mouse clicks
one.addEventListener('click',(e)=>{numberInput(e.target.innerText), UI.animateButton(e.target)});
two.addEventListener('click',(e)=>{numberInput(e.target.innerText), UI.animateButton(e.target)});
three.addEventListener('click',(e)=>{numberInput(e.target.innerText), UI.animateButton(e.target)});
four.addEventListener('click',(e)=>{numberInput(e.target.innerText), UI.animateButton(e.target)});
five.addEventListener('click',(e)=>{numberInput(e.target.innerText), UI.animateButton(e.target)});
six.addEventListener('click',(e)=>{numberInput(e.target.innerText), UI.animateButton(e.target)});
seven.addEventListener('click',(e)=>{numberInput(e.target.innerText), UI.animateButton(e.target)});
eight.addEventListener('click',(e)=>{numberInput(e.target.innerText), UI.animateButton(e.target)});
nine.addEventListener('click',(e)=>{numberInput(e.target.innerText), UI.animateButton(e.target)});
zero.addEventListener('click',(e)=>{numberInput(e.target.innerText), UI.animateButton(e.target)});
decimal.addEventListener('click',(e)=>{numberInput(e.target.innerText), UI.animateButton(e.target)});

// Operator mouse clicks
add.addEventListener('click',(e)=>{operatorInput(e.target.innerText), UI.animateButton(e.target)});
subtract.addEventListener('click',(e)=>{operatorInput(e.target.innerText), UI.animateButton(e.target)});
multiply.addEventListener('click',(e)=>{operatorInput(e.target.innerText), UI.animateButton(e.target)});
divide.addEventListener('click',(e)=>{operatorInput(e.target.innerText), UI.animateButton(e.target)});
squareRoot.addEventListener('click',(e)=>{squareRootInput(e.target.innerText), UI.animateButton(e.target)});

// Equal sign click
equal.addEventListener('click',equate);

// '%' and '+/-' click
percent.addEventListener('click',(e)=>{numberInput(e.target.innerText), UI.animateButton(e.target)});
changeBit.addEventListener('click',(e)=>{changeBitInput(e), UI.animateButton(e.target)})

// Clear button mouse clicks
clearEntry.addEventListener('click',(e)=>{clearE(e), UI.animateButton(e.target)});
clearAll.addEventListener('click',(e)=>{clearA(e), UI.animateButton(e.target)});

// Varible button mouse clicks
variableA.addEventListener('click',(e)=>{ioVariable('A'), UI.animateButton(e.target)});
variableB.addEventListener('click',(e)=>{ioVariable('B'), UI.animateButton(e.target)});
variableC.addEventListener('click',(e)=>{ioVariable('C'), UI.animateButton(e.target)});
variableD.addEventListener('click',(e)=>{ioVariable('D'), UI.animateButton(e.target)});

// Events

function keyBoardRouting (e) {
    let capitalize, key;
    console.log(e.key);  

    // If a number is keyed then call function
    if (!isNaN(e.key) || e.key === '%' || e.key ==='.') {
        numberInput(e.key);
        key = document.getElementById(e.key);
        UI.animateButton(key);  
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
            key = document.getElementById(e.key);
            UI.animateButton(key);
            break;
        case 'Enter':
        case '=':
            equate (e.key);
            key = document.getElementById('=');
            UI.animateButton(key);
            break;
        case 'Backspace':
            clearE();
            key = document.getElementById('clearEntry');
            UI.animateButton(key);
            break;
        case 'Delete':
            clearA();
            key = document.getElementById('clearAll');
            UI.animateButton(key);
            break;
        case 'S':
        case 's':
            capitalize = e.key.toUpperCase();
            squareRootInput (capitalize);
            key = document.getElementById(capitalize);
            UI.animateButton(key);
            break;
        case 'A':
        case 'a':
        case 'B':
        case 'b':
        case 'C':
        case 'c':
        case 'D':
        case 'd':
            capitalize = e.key.toUpperCase();
            ioVariable(capitalize);
            key = document.getElementById(capitalize);
            UI.animateButton(key);
            break;           
    }
}

// Store or Get variable inputs
function ioVariable(input) {
    if(input in variableObj) {
        console.log('Get');
        UI.getVariables(input);
    } else {
        console.log('Store');
        UI.storeVariables(input);
    }
}

// Handles number inputs and '%' and '.'
function numberInput (input) {
    console.log(input);
    // Everytime a number is clicked, append to var_displayNumbers     
    if (!displayNumbers.includes('%')) { //Don't allow multiple '%'s to be appended
        let displayNumbersCopy = displayNumbers;
        displayNumbersCopy += `${input}`;
        if (displayNumbersCopy.split('.').length -1 < 2) {  //Don't allow multiple '.'s to be added
            displayNumbers += `${input}`; 
            UI.displayNumber(displayNumbers);
        }       
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

function changeBitInput (e) {
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

function squareRootInput (e) {
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