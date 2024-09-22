var map = L.map('map').setView([lat, lon], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Custom green marker icon
const greenIcon = (color) => L.icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',

    iconSize: [25, 41], // size of the icon
    iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
    popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
    shadowSize: [41, 41]  // size of the shadow
});

// Add a marker at the exact location
const marker = L.marker([lat, lon], { icon: greenIcon("red") }).addTo(map);

// Add a light red circle around the marker
const circle = L.circle([lat, lon], {
    color: 'lightcoral', // light red color
    fillColor: 'lightcoral', // fill color
    fillOpacity: 0.5, // transparency of fill color
    radius: 200 // radius in meters
}).addTo(map);

// Optional: Add a popup to the marker with some custom message
marker.bindPopup(`Exact location provided after booking. (${point})`).openPopup();