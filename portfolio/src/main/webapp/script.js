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
 * Initializes the page.
 */
 window.addEventListener('load', loadPage);

/*
 * Handles all functions to trigger when page loads.
 */
function loadPage() {
  const isMapPage = $('body.gallery-map-page').length > 0;
  authenticateUser(isMapPage);
  getComments();
  if (isMapPage) {
    createMap();
  }
}

/*
 * JQuery to change header bar from transparent to solid on scroll.
 */
$(window).scroll(function() {
  if ($('body.main-page').length > 0) {
    if ($(document).scrollTop() < 50) {
      $('.header').addClass('transparent');
    } else {
      $('.header').removeClass('transparent');
    }
  }
});

/*
 * Add a random greeting to the intro section of main page.
 */
function addRandomGreeting() {
  const greetings = [
    "HELLO, I\'M", "HOLA, ME LLAMO", "NAMASTE, MERA NAAM HAI", 
    "BONJOUR, JE M\'APPELLE", "CIAO, MI CHIAMO",
  ];

  // Pick a random greeting.
  const greeting = greetings[Math.floor(Math.random() * greetings.length)];

  // Add it to the page.
  const greetingContainer = document.getElementById('greeting-container');
  greetingContainer.innerText = greeting;
}

/*
 * Add a random fact about me to the about section of main page.
 */
let randomFact = 0;
function addRandomFact() {
  const factoids =[
    'I\'ve never been stung by a bee 🐝', 'I love choir! I sing Alto 🎶', 
    'My dream vacation is Bali 🌴', 'I used to run a book blog! 📚',
    'My favorite color is purple 💜' , 'My favorite composer is Debussy 🎹',
  ];

  // Pick a random fact.
  const index = Math.floor(Math.random() * factoids.length);

  // Get a different index than last time.
  if (index === randomFact) {
    index++;
  }
  randomFact = index % factoids.length;

  // Make sure the index doesn't overflow.
  const factoid = factoids[index % factoids.length];

  // Add it to the page.
  const factContainer = document.getElementById('fact-container');
  factContainer.innerText = factoid;
}

/*
 * Display caption text when user clicks on image in the gallery.
 */
function showCaption(element) {
  let caption = element.querySelector('span');
  caption.classList.toggle('show-caption');
  caption.focus();
}

/*
 * Fetch the authentication status of the user from the server
 */
 function authenticateUser(isMapPage) {
   let loginStatus = false;

   fetch('/login')
  .then(response => response.json())
  .then((login) => {
    const commentsDiv = document.getElementById('comments');
    const mapDiv = document.getElementById('map-container');
    let loginText;
    let logoutText;

    if (login.email === 'null') {
      // user is logged out
      loginText = createElement('<a href=\"' + login.url 
          + '\">Log in</a> to submit a comment.', 'p');
      commentsDiv.appendChild(loginText);

      if (isMapPage) {
        loginText = createElement('<a href=\"' + login.mapUrl 
          + '\">Log in</a> to add a marker.', 'p');
        mapDiv.appendChild(loginText);
      }

      loginStatus = false;
    } else {
      // user is logged in
      logoutText = createElement('Hi ' + login.email 
        + '! Leave a comment or <a href=\"' + login.url + '\">log out</a>.', 'p');
      commentsDiv.appendChild(logoutText);

      if (isMapPage) { 
        logoutText = createElement('Hi ' + login.email 
          + '! Add a marker or <a href=\"' + login.mapUrl + '\">log out</a>.', 'p');
        mapDiv.appendChild(logoutText);
      }

      loginStatus = true;
    }

    toggleCommentsForm(loginStatus);
    if (isMapPage) { 
      toggleClickListener(loginStatus);
    }
  });
 }

/* Creates an element containing text. */
function createElement(text, type) {
  const element = document.createElement(type);
  element.innerHTML = text;
  return element;
}
