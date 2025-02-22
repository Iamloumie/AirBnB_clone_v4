$(document).ready(function () {
  // Initialize an empty object to store amenity selections
  const amenitiesSelected = {};

  // Function to fetch places with selected amenities
  function fetchPlaces(amenities = {}) {
    $.ajax({
      url: "http://0.0.0.0:5001/api/v1/places_search/",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        amenities: Object.keys(amenities),
      }),
      success: function (data) {
        // Clear existing places
        $("section.places").find("article").remove();

        // Add new places
        data.forEach(function (place) {
          const article = `
            <article>
              <h2>${place.name}</h2>
              <div class="price_by_night">
                <h3>$${place.price_by_night}</h3>
              </div>
              <div class="information" role="list">
                <div class="max_guest" title="Number of Guests">
                  <h3>${place.max_guest} Guest${place.max_guest !== 1 ? "s" : ""}</h3>
                </div>
                <div class="number_rooms" title="Number of Rooms">
                  <h3>${place.number_rooms} Bedroom${place.number_rooms !== 1 ? "s" : ""}</h3>
                </div>
                <div class="number_bathrooms" title="Number of Bathrooms">
                  <h3>${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? "s" : ""}</h3>
                </div>
              </div>
              <div class="description">
                <p>${place.description}</p>
              </div>
            </article>
          `;
          $("section.places").append(article);
        });
      },
      error: function (xhr, status, error) {
        console.error("Error fetching places:", error);
      },
    });
  }

  // Check API status
  $.ajax({
    url: "http://0.0.0.0:5001/api/v1/status/",
    type: "GET",
    dataType: "json",
    success: function (data) {
      if (data.status === "ok") {
        $("#api_status").addClass("available");
      } else {
        $("#api_status").removeClass("available");
      }
    },
    error: function () {
      $("#api_status").removeClass("available");
    },
  });

  // Listen for changes on checkboxes
  $('div.amenities input[type="checkbox"]').change(function () {
    const id = $(this).attr("data-id");
    const name = $(this).attr("data-name");

    if ($(this).prop("checked")) {
      // Add to selected amenities
      amenitiesSelected[id] = name;
    } else {
      // Remove from selected amenities
      delete amenitiesSelected[id];
    }

    // Update the h4 tag with selected amenities
    let amenitiesList = Object.values(amenitiesSelected).join(", ");

    // Truncate with ellipsis if too long
    if (amenitiesList.length > 30) {
      amenitiesList = amenitiesList.substring(0, 30) + "...";
    }

    // If no amenities selected, show default text
    if (Object.keys(amenitiesSelected).length === 0) {
      $("div.amenities h4").text("Internet, Kitchen...");
    } else {
      $("div.amenities h4").text(amenitiesList);
    }
  });

  // Listen for button click
  $("section.filters button").click(function () {
    fetchPlaces(amenitiesSelected);
  });

  // Initial fetch of places on page load
  fetchPlaces();
});
