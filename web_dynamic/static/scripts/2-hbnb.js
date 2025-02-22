$(document).ready(function () {
  // Initialize an empty object to store amenity selections
  const amenitiesSelected = {};

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

    // Truncate with ellipsis if too long (as shown in screenshots)
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
});
