const zomatoURL = 'https://developers.zomato.com/api/v2.1';
const app = {
    locationsURL: zomatoURL + '/locations',
    cuisinesURL: zomatoURL + '/cuisines',
    restaurantURL: zomatoURL + '/search',
    key: '96da6937114a6901ec154be1338c5427'
};


app.locationForm = function() {
    $('.search').on('click', function(e) {
        e.preventDefault();
        app.userInput = $('#userInput').val();
        if (app.userInput === '') {
            alert('please enter city');
        } else {
        console.log(app.userInput);
        app.getLocation(app.userInput);
        };
    });
};


app.getLocation = function (userInput) {
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
        $('#displayCity').text(userInput);
        app.cityId = res.location_suggestions[0].city_id;
        app.entityId = res.location_suggestions[0].entity_id;
        app.entityType = res.location_suggestions[0].entity_type;
        app.getCuisines(app.cityId);
        console.log('city id', app.cityId);
    });
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
            $('#cuisineList').append(`<option value="${cuisine.cuisine.cuisine_id}">${cuisine.cuisine.cuisine_name}</option>`);
        }); 
    };
};

app.cuisineForm = function() {
    $('#submitCuisine').on('click', function(e) {
        e.preventDefault();
        var selector = document.getElementById('cuisineList');
        app.cuisineId = selector[selector.selectedIndex].value;
        app.getRestaurant(app.cuisineId);
        console.log(app.cuisineId);
    });
};


app.getRestaurant = function () {
    $.ajax({
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
    });
};

app.displayRestaurants = function (restaurantsArray) {
    if(restaurantsArray) {
        const restaurant = restaurantsArray[Math.floor(Math.random() * restaurantsArray.length)];
        console.log(restaurant);
        $('#restaurantName').append(`<div class="rest-content">
            <h2>${restaurant.restaurant.name}</h2>
            <p>${restaurant.restaurant.location.address}</p>
            <p><a href="${restaurant.restaurant.url}">Visit on Zomato</a></p>
        </div>
        <div class="img-container">
            <img src="${restaurant.restaurant.featured_image}">
        </div>
        `);
    }
    // if (restaurantsArray) {
    //     const restaurant = restaurantsArray[Math.floor(Math.random() * restaurantsArray.length)];
    //     $('#restaurantName').append(`
    //     <div class="rest-content>
    //         <h2>${restaurant.restaurant.name}</h2>
    //         <p>${restaurant.restaurant.location.address}</p>
    //         <p>Rating: ${restaurant.restaurant.user_rating.rating_text}</p>
    //         <p>Average Cost (for 2): ${restaurant.restaurant.average_cost_for_two}</p>
    //         <p><a href="${restaurant.restaurant.url}">Visit on Zomato</a></p>
    //     </div>
    //     <div class="img-container">
    //         <img src="${restaurant.restaurant.featured_image}">
    //     </div>`);
    // }
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
};

// 1. document ready
$(function () {
    app.init();
    console.log('ready');
});