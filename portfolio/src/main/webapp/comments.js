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

const DELETE_ALL_COMMENTS_WARNING = 'Careful! Do you really want to delete all comments?';
const DELETE_COMMENT_WARNING = 'Are you sure you want to delete this comment?';
const DELETE_COMMENT_FAIL = `You can't delete a comment that's not yours!`;

/* 
 * Hide comments form if user is logged out, show if user is logged in.
 */
function toggleCommentsForm(loginStatus) {
  let form = document.getElementById('comment-form');
  if (loginStatus) {
    form.style.display = "block";
  } else {
    form.style.display = "none";
  }
}

/*
 * Fetch comments data from the data servlet to display on main page.
 */
let pageNumber = 0;
let numResults = 0;
let maxComments = 5;
function getComments() {
  checkFirstPage();

  const maxCommentsSelect = document.getElementById('max-comments');
  maxComments = maxCommentsSelect.value;

  fetch('/data?max-comments=' + maxComments + '&page-num=' + pageNumber)
  .then(response => response.json())
  .then((comments) => {
    // comments is an array of json objects
    numResults = Object.keys(comments).length;
    
    // clear the comments container before displaying new results
    const commentsElement = document.getElementById('comments-container');
    commentsElement.innerHTML = '';

    checkLastPage();

    if (numResults === 0) {
      if (pageNumber === 0) {
        commentsElement.appendChild(
            createElement('Be the first to leave a comment.', 'p'));
      } else {
         commentsElement.appendChild(createElement('No more comments.', 'p'));
      }
    } else {
      comments.forEach((comment) => {
        commentsElement.appendChild(createCommentElement(comment));
      });
    }
  });
}

/* 
 * Creates an element that represents a comment and its delete button.
 */
function createCommentElement(comment) {
  const divElem = createElement('', 'div');
  divElem.className = 'comment';

  divElem.appendChild(createElement(`${comment.name}`.toLowerCase(), 'h3'));

  const date = new Date(comment.timestamp);
  divElem.appendChild(createElement(`${date.toDateString()}`, 'h4'))

  divElem.appendChild(createElement(`${comment.message}`, 'p'));

  const deleteButtonElement = document.createElement('button');
  deleteButtonElement.innerText = 'Delete';
  deleteButtonElement.addEventListener('click', () => {
    deleteComment(comment);
    // Reload so the comment is removed from the DOM and the same number 
    // of comments is displayed.
    getComments(); 
  });

  divElem.appendChild(deleteButtonElement);

  return divElem;
}

/*
 * Navigates user to previous page of comments. 
 */
function previousPage() {
  if (pageNumber > 0) {
    pageNumber--;
  }
  getComments();
}

/*
 * Navigates user to next page of comments. 
 */
function nextPage() {
  pageNumber++;
  getComments();
}

/*
 * Disables button if user is on the first page of comments. 
 */
function checkFirstPage() {
  let previous = document.getElementById("previous");
  if (pageNumber === 0) {
    previous.disabled = true;
  } else {
    previous.disabled = false;
  }
}

/*
 * Disables button if user is on the last page of comments. 
 */
function checkLastPage() {
  let next = document.getElementById("next");
  if (numResults < maxComments) {
    next.disabled = true;
  } else {
    next.disabled = false;
  }
}

/*
 * Tells the server to add a comment. 
 */
function addComment() {
  const name = document.getElementById('name').value;
  const message = document.getElementById('message').value;

  // only submit the comment if message contains a value
  if (message !== '') {
    const params = new URLSearchParams();
    params.append('name', name);
    params.append('message', message);
    fetch('/data', {method: 'POST', body: params})
    .then((ignore) => {
      getComments();
      // clear form text
      document.getElementById('comment-form').reset();
    });
  }
}

/*
 * Delete all comment data and clear main page.
 */
function deleteAllComments() {
  if (window.confirm(DELETE_ALL_COMMENTS_WARNING)) {
    fetch('/delete-data', {method: 'POST'})
    .then(getComments());
  }  
}

/*
 * Tells the server to delete an individual comment. 
 */
function deleteComment(comment) {
  if (window.confirm(DELETE_COMMENT_WARNING)) { 
    const params = new URLSearchParams();
    params.append('id', comment.id);
    params.append('email', comment.email);
    fetch('/delete-comment', {method: 'POST', body: params})
    .then(response => response.json())
    .then((status) => {
      if (status.success === false) {
        window.alert(DELETE_COMMENT_FAIL);
      }
    });
  }
}
