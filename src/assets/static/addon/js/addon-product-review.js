
function fetchProductReview(){
    var productId = $('#review-product-id').val();
    var baseURL = 'https://shopify-theme-addon.appspot.com/_ah/api/ThemeAddonAPI/v1/';
    var getReview = baseURL + 'get_reviews?id=';
    var getReviewApi = getReview + productId;
    fetch(getReviewApi)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            var html = '';
            
            if(data.total_review != 0) {
                for (reviewIndex in data.reviews) {
                    var review = data.reviews[reviewIndex];
                    html += reviewmarkup(review);
                }

                $('#product-review-markup').html(html);

                console.log(data.total_review);
                var starsMarkup = productRatingStars(data.total_review);
                $('#rating-number').html(starsMarkup);
            }
            
        })
        .catch(function(error){
            console.log(error);
        });
}

function openReviewForm(){
    $('#review-form').show();
}

function submitReview(e){
    e.preventDefault();

    var submiteReviewBtn = $('#submit-review-btn');
    var reviewResponse = $('#submit-review-response');

    submiteReviewBtn.text('sending...');
    submiteReviewBtn.prop('disabled',true);

    var name = $('#username');
    var review = $('#review');
    var stars = $('#stars');

    var nameVal = name.val();
    var reviewVal = review.val();
    var starsVal = stars.val();
    var productId = $('#review-product-id').val();

    var baseURL = 'https://shopify-theme-addon.appspot.com/_ah/api/ThemeAddonAPI/v1/';
    var saveReview = baseURL + 'save_review';

    fetch(saveReview, {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            product_id: productId,
            name: nameVal,
            review: reviewVal,
            stars: starsVal
        })
    })
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        submiteReviewBtn.text('Submit');
        submiteReviewBtn.prop('disabled',false);

        name.val('');
        review.val('');
        stars.val('');

        reviewResponse.text(data.message);
    })
    .catch(function(error){
        console.log(error);
    });
}

function selectStarRating(numberOfStars){
    for (var i=1; i <= 5; i++) {
        $('#ssr-' + i).removeClass('ion-ios-star red-star');
        $('#ssr-' + i).addClass('ion-android-star-outline');
    }

    for (var i=1; i <= numberOfStars; i++) {
        $('#ssr-' + i).removeClass('ion-android-star-outline');
        $('#ssr-' + i).addClass('ion-ios-star red-star');
    }

    $('#stars').val(numberOfStars);
}

function productRatingStars(stars){
    var reviewStars = [
                        'ion-android-star-outline',
                        'ion-android-star-outline',
                        'ion-android-star-outline',
                        'ion-android-star-outline',
                        'ion-android-star-outline'
                      ];
    
    for(var i=0; i < stars; i++){
        reviewStars[i] = 'ion-ios-star red-star';
    }
    var html = '<div class="quick-view-rating">';
        html += '    <i class="'+reviewStars[0]+'"></i>';
        html += '    <i class="'+reviewStars[1]+'"></i>';
        html += '    <i class="'+reviewStars[2]+'"></i>';
        html += '    <i class="'+reviewStars[3]+'"></i>';
        html += '    <i class="'+reviewStars[4]+'"></i>';
        html += '</div>';
        html += '<div class="quick-view-number">';
        html += '    <span>'+stars+' Ratting (S)</span>';
        html += '</div>';

    return html;
}

function reviewmarkup(review){
    var reviewStars = [
                        'ion-android-star-outline',
                        'ion-android-star-outline',
                        'ion-android-star-outline',
                        'ion-android-star-outline',
                        'ion-android-star-outline'
                      ];
    
    for(var i=0; i < review.stars; i++){
        reviewStars[i] = 'ion-ios-star red-star';
    }

    var image = $('#blank-image-url').val();
    var html = '<div '; 
        html += '    class="blog-top text-left"';
        html += '    style="margin-top:20px !important;">';
        html += '    <div class="news-allreply">';
        html += '        <img style="width:70px;height:70px" src="'+image+'" alt=""></a>';
        html += '    </div>';
        html += '    <div class="blog-img-details">';
        html += '        <div class="blog-title">';
        html += '            <h3>'+review.name+'</h3>';
        html += '            <div ';
        html += '                class="rating-number"';
        html += '                style="margin-bottom: 8px;">';
        html += '                <div class="quick-view-rating">';
        html += '                    <i class="'+reviewStars[0]+'"></i>';
        html += '                    <i class="'+reviewStars[1]+'"></i>';
        html += '                    <i class="'+reviewStars[2]+'"></i>';
        html += '                    <i class="'+reviewStars[3]+'"></i>';
        html += '                    <i class="'+reviewStars[4]+'"></i>';
        html += '                </div>';
        html += '                <div class="quick-view-number">';
        html += '                    <span>'+review.stars+' Ratting (S)</span>';
        html += '                </div>';
        html += '            </div>';
        html += '        </div>';
        html += '        <p style="width:100%">';
        html +=                 review.review;
        html += '        </p>';
        html += '    </div>';
        html += '</div>';

    return html;
}

$(document).ready(function(){
    fetchProductReview();
});