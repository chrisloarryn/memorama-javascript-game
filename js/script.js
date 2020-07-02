class Memo {
  constructor() {
    this.cardsTotal = [];
    this.cardsNumber = 0;
    this.cardsVerifier = [];
    this.errors = 0;
    this.difficultyLevel = '';
    this.rightImages = [];
    this.cardsHandler = [];
    this.gameMemo = 0;

    this.$mainContainer = document.querySelector('.main-container');
    this.$cardsContainer = document.querySelector('.cards-container');
    this.$blockedScreen = document.querySelector('.blocked-screen');
    this.$message = document.querySelector('.message');
    this.$errorContainer = document.createElement('div');
    this.$difficultyLevel = document.createElement('div');

    // Event calls
    this.eventListener();
  }

  eventListener() {
    window.addEventListener('DOMContentLoaded', () => {
      this.loadCardsToScreen();
      this.difficultSelection();
      window.addEventListener(
        'contextmenu',
        (e) => {
          e.preventDefault();
        },
        false
      );
    });
  }

  difficultSelection() {
    const message = prompt(
      'Please select a level: easy, medium, hard. If you do not select any level, the selected level by default will be medium.'
    );
    if (!message) {
      this.gameMemo = 5;
      this.difficultyLevel = 'Medium';
    } else {
      if (message.toLowerCase() === 'easy') {
        this.gameMemo = 12;
        this.difficultyLevel = 'easy';
      } else if (message.toLowerCase() === 'medium') {
        this.gameMemo = 8;
        this.difficultyLevel = 'medium';
      } else if (message.toLowerCase() === 'hard') {
        this.gameMemo = 5;
        this.difficultyLevel = 'hard';
      } else {
        this.gameMemo = 8;
        this.difficultyLevel = 'medium';
      }
    }
    this.errorContainer();
    this.messageMemoDifficulty();
  }

  async loadCardsToScreen() {
    this.cardsTotal = await (await fetch('./../memo.json')).json();
    if (this.cardsTotal && this.cardsTotal.length > 0) {
      this.cardsTotal.sort((a, b) => Math.random() - 0.5);
    }
    this.cardsNumber = this.cardsTotal.length;
    let html = '';
    if (!this.cardsTotal) return;
    this.cardsTotal.forEach((card) => {
      html += `<div class="card">
                <img class="card-img" src=${card.src} alt="memo image" />
               </div>`;
    });
    this.$cardsContainer.innerHTML = html;
    this.gameStarts();
  }

  gameStarts() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card) => {
      card.addEventListener('click', (e) => {
        this.cardClick(e);
      });
    });
  }

  cardClick(e) {
    e.preventDefault();
    this.reverseCardEffect(e);
    let sourceImage = e.target.childNodes[1].attributes[1].value;
    this.cardsVerifier.push(sourceImage);

    let card = e.target;
    this.cardsHandler.unshift(card);
    this.cardsCheckout();
  }

  reverseCardEffect(e) {
    e.target.style.backgroundImage = 'none';
    e.target.style.backgroundColor = 'white';
    e.target.childNodes[1].style.display = 'block';
  }

  setPairOfCards(arrAcceptedCards) {
    arrAcceptedCards.forEach((card) => {
      card.classList.add('truth');
      this.rightImages.push(card);
      this.victoryOfGame();
    });
  }

  reverseCard(cardsArray) {
    cardsArray.forEach((card) => {
      setTimeout(() => {
        card.style.backgroundImage = 'url(../img/cover.jpg)';
        card.childNodes[1].style.display = 'none';
      }, 1000);
    });
  }

  cardsCheckout() {
    if (this.cardsVerifier.length === 2) {
      if (this.cardsVerifier[0] === this.cardsVerifier[1]) {
        this.setPairOfCards(this.cardsHandler);
      } else {
        this.reverseCard(this.cardsHandler);
        this.errors++;
        this.addsErrors();
        this.gameOver();
      }
      this.cardsVerifier.splice(0);
      this.cardsHandler.splice(0);
    }
  }

  victoryOfGame() {
    if (this.rightImages.length == this.cardsTotal.length) {
      setTimeout(() => {
        this.$blockedScreen.style.display = 'block';
        this.$message.innerText = 'Congrats! You are the winner!';
      }, 1000);
      setTimeout(() => {
        location.reload();
      }, 5000);
    }
  }

  gameOver() {
    if (this.errors === this.gameMemo) {
      setTimeout(() => {
        this.$blockedScreen.style.display = 'block';
      }, 1000);
      setTimeout(() => {
        location.reload();
      }, 4000);
    }
  }

  addsErrors() {
    this.$errorContainer.innerText = `Errors: ${this.errors}`;
  }

  errorContainer() {
    this.$errorContainer.classList.add('error');
    this.addsErrors();
    this.$mainContainer.appendChild(this.$errorContainer);
  }

  messageMemoDifficulty() {
    this.$difficultyLevel.classList.add('difficulty-level');
    this.$difficultyLevel.innerHTML = `Difficulty Level: ${this.difficultyLevel}`;
    this.$mainContainer.appendChild(this.$difficultyLevel);
  }
}

new Memo();
