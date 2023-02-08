import axios  from "axios"; 
require('dotenv').config();

const form = document.querySelector('form')! as HTMLFormElement;

const addressInput = document.getElementById('address')! as HTMLInputElement;

const API_KEY = process.env.GOOGLE_API_KEY;

type GoogleGeocodingResponse = {
    results: { geometry: { location: { lat: number; lng: number } } }[];
    status: 'OK' | 'ZERO_RESULTS';
};

function searchAddressHandler(event: Event) {
  event.preventDefault();
  
  const enteredAddress = addressInput.value;

  axios.get<GoogleGeocodingResponse> 
  (`https://maps.googleapis.com/maps/api/geocode/json?address=${enteredAddress}&key=${API_KEY}`)
    .then(response => {
        console.log(response.data);

        if (response.data.status !== 'OK') {
            throw new Error('Could not fetch location!');
        }

        const coordinates = response.data.results[0].geometry.location;

        const map = new google.maps.Map(document.getElementById('map')!, {
            center: coordinates,
            zoom: 16
        });

        new google.maps.Marker({ position: coordinates, map: map });




        
    })
    .catch(err => {
        console.log(err);
    });
  

  // send this to Google's API!
}

form.addEventListener('submit', searchAddressHandler);