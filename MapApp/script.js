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

//global variables
let map;
let mapEvent;
let workout;
let workouts = [];

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
    type = "Running";

    constructor(coords, distance, duration, cadence) {
        super(coords, distance, duration); //from Workout class
        this.cadence = cadence;
        this.calcPace();
        this.setDescription();
    }

    //methods
    calcPace() {
        //min / km
        this.pace = this.duration / this.distance;
        return this.pace;
    }

    setDescription() {
        this.description = `${this.type} on ${this.date.toDateString()}`;
    }
}

class Cycling extends Workout {
    type = "Cycling";

    constructor(coords, distance, duration, elevationGain) {
        super(coords, distance, duration);
        this.elevation = elevationGain;
        this.calcPace();
        this.setDescription();
    }

    //methods
    calcPace() {
        //km / h
        this.pace = this.distance / (this.duration / 60);
        return this.pace;
    }

    setDescription() {
        this.description = `${this.type} on ${this.date.toDateString()}`;
    }
}

//testing classes w' test parameters *TESTED
//const run1 = new Running([39, -12], 5.2, 24, 178);
//const cycling1 = new Cycling([39, -12], 27, 95, 523);
//console.log(run1, cycling1)

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
    const type = inputType.value;
    const distance = Number(inputDistance.value);
    const duration = Number(inputDuration.value);
    const lat = mapEvent.latlng.lat
    const lng = mapEvent.latlng.lng

    if (type === 'running') {
        const cadence = Number(inputCadence.value);

        //validate form data later

        //Create new running object
        workout = new Running([lat, lng], distance, duration, cadence);
    }

    if (type === 'cycling') {
        const elevation = +inputElevation.value;

        //Create new cycling object
        workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    workouts.push(workout);
    //Workout array testing
    console.log(workouts);

    //7.1 Local Storage of Workouts Array
    localStorage.setItem("workouts", JSON.stringify(workouts));

    let html;

    if (type === "running") {
        html = `<li class="workout workout--running" data-id=${workout.id}>
                    <h2 class="workout__title">${workout.description}</h2>
                    <div class="workout__details">
                        <span class="workout__icon">🏃‍♂️</span>
                        <span class="workout__value">${workout.distance}</span>
                        <span class="workout__unit">km</span>
                    </div>
                    <div class="workout__details">
                        <span class="workout__icon">⏱</span>
                        <span class="workout__value">${workout.duration}</span>
                        <span class="workout__unit">min</span>
                    </div>
                    <div class="workout__details">
                        <span class="workout__icon">⚡️</span>
                        <span class="workout__value">${workout.pace}</span>
                        <span class="workout__unit">min/km</span>
                    </div>
                    <div class="workout__details">
                        <span class="workout__icon">🦶🏼</span>
                        <span class="workout__value">${workout.cadence}</span>
                        <span class="workout__unit">spm</span>
                    </div>
                </li>`;
    }

    if (type === "cycling") {
        html = `<li class="workout workout--cycling" data-id=${workout.id}>
                <h2 class="workout__title">${workout.description}</h2>
                <div class="workout__details">
                    <span class="workout__icon">🚴‍♀️</span>
                    <span class="workout__value">${workout.distance}</span>
                    <span class="workout__unit">km</span>
                </div>
                <div class="workout__details">
                    <span class="workout__icon">⏱</span>
                    <span class="workout__value">${workout.duration}</span>
                    <span class="workout__unit">min</span>
                </div>
                <div class="workout__details">
                    <span class="workout__icon">⚡️</span>
                    <span class="workout__value">${workout.pace}</span>
                    <span class="workout__unit">km/h</span>
                </div>
                <div class="workout__details">
                    <span class="workout__icon">⛰</span>
                    <span class="workout__value">${workout.elevation}</span>
                    <span class="workout__unit">m</span>
                </div>
            </li>`;
    }

    form.insertAdjacentHTML("afterend", html);

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
    if (inputType.value == "cycling") { // This code will reset back to running with the correct cadence/elevation options.
        inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
        inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
    }
    form.reset();
});

//Event Listener Toggle form input type change. 

inputType.addEventListener('change', function () {
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
})

containerWorkouts.addEventListener("click", function (e) {
    const workoutEl = e.target.closest(".workout");

    if (!workoutEl) return; // if workout not found then return out of function

    const workout = workouts.find((work) => work.id === workoutEl.dataset.id);

    map.setView(workout.coords, 13, {
        //set the map view to the location of the workout coords
        animate: true,
        pan: {
            duration: 1,
        },
    });
});