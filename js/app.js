// This code is adapted from matthewcranford.com/memory-game-walkthroughs
// provided in the FEND Resources...
// I want to get this working right before I re-write it for submission.

//global variables
const deck = document.querySelector('.deck');
const totalPairs = 8;

let toggledCards = [];
let moves = 0;
let clockOff = true;
let time = 0;
let clockId;
let matched = 0;

//For Modal Testing
//forModalTesting();

/*
 * Create a list that holds all of your cards
 */

//remove the classes from all of the cards before making the list
resetCardClasses();
//$('li.card').removeClass('open show match');

//resetClockAndTime();
//replayGame();
//resetGame();
//stopClock();
//clockOff = true;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function shuffleDeck() {
  const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
  //console.log('cardsToShuffle', cardsToShuffle);
  const shuffledCards = shuffle(cardsToShuffle);
  //console.log('shuffledCards', shuffledCards);
  for (card of shuffledCards) {
    deck.appendChild(card);
  }
}

shuffleDeck();

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

deck.addEventListener('click', function() {
  const clickTarget = event.target;
  if (isClickValid(clickTarget)) {
    if (clockOff) {
      startClock();
      clockOff = false;
    }
    toggleCard(clickTarget);
    addToggleCard(clickTarget);
    if (toggledCards.length === 2) {
      checkForMatch(clickTarget);
      addMove();
      checkScore();
      //console.log(moves);
    }
  }
});

function isClickValid(clickTarget) {
  return (
    clickTarget.classList.contains('card') &&
    !clickTarget.classList.contains('match') &&
    toggledCards.length < 2 &&
    !toggledCards.includes(clickTarget));
}

function toggleCard(card) {
  //console.log('You clicked on a card');
  card.classList.toggle('open');
  card.classList.toggle('show');
}

function addToggleCard(clickTarget) {
  toggledCards.push(clickTarget);
  //console.log(toggledCards);
}

function checkForMatch() {
  if (toggledCards[0].firstElementChild.className === toggledCards[1].firstElementChild.className) {
    toggledCards[0].classList.toggle('match');
    toggledCards[1].classList.toggle('match');
    toggledCards = [];
    moves = moves - 1; // Dont add moves if a match
    matched = matched + 1;
    console.log('Two cards match!');
    if (matched === totalPairs) {
      gameOver();
    }
  } else {
    setTimeout(function() {
      console.log('Not a match!');
      toggleCard(toggledCards[0]);
      toggleCard(toggledCards[1]);
      toggledCards = [];
    }, 800);
  }
}

function addMove() {
  moves = moves + 1;
  const movesText = document.querySelector('.moves');
  movesText.innerHTML = moves;
}


// function removeMove() {
// }

function checkScore() {
  if (moves === 14 || moves === 20) {
    hideStar();

  }
}

function hideStar() {
  const starList = document.querySelectorAll('.stars li');
  for (star of starList) {
    if (star.style.display !== 'none') {
      star.style.display = 'none';
      break;
    }
  }
}

function startClock() {
  //time = 0;
  clockId = setInterval(function() {
    time++;
    displayTime();
    //console.log(time);
  }, 1000);
}
//startClock();

//same as above? but arrow function instead
//I've read that IE doesn't play nice with arrow script.
//use js function instead
// function startClock() {
//   //time = 0; changed to global scope
//   let clockId = setInterval(() => {
//     time++;
//     console.log(time);
//   }, 1000);
// }
// startClock();

function displayTime() {
  const clock = document.querySelector('.clock');
  //console.log(clock);
  clock.innerHTML = time;
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  if (seconds < 10) {
    clock.innerHTML = `${minutes}:0${seconds}`;
  } else {
    clock.innerHTML = `${minutes}:${seconds}`;
  }
}

function stopClock() {
  clearInterval(clockId);
  clockOff = true;
}

function toggleModal() {
  const modal = document.querySelector('.modal_background');
  modal.classList.toggle('hide');
}
toggleModal();  //Opens the modal
toggleModal();  //Closes the modal

function writeModalStats() {
  const timeStat = document.querySelector('.modal_time');
  const clockTime = document.querySelector('.clock').innerHTML;
  const movesStat = document.querySelector('.modal_moves');
  const starsStat = document.querySelector('.modal_stars');
  const stars = getStars();

  timeStat.innerHTML = `Time = ${clockTime}`;
  movesStat.innerHTML = `Moves = ${moves+1}`;
  starsStat.innerHTML = `Stars = ${stars}`;
}

function getStars() {
  stars = document.querySelectorAll('.stars li');
  starCount = 0;
  for (star of stars) {
    if (star.style.display !== 'none') {
      starCount = starCount + 1;
    }
  }
  console.log(starCount);
  return starCount;
}

document.querySelector('.modal_cancel').addEventListener('click', function () {
  toggleModal();
});

// IE doesn't support ES6 arrow functions
// document.querySelector('.modal_cancel').addEventListener('click', () => {
//   toggleModal();
// });

document.querySelector('.modal_replay').addEventListener('click', replayGame);

// ***** Might be the same as above and maybe delete this one... *******
// ***************** Might need this again so do't remove yet ***********
// document.querySelector('.modal_replay').addEventListener('click', resetGame) {
//   //TODO: Call reset game HERE
//   // This is accomplished in the querySelector above
//   //console.log('replay');
// });

// IE doesn't support ES6 arrow functions
// document.querySelector('.modal_replay').addEventListener('click', () => {
//   console.log('replay');
// });

function resetGame() {
  location.reload();
  // resetClockAndTime();
  // resetMoves();
  // resetStars();
  // resetCardClasses();
  shuffleDeck();
}

function replayGame() {
  resetGame();
  toggleModal();
  //resetCardClasses();
}

document.querySelector('.restart').addEventListener('click', resetGame);

function resetCardClasses () {
  $('li.card').removeClass('open show match');
}
resetCardClasses();

function resetClockAndTime() {
  stopClock();
  clockOff = true;
  time = 0;
  displayTime();
}

function resetMoves() {
  moves = 0;
  document.querySelector('.moves').innerHTML = moves;
}

function resetStars() {
  stars = 0;
  const starList = document.querySelectorAll('.stars li');
  for (star of starList) {
    star.style.display = 'inline';
  }
}

function gameOver() {
  stopClock();
  writeModalStats();
  toggleModal();
}

function resetCards() {
  const cards = document.querySelectorAll('.deck li');
  for (let card of cards) {
    resetCardClasses();
  }
}

function forModalTesting() {
  time = 121;
  displayTime(); //2:01
  moves = 16;
  checkScore(); // 2 stars

  writeModalStats();
  toggleModal();  //Opens the modal
}
