// The answer currently saved
const answer = (() => {
  let answerValue = '';
  return {
    get val() {
      return answerValue;
    },
    set val(v) {
      answerValue = v;
    }
  }
})();
// Player's current score; starts at 100
const currentScore = (() => {
  let currentScoreValue = 100;
  return {
    get val() {
      return currentScoreValue;
    },
    set val(v) {
      currentScoreValue = v;
    }
  }
})();
// Number of guesses made so far
const guesses = (() => {
  let guessesValue = 0;
  return {
    get val() {
      return guessesValue;
    },
    increment() {
      guessesValue++;
    }
  }
})();
// Happy status
const happy = (() => {
  let happyValue;
  return {
    get val() {
      return happyValue;
    },
    set val(v) {
      happyValue = v;
    }
  }
})();

// Calculates the factorial of a given number n
const factorial = (n) => {
  let result = 1;
  while(n > 1) {
    result *= n;
    n--;
  }
  return result;
};

// Determines if the given number string n is 'happy'
// ABC = A! + B! + C!, where A > 0, B >= 0, C >= 0
// and ABC is not a product, but a three-digit number
const isHappy = (n) => {
  const a = n[0];
  const b = n[1];
  const c = n[2];
  const factorialSum = factorial(a) + factorial(b) + factorial(c);

  return `${a}${b}${c}` === `${factorialSum}`;
};

// Renders game based on its status
const updateScreen = () => {
  const score = document.getElementById('score');
  const message = document.getElementById('message');
  const reels = document.getElementsByClassName('reel');
  const submitBtn = document.getElementById('submitBtn');

  // Render the current score
  score.innerHTML = `${currentScore.val}%`;
  // Render Happy!/Unhappy! message
  if(happy.val !== undefined) {
    message.innerHTML = happy.val ? 'Happy!' : 'Unhappy!';
  } else {
    message.innerHTML = '&nbsp';
  }
  // Render digits to screen
  for(let i = 0; i < reels.length; i++) {
    reels[i].innerHTML = answer.val[i] === undefined ? '' : answer.val[i];
  }
};

// Takes user input from numpad and adds it to the answer
const inputDigit = (e) => {
  const digit = e.textContent;
  const zeroDigit = document.getElementById('digit0');

  // Add digits to answer while screen isn't full
  if(answer.val.length < 3) {
    answer.val += digit;
  }
  // Enable/disable 0 digit on numpad; digit A (first digit) must be > 0
  zeroDigit.disabled = answer.val.length < 1;
  updateScreen();
};

// Submits the answer currently saved
const inputSubmit = () => {
  const reels = document.getElementsByClassName('reel');
  const buttons = document.getElementsByClassName('button');

  happy.val = isHappy(answer.val); // Is the answer happy?
  guesses.increment(); // Increment guesses
  // Wrong answer means a score penalty!
  if(!happy.val) {
    const g = guesses.val;
    currentScore.val -= Math.ceil(g*Math.log(g))+1;
  }
  // Change screen display color based on the answer
  for(let r of reels) {
    r.classList.add(`${happy.val}`);
  }
  // Disable certain buttons based on the answer
  for(let b of buttons) {
    if(!(!happy.val && b.id === 'clearBtn')) {
      b.disabled = true;
    }
  }
  updateScreen();
};

// Clears the answer currently saved
const inputClear = () => {
  const message = document.getElementById('message');
  const reels = document.getElementsByClassName('reel');
  const buttons = document.getElementsByClassName('button');

  answer.val = ''; // Reset stored answer
  // Reset screen display color
  if(!happy.val) {
    for(let r of reels) {
      r.classList.remove('false');
    }
  }
  happy.val = undefined; // Reset happiness
  // Reenable all disabled buttons, except 0
  for(let b of buttons) {
    if(b.id !== 'digit0') {
      b.disabled = false;
    } else {
      b.disabled = true;
    }
  }
  updateScreen();
};

// Finds the happy number, displays it to the player, then ends the game
const inputConcede = () => {
  const buttons = document.getElementsByClassName('button');

  if(currentScore.val > 0) {
    currentScore.val = 0; // Giving up means no points!
  }
  happy.val = true; // Game Over
  // Find and store the Happy Number
  for(let n = 100; n < 1000; n++) {
    if(isHappy(`${n}`)) {
      answer.val = `${n}`;
    }
  }
  // Disable all buttons
  for(let b of buttons) {
    b.disabled = true;
  }
  updateScreen();
};
