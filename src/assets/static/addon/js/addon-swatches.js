var selectors = {
    'swatches': 'addon-swatch'
};

function bindSwatches() {

    var swatches = document.getElementsByClassName(selectors.swatches);

    for( swatch of swatches ) {

        swatch.addEventListener('click', function(){
            setupSwatchVariant(this);
        });

    }

}

function setupSwatchVariant(element) {

    var optionId = element.dataset.optionId;
    var optionValue = element.dataset.optionValue;
    var swatchType = element.dataset.swatchType;

    var optionField = document.getElementById(optionId);
    optionField.value = optionValue;
    optionField.dispatchEvent( new Event('change') );

    // Remove previous select item
    var previousSelectedVariant = document.getElementsByClassName('addon-swatch-'+swatchType+'-active')[0];

    if (previousSelectedVariant != undefined)
        previousSelectedVariant.classList.remove('addon-swatch-'+swatchType+'-active');

    // Add active class to current item
    element.classList.add('addon-swatch-'+swatchType+'-active');
    
}


// Initalize Addon Swatches
window.onload = function () {

    bindSwatches();

}