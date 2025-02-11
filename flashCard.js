class SpeechService {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voice = null;
    this.timeout = null;
  }

  async init() {
    // Wait for voices to be loaded
    if (this.synth.getVoices().length === 0) {
      await new Promise(resolve => {
        this.synth.addEventListener('voiceschanged', resolve, { once: true });
      });
    }

    // Try to find Finnish voice
    const voices = this.synth.getVoices();
    this.voice = voices.find(voice => 
      voice.name.toLowerCase() === 'satu' && voice.lang === 'fi-FI'
    ) || voices.find(voice => voice.lang === 'fi-FI');

    console.log(voices, voices.filter(voice => voice.lang === 'fi-FI').map(v => v.name));

    // Initialize with empty utterance
    this.synth.speak(new SpeechSynthesisUtterance(''));
  }

  stop() {
    this.synth.cancel();
  }

  speak(text) {
    return;
    return new Promise((resolve) => {
      if (this.synth.speaking || this.timeout) {
        console.error('speechSynthesis.speaking');
        resolve(false);
        return;
      }

      if (!text) {
        resolve(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      if (this.voice) {
        utterance.voice = this.voice;
      }

      utterance.onend = () => resolve(true);
      utterance.onerror = (event) => {
        console.error(`Speech synthesis error: ${event.error}`);
        resolve(false);
      };

      this.timeout = setTimeout(() => {
        this.timeout = null;
        this.synth.speak(utterance);
      }, 200);
    });
  }
}

class FlashcardApp {
  constructor() {
    this.cards = [...vocabulary];
    this.currentIndex = 0;
    this.isFlipped = false;
    this.rejectedCards = [];
    this.showingRejected = false;
    this.firstLanguage = 'swedish';
    this.speechService = new SpeechService();
    
    this.initializeUI();
    this.attachEventListeners();
    this.speechService.init();
  }

  initializeUI() {
    document.body.innerHTML = `
      <div class="container">
        <div class="controls">
          <select id="languageSelect">
            <option value="swedish">Swedish First</option>
            <option value="finnish">Finnish First</option>
          </select>
        </div>

        <div class="flashcard" id="flashcard">
          <div class="content"></div>
        </div>

        <div class="buttons">
          <button id="showBtn">Show</button>
          <button id="acceptBtn">Accept</button>
          <button id="rejectBtn">Reject</button>
        </div>

        <div class="navigation">
          <button id="restartBtn">Start Over</button>
          <button id="processRejectedBtn">Process Rejected (0)</button>
        </div>

        <div id="status" class="status"></div>
      </div>
    `;

    // Add basic styles
    const style = document.createElement('style');
    style.textContent = `
      .container { max-width: 600px; margin: 2em auto; text-align: center; }
      .flashcard { 
        width: 400px; 
        height: 200px; 
        border: 1px solid #ccc; 
        margin: 1em auto; 
        display: flex; 
        align-items: center; 
        justify-content: center;
        cursor: pointer;
      }
      .buttons, .navigation { margin: 1em 0; }
      button { margin: 0 0.5em; padding: 0.5em 1em; }
      .content { font-size: 1.5em; }
    `;
    document.head.appendChild(style);
  }

  attachEventListeners() {
    document.getElementById('languageSelect').addEventListener('change', (e) => {
      this.firstLanguage = e.target.value;
      this.updateCard();
    });

    document.getElementById('showBtn').addEventListener('click', () => this.handleShow());
    document.getElementById('acceptBtn').addEventListener('click', () => this.handleAccept());
    document.getElementById('rejectBtn').addEventListener('click', () => this.handleReject());
    document.getElementById('restartBtn').addEventListener('click', () => this.handleRestart());
    document.getElementById('processRejectedBtn').addEventListener('click', () => this.handleProcessRejected());
    document.getElementById('flashcard').addEventListener('click', () => this.handleShow());
  }

  updateCard() {
    const card = this.cards[this.currentIndex];
    if (!card) return;

    const content = this.isFlipped ? 
      (this.firstLanguage === 'swedish' ? card.translation : card.term) :
      (this.firstLanguage === 'swedish' ? card.term : card.translation);

    document.querySelector('.content').textContent = content;

    if (this.isFlipped) {
      // Speak the translation when card is flipped
      const textToSpeak = this.firstLanguage === 'swedish' ? card.translation : card.term;
      this.speechService.speak(textToSpeak);
    }
  }

  handleShow() {
    this.isFlipped = !this.isFlipped;
    this.updateCard();
  }

  handleAccept() {
    if (this.currentIndex < this.cards.length - 1) {
      this.currentIndex++;
      this.isFlipped = false;
      this.updateCard();
    }
  }

  handleReject() {
    this.rejectedCards.push(this.cards[this.currentIndex]);
    if (this.currentIndex < this.cards.length - 1) {
      this.currentIndex++;
      this.isFlipped = false;
      this.updateCard();
    }
    document.getElementById('processRejectedBtn').textContent = 
      `Process Rejected (${this.rejectedCards.length})`;
  }

  handleRestart() {
    this.currentIndex = 0;
    this.isFlipped = false;
    this.rejectedCards = [];
    this.showingRejected = false;
    this.cards = [...vocabulary];
    this.updateCard();
    document.getElementById('processRejectedBtn').textContent = 'Process Rejected (0)';
  }

  handleProcessRejected() {
    if (this.rejectedCards.length > 0) {
      this.cards = [...this.rejectedCards];
      this.rejectedCards = [];
      this.currentIndex = 0;
      this.isFlipped = false;
      this.showingRejected = true;
      this.updateCard();
      document.getElementById('processRejectedBtn').textContent = 'Process Rejected (0)';
    }
  }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  new FlashcardApp();
});
