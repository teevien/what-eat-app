const zomatoURL = 'https://developers.zomato.com/api/v2.1';
const app = {
    locationsURL: zomatoURL + '/locations',
    cuisinesURL: zomatoURL + '/cuisines',
    restaurantURL: zomatoURL + '/search',
    key: '96da6937114a6901ec154be1338c5427'
};


app.locationForm = function() {
    $('.search-city__submit').on('click', function(e) {
        e.preventDefault();
        app.userInput = $('#userInput').val();
        if (app.userInput === '') {
            alert('please enter city');
        } else {
        console.log(app.userInput);
        app.getLocation(app.userInput);
        }; 
        $('html,body').animate({
        scrollTop: $("#cuisine").offset().top},
        'slow');
    });
};


app.getLocation = function (userInput) {
    if (userInput) {
        return $.ajax({
            method: 'GET',
            url: app.locationsURL,
            dataType: 'json',
            headers: {
                'user-key': app.key
            },
            data: {
                query: userInput
            },
        }).then((res) =>{ 
            console.log('location info', res);
            // $('#displayCity').text(userInput);
            app.cityId = res.location_suggestions[0].city_id;
            app.entityId = res.location_suggestions[0].entity_id;
            app.entityType = res.location_suggestions[0].entity_type;
            app.getCuisines(app.cityId);
            console.log('city id', app.cityId);
        });
    };
};

app.getCuisines = function(cityId) {
    return $.ajax({
        method: 'GET',
        url: app.cuisinesURL,
        dataType: 'json',
        headers: {
            'user-key': app.key
        },
        data: {
            city_id: cityId
        },
    }).then((res) => {
        console.log('cuisines', res);
        app.cuisinesArray = res.cuisines;
        console.log(app.cuisinesArray);
        app.displayCuisines(app.cuisinesArray);
    });
};

app.displayCuisines = function (cuisinesArray) {
    if (cuisinesArray) {
        cuisinesArray.forEach((cuisine) => {
            $('#cuisine-select').append(`<option value="${cuisine.cuisine.cuisine_id}">${cuisine.cuisine.cuisine_name}</option>`);
        }); 
    };
};

app.cuisineForm = function() {
    $('#cuisine-submit').on('click', function(e) {
        e.preventDefault();
        var selector = document.getElementById('cuisine-select');
        app.cuisineId = selector[selector.selectedIndex].value;
        app.getRestaurant(app.cuisineId);
        console.log(app.cuisineId);
        $('html,body').animate({
        scrollTop: $("#results").offset().top},
        'slow');
    });
};


app.getRestaurant = function (cuisineId) {
    if (cuisineId) {
       return $.ajax({
            method: 'GET',
            url: app.restaurantURL,
            dataType: 'json',
            headers: {
                'user-key': app.key
            },
            data: {
                cuisines: app.cuisineId,
                entity_id: app.entityId,
                entity_type: app.entityType
            }
        }).then((res) => {
            console.log('restaurants', res.restaurants);
            app.restaurantsArray = res.restaurants;
            app.displayRestaurants(app.restaurantsArray);
            app.tryAgain(app.cuisineId);
        });
    };
};

app.displayRestaurants = function(restaurantsArray) {
    if(restaurantsArray) {
        const restaurant = restaurantsArray[Math.floor(Math.random() * restaurantsArray.length)];
        console.log(typeof restaurant.restaurant.featured_image);
        if (restaurant.restaurant.featured_image) {
            $('#results__restaurants').append(`
            <div class="results__restaurants__img-container">
                <a href="${restaurant.restaurant.url}" target="_blank"><img src="${restaurant.restaurant.featured_image}"></a>


                <div class="results__restaurants__content">
                    <h2>${restaurant.restaurant.name}</h2>
                    <p>${restaurant.restaurant.location.address}</p>
                </div> 
            </div>
            `);
        } else if (restaurant.restaurant.featured_image === ''){
              $('#results__restaurants').append(`
            <div class="results__restaurants__img-container">
                <a href="${restaurant.restaurant.url}" target="_blank"><img src="assets/img1.jpg"></a>


                <div class="results__restaurants__content">
                    <h2>${restaurant.restaurant.name}</h2>
                    <p>${restaurant.restaurant.location.address}</p>
                </div> 
            </div>
            `);
        }
    };
};


app.tryAgain = function (cuisineId) {
    $('#searchAgain').on('click', function (e) {
        e.preventDefault();
        const restDetails = app.getRestaurant(cuisineId);
        console.log(restDetails);
        app.displayRestaurants(restDetails);
    });
};

app.newSearch = function () {
    $('.results__form__new-search').on('submit', function(e) {
        console.log('new search');
        // return true;
    });
};

// 2. create init function
app.init = function() {
    app.locationForm();
    app.getLocation();
    app.getCuisines();
    app.displayCuisines();
    app.cuisineForm();
    app.getRestaurant();
    app.displayRestaurants();
    app.tryAgain();
    app.newSearch();
};

// 1. document ready
$(function () {
    app.init();
    console.log('ready');
});