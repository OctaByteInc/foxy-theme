var currenyClassName = "addon-price";

var addonCurrency = {
    originalValue: 'addon-money',
    switch: '.addon-currency-switch'
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

        var thenum = m.replace( /^\D+/g, '');
        
        var isOnlyNum = /^[0-9, .]+$/.test(m);
        
        var newMoney = (parseFloat(thenum) * rateFrom) / rateTo;

        
        newMoney = newMoney.toFixed(2);
        
        if (isOnlyNum) {
            var moneyCode = '';
        } else {
            var moneyCode = ' ' + currencyCode;
        }

        money.innerText = newMoney + moneyCode;
    }
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

function currency_init(){

    // Save original values
    saveOriginalValue();

    // Set Event Listener to currency switches
    var currencySwitches = document.getElementsByClassName(addonCurrency.switch);
    for (switchElement of currencySwitches) {
        var switchCurrencyCode = switchElement.dataset.addonCurrencyCode;

        switchElement.addEventListener('click', function(){
            var currencyCode = switchCurrencyCode;
            var rateFrom = Currency.rates[addonCurrencySetting.storeCurrency];
            var rateTo = Currency.rateTo[currencyCode];

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