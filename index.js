// grab the elements we need
const inputAmount = document.querySelector("#original-currency-amount");
const inputOriginalCurrency = document.querySelector("#original-currency-unit");
const inputNewCurrency = document.querySelector("#new-currency-unit");
const inputFXRate = document.querySelector("#exchange-rate");
const outputAmount = document.querySelector("#output-text");
const button = document.querySelector("button");
let amount = 0;

function updateCurrencyName(e) {
  // grab data attribute
  const currencyName = this.selectedOptions[0].dataset.name;
  // assign currency output text on which was changed
  const outputText = this.id.includes("original")
    ? document.querySelector("#fromCurrencyText")
    : document.querySelector("#toCurrencyText");
  // update html
  outputText.innerHTML = currencyName;
  // update amount currency format
  updateFormat(e);
}

function updateFormat(e) {
  // conditional take from user input or stored number value
  const value = e.type === "blur"? Number(inputAmount.value): amount;
  // update stored number value
  amount = (Number(value)).toFixed(2);
  // console.log(amount, typeof(amount)); *** changing amount to string
  // grab selected original currency
  const originalCurrency = inputOriginalCurrency.value;
  // update html with formatted currency str
  inputAmount.value = formatToCurrency(value, originalCurrency);
}

function formatToCurrency(number, currencyCode){
  //  set options
  const formatOptions = {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
    currencyDisplay: "symbol",
  };
  // create intlNum constructor
  const currencyFormatText = new Intl.NumberFormat("en-US", formatOptions).format(number);
  // return str
  return currencyFormatText;
}

function checkNumberKey(e){
  // stop default adding typed value to input
  e.preventDefault();
  // set allowed values
  const allowedKeys = "0123456789";
  const keyArray = allowedKeys.split("");
  const allowOnce = ".";
  // adds to input if matches allowed characters
  if(keyArray.includes(e.key)){
    inputAmount.value += e.key;
  }else if(!inputAmount.value.includes(".") && e.key === allowOnce){ // allows . if not present
    inputAmount.value += e.key;
  }
}

async function getExchangeRate() {
  // grab selections
  const fromCurrency = inputOriginalCurrency.value;
  const toCurrency = inputNewCurrency.value;
  // personal key
  const apiKey = "";
  // encode currency and build the query
  const fromCurrencyURI = encodeURIComponent(fromCurrency);
  const toCurrencyURI = encodeURIComponent(toCurrency);
  const query = fromCurrencyURI + "_" + toCurrencyURI;
  // add the key and query to final url
  const url =
    "https://free.currconv.com/api/v7/convert?q=" +
    query +
    "&compact=ultra&apiKey=" +
    apiKey;
  // send it
  const response = await fetch(url);
  const data = await response.json();
  const FXRate = data[query];
  // update html
  inputFXRate.innerHTML = FXRate;
  // actually calculate the new amount
  const toAmount = amount * FXRate;
  // format currency
  const fromText = formatToCurrency(amount, fromCurrency);
  const toText = formatToCurrency(toAmount, toCurrency);
  // update html with xchange details
  const msg = `${fromText} = ${toText}`;
  outputAmount.innerHTML = msg;
}

// update currency texts on selection
inputOriginalCurrency.addEventListener("change", updateCurrencyName);
inputNewCurrency.addEventListener("change", updateCurrencyName);

// amount input listeners
inputAmount.addEventListener("keydown", checkNumberKey);
inputAmount.addEventListener("blur", updateFormat);
inputAmount.addEventListener("focus", () => inputAmount.value ="");

// main event
button.addEventListener("click", getExchangeRate);