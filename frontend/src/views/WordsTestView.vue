<template>
  <div class="page-content">
    <h1 class="page-title">Тест английских слов</h1>
    
    <transition name="fade" mode="out-in">
      <div v-if="userWords.length === 0" class="card no-words">
        <p class="no-words-message">Вы еще не добавили слова для изучения.</p>
        <router-link to="/add-word" class="primary-button">Добавить слова</router-link>
      </div>
      
      <!-- Выбор режима тестирования -->
      <div v-else-if="!testStarted" class="card test-mode-selector">
        <h2>Выберите режим тестирования:</h2>
        <div class="mode-options">
          <button 
            v-for="mode in testModes" 
            :key="mode.value"
            @click="startTest(mode.value)"
            class="mode-button"
            :data-mode="mode.value"
          >
            {{ mode.label }}
          </button>
        </div>
      </div>
      
      <!-- Основной блок тестирования -->
      <div v-else class="card test-container">
        <div v-if="!testFinished">
          <div class="progress-container">
            <div class="progress-info">
              Прогресс: {{ currentWordIndex + 1 }}/{{ wordsToTest.length }}
              <span class="progress-percent">{{ progressPercent }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
            </div>
          </div>
          
          <!-- Блок для режима выбора перевода -->
          <div v-if="currentTestMode === 'choice'" class="test-content">
            <div class="word-display">
              <h2 class="word-text">{{ currentWord.russian }}</h2>
            </div>
            
            <div class="options-grid">
              <button 
                v-for="(option, index) in options" 
                :key="index"
                @click="checkAnswer(option)"
                class="option-button"
                :disabled="showFeedback"
                :class="{
                  'correct': showFeedback && option === currentWord.english,
                  'incorrect': showFeedback && userAnswer === option && !isCorrect,
                  'pulse': showFeedback && option === currentWord.english
                }"
              >
                {{ option }}
              </button>
            </div>
          </div>
          
          <!-- Блок для режима написания слова -->
          <div v-if="currentTestMode === 'typing'" class="test-content">
            <div class="word-display">
              <h2 class="word-text">{{ currentWord.russian }}</h2>
            </div>
            
            <div class="typing-container">
              <input
                v-model="userTypedAnswer"
                @keyup.enter="checkTypedAnswer"
                :disabled="showFeedback"
                placeholder="Введите перевод..."
                class="typing-input"
                ref="typingInput"
              />
              <button 
                @click="checkTypedAnswer"
                :disabled="showFeedback"
                class="check-button"
              >
                Проверить
              </button>
            </div>
          </div>
          
<!-- Блок для режима произношения -->
<div v-if="currentTestMode === 'pronunciation'" class="test-content">
  <div class="pronunciation-instruction">
    <h2>Произнесите слово:</h2>
    <p class="word-to-pronounce">{{ currentWord.russian }}</p>
  </div>

  <div class="pronunciation-controls">
    <button @click="speakWord(currentWord.english)">
      ▶️ Произнести слово
    </button>
    <button @click="startRecognition">
      🎤 Говорить
    </button>
  </div>

  <div v-if="recognizedText" class="recognized-text">
    <p>Распознано: <strong>{{ recognizedText }}</strong></p>
  </div>
