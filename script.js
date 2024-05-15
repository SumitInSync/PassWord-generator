const inputSlider = document.querySelector('[data-length-slider]');
const lengthDisplay = document.querySelector('[data-lengthNumber]');
const passwordDisplay = document.querySelector('[data-passwordDisplay]');
const copyBtn = document.querySelector('[data-copy]');
const copyMsg = document.querySelector('[data-copyMsg]');
const uppercaseCheck = document.querySelector('#uppercase');
const lowercaseCheck = document.querySelector('#lowercase');
const numbersCheck = document.querySelector('#numbers');
const symbolCheck = document.querySelector('#symbol');
const indicator = document.querySelector('[data-indicator]');
const generateBtn = document.querySelector('.generateButton');
const allCheckBox = document.querySelectorAll('input[type="checkbox"]');

const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// set strength circle color to be grey

// set password length
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

function setIndicator(color){
    indicator.style.backgroundColor  =  color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min,max){
   return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber(){
    return getRandomInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRandomInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRandomInteger(65,91));
}


function generateSymbol(){
    const random = getRandomInteger(0,symbols.length);
    return symbols.charAt(random);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSymbol = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolCheck.checked) hasSymbol = true;

    if(hasUpper && hasLower && (hasNum || hasSymbol) && passwordLength >= 8){
        setIndicator("#0f0");
    }
    else if((hasLower || hasUpper) && 
    (hasNum || hasSymbol) && 
    passwordLength >= 6){
        setIndicator("#ff0");
    }
    else {
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value); // this is used to copy on clipboard 
        copyMsg.innerText = 'copied';
    }
    catch(e){
        copyMsg.innerText = 'Failed';
    }
    // to make copy wala span visible 
    copyMsg.classList.add('active');

    // to make copy wala span remove 
    setTimeout(()=>{
        copyMsg.classList.remove('active');
    },2000);
}

function shufflePassword(Array){
    // Fisher Yates Method
    for(let i = Array.length - 1; i>0 ;i--){
        // finding random j
        const j = Math.floor(Math.random() * (i+1));
        // swap i and j
        const temp = Array[i];
        Array[i] = Array[j];
        Array[j] = temp;
    }
    let str = "";
    Array.forEach((el) => {str += el});
    return str;
}

function handleBoxChange(){
    checkCount = 0 ;
    allCheckBox.forEach((checkBox)=>{
            if(checkBox.checked)
             checkCount++;
    });
    // special condition
    if(passwordLength < checkCount){
    passwordLength = checkCount;
    handleSlider();
   }
}

allCheckBox.forEach((checkbox) =>{
    checkbox.addEventListener('change',handleBoxChange);
})
// Event Listeners

inputSlider.addEventListener('input',(e)=>{
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){ // Non-empty
        copyContent();
    }
});


generateBtn.addEventListener('click',()=>{
    // None of the check box are selected
    if(checkCount == 0)
     return;

    if(passwordLength < checkCount){
       passwordLength = checkCount;
       handleSlider();
    }
    // let's  start the jpurney to find new password
    console.log("starting the joiureny");
    // remove old password
    password = "";

    // lets put the stuff mentioned by checkboxes
    // if(uppercaseCheck.checked)
    // password+= generateUpperCase();

    // if(lowercaseCheck.checked)
    // password+= generateLowerCase();

    // if(numbersCheck.checked)
    // password+= generateRandomNumber();

    // if(symbolCheck.checked) 
    // password+= generateSymbol();

    let funcArr = [];

    if(uppercaseCheck.checked){ 
        funcArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked) {
        funcArr.push(generateLowerCase);
    }
    if(symbolCheck.checked) {
        funcArr.push(generateSymbol);
    }
    if(numbersCheck.checked) {
        funcArr.push(generateRandomNumber);
    }

    // compulsory addition
    for(let i = 0 ; i < funcArr.length;i++){
        password += funcArr[i]();
    }
    console.log("compulsory addition done");
    // Remaining addition
    for(let i = 0 ; i< passwordLength - funcArr.length;i++) {
        let randomIndex = getRandomInteger(0,funcArr.length);
        console.log("get random done");
        password += funcArr[randomIndex]();
    }
    console.log("remaining addn  done");
    // shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("shuffling done");
    // show in UI
    passwordDisplay.value = password;
    console.log("Ui done");
    // calculate strength
    calcStrength();
});
