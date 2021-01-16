// Instructions:

// 1. Add the functionality to exchange one currency to another
//(you can use a technology of your choice) 🤖
// 2. Style the app 🎨

// grab the elements we need
const inputAmount = document.querySelector("#original-currency-amount");
const inputOriginalCurrency = document.querySelector("#original-currency-unit");
const inputNewCurrency = document.querySelector("#new-currency-unit");
const inputFXRate = document.querySelector("#exchange-rate");
const outputAmount = document.querySelector("#output-text");
const button = document.querySelector("button");
let originalAmount = 0;

// update currency texts on selection
inputOriginalCurrency.addEventListener("change", updateCurrencyName);
inputNewCurrency.addEventListener("change", updateCurrencyName);

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
  updateAmount(e);
}

button.addEventListener("click", () => {
  // assign inputted values
  const originalAmount = amount;
  console.log(typeof originalAmount);
  const originalCurrency = inputOriginalCurrency.value;
  const newCurrency = inputNewCurrency.value;
  // call to update currency
  getExchangeRate(originalCurrency, newCurrency, originalAmount);
});

async function getExchangeRate(fromCurrency, toCurrency, fromAmount) {
  // personal key
  const apiKey = "";
  // encode currency and build the query
  fromCurrency = encodeURIComponent(fromCurrency);
  toCurrency = encodeURIComponent(toCurrency);
  const query = fromCurrency + "_" + toCurrency;
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
  const toAmount = (fromAmount * FXRate).toFixed(2);
  const msg = `${fromCurrency} ${fromAmount} will convert to ${toCurrency} ${toAmount}`;
  outputAmount.innerHTML = msg;
}

inputAmount.addEventListener("blur", updateAmount);
inputAmount.addEventListener("focus", () => {
    inputAmount.value ="";
    inputAmount.placeholder = `${amount}`;
});

function updateAmount(e) {
  console.log(e);

  const value = e.type === "blur"? Number(inputAmount.value): amount;
  amount = value;
  console.log(amount, typeof(amount));

  inputAmount.value = formatToCurrency(value);
}

function formatToCurrency(number){
  //   grab selected original currency
  const originalCurrency = inputOriginalCurrency.value;
  //   set options
  const formatOptions = {
    style: "currency",
    currency: originalCurrency, // CNY for Chinese Yen, EUR for Euro
    minimumFractionDigits: 2,
    currencyDisplay: "symbol",
  };
  // create intlNum constructor
  const currencyFormatText = new Intl.NumberFormat("en-US", formatOptions).format(number);
  // console.log(currencyFormatText, typeof(currencyFormatText));
  // return str
  return currencyFormatText;
}