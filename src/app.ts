import axios from "axios";

const form = document.querySelector("form")!;
const addressInput = document.querySelector("#address")! as HTMLInputElement;
// REMEMBER: only 300$ free yearly from google
const API_KEY = "enter your api key here";

// otherwise google is "unkown" to typescript
// comes from the google script imported in the html file
declare var google: any;

// print reponse from api request
// to find lat and lng of address:
// unfold data -> results -> geometry -> location
// read about all status codes here:
// https://developers.google.com/maps/documentation/geocoding/intro#GeocodingResponses
type GoogleGeocodingResponse = {
  results: { geometry: { location: { lat: number; lng: number } } }[];
  status: "OK" | "ZERO_RESULTS";
};

function searchAddressHandler(event: Event) {
  event.preventDefault();
  const enteredAddress = addressInput.value; // forward this to google

  axios
    .get<GoogleGeocodingResponse>(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
        enteredAddress
      )}&key=${API_KEY}`
    )
    .then((response) => {
      // takes index 0 because the first suggestions is usually the best one
      if (response.data.status !== "OK") {
        throw new Error("Could not fetch location!");
      }
      const coordinates = response.data.results[0].geometry.location;
      const map = new google.maps.Map(document.getElementById("map"), {
        center: coordinates,
        zoom: 8,
      });

      new google.maps.Marker({ position: coordinates, map: map });
    })
    .catch((error) => {
      alert(error.message);
      console.log(error);
    });
}

form?.addEventListener("submit", searchAddressHandler);