</div>


          
          <transition name="slide-fade">
            <div v-if="showFeedback" class="feedback-container">
              <p v-if="isCorrect" class="feedback-message correct">
                <span class="feedback-icon">✅</span> Верно!
              </p>
              <p v-else class="feedback-message incorrect">
                <span class="feedback-icon">❌</span> Неверно. Правильно: <strong>{{ currentWord.english }}</strong>
              </p>
              <button @click="nextWord" class="next-button">
                {{ isLastWord ? 'Завершить тест' : 'Следующее слово' }}
              </button>
            </div>
          </transition>
        </div>
        
        <transition name="zoom" mode="out-in">
          <div v-if="testFinished" class="results-container">
            <h2 class="results-title">Тест завершен!</h2>
            <div class="score-container">
              <div class="score-text">
                Правильных ответов: <strong>{{ correctAnswers }} из {{ wordsToTest.length }}</strong>
              </div>
              <div class="percentage-circle" :class="scoreClass">
                {{ correctPercentage }}%
              </div>
            </div>
            
            <div class="results-buttons">
              <button @click="restartTest" class="primary-button">Начать заново</button>
              <router-link to="/add-word" class="secondary-button">Добавить слова</router-link>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'WordsTestView',
  data() {
    return {
      userWords: JSON.parse(localStorage.getItem('englishWords')) || [],
      wordsToTest: [],
      currentWordIndex: 0,
      userAnswer: '',
      userTypedAnswer: '',
      isCorrect: false,
      showFeedback: false,
      correctAnswers: 0,
      testFinished: false,
      testStarted: false,
      learnedWords: JSON.parse(localStorage.getItem('learnedWords')) || [],
      currentTestMode: 'choice', // choice, typing, pronunciation
      testModes: [
        { value: 'choice', label: 'Выбор перевода' },
        { value: 'typing', label: 'Написание слова' },
        { value: 'pronunciation', label: 'Произношение' }
      ],
      recognizedText: '' // добавлено для распознавания речи
    }
  },
  computed: {
    currentWord() {
      return this.wordsToTest[this.currentWordIndex]
    },
    options() {
      if (!this.currentWord || this.userWords.length < 2) return []
      const allOptions = this.userWords.map(word => word.english)
      let wrongOptions = []
      const uniqueOptions = [...new Set(allOptions)]
      const otherOptions = uniqueOptions.filter(opt => opt !== this.currentWord.english)
      if (otherOptions.length >= 3) {
        wrongOptions = [...otherOptions].sort(() => 0.5 - Math.random()).slice(0, 3)
      } else {
        wrongOptions = [...otherOptions]
        while (wrongOptions.length < 3) {
          wrongOptions.push(...otherOptions)
        }
        wrongOptions = wrongOptions.slice(0, 3)
      }
      return [...wrongOptions, this.currentWord.english].sort(() => 0.5 - Math.random())
    },
    progressPercent() {
      return Math.round((this.currentWordIndex / this.wordsToTest.length) * 100)
    },
    correctPercentage() {
      return Math.round((this.correctAnswers / this.wordsToTest.length) * 100)
    },
    isLastWord() {
      return this.currentWordIndex === this.wordsToTest.length - 1
    },
    scoreClass() {
      if (this.correctPercentage >= 80) return 'excellent'
      if (this.correctPercentage >= 60) return 'good'
      if (this.correctPercentage >= 40) return 'average'
      return 'poor'
    }
  },
  created() {
    this.prepareTest()
    window.addEventListener('keydown', this.handleKeyPress)
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.handleKeyPress)
  },
  methods: {
    prepareTest() {
      this.wordsToTest = this.userWords.filter(word => !this.learnedWords.includes(word.english))
      if (this.wordsToTest.length === 0 && this.userWords.length > 0) {
        if (confirm('Вы изучили все слова! Хотите начать заново?')) {
          this.learnedWords = []
          localStorage.setItem('learnedWords', JSON.stringify([]))
          this.wordsToTest = [...this.userWords]
        }
      }
      this.wordsToTest = this.shuffleArray([...this.wordsToTest])
      this.currentWordIndex = 0
      this.correctAnswers = 0
      this.testFinished = this.wordsToTest.length === 0
      this.showFeedback = false
      this.testStarted = false
    },
    startTest(mode) {
      this.currentTestMode = mode
      this.testStarted = true
      if (mode === 'typing') {
        this.$nextTick(() => {
          this.$refs.typingInput?.focus()
        })
      }
    },
    shuffleArray(array) {
      const newArray = [...array]
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
      }
      return newArray
    },
    checkAnswer(selectedAnswer) {
      this.userAnswer = selectedAnswer
      this.isCorrect = selectedAnswer === this.currentWord.english
      this.processResult()
    },
    checkTypedAnswer() {
      this.isCorrect = this.userTypedAnswer.trim().toLowerCase() === this.currentWord.english.toLowerCase()
      this.processResult()
    },
    checkPronunciation(knewWord) {
      this.isCorrect = knewWord
      this.processResult()
    },
    processResult() {
      if (this.isCorrect) {
        this.correctAnswers++
        if (!this.learnedWords.includes(this.currentWord.english)) {
          this.learnedWords.push(this.currentWord.english)
          localStorage.setItem('learnedWords', JSON.stringify(this.learnedWords))
        }
      }
      this.showFeedback = true
    },
    nextWord() {
      this.showFeedback = false
      this.userAnswer = ''
      this.userTypedAnswer = ''
      this.recognizedText = ''
      if (this.currentWordIndex < this.wordsToTest.length - 1) {
        this.currentWordIndex++
        if (this.currentTestMode === 'typing') {
          this.$nextTick(() => {
            this.$refs.typingInput?.focus()
          })
        }
      } else {
        this.testFinished = true
      }
    },
    restartTest() {
      this.learnedWords = []
      localStorage.setItem('learnedWords', JSON.stringify([]))
      this.prepareTest()
      this.testFinished = false
    },
    handleKeyPress(e) {
      if (this.showFeedback && e.key === 'Enter') {
        this.nextWord()
      }
    },

    // ▶️ ПРОИЗНЕСТИ СЛОВО
    speakWord(text) {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        speechSynthesis.speak(utterance);
      } else {
        alert('Ваш браузер не поддерживает синтез речи.');
      }
    },

    // 🎤 РАСПОЗНАВАНИЕ РЕЧИ
    startRecognition() {
      if (!('webkitSpeechRecognition' in window)) {
        alert('Ваш браузер не поддерживает распознавание речи.');
        return;
      }
      const recognition = new webkitSpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const result = event.results[0][0].transcript.trim().toLowerCase();
        this.recognizedText = result;
        this.isCorrect = result === this.currentWord.english.toLowerCase();
        this.processResult();
      };

      recognition.onerror = (event) => {
        console.error('Ошибка распознавания речи:', event.error);
        alert('Произошла ошибка распознавания речи.');
      };

      recognition.start();
    }
  }
}
</script>

<style scoped>
.page-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 2.2rem;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 30px;
  margin-bottom: 30px;
}

.no-words {
  text-align: center;
  padding: 40px 20px;
}

.no-words-message {
  font-size: 1.1rem;
  margin-bottom: 20px;
  color: #555;
}

.test-container {
  max-width: 600px;
  margin: 0 auto;
}

.progress-container {
  margin-bottom: 30px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.95rem;
  color: #555;
}

.progress-percent {
  font-weight: bold;
  color: #42b983;
}

.progress-bar {
  height: 10px;
  background: #f0f0f0;
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #42b983, #4cc9a7);
  transition: width 0.4s ease-out;
}

.word-display {
  margin: 40px 0;
  text-align: center;
}

.word-text {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 15px;
  font-weight: 600;
}



.options-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 25px;
}

.option-button {
  padding: 18px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  background: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.25s ease;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  word-break: break-word;
}

.option-button:hover:not(:disabled) {
  border-color: #42b983;
  background: #f5fbf8;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.option-button:disabled {
  cursor: not-allowed;
  opacity: 0.8;
}

.option-button.correct {
  background: #e8f5e9;
  border-color: #4caf50;
  color: #2e7d32;
  animation: pulse 0.5s;
}

.option-button.incorrect {
  background: #ffebee;
  border-color: #ef5350;
  color: #c62828;
}

.feedback-container {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  text-align: center;
}

.feedback-message {
  font-size: 1.2rem;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.feedback-message.correct {
  color: #2e7d32;
}

.feedback-message.incorrect {
  color: #c62828;
}

.feedback-icon {
  font-size: 1.4rem;
}

.next-button {
  margin-top: 10px;
  padding: 14px 28px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.next-button:hover {
  background: #369f6e;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.results-container {
  text-align: center;
  padding: 30px 20px;
}

.results-title {
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 1.8rem;
}

.score-container {
  margin: 30px 0;
}

.score-text {
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 20px;
}

.percentage-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  font-size: 2rem;
  font-weight: bold;
  color: white;
  background: #42b983;
  box-shadow: 0 4px 15px rgba(66, 185, 131, 0.3);
}

.percentage-circle.excellent {
  background: linear-gradient(135deg, #42b983, #4cc9a7);
}

.percentage-circle.good {
  background: linear-gradient(135deg, #66bb6a, #81c784);
}

.percentage-circle.average {
  background: linear-gradient(135deg, #ffa726, #fb8c00);
}

.percentage-circle.poor {
  background: linear-gradient(135deg, #ef5350, #e53935);
}

.results-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 40px;
  flex-wrap: wrap;
}

.primary-button {
  padding: 14px 28px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  display: inline-block;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.primary-button:hover {
  background: #369f6e;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.secondary-button {
  padding: 14px 28px;
  background: white;
  color: #42b983;
  border: 2px solid #42b983;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  display: inline-block;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.secondary-button:hover {
  background: #f5fbf8;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Анимации */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

.zoom-enter-active, .zoom-leave-active {
  transition: all 0.3s ease;
}
.zoom-enter-from, .zoom-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* Адаптивность */
@media (max-width: 768px) {
  .options-grid {
    grid-template-columns: 1fr;
  }
  
  .word-text {
    font-size: 1.8rem;
  }
  
  .results-buttons {
    flex-direction: column;
    gap: 12px;
  }
  
  .primary-button, .secondary-button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .card {
    padding: 20px 15px;
  }
  
  .page-title {
    font-size: 1.8rem;
  }
  
  .word-text {
    font-size: 1.6rem;
  }
}

.mode-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

.mode-button {
  padding: 1rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 500;
  color: #2c3e50;
  background-color: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.mode-button:hover {
  background-color: #e9ecef;
  border-color: #dee2e6;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.mode-button:active {
  transform: translateY(0);
  box-shadow: none;
}

/* Дополнительные стили для разных режимов (опционально) */
.mode-button[data-mode="choice"] {
  border-left: 4px solid #4e73df;
}

.mode-button[data-mode="typing"] {
  border-left: 4px solid #1cc88a;
}

.mode-button[data-mode="pronunciation"] {
  border-left: 4px solid #f6c23e;
}

.typing-container {
  display: flex;
  gap: 12px;
  max-width: 500px;
  margin: 0 auto;
  padding: 0 16px;
}

.typing-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.typing-input:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.2);
}

.typing-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.check-button {
  padding: 12px 24px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.check-button:hover:not(:disabled) {
  background-color: #3aa876;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.check-button:active:not(:disabled) {
  transform: translateY(0);
}

.check-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  opacity: 0.7;
}



.pronunciation-instruction h2 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #2c3e50;
  text-align: center;
}

.word-to-pronounce {
  font-size: 2.2rem;
  font-weight: 700;
  color: #2980b9;
  text-align: center;
  margin-bottom: 25px;
  user-select: none;
}

.pronunciation-controls {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}

.pronunciation-controls button {
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(41, 128, 185, 0.4);
  display: flex;
  align-items: center;
  gap: 8px;
}

.pronunciation-controls button:hover {
  background-color: #349167;
  box-shadow: 0 6px 10px rgba(52, 152, 219, 0.5);
}



.recognized-text {
  background: #dff0d8;
  border: 1px solid #a3c293;
  padding: 12px 18px;
  border-radius: 8px;
  color: #3c763d;
  font-weight: 600;
  text-align: center;
  user-select: text;
}

</style>