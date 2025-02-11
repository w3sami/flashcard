class SpeechService {
  constructor() {
    this.synth = window.speechSynthesis;
    this.finnishVoice = null;
    this.swedishVoice = null;
    this.timeout = null;
    this.enabled = true;
  }

  async init() {
    // Wait for voices to be loaded
    if (this.synth.getVoices().length === 0) {
      await new Promise(resolve => {
        this.synth.addEventListener('voiceschanged', resolve, { once: true });
      });
    }

    const voices = this.synth.getVoices();
    
    // Try to find Finnish voice
    this.finnishVoice = voices.find(voice => 
      voice.name.toLowerCase() === 'satu' && voice.lang === 'fi-FI'
    ) || voices.find(voice => voice.lang === 'fi-FI');

    // Try to find Swedish voice (Siri)
    this.swedishVoice = voices.find(voice => 
      voice.name.toLowerCase().includes('siri') && voice.lang === 'sv-SE'
    ) || voices.find(voice => voice.lang === 'sv-SE');

    console.log('Available voices:', {
      finnish: voices.filter(voice => voice.lang === 'fi-FI').map(v => v.name),
      swedish: voices.filter(voice => voice.lang === 'sv-SE').map(v => v.name)
    });

    // Initialize with empty utterance
    this.synth.speak(new SpeechSynthesisUtterance(''));
  }

  setEnabled(enabled) {
    this.enabled = enabled;
    if (!enabled) {
      this.stop();
    }
  }

  stop() {
    this.synth.cancel();
  }

  speak(text, voice, lang) {
    if (!this.enabled) return Promise.resolve(false);
    
    return new Promise((resolve) => {
      if (this.synth.speaking || this.timeout) {
        console.error('speechSynthesis.speaking');
        resolve(false);
        return;
      }

      if (!text || !voice) {
        resolve(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);

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
    this.vocabularies = {
      vocabulary1: vocabulary,
      vocabulary2: vocabulary2
    };
    this.currentVocabulary = 'vocabulary1';
    this.cards = [...this.vocabularies[this.currentVocabulary]];
    this.currentIndex = 0;
    this.isFlipped = false;
    this.rejectedCards = [];
    this.showingRejected = false;
    this.firstLanguage = 'swedish';
    this.speechService = new SpeechService();
    
    this.initializeUI();
    this.attachEventListeners();
    this.speechService.init();
    this.handleRestart();
  }

  initializeUI() {
    document.body.innerHTML = `
      <div class="container">
        <div class="controls">
          <select id="vocabularySelect">
            <option value="vocabulary1">Vocabulary 1</option>
            <option value="vocabulary2">Vocabulary 2</option>
          </select>
          <select id="languageSelect">
            <option value="swedish">Swedish First</option>
            <option value="finnish">Finnish First</option>
          </select>
          <label class="voice-toggle">
            <input type="checkbox" id="voiceEnabled" checked>
            Enable Voice
          </label>
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
      .controls {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1em;
        margin-bottom: 1em;
      }
      .voice-toggle {
        display: flex;
        align-items: center;
        gap: 0.5em;
        cursor: pointer;
      }
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
    document.getElementById('vocabularySelect').addEventListener('change', (e) => {
      this.currentVocabulary = e.target.value;
      this.handleRestart();
    });

    document.getElementById('languageSelect').addEventListener('change', (e) => {
      this.firstLanguage = e.target.value;
      this.updateCard();
    });

    document.getElementById('voiceEnabled').addEventListener('change', (e) => {
      this.speechService.setEnabled(e.target.checked);
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

    const language = this.isFlipped
        ? (this.firstLanguage === 'swedish' ? 'finnish' : 'swedish')
        : this.firstLanguage;

    if (language === 'finnish') {
      document.querySelector('.content').textContent = card.translation;
      this.speechService.speak(card.translation, this.speechService.finnishVoice, 'fi-FI');
    } else {
      document.querySelector('.content').textContent = card.term;
      this.speechService.speak(card.term, this.speechService.swedishVoice, 'sv-SE');
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
    this.cards = [...this.vocabularies[this.currentVocabulary]];
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
