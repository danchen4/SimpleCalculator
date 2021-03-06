
// UI class for UI functions
class UI {

    // Displays numpad buttons in #display
    static display () {
        let text = '';
        let convertedNumber;
        let outputArray = output.trim().split(' ');
        console.log(outputArray);
        outputArray.forEach((item)=>{
            if (!isNaN(item)) {// If number, then only allow four decimal places after decimal
                if (item.lastIndexOf('.') === item.length - 1) {//If there is a '.' at end, then just display since parseFloat method will remove it.
                    text += `${item}`;
                } else if (item.lastIndexOf('0') === item.length - 1)  { //If a '0' is entered after '.', then just display since parseFloat method will remove it.
                    text += `${item}`;
                } else {
                    // convertedNumber = Math.round(item + 0.01 * 10000) / 10000;
                    convertedNumber = +parseFloat(item).toFixed(toDecimal);
                    text += `${convertedNumber}`;
                }
            } else {//If an operator then need to add spaces before and after
                text += ` ${item} `;
            }
        })

        // Adding commas
        display.textContent = text.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    }

    static displayEquation() {
        displayHistory.textContent = equation;
    }

    // #region
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
        let convertedNumber =  +parseFloat(operand).toFixed(toDecimal);
        if (operand !== '') {
            if (operand.includes('%')) { //If displayed number contains a '%' then convert to percentage
                variableObj[input] = convertedNumber/100;
            } else {
                variableObj[input] = convertedNumber;
            }
            UI.displayVariablesOnButton(input);
        }
        console.log(variableObj);   
    }

    static getVariables (variable) {
        // When the variable is retrieved, it will wipe all history 
        UI.clearDisplay;
        UI.storeNumbers(variableObj[variable].toString());
        operand = variableObj[variable].toString();
        //When retrieving variable, if there is an operator than add to output, otherwise replace output with variable
        if ((output.indexOf('+') > -1 || output.indexOf('-') > -1 || output.indexOf('x') > -1 || output.indexOf('÷') > -1)) {  
            output += variableObj[variable].toString();
        } else {
            output = variableObj[variable].toString();
        }
        UI.display();
    }

    static displayVariablesOnButton (variable) {
        let parent = document.getElementById(variable);
        let operandWithCommas = operand.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");        
        // Need to remove decimals places past 2 and append '..' if 3 or more decimal places;   
        if (operand.includes('.')) {
            let modifiedText = operand.substr(0,operand.indexOf('.') + 3).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            if (operand.length - operand.indexOf('.') > 3) {
                parent.children[2].textContent = `${modifiedText}..`;
            } 
            else {
                parent.children[2].textContent = `${modifiedText}`;
            }
        } else {
            // newdiv.textContent = operand;
            parent.children[2].textContent = operandWithCommas;
        }
        // parent.insertBefore(newdiv,div);
    }    

    static clearAllVariables() {
        // Got through all stored variables in object and remove content 
        for (let key in variableObj) {
            let element = document.getElementById(key);
            element.children[2].textContent = '';
        }
        // Clear the variableObj
        variableObj = {};
    }
    
    //#region
    static async animateButton (element) {
        clickSound.play(); // Play sound
        element.style.margin = '2px -2px -2px 2px';
        element.style.boxShadow = 'none';
        await setTimeout(()=>{
            element.style.margin = '0';
            element.style.boxShadow = '4px 4px 4px -5px rgba(0, 0, 0, 0.4)';   
        },150)
    }

    // Clear operand variable;
    static clearOperand() {
        operand = '';
    }

    // Clear output;
    static clearOutput() {
        output = '';
    }

    // Clear display;
    static clearDisplay() {
        display.textContent = '';
    }

    static clearEquation() {
        displayHistory.textContent = '';
    }

    // Clear all arrays
    static clearArrays() {
        numbers.length = 0;
        operator.length = 0;
    }
    //#endregion

}

// Math class functions 
class mathCalc {
    static calculate () {
        let total = 0;
        let convertedNumber;

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

            //Provide all answers to 4 decimal places
            convertedNumber = +parseFloat(total).toFixed(toDecimal);
            numbers.unshift(convertedNumber);
            numberIsTotal = true;  //When total is stored, then sit the flag to true (to handle +/-)
            }
        }
        return total;
    }
}

// Variable declarations
//#region
const numbers = [];
const operator = [];
const inputs = [];
let operand = '';  // Stores display text
let numberIsTotal = false;  //Flag to check if item in numbers[] is the total from previous equation
let variableObj = {};
let output = '';
let equation = '';
let toDecimal = 4; //Number of decimals

// Calculator sound on clicks and Keyboard presses
let clickSound = new Audio();
clickSound.src='../media/audio/office-calculator-single-button-press.mp3';
//#endregion

// DOM elements
//#region
//DOM Items
let display = document.getElementById('display');
let displayHistory = document.getElementById('display-history');

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
let clearEntryButton = document.getElementById('clearEntry');
let clearAllButton = document.getElementById('clearAll');
let divide = document.getElementById('÷');
let multiply = document.getElementById('x');
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

// let clearA = document.getElementById('clearA');
// let clearB = document.getElementById('clearB');
// let clearC = document.getElementById('clearC');
// let clearD = document.getElementById('clearD');

// Keyboard presses
window.addEventListener('keyup',keyBoardRouting);

// Number mouse clicks
one.addEventListener('click',(e)=>{numberInput(e.target.children[1].innerHTML), UI.animateButton(e.target)});
two.addEventListener('click',(e)=>{numberInput(e.target.children[1].innerHTML), UI.animateButton(e.target)});
three.addEventListener('click',(e)=>{numberInput(e.target.children[1].innerHTML), UI.animateButton(e.target)});
four.addEventListener('click',(e)=>{numberInput(e.target.children[1].innerHTML), UI.animateButton(e.target)});
five.addEventListener('click',(e)=>{numberInput(e.target.children[1].innerHTML), UI.animateButton(e.target)});
six.addEventListener('click',(e)=>{numberInput(e.target.children[1].innerHTML), UI.animateButton(e.target)});
seven.addEventListener('click',(e)=>{numberInput(e.target.children[1].innerHTML), UI.animateButton(e.target)});
eight.addEventListener('click',(e)=>{numberInput(e.target.children[1].innerHTML), UI.animateButton(e.target)});
nine.addEventListener('click',(e)=>{numberInput(e.target.children[1].innerHTML), UI.animateButton(e.target)});
zero.addEventListener('click',(e)=>{numberInput(e.target.children[1].innerHTML), UI.animateButton(e.target)});
decimal.addEventListener('click',(e)=>{numberInput(e.target.children[1].innerHTML), UI.animateButton(e.target)});

// Operator mouse clicks
add.addEventListener('click',(e)=>{operatorInput(e.target.children[1].innerHTML), UI.animateButton(e.target)});
subtract.addEventListener('click',(e)=>{operatorInput(e.target.children[1].innerHTML), UI.animateButton(e.target)});
multiply.addEventListener('click',(e)=>{operatorInput(e.target.children[1].innerHTML), UI.animateButton(e.target)});
divide.addEventListener('click',(e)=>{operatorInput(e.target.children[1].innerHTML), UI.animateButton(e.target)});

// Squareroot mouse click
squareRoot.addEventListener('click',(e)=>{squareRootInput(e.target.children[1].innerHTML), UI.animateButton(e.target)});

// Equal sign click
equal.addEventListener('click',(e)=>{equate(), UI.animateButton(e.target)});

// '%' and '+/-' click
percent.addEventListener('click',(e)=>{numberInput(e.target.children[1].innerHTML), UI.animateButton(e.target)});
changeBit.addEventListener('click',(e)=>{changeBitInput(), UI.animateButton(e.target)})

// Clear button mouse clicks
clearEntryButton.addEventListener('click',(e)=>{clearEntry(), UI.animateButton(e.target)});
clearAllButton.addEventListener('click',(e)=>{clearAll(), UI.animateButton(e.target)});

// Varible button mouse clicks
variableA.addEventListener('click',(e)=>{ioVariable('A', e), UI.animateButton(e.target)});
variableB.addEventListener('click',(e)=>{ioVariable('B', e), UI.animateButton(e.target)});
variableC.addEventListener('click',(e)=>{ioVariable('C', e), UI.animateButton(e.target)});
variableD.addEventListener('click',(e)=>{ioVariable('D', e), UI.animateButton(e.target)});

// clearA.addEventListener('click',(e)=>UI.clearVariable(e.target));
// clearB.addEventListener('click',(e)=>UI.clearVariable(e.target));
// clearC.addEventListener('click',(e)=>UI.clearVariable(e.target));
// clearD.addEventListener('click',(e)=>UI.clearVariable(e.target));

//#endregion

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
        case 'x':
            // Dont' store blank spaces in array if hitting operator buttons first
            operatorInput(e.key);
            key = document.getElementById(e.key);
            UI.animateButton(key);
            break;
        case '*': //Need special case for * since it doesn't match 'x'
            operatorInput('x');
            key = document.getElementById('x');
            UI.animateButton(key);
            break;
        case '/': //Need special case for '/ since it doesn't match '÷'
            operatorInput('÷');
            key = document.getElementById('÷');
            UI.animateButton(key);
            break;    
        case 'Enter':
        case '=':
            equate(e.key);
            key = document.getElementById('=');
            UI.animateButton(key);
            break;
        case 'Backspace':
            clearEntry();
            key = document.getElementById('clearEntry');
            UI.animateButton(key);
            break;
        case 'Delete':
            clearAll();
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
        case 'PageDown':
            changeBitInput();
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
function ioVariable(variable) {
    if(variable in variableObj) {
        console.log('Get');
        UI.getVariables(variable);
    } else {
        console.log('Store');
        UI.storeVariables(variable);
    }
}

// Handles number inputs and '%' and '.'
function numberInput (input) {
    // Everytime a number is clicked, append to operand
    if (operand.lastIndexOf('.') === operand.length - 1 && input === '%') {//Dont' allow '%' right after '.'
        return;
    } else if (!operand.includes('%')) { //Don't allow multiple '%'s to be appended.  Once '%' is inputted, then can't add anything afterwards
        let operandCopy = operand;
        operandCopy += `${input}`;
        if (operandCopy.split('.').length -1 < 2) {  //Don't allow multiple '.'s to be added
            operand += `${input}`; 
            output += `${input}`; 
            UI.display();
        }       
    } 
}

// Handles math operator inputs: +,-,*,/
function operatorInput (input) {
    // Store operand into numbers[] if not blank and don't allow operators unless there is a number
    if (operand !== '') {
        UI.storeNumbers(operand);
    
        // If operator is already in output, then replace with most recent operator
        if (output.trim().lastIndexOf('+') === output.trim().length - 1 || output.trim().lastIndexOf('-') === output.trim().length-1   || output.trim().lastIndexOf('x') === output.trim().length-1 || output.trim().lastIndexOf('÷') === output.trim().length-1) {
            let array = output.trim().split(' ');  //remove space after operator with trim();
            array.splice(array.length-1,1,input); // replace last operator with current operator;
            array.push(' '); // add space after operator that was removed from trim();
            output = array.join(' ');
        } else {
            output += ` ${input} `; //add space between operators to use as delimiter
        }
    }

    UI.display();
    UI.clearOperand();
    UI.storeOperator(input);
}

function changeBitInput () {
    if (operand !== '' && numbers.length === 0) {// Change bit if there is an operand but no other numbers
        if (operand.indexOf('-') < 0) {//If there is no '-' in front
            operand = '-'+operand;
            output = operand;
            UI.display();
            if (numberIsTotal) {  // If number in numbers[] is total from previous equation, then need to change sign in numbers[]
                numbers.splice(0,1,numbers[0] * -1);
            }
        } else if (operand.indexOf('-') === 0) {//If there is '-' in front
            operand = operand.slice(1);
            output = operand;
            UI.display();
        }
    } else if (operand !== '' && numbers.length > 0) { //If there is an operand and other numbers, then only change bit of last number
        if (operand.indexOf('-') < 0) {//If there is no '-' in front
            operand = '-'+operand;
            // Replaces last number of output with it's negative
            let array = [];
            array = output.split(' ').slice(0,array.length-1);
            array.push(operand);
            let string = array.join(' ');
            output = string;
            // output.split(' ').pop().push(operand).join(' ');
            UI.display();
            if (numberIsTotal) {  // If number in numbers[] is total from previous equation, then need to change sign in numbers[]
                numbers.splice(0,1,numbers[0] * -1);
            }
        } else if (operand.indexOf('-') === 0) {//If there is '-' in front
            operand = operand.slice(1);
            // Replaces last number of output with it's negative
            let array = [];
            array = output.split(' ').slice(0,array.length-1);
            array.push(operand);
            let string = array.join(' ');
            output = string;
            // output.split(' ').pop().push(operand).join(' ');
            UI.display();
        }
    }
}

function squareRootInput (input) {
        let convertedNumber;

        if (operand !== '') { 
            equation = '√' + output + ' = ';
            operand = Math.sqrt(operand).toString();  //Math.sqrt will convert to number
            // Only show square root to the 4 decimals
            convertedNumber = +parseFloat(operand).toFixed(4);
            output = convertedNumber.toString();
            UI.display();
            UI.displayEquation();
        }
}
    
// Equal sign click
function equate() {
    // Hitting the equal should only compute if the following three conditions are met:
    // 1. There is at least one operator in the output
    // 2. The operator is not an '-' in the front
    // 3. There is a number after the operator (so a binary operator)
    if ((output.indexOf('+') > -1 || (output.indexOf('-') > -1 && operand.indexOf('-') !== 0) || output.indexOf('x') > -1 || output.indexOf('÷') > -1) && (!isNaN(output.trim().charAt(output.trim().length-1)))) {  
        UI.storeNumbers(operand);
        equation = output + ` = `;
        UI.clearDisplay();
        UI.clearOperand();
        UI.clearOutput();

        operand = mathCalc.calculate().toString();  //Need to keep the operand equal to solution of previous euation
            
        // Store total from previous answer into output
        output = numbers[0].toString();
        UI.displayEquation();
        UI.display(); 
        console.log(`numbers[] after equal: ${numbers}`);

        // Store total from previous answer into output
        console.log(`output after equal: ${output}`);
    };
}

// Clear Entry
function clearEntry() {
    UI.clearDisplay();
    UI.clearEquation();
    UI.clearOperand();
    UI.clearOutput();
}

// Clear All
function clearAll() {
    UI.clearDisplay();
    UI.clearEquation();
    UI.clearOperand();
    UI.clearOutput();
    UI.clearArrays();
    UI.clearAllVariables();
}

