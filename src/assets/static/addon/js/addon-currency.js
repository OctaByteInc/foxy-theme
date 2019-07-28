var currenyClassName = "addon-price";

var addonCurrency = {
    originalValue: 'addon-money',
    switch: 'addon-currency-switch',
    currentCurrency: 'addon-current-currency',
    mutationPrice: 'addon-price-mutation',
    userMutationPrice: 'money'
}

var addonCurrencySetting = {
    enableLocation: true,
    storeCurrency: 'PKR'
}

var user = {
    selectedCurreny: 'addon-currency-user-selected',
    currencyRateFrom: 'addon-currency-rate-from',
    currencyRateTo: 'addon-currency-rate-to'
};

var moneySpan;
var geoPluginCurrencyCode;

function saveOriginalValue(){
    moneySpan = document.getElementsByClassName(currenyClassName);
    for (money of moneySpan) {
        money.setAttribute(addonCurrency.originalValue, money.innerText);
    }
}

function convertCurrency(currencyCode, rateFrom, rateTo){

    for (money of moneySpan) {
        var m = money.getAttribute(addonCurrency.originalValue);

        money.innerText = amountConverter(currencyCode, m, rateFrom, rateTo);
    }
}

function amountConverter(currencyCode, money, rateFrom, rateTo){
    var thenum = m.replace(/^\D+/g, '');

    var isOnlyNum = /^[0-9, .]+$/.test(money);

    var newMoney = (parseFloat(thenum) * rateFrom) / rateTo;


    newMoney = newMoney.toFixed(2);

    if (isOnlyNum) {
        var moneyCode = '';
    } else {
        var moneyCode = ' ' + currencyCode;
    }

    return newMoney + moneyCode;
}

function loadGeoPlugin(){
    fetch("https://api.ipdata.co/?api-key=ef319447175d5d1c9b38677eaeea273575e9ec69d8500109ee5cb700", { 
        headers: {
          Accept: 'application/json',
        },
    })
      .then(res => res.json())
      .then(
        (result) => {
            geoPluginCurrencyCode = result.currency.code;
        },
        (error) => {
          console.error(error);
        }
    );
}

function currencyMutation() {
    var mutatePrices;
    mutatePrices = document.getElementsByClassName(addonCurrency.userMutationPrice);

    if (mutatePrice.length == 0) {
        mutatePrices = document.getElementsByClassName(addonCurrency.mutationPrice);
    }

    var observer = new MutationObserver(function(mutations) {
        mutatePrice(mutations[0].target);   
    });
    var config = { childList: true};

    for (priceNode of mutationPrices) {
        observer.observe(priceNode, config);
    }
}

function mutatePrice(mutantElement) {
    var price = mutantElement.innerText;

    if (mutantElement.dataset.addonMutantPrice != price) {
        mutantElement.dataset.addonMutantPrice = price;

        var currencyCode = localStorage.getItem(userSelectedCurreny);
        var rateFrom = localStorage.getItem(user.currencyRateFrom);
        var rateTo = localStorage.getItem(user.currencyRateTo);

        mutantElement.innerText = amountConverter(currencyCode, price, rateFrom, rateTo);
    }
}

function currency_init(){

    // Save original values
    saveOriginalValue();

    // Set price mutation if it is a product page
    if (window.location.pathname.includes('products')) {
        currencyMutation();
    }

    // Currenct curreny holder
    var currentCurrency = document.getElementById(addonCurrency.currentCurrency);

    // Set Event Listener to currency switches
    var currencySwitches = document.getElementsByClassName(addonCurrency.switch);
    for (switchElement of currencySwitches) {

        switchElement.addEventListener('click', function(){
            var currencyCode = this.dataset.addonCurrencyCode;
            var rateFrom = Currency.rates[addonCurrencySetting.storeCurrency];
            var rateTo = Currency.rates[currencyCode];

            // Set Currenct currency
            currentCurrency.innerText = currencyCode;

            convertCurrency(currencyCode, rateFrom, rateTo);

            // Check if Geo Location is enable the don't save
            // these values otherwise Geo location not work
            if(!addonCurrencySetting.enableLocation) {
                // Save this setting for later use
                localStorage.setItem(user.selectedCurreny, currencyCode);
                localStorage.setItem(user.currencyRateFrom, rateFrom);
                localStorage.setItem(user.currencyRateTo, rateTo);
            }

        });
    }

    // Show user selected currency
    var userSelectedCurreny = localStorage.getItem(user.selectedCurreny);

    if (userSelectedCurreny != null) {
        var rateFrom = localStorage.getItem(user.currencyRateFrom);
        var rateTo = localStorage.getItem(user.currencyRateTo);

        convertCurrency(userSelectedCurreny, rateFrom, rateTo);

    } else if(addonCurrencySetting.enableLocation) {
        // If location is enable then check geoPluginLoaded or not
        // If geoPlugin is not loaded then wait for it
        var geoPluginWaiting = setInterval(function(){
            if (geoPluginCurrencyCode != null) {

                // Fetch values from Shopify currency API
                var rateFrom = Currency.rates[addonCurrencySetting.storeCurrency];
                var rateTo = Currency.rates[geoPluginCurrencyCode];

                // Save this setting for later use
                localStorage.setItem(user.selectedCurreny, geoPluginCurrencyCode);
                localStorage.setItem(user.currencyRateFrom, rateFrom);
                localStorage.setItem(user.currencyRateTo, rateTo);

                // Convert all currencies
                convertCurrency(geoPluginCurrencyCode, rateFrom, rateTo);

                // Stop the timer geo plugin is loaded
                clearInterval(geoPluginWaiting);
            }
        }, 300);

    }

}

// Initialize the Currency Converter

// Check user already select any currency or not
var userSelectedCurreny = localStorage.getItem(user.selectedCurreny);

if (userSelectedCurreny == null && addonCurrencySetting.enableLocation) {
    loadGeoPlugin();
}

// Configure other setting when page load
window.onload = function() {
    currency_init();
}