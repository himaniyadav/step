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
