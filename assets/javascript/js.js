//-----------Global Variables------------------//

let allergies = [];
let dietFilter = '';
let mealIndex = -1;
let printmealIndex = -1;
const meal = ['Appetizer', 'Main Course', 'Dessert'];
let printmeals = [];
let offset = Math.floor(Math.random() * 300);
var city = $("#city").val();
var country = "";
var eventCityNoSpace

  
  $("#search").on("click", function() {
      $("#events").removeClass("is-invisible");
      formCheck();
      searchClicked();
  });

  function formCheck() {
        var noCity = $('#city').val();
        if (noCity == '') {
            event.preventDefault();
            $('#error').text('*Please enter a city*');
        }
    };
  
  function searchClicked() {  
      city = $("#city").val().trim();
      eventCityNoSpace = city.replace(" ", "+")
      eventful();
  }


  function eventful() {
      $("#eventsRows").empty();
      var eventfulURL

      if (city != "") {
          eventfulURL = "https://api.eventful.com/json/events/search?app_key=89mqxRzVfPpkNpLh&location=" + eventCityNoSpace + "&within=20&date=today&sort_order=popularity";
          $('#error').empty();
      }

      $.ajax ({
          url: eventfulURL,
          dataType: "jsonp",
          method: "GET",
      }).then(function(response) {
          if (response.total_items < 1) {
              var event = $("<tr>)");
              event.text("No events found")
              event.appendTo($("#eventsRows"));
          }
          else {
              for (e = 0; e < response.events.event.length; e++) {
                  var event = $("<tr>");

                  var eventPlaying = $("<td>");
                  eventPlaying.text()
                  eventPlaying.text(response.events.event[e].title)

                  var eventCity = $("<td>");
                  eventCity.text(response.events.event[e].city_name + ", " + response.events.event[e].region_abbr + ", " + response.events.event[e].country_abbr)
                  country = response.events.event[e].country_name

                  var eventAddress = $("<td>");
                  eventAddress.text(response.events.event[e].venue_name)

                  var eventDate = $("<td>");
                  eventDate.text(response.events.event[e].start_time)
                  
                  event.append(eventPlaying, eventAddress, eventCity, eventDate)
                  event.appendTo($("#eventsRows"));
              }
          }
      });
  }

function setHeader(xhr) {
        xhr.setRequestHeader('X-Mashape-Key', 'cALLqoH7nVmsh32vwy7ZLWc3GiiTp10kvtQjsnw7sUC1nviRD8');
      }

function getRecipesForNight() { 
//Get general recipe data for the night's menu
  $.ajax({
    url: `https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/searchComplex?diet=${dietFilter}&addRecipeInformation=false&number=3&offset=${offset}&instructionsRequired=true&limitLicense=false&type=main+course`,
      type: 'GET',
      dataType: 'json',
      success: function (result) { displayRecipesForNight(result) },
      beforeSend: setHeader
      });
  };


function getRecipeForMeal(meal, query) { 
  $.ajax({
    url: `https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/searchComplex?query=${query}&diet=${dietFilter}&addRecipeInformation=false&number=1&offset=${offset}&instructionsRequired=true&limitLicense=false&type=main+course`,
      type: 'GET',
      dataType: 'json',
      success: function (result) { displayRecipeForMeal(result, meal) },
      beforeSend: setHeader
      });
  };


function getRecipeInfo(id, meal) { 
//Get instructions, ingredient and source info for specific recipes found by previous searches
  $.ajax({
    url: `https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/${id}/information`,
      type: 'GET',
      dataType: 'json',
      success: function (result) { renderRecipeInfo(result) },
      beforeSend: setHeader
      });
}

function getRecipeInfoForNight(ids) {
    return $.ajax({
    url: `https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/informationBulk?ids=${ids}`,
      type: 'GET',
      dataType: 'json',
      beforeSend: setHeader
      })
}

//---------Menu Cards----------------------------//


function displayRecipesForNight(data) {
//render menu
  const results = data.results.map((item, index) => renderMenu(offset, item));
  $('.js-search-results').html(results);
}

function renderMenu(offset, result) {
  mealIndex++
  let html = `
  <div class="col-4"> 
    <span class="meal-title">${meal[mealIndex]}</span>
    <div id="${meal[mealIndex]}Card" class="recipe-card">
      <h3 id="recipe-title" class="recipe-title">${result.title}</h3>
      <button id="js-view-recipe-btn-${meal[mealIndex]}" class="js-view-recipe-btn controls-button" data-recipe-id="${result.id}" data-meal="${meal[mealIndex]}">
          <img id="card-image" class="card-image" src="${result.image}" alt="${result.title} image">
        <br><div class="view-recipe-div">View Recipe</div>
      </button>
    </div>
    <form class="ingredient-form">
      <input id="search-by-ingredient${meal[mealIndex]}" class="search-by-ingredient" type="search" name="search-by-ingredient" placeholer="Search By Ingredient">
      <button title="Search For Recipes By Ingredient" class="search-by-ingredient-btn controls-button" data-meal="${meal[mealIndex]}">Search</button>
    </form>
    <div class="recipe-controls">
      <button title="View Previous Recipe Option" class="js-previous-result-btn controls-button previous" data-meal="${meal[mealIndex]}" aria-live="assertive">
      <i class="fas fa-chevron-circle-left"></i></button>
      <button title="View Next Recipe Option" class="js-next-result-btn controls-button next" data-meal="${meal[mealIndex]}">
      <i class="fas fa-chevron-circle-right"></i></button>
    </div>
    <section role="region" id="recipeModal${meal[mealIndex]}" class="modal" aria-live="assertive" hidden>
      <div class="modal-content">  
      </div>
    </section>
  </div>
  `
  return html
  
}

function displayRecipeForMeal(data, meal) {
//Render new meal card when user clicks next, previous or search
  let mealCard = `${meal}`
  if (data.results.length > 0) {
    const results = data.results.map((item, meal, index) => rendermealCard(item, mealCard));
    $(`#${meal}Card`).html(results);
  }
}

function rendermealCard(result, meal) {  
//Replace card image and recipe title for meal with new results
  let html = `
      <h3 class="recipe-title">${result.title}</h3>
      <button id="js-view-recipe-btn-${meal}" class="js-view-recipe-btn controls-button" data-recipe-id="${result.id}" data-meal="${meal}">
        <img id="card-image${meal}" class="card-image" src="${result.image}" alt="${result.title}">
        <div class="view-recipe-div">View Recipe</div>
      </button>`
 offset += 7 //increase the offset to provide variety in results
 return html
}

//---------Modal Content-------------------------//

function renderRecipeInfo(result) {
//Render source, ingredients list and instructions to modal content
  $('.modal-content').html(renderModalContent(result));
  appendIngredients(result);
  appendSourceName(result);
  appendInstructions(result);
}

function appendInstructions(result) {
  for (let x = 0; x < result.analyzedInstructions.length; x++) {
  //for each array of steps in the analyzed instruction array, render a list item for each step
    for (let y = 0; y < result.analyzedInstructions[x].steps.length; y++) {
      if ((result.analyzedInstructions[x].steps[y].step).length > 1) { 
      $(`.recipe-instructions`).append(`<li>${result.analyzedInstructions[x].steps[y].step}</li>`)
      }
    }
  }
}

function appendIngredients(result) {
  for (let i = 0; i < result.extendedIngredients.length; i++) {
  //for each ingredient in array, render a list item with the amount, unit and the ingredient
    let amount = result.extendedIngredients[i].amount;
    let unit = result.extendedIngredients[i].unit;
    let ingredient = result.extendedIngredients[i].name;
    $(`.recipe-ingredients`).append(`<li>${amount} ${unit} - ${ingredient}</li>`);
  }
}

function appendSourceName(result) {
//credit the source of the recipe
  let sourceName = result.sourceName;
  if (sourceName == null) {
    sourceName = 'Visit Source'
  }
  $('.credit').append(`<a title="Go to Source" href="${result.sourceUrl}" target="_blank">Credit: ${sourceName}</a>`);
}

function renderModalContent(result) {
//Modal content HTML
  return `<span class="close">&times;</span>
    <h3 id="recipe-title">${result.title}</h3>
    <p>Ready in: ${result.readyInMinutes} minutes</p>
    <img id="card-image" class="modal-card-image" src="${result.image}" alt="${result.title} image">
    <div class="ingredient-container">
      <span class="modal-section-title">Ingredients:</span><br>
      <ul class="recipe-ingredients">
      </ul>
    </div>  
    <div class="instructions-container">
      <span class="modal-section-title">Directions:</span>
      <ol class="recipe-instructions">
      </ol>
    </div>
    <span class="credit"></span><br>
    <button class="close-modal-btn controls-button">Close</button>`  
}


//------------User Actions-------------------------//
//User clicks and submits trigger the following functions

function watchBeginClick() {
//Hide intro, display the select diet section
  $('.js-begin-btn').click(event => {
    event.preventDefault();
    $('.js-select-diet').prop('hidden', false);
    $('.js-intro').prop('hidden', true);
    });
}

function watchMenuSubmit() {
//Update global variables and get the recipes for the night
  $('.js-select-diet').submit(event => {
    event.preventDefault();
    $('.js-output').prop('hidden', false);
    $('.js-menu-controls').prop('hidden', false);
    $('.js-select-diet').prop('hidden', true);
    getRecipesForNight();
  });
}

function watchViewRecipeClick() {
//Open modal by clicking "View Recipe". Use the recipe id to get the info for modal content. (Not Working)
  $('.js-output').on('click', '.js-view-recipe-btn', function(event) {
    event.preventDefault();
    let meal = $(this).data('meal');
    $(`#recipeModal${meal}`).prop('hidden', false);
    let recipeId = $(this).data('recipe-id');
    getRecipeInfo(recipeId, meal);
  });
}

function watchSearchByIngredientClick() {
//Search for an ingredient to update the meal card's recipe
  $('.js-output').on('click', '.search-by-ingredient-btn', function(event) {
  event.preventDefault();
  let meal = $(this).data('meal');
  let ingredient = $(`#search-by-ingredient${meal}`).val();
  offset = Math.floor(Math.random() * 100) //Randomized result to provide variety
  getRecipeForMeal(meal, ingredient);
  })
}

function watchNextResultClick() {
//Get the next recipe. If user has a search term submitted, apply the ingredient in the search
  $('.js-output').on('click', '.js-next-result-btn', function(event) {
  event.preventDefault();
  let meal = $(this).data('meal');
  let ingredient = $(`#search-by-ingredient${meal}`).val();
  getRecipeForMeal(meal, ingredient);
  })
}

function watchPreviousResultClick() {
//Click on previous button to see last result, or the result further back in recipe index
  $('.js-output').on('click', '.js-previous-result-btn', function(event) {
  event.preventDefault();
  let meal = $(this).data('meal');
  let ingredient = $(`#search-by-ingredient${meal}`).val();
  offset -= 3; //Subtract 3 from the offset to provide variety in results
  getRecipeForMeal(meal, ingredient);
  })
}

function handleMenuGenerator() { 
  watchBeginClick();
  watchMenuSubmit();
  watchViewRecipeClick();
  watchSearchByIngredientClick();
  watchNextResultClick();
  watchPreviousResultClick();
}
$(handleMenuGenerator);