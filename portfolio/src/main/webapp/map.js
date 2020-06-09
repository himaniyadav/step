// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/*
 * Display map when page loads.
 */
window.addEventListener('load', createMap);

/** 
 * Creates a map and adds it to the page. 
 */
function createMap() {
  const map = new google.maps.Map(
      document.getElementById('map'),
      {center: {lat: 36.9, lng: -76.66}, zoom: 5.2}); 

  // add hardcoded markers to visualize where each gallery image was taken
  addImageLandmark(
      map, 33.9467697, -83.3755391, 'UGA Science Library',
      'The UGA Science Library, affectionately known as the Sci Li.')
  addImageLandmark(
      map, 33.9464951, -83.3772612, 'Myers Quad',
      'Myers Quad aka the best place on campus!')
  addImageLandmark(
      map, 34.647210, -83.719380, 'Yonah Mountain',
      'Yonah Mountain in Georgia.');
  addImageLandmark(
      map, 31.9857085, -81.0306078, 'UGA Marine Center',
      'UGA Marine Center on Skidaway Island in Savannah, Georgia.');
  addImageLandmark(
      map, 40.713050, -74.007230, 'The Met',
      'The Metropolitan Museum of Art in NYC.');
  addImageLandmark(
      map, 51.5033273, -0.1217317, 'London Eye',
      'The London Eye by the Thames.');
  addImageLandmark(
      map, 51.514510, -0.098420, 'St. Pauls Cathedral',
      'St Paul\'s Cathedral in London.');
  addImageLandmark(
      map, 50.6661297, -4.7590606, 'Tintagel, Cornwall',
      'The coast at Tintagel, Cornwall');
  addImageLandmark(
      map, 51.752776, -1.253692, 'Oxford, England',
      'The view of Oxford from atop the University Church of St Mary the Virgin.');
  addImageLandmark(
      map, 51.1462534, -2.7157123, 'King Arthur\s Tomb',
      'Glastonbury Abbey by King Arthur\'s Tomb.');
  addImageLandmark(
      map, 48.8594193, 2.3004549, 'Eiffel Tower',
      'A side street near the Eiffel Tower.');
  addImageLandmark(
      map, 48.8552017, 2.3150708, 'Rodin Museum',
      'The Thinker Statue at the Rodin Museum in Paris.');
  addImageLandmark(
      map, 48.8322871, 2.3846624, 'Paris Shops',
      'Outdoor shop in Paris.');
  addImageLandmark(
    map, 41.2465819,1.8223518, 'Sitges, Spain',
    'Near our stay in Sitges, Spain.');
  addImageLandmark(
    map, 52.3668475, 4.891357, 'Floating Flower Market',
    'The floating flower market in Amsterdam.');
  addImageLandmark(
    map, 52.3773409, 4.8987192, 'Basilica in Amsterdam',
    'By the canals with a view of the Basilica in Central Amsterdam.');
}

/** 
 * Adds a marker that shows an info window when clicked.
 * Represents a place pictured in the image gallery.
 */
function addImageLandmark(map, lat, lng, title, description) {
  const marker = new google.maps.Marker(
      {position: {lat: lat, lng: lng}, map: map, title: title});

  const infoWindow = new google.maps.InfoWindow({content: description});
  marker.addListener('click', () => {
    infoWindow.open(map, marker);
  });
}