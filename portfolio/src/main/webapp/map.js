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

const icons = {
  image: {
    name: 'Image Locations',
    icon: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_red.png'
  },
  place: {
    name: 'Places To Go',
    icon: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_green.png'
  },
  user: {
    name: 'User Submitted',
    icon: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_purple.png'
  },
};

const DELETE_MARKER_WARNING = 'Are you sure you want to delete this marker?';
const DELETE_MARKER_FAIL = `You can't delete a marker that's not yours!`;

let map;

/** 
 * Creates a map and adds it to the page. 
 */
function createMap() {
  map = new google.maps.Map(
      document.getElementById('map'),
      {center: {lat: 36.9, lng: -76.66}, zoom: 5.2}); 
  
  // Add hardcoded markers to visualize where each gallery image was taken.
  addImageLandmark( 
      33.9467697, -83.3755391, 
      'UGA Science Library',
      'The UGA Science Library, affectionately known as the Sci Li.'
  );
  addImageLandmark(
      33.9464951, -83.3772612, 
      'Myers Quad',
      'Myers Quad aka the best place on campus!'
  );
  addImageLandmark(
      34.647210, -83.719380, 
      'Yonah Mountain',
      'Yonah Mountain in Georgia.'
  );
  addImageLandmark(
      31.9857085, -81.0306078, 
      'UGA Marine Center',
      'UGA Marine Center on Skidaway Island in Savannah, Georgia.'
  );
  addImageLandmark(
      40.713050, -74.007230, 
      'The Met',
      'The Metropolitan Museum of Art in NYC.'
  );
  addImageLandmark(
      51.5033273, -0.1217317, 
      'London Eye',
      'The London Eye by the Thames.'
  );
  addImageLandmark(
      51.514510, -0.098420, 
      'St. Pauls Cathedral',
      'St Paul\'s Cathedral in London.'
  );
  addImageLandmark(
      50.6661297, -4.7590606, 
      'Tintagel, Cornwall',
      'The coast at Tintagel, Cornwall'
  );
  addImageLandmark(
      51.752776, 1.253692, 
      'Oxford, England',
      'The view of Oxford from atop the University Church ' + 
      'of St Mary the Virgin.'
  );
  addImageLandmark(
      51.1462534, -2.7157123, 
      'King Arthur\s Tomb',
      'Glastonbury Abbey by King Arthur\'s Tomb.'
  );
  addImageLandmark(
      48.8594193, 2.3004549, 
      'Eiffel Tower',
      'A side street near the Eiffel Tower.'
  );
  addImageLandmark(
      48.8552017, 2.3150708, 
      'Rodin Museum',
      'The Thinker Statue at the Rodin Museum in Paris.'
  );
  addImageLandmark(
      48.8322871, 2.3846624,
      'Paris Shops',
      'Outdoor shop in Paris.'
  );
  addImageLandmark(
      41.2465819,1.8223518, 
      'Sitges, Spain',
      'Near our stay in Sitges, Spain.'
  );
  addImageLandmark(
      52.3668475, 4.891357, 
      'Floating Flower Market',
      'The floating flower market in Amsterdam.'
  );
  addImageLandmark(
      52.3773409, 4.8987192, 
      'Basilica in Amsterdam',
      'By the canals with a view of the Basilica in Central Amsterdam.'
  );

  // Add additional hardcoded markers with places I want to visit someday.
  addPlaceMarker(
      31.6003468, -8.0824187, 
      'Marrakesh',
      'Though my last spring break trip to Morocco was cancelled, ' +
      'I hope I can go again next spring.'
  );
  addPlaceMarker(
      -13.1632509, -72.5452093, 
      'Machu Picchu',
      'Seeing Machu Picchu is on my bucket list. ' + 
      'Visiting Peru would be so cool!'
  );
  addPlaceMarker(
      -8.5525233, 114.8082374, 
      'Bali, Indonesia',
      'I would love to visit Bali one day!'
  );
  addPlaceMarker(
      26.4474128, 80.198301, 
      'Kanpur, India',
      'My extended family lives in India - I haven\'t visited in a while!'
  );
  addPlaceMarker(
      37.4220041, -122.0862462, 
      'Googleplex Mountain View',
      'I\'ve never seen Google\'s Mountain View HQ before.'
  );
  addPlaceMarker(
      40.4571004, -79.9171171, 
      'Google Pittsburgh Office',
      'My current team is based in Pittsburgh. I\'d love to visit Google PIT!'
  );

  fetchMarkers();

  // Create and display legend of icons.
  let legend = document.getElementById('legend');
  for (var key in icons) {
    let type = icons[key];
    let name = type.name;
    let icon = type.icon;
    let div = document.createElement('div');
    div.innerHTML = '<img src="' + icon + '"> ' + name;
    legend.appendChild(div);
  }
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
}

/** 
 * Adds a marker that shows an info window when clicked.
 * Represents a place pictured in the image gallery.
 */
function addImageLandmark(lat, lng, title, description) {
  const marker = new google.maps.Marker(
      {position: {lat: lat, lng: lng}, map: map, title: title});

  const infoWindow = new google.maps.InfoWindow({content: description});
  marker.addListener('click', () => {
    infoWindow.open(map, marker);
  });
}

/** 
 * Adds a marker that shows an info window when clicked.
 * Represents a place I have not yet visited.
 */
function addPlaceMarker(lat, lng, title, description) {
  const marker = new google.maps.Marker({
    position: {lat: lat, lng: lng}, 
    map: map, 
    title: title,
    icon: icons.place.icon
  });

  const infoWindow = new google.maps.InfoWindow({content: description});
  marker.addListener('click', () => {
    infoWindow.open(map, marker);
  });
}

/**
 * Gets markers from the datastore and adds them to the map.
 */
function fetchMarkers() {
  fetch('/markers')
  .then(response => response.json())
  .then((markers) => {
    // markers is an array of JSON objects
    markers.forEach((marker) => {
        addUserMarker(marker.lat, marker.lng, marker.content, marker.id, marker.email);
    });
  });
}

/**
 * Adds a marker that shows an info window.
 * Represents a user-submitted marker.
 */
function addUserMarker(lat, lng, description, id, email) {
  const marker = new google.maps.Marker({
    position: {lat: lat, lng: lng}, 
    map: map,
    icon: icons.user.icon
  });

  const infoWindow = new google.maps.InfoWindow(
    {content: buildMarkerInfoWindow(marker, description, id, email)});
  
  marker.addListener('click', () => {
    infoWindow.open(map, marker);
  });
}

let editableMarker;
/** 
 * Creates a marker that shows a textbox the user can edit. 
 */
function addEditMarker(event) {
  let lat = event.latLng.lat();
  let lng = event.latLng.lng();

  // If we're already showing an editable marker, then remove it.
  if (editableMarker) {
    editableMarker.setMap(null);
  }

  editableMarker = new google.maps.Marker({
    position: {lat: lat, lng: lng}, 
    map: map,
    icon: icons.user.icon
  });

  const infoWindow = new google.maps.InfoWindow(
    {content: buildInputInfoWindow(lat, lng)});

  // When the user closes the editable info window, remove the marker.
  google.maps.event.addListener(infoWindow, 'closeclick', () => {
    editableMarker.setMap(null);
  });

  infoWindow.open(map, editableMarker);
}

/**
 * Builds HTML elements that show the marker description and a delete
 * button to go in the info window.
 */
function buildMarkerInfoWindow(marker, description, id, email) {
  const text = document.createElement('span');
  text.innerText = description;

  const deleteButton = document.createElement('button');
  deleteButton.appendChild(document.createTextNode('Delete'));

  deleteButton.onclick = () => {
    deleteMarker(marker, id, email);
  };

  const containerDiv = document.createElement('div');
  containerDiv.appendChild(text);
  containerDiv.appendChild(document.createElement('br'));
  containerDiv.appendChild(deleteButton);

  return containerDiv;
}

/**
 * Builds HTML elements that show an editable textbox and a submit
 * button to go in the info window.
 */
function buildInputInfoWindow(lat, lng) {
  const textBox = document.createElement('textarea');
  textBox.placeholder = 'Add a description...';

  const submit = document.createElement('button');
  submit.appendChild(document.createTextNode('Submit'));

  submit.onclick = () => {
    postMarker(lat, lng, textBox.value);
    editableMarker.setMap(null);
  };

  const containerDiv = document.createElement('div');
  containerDiv.appendChild(textBox);
  containerDiv.appendChild(document.createElement('br'));
  containerDiv.appendChild(submit);

  return containerDiv;
}

/** 
 * Sends a marker to server to save. 
 */
function postMarker(lat, lng, content) {
  const params = new URLSearchParams();
  params.append('lat', lat);
  params.append('lng', lng);
  params.append('content', content);

  fetch('/markers', {method: 'POST', body: params})
  .then(fetchMarkers());
}

/**
 * Tells the server to delete an individual marker. 
 */
function deleteMarker(marker, id, email) {
  if (window.confirm(DELETE_MARKER_WARNING)) {
    const params = new URLSearchParams();
    params.append('id', id);
    params.append('email', email);
    fetch('/delete-marker', {method: 'POST', body: params})
    .then(response => response.json())
    .then((status) => {
      if (status.success === false) {
        window.alert(DELETE_MARKER_FAIL);
      } else {
        marker.setMap(null);
      }
    });
  }
}

/* 
 * Disable click event on map if logged out, enable if logged in.
 */
function toggleMapClickListener(loginStatus) {
  if (loginStatus) {
    // When the user clicks in the map, allow user to create and edit a marker
    map.addListener('click', addEditMarker);
  } else {
    google.maps.event.clearListeners(map, 'click');
  }
}
