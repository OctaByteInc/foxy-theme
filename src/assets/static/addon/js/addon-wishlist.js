
var wishlistProduct = {
    fetch: 'addon-wishlist',
    render: 'addon-wishlist-render',
    btn: 'addon-wishlist-btn'
};

var wishlistSettings = {
    storage: 'addon-wishlist-storage'
};

function bindWishlist() {

    var wishlistBtns = document.getElementsByClassName(wishlistProduct.fetch);
    
    for (btn of wishlistBtns) {

        btn.addEventListener('click', function(){
            this.classList.replace('ion-ios-heart-outline', 'ion-android-done-all');
            
            if (!this.dataset.addedInWishlist) {
                this.dataset.addedInWishlist = true;
                saveWishlistItem(this);                
            }

        });

    }

}

function saveWishlistItem(product){

    var uuid = new Date().getTime();
    var handle = product.dataset.productHandle;
    var image = product.dataset.productImage;
    var title = product.dataset.productTitle;
    var salePrice = product.dataset.productSalePrice;
    var regularPrice = product.dataset.productRegularPrice;

    if ( localStorage.getItem(wishlistSettings.storage) != null ) {

        var wishListStorage = localStorage.getItem(wishlistSettings.storage);
        var wishlist = JSON.parse(wishListStorage);

        wishlist.push({ uuid, handle, image, title, salePrice, regularPrice });

        wishListStorage = JSON.stringify(wishlist);

        localStorage.setItem(wishlistSettings.storage, wishListStorage);

    } else {

        var wishlist = [{ handle, image, title, salePrice, regularPrice }];
        var wishListStorage = JSON.stringify(wishlist);
        
        localStorage.setItem(wishlistSettings.storage, wishListStorage);

    }

}

function deleteWishlistItem(uuid) {

    if ( localStorage.getItem(wishlistSettings.storage) != null ) {

        var wishListStorage = localStorage.getItem(wishlistSettings.storage);
        var wishlist = JSON.parse(wishListStorage);

        var newWishlist = wishlist.filter(function(product){

            if (product.uuid == uuid) {
                var productElement = document.getElementById('wishlist-'+uuid);
                productElement.style.display = 'none';
                return false;
            } else {
                return true;
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
    var html  = '<li id="wishlist-'+product.uuid+'" class="single-product-cart">';
        html +=     '<div class="cart-img">';
        html +=         '<a href="/products/'+product.handle+'"><img src="'+product.image+'"></a>';
        html +=     '</div>';
        html +=     '<div class="cart-title">';
        html +=         '<h3><a href="/products/'+product.handle+'">'+product.title+'</a></h3>';
        html +=         '<span>'+product.salePrice+'</span>';
        html +=         '<del><span style="margin-left: 8px;color: #333;">'+product.regularPrice+'</span></del>';
        html +=     '</div>';
        html +=     '<div class="cart-delete">';
        html +=         '<a href="javascript:void(0)" onclick="deleteWishlistItem('+product.uuid+')"><i class="ion-ios-trash-outline"></i></a>';
        html +=     '</div>';
        html += '</li>';

    return html;
}

// Initalize Addon Wish List
window.onload = function(){

    bindWishlist();

    // Bind wishlist header button for wishlist product rendering
    var wishListBtn = document.getElementById(wishlistProduct.btn);
    wishListBtn.addEventListener('click', function(){
        renderWishlistProduct();
    });

}