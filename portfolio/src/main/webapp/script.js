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
 * JQuery to change header bar from transparent to solid on scroll.
 */
$(window).scroll(function() {
  if ($(document).scrollTop() < 50) {
    $('.header').addClass('transparent');
  } else {
    $('.header').removeClass('transparent');
  }
});

/*
 * Add a random greeting to the intro section of main page.
 */
function addRandomGreeting() {
  const greetings =
      ["HELLO, I\'M", "HOLA, ME LLAMO", "NAMASTE, MERA NAAM HAI", "BONJOUR, JE M\'APPELLE"];

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
  const factoids =
    ['I\'ve never been stung by a bee 🐝', 'I love choir! I sing Alto 🎶', 'My dream vacation is Bali 🌴', 'I used to run a book blog! 📚',
     'My favorite color is purple 💜' , 'My favorite composer is Debussy 🎹'];

  // Pick a random fact.
  const index = Math.floor(Math.random() * factoids.length);

  // Get a different index than last time.
  if (index == randomFact) {
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
  var caption = element.querySelector("span");
  caption.classList.toggle("show-caption");
  caption.focus();
}

/*
 * Fetch comments data from the data servlet to display on main page.
 */
function getComments() {
  fetch('/data')
  .then(response => response.json())
  .then((comments) => {
    // comments is an array of json objects
    const commentsElement = document.getElementById('comments-container');

    if (Object.keys(comments).length == 0) {
        commentsElement.appendChild(createElement('Be the first to leave a comment.'));
    } else {
      // TO DO: try to fix this to append new comments instead of erasing and rewriting them each time.
      commentsElement.innerHTML = '';
      for (i in comments) {
        commentsElement.appendChild(
        createElement('By: ' + comments[i].name + '\n Message: ' + comments[i].message));
      }
    }
  });
}

/* Creates a <p> element containing text for the comments. */
function createElement(text) {
  const element = document.createElement('p');
  element.innerText = text;
  return element;
}

/* Run the getComments() function when the page loads. */
window.onload = getComments;