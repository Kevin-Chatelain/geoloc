let map, userPosition, userArea;
const globalRadius = 40;
let knownAreas = [];


const addNewArea = (lat, lng) => {
    let newArea = L.circle([lat, lng], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: globalRadius
    }).addTo(map);
    knownAreas.push(newArea);
}

const checkNewAreas = (curentLat, curentLng) => {
    if(knownAreas.length === 0) {
        addNewArea(curentLat, curentLng);
    } else {
        let isAlone = true;
        knownAreas.forEach(area => {
            const distance = haversineCalculation(curentLat, curentLng, area.getLatLng().lat, area.getLatLng().lng);
            if(distance <= (globalRadius / 1000)) {
                isAlone = false;
            }
        });

        if(isAlone) {
            addNewArea(curentLat, curentLng);
        }
    }
}

const haversineCalculation = (lat1, lng1, lat2, lng2) => {
    var R = 6371;
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLng = (lng2 - lng1) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}

const initHandling = (position) => {
    map = L.map('map').setView([position.coords.latitude, position.coords.longitude], 40);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    userPosition = L.marker([position.coords.latitude, position.coords.longitude]).addTo(map);
    checkNewAreas(position.coords.latitude, position.coords.longitude);
}

const updateHandling = (position) => {
    const userLat = userPosition.getLatLng().lat;
    const userLng = userPosition.getLatLng().lng;
    const newUserLat = position.coords.latitude;
    const newUserLng = position.coords.longitude;

    if (newUserLat !== userLat && newUserLng !== userLng) {
        userPosition.setLatLng(new L.LatLng(newUserLat, newUserLng));
    }

    checkNewAreas(newUserLat, newUserLng);
}

const positionInit = () => {
    navigator.geolocation.getCurrentPosition(initHandling);
}

const positionUpdate = () => {
    navigator.geolocation.getCurrentPosition(updateHandling)
}

positionInit();
setInterval(() => {
    positionUpdate();
}, 5000);


