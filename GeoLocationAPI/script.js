navigator.geolocation.getCurrentPosition(
    function (position) {
        console.log(position);
        const latitude = 46.2358379;
        const longitude = -63.131407;
        console.log(`https://www.google.com/maps/@${latitude},${longitude}`);
    },
    function () {
        alert("Could not get position.")
    }
);

