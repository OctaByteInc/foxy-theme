
var wishlistProduct = {
    fetch: 'addon-wishlist',
    render: 'addon-wishlist-render'
};

var wishlistSettings = {
    storage: 'addon-wishlist-storage'
};

function bindWishlist() {

    var wishlistBtns = document.getElementsByClassName(wishlistProduct.fetch);

    for (btn of wishlistBtns) {

        btn.addEventlistener('click', function(){
            saveWishlistItem(btn);
        });

    }

}

function saveWishlistItem(product){

    var handle = product.dataset.productHandle;
    var image = product.dataset.productImage;
    var title = product.dataset.productTitle;
    var salePrice = product.dataset.productSalePrice;
    var regularPrice = product.dataset.productRegularPrice;

    if ( localStorage.getItem(wishlistSettings.storage) != null ) {

        var wishListStorage = localStorage.getItem(wishlistSettings.storage);
        var wishlist = JSON.parse(wishListStorage);

        wishlist.push({ handle, image, title, salePrice, regularPrice });

        wishListStorage = JSON.stringify(wishlist);

        localStorage.setItem(wishlistSettings.storage, wishListStorage);

    } else {

        var wishlist = [{ handle, image, title, salePrice, regularPrice }];
        var wishListStorage = JSON.stringify(wishlist);
        
        localStorage.setItem(wishlistSettings.storage, wishListStorage);

    }

}

function deleteWishlistItem(handle) {

    if ( localStorage.getItem(wishlistSettings.storage) != null ) {

        var wishListStorage = localStorage.getItem(wishlistSettings.storage);
        var wishlist = JSON.parse(wishListStorage);

        var newWishlist = wishlist.filter(function(product){

            if (product.handle == handle) {
                return false;
            } else {
                true;
            }

        });

        wishListStorage = JSON.stringify(newWishlist);

        localStorage.setItem(wishlistSettings.storage, wishListStorage);

    } 

}

function renderWishlistProduct() {

    var renderElement = document.getElementById(wishlistProduct.render);

    if ( localStorage.getItem(wishlistSettings.storage) != null ) {

        var html = '';
        var wishListStorage = localStorage.getItem(wishlistSettings.storage);
        var wishlist = JSON.parse(wishListStorage);

        for (product of wishlist) {
            html += singleWishlistProduct(product);
        }

        renderElement.innerHTML = html;
    }
    
}

function singleWishlistProduct(product) {
    var html  = '<li class="single-product-cart">';
        html +=     '<div class="cart-img">';
        html +=         '<a href="/products/'+product.handle+'"><img src="'+product.image+'"></a>';
        html +=     '</div>';
        html +=     '<div class="cart-title">';
        html +=         '<h3><a href="/products/'+product.handle+'">'+product.title+'</a></h3>';
        html +=         '<span>'+product.salePrice+'</span>';
        html +=         '<span>'+product.regularPrice+'</span>';
        html +=     '</div>';
        html +=     '<div class="cart-delete">';
        html +=         '<a href="javascript:void(0)" onclick="deleteWishlistItem('+product.handle+')"><i class="ion-ios-trash-outline"></i></a>';
        html +=     '</div>';
        html += '</li>';

    return html;
}