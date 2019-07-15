/**
 * Cart Script
 * ------------------------------------------------------------------------------
 * Script for Ajax Cart
 *
 */

import {register} from '@shopify/theme-sections';
import * as cart from '@shopify/theme-cart';

register('header', {
    onLoad() {
        $('.s-add-to-cart').click(function(event){
            event.preventDefault();

            const btn = $(this);

            // disable button
            btn.prop('disabled', true); // Not working

            const variantId = btn.data('variantId');
            
            // Loading message
            btn.text('Please wait...')

            // Add product into cart
            cart.addItem(variantId).then(state => {
                btn.text('Added in cart');

                // Notify cart count in Header
                $('#cart-notify').text(state.item_count);
            });
        });
    }

});