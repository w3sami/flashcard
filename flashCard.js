class SpeechService {
  constructor() {
    this.synth = window.speechSynthesis;
    this.finnishVoice = null;
    this.swedishVoice = null;
    this.timeout = null;
    this.enabled = true;
    this.isInitialized = false;
  }

  async init() {
    try {
      // Check if speech synthesis is available
      if (!('speechSynthesis' in window)) {
        console.log('Speech synthesis not available');
        return false;
      }

      // iOS Safari specific: need to wait a bit before getting voices
      await new Promise(resolve => setTimeout(resolve, 100));

      // Get voices with retry mechanism
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        const voices = this.synth.getVoices();
        if (voices.length > 0) {
          // Try to find Finnish voice
          this.finnishVoice = voices.find(voice =>
              voice.name.toLowerCase() === 'satu' && voice.lang === 'fi-FI'
          ) || voices.find(voice => voice.lang === 'fi-FI');

          // Try to find Swedish voice (Siri)
          this.swedishVoice = voices.find(voice =>
              voice.name.toLowerCase().includes('siri') && voice.lang === 'sv-SE'
          ) || voices.find(voice => voice.lang === 'sv-SE');

          console.log('Voices loaded:', {
            totalVoices: voices.length,
            finnish: this.finnishVoice?.name,
            swedish: this.swedishVoice?.name
          });

          // Initialize with empty utterance
          this.synth.speak(new SpeechSynthesisUtterance(''));

          this.isInitialized = true;
          return true;
        }

        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }

      console.log('Could not load voices after multiple attempts');
      return false;
    } catch (error) {
      console.log('Speech service initialization error:', error);
      return false;
    }
  }

  setEnabled(enabled) {
    this.enabled = enabled;
    if (!enabled) {
      this.stop();
    }
  }

  stop() {
    try {
      this.synth.cancel();
    } catch (error) {
      console.log('Error stopping speech:', error);
    }
  }

  speak(text, voice, lang) {
    if (!this.enabled || !this.isInitialized) return Promise.resolve(false);

    return new Promise((resolve) => {
      try {
        if (!text || !voice) {
          resolve(false);
          return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = voice;
        utterance.lang = lang;

        utterance.onend = () => resolve(true);
        utterance.onerror = (event) => {
          console.log(`Speech synthesis error: ${event.error}`);
          resolve(false);
        };

        // iOS Safari specific: Clear any existing speech
        this.synth.cancel();

        // Small delay before speaking
        setTimeout(() => {
          try {
            this.synth.speak(utterance);
          } catch (error) {
            console.log('Error speaking:', error);
            resolve(false);
          }
        }, 100);
      } catch (error) {
        console.log('Error in speak function:', error);
        resolve(false);
      }
    });
  }
}

class FlashcardApp {
  constructor() {
    this.initializeUI();
    this.setupApp();
  }

  async setupApp() {
    try {
      this.vocabularies = {
        vocabulary1: vocabulary,
        vocabulary2: vocabulary2,
        vocabulary3: vocabulary3
      };
      this.currentVocabulary = 'vocabulary1';
      this.cards = [...this.vocabularies[this.currentVocabulary]];
      this.currentIndex = 0;
      this.isFlipped = false;
      this.rejectedCards = [];
      this.showingRejected = false;
      this.firstLanguage = 'swedish';

      // Initialize speech service
      this.speechService = new SpeechService();
      const speechInitialized = await this.speechService.init();

      // Update UI based on speech availability
      document.getElementById('voiceEnabled').checked = speechInitialized;
      document.getElementById('voiceEnabled').disabled = !speechInitialized;

      this.attachEventListeners();
      this.handleRestart();

      // Show status message
      this.updateStatus(speechInitialized ? 'App ready' : 'App ready (voice not available)');
    } catch (error) {
      this.updateStatus('Error initializing app. Please refresh the page.');
      console.log('Setup error:', error);
    }
  }

  updateStatus(message) {
    const status = document.getElementById('status');
    if (status) {
      status.textContent = message;
    }
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
      .status { margin-top: 1em; padding: 0.5em; color: #666; }
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

document.addEventListener('DOMContentLoaded', () => {
  new FlashcardApp();
});
