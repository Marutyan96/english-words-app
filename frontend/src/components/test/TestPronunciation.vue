<template>
  <div class="test-content" :key="currentWord.english">
    <div class="pronunciation-instruction">
      <h2>Произнесите слово:</h2>
      <p class="word-to-pronounce">{{ currentWord.russian }}</p>
    </div>
    <div class="pronunciation-controls">
      <button
        v-if="isSpeechSynthesisSupported"
        @click="speakWord(currentWord.english)"
        class="control-button speak-button"
      >
        ▶️ Произнести слово
      </button>
      <button
        v-if="isSpeechRecognitionSupported"
        @click="startRecognition"
        class="control-button record-button"
        :disabled="isRecognizing"
      >
        {{ isRecognizing ? '🎤 Запись...' : '🎤 Говорить' }}
      </button>
    </div>
    <div v-if="recognizedText" class="recognized-text">
      <p>Распознано: <strong>{{ recognizedText }}</strong></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TestPronunciation',
  props: {
    currentWord: {
      type: Object,
      required: true,
    },
    recognizedText: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isRecognizing: false,
    };
  },
  computed: {
    isSpeechSynthesisSupported() {
      return 'speechSynthesis' in window;
    },
    isSpeechRecognitionSupported() {
      return 'webkitSpeechRecognition' in window;
    },
  },
  methods: {
    speakWord(text) {
      if (this.isSpeechSynthesisSupported) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        speechSynthesis.speak(utterance);
      } else {
        alert('Ваш браузер не поддерживает синтез речи.');
      }
    },
    startRecognition() {
      if (!this.isSpeechRecognitionSupported) {
        alert('Ваш браузер не поддерживает распознавание речи.');
        return;
      }
      this.isRecognizing = true;
      const recognition = new webkitSpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.onresult = (event) => {
        const result = event.results[0][0].transcript.trim().toLowerCase();
        this.$emit('update:recognizedText', result);
        this.$emit('recognized', result === this.currentWord.english.toLowerCase());
        this.isRecognizing = false;
      };
      recognition.onerror = (event) => {
        console.error('Ошибка распознавания речи:', event.error);
        alert('Произошла ошибка при распознавании речи.');
        this.isRecognizing = false;
      };
      recognition.onend = () => {
        this.isRecognizing = false;
      };
      recognition.start();
    },
  },
};
</script>

<style scoped>
.test-content {
  text-align: center;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.test-content:hover {
  transform: translateY(-5px);
}

.pronunciation-instruction {
  margin-bottom: 25px;
}

.pronunciation-instruction h2 {
  font-size: 1.5em;
  color: #333;
  margin-bottom: 10px;
}

.word-to-pronounce {
  font-size: 1.8em;
  color: #2e7d32;
  font-weight: 600;
  padding: 10px;
  background: #e8f5e9;
  display: inline-block;
  border-radius: 5px;
}

.pronunciation-controls {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 20px;
}

.control-button {
  padding: 12px 25px;
  border: none;
  border-radius: 6px;
  font-size: 1em;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.3s ease;
}

.speak-button {
  background: #2196F3;
  color: white;
}

.speak-button:hover {
  background: #1976D2;
  transform: scale(1.05);
}

.record-button {
  background: #F44336;
  color: white;
}

.record-button:hover {
  background: #D32F2F;
  transform: scale(1.05);
}

.recognized-text {
  margin-top: 20px;
  color: #444;
  font-size: 1.1em;
}

.recognized-text strong {
  color: #2e7d32;
}

@media (max-width: 600px) {
  .pronunciation-controls {
    flex-direction: column;
    gap: 10px;
  }
  .control-button {
    width: 100%;
  }
}
</style>