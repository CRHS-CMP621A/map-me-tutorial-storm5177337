'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

let map;
let mapEvent; //global variables

//Classes
class Workout { //parent class
    date = new Date(); //Need's to be fixed!!!
    id = (Date.now() + '').slice(-10);

    constructor(coords, distance, duration) {
        this.coords = coords; // [lat, lng]
        this.distance = distance; //in km
        this.duration = duration; //in mins
    }
}

//child classes of Workout class
class Running extends Workout {
    constructor(coords, distance, duration, cadence) {
        super(coords, distance, duration); //from Workout class
        this.cadence = cadence;
    }
}

class Cycling extends Workout {
    constructor(coords, distance, duration, elevationGain) {
        super(coords, distance, duration);
        this.elevation = elevationGain;
    }
}

//testing classes w' test parameters
const run1 = new Running([39, -12], 5.2, 24, 178);
const cycling1 = new Cycling([39, -12], 27, 95, 523);
console.log(run1, cycling1)

//navigator code

navigator.geolocation.getCurrentPosition(
    function (position) {
        console.log(position);
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

        const coords = [latitude, longitude]
        map = L.map('map').setView(coords, 13);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.marker(coords).addTo(map)
            .bindPopup('A pretty CSS popup.<br> Easily customizable.')
            .openPopup();
        //console.log(map)
        map.on('click', function (mapE) {
            mapEvent = mapE;

            form.classList.remove('hidden');
            inputDistance.focus();
        })
    },
    function () {
        alert("Could not get position.")
    }
);

// form event listener to check if submitted/completed
form.addEventListener('submit', function (e) {
    e.preventDefault()
    // code for adding map marker...
    const lat = mapEvent.latlng.lat
    const lng = mapEvent.latlng.lng
    L.marker([lat, lng]).addTo(map)
        .bindPopup(L.popup({
            maxWidth: 250,
            minWidth: 100,
            autoClose: false,
            closeOnClick: false,
            className: 'running-popup',
        }))
        .setPopupContent('Workout')
        .openPopup();

    form.reset();
});

//Event Listener Toggle form input type change. 

inputType.addEventListener('change', function () {
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
})