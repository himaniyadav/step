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