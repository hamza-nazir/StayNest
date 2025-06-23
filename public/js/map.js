const mapDiv = document.getElementById('map');
const mapToken = mapDiv.dataset.token;

mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: coordinates,
  zoom: 9
});

const marker1 = new mapboxgl.Marker({color:"red"})
  .setLngLat(coordinates)
  .addTo(map);
console.log(coordinates);