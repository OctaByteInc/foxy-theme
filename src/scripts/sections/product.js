/**
 * Product Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Product template.
 *
 * @namespace product
 */

import {getUrlWithVariant, ProductForm} from '@shopify/theme-product-form';
import {formatMoney} from '@shopify/theme-currency';
import {register} from '@shopify/theme-sections';
import {forceFocus} from '@shopify/theme-a11y';
import * as images from '@shopify/theme-images';

const classes = {
    paneShow: 'show',
    paneActive: 'active',
    hide: 'd-none',
    cartBtnSelector: 's-add-to-cart',
    cartBtnHover: 'btn-hover-black'
}

const selectors = {
    productForm: '[data-product-form]',
    variantDetail: '[data-detail-variant-image]',
    variantBigImage: '[data-detail-variant-image-big]',
    variantLowImage: '[data-detail-variant-image-low]',
    productPrice: '[data-product-price]',
    productRegularPrice: '[data-product-regular-price]',
    addToCart: '[data-add-to-cart]'
};

register('product', {
    async onLoad() {
        const productFromElement = document.querySelector(selectors.productForm);
        
        // Load product Json and save into product variable
        this.product = await this.getProductJson(productFromElement.dataset.productHandle);
        
        // Create new Form to listen user actions
        this.productForm = new ProductForm(productFromElement, this.product, { 
            onOptionChange: this.onFormOptionChange.bind(this), 
        })
    },

    // Called whenever user change any option in product form
    onFormOptionChange(event) {
        const variant = event.dataset.variant;
        
        this.renderVariantImage(variant);
        this.renderPrice(variant);
        this.renderAddToCart(variant);
    },

    // Add To cart button
    renderAddToCart(variant){
        const cartBtn = this.container.querySelector(selectors.addToCart);

        if (!variant) {
            cartBtn.disabled = true;
            cartBtn.classList.remove(classes.cartBtnSelector, classes.cartBtnHover);
            cartBtn.innerText = theme.strings.unavailable;
        } else if(variant.available) {
            cartBtn.disabled = false;
            cartBtn.classList.add(classes.cartBtnSelector, classes.cartBtnHover);
            cartBtn.innerText = theme.strings.addToCart;
        } else {
            cartBtn.disabled = true;
            cartBtn.classList.remove(classes.cartBtnSelector, classes.cartBtnHover);
            cartBtn.innerText = theme.strings.soldOut;
        }
    },

    // Display variant price
    renderPrice(variant) {
        const priceElement = this.container.querySelector(selectors.productPrice);
        const regularPriceElement = this.container.querySelector(selectors.productRegularPrice);

        if(variant === null) {
            priceElement.innerHTML = '';

            if (regularPriceElement !== null) {
                regularPriceElement.classList.add(classes.hide);
            }
            
            return;
        }

        priceElement.innerHTML = formatMoney(variant.price, theme.moneyFormat);

        if (variant.compare_at_price > variant.price) {
            regularPriceElement.classList.remove(classes.hide);
            regularPriceElement.innerHTML = formatMoney(variant.compare_at_price, theme.moneyFormat);
        } else if (regularPriceElement !== null) {
            regularPriceElement.classList.add(classes.hide);
        }
    },

    // Display variant Image
    renderVariantImage(variant) {
        if(!variant || variant.featured_image === null) {
            return;
        }

        // Remove currently active classes
        const tabPaneList = this.container.getElementsByClassName('tab-pane'); 
        for(let i=0; i < tabPaneList.length; i++) {
            tabPaneList[i].classList.remove(classes.paneActive, classes.paneShow);
        }

        // Set variant Big image for zoom
        const variantBigImage = this.container.querySelector(selectors.variantBigImage);
        variantBigImage.setAttribute('href', variant.featured_image.src);
        
        // Set variant small image
        const variantLowImage = this.container.querySelector(selectors.variantLowImage);
        variantLowImage.setAttribute('src', variant.featured_image.src);
        
        // Show varient image
        const variantDetail = this.container.querySelector(selectors.variantDetail);
        variantDetail.classList.add(classes.paneActive, classes.paneShow);
    },

    // Fetch Product detail from Shopify API
    getProductJson(handle) {
        return fetch(`/products/${handle}.js`).then((response) => {
          return response.json();
        });
    },

    onUnload() {
        this.productForm.distroy();
    }
});