<template>
  <div class="page-content" @keydown.enter="showFeedback && nextWord">
    <h1 class="page-title">Тест английских слов</h1>
    
    <transition name="fade" mode="out-in">
      <div v-if="userWords.length === 0" key="no-words" class="card no-words">
        <p class="no-words-message">Вы еще не добавили слова для изучения.</p>
        <router-link to="/add-word" class="primary-button">Добавить слова</router-link>
      </div>
      
      <TestModeSelector
        v-else-if="!testStarted"
        key="mode-selector"
        :test-modes="testModes"
        :start-test="startTest"
      />
      
      <div v-else key="test" class="card test-container">
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
          
          <TestChoice
            v-if="currentTestMode === 'choice'"
            :current-word="currentWord"
            :options="options"
            :show-feedback="showFeedback"
            :user-answer="userAnswer"
            :is-correct="isCorrect"
            :check-answer="checkAnswer"
          />
          
          <TestTyping
            v-if="currentTestMode === 'typing'"
            :current-word="currentWord"
            :show-feedback="showFeedback"
            :typed-answer="userTypedAnswer"
            @update:typed-answer="userTypedAnswer = $event"
            :check-typed-answer="checkTypedAnswer"
          />
          
          <TestPronunciation
            v-if="currentTestMode === 'pronunciation'"
            :current-word="currentWord"
            v-model:recognized-text="recognizedText"
            @recognized="handleRecognitionResult"
          />
          
          <Feedback
            :show-feedback="showFeedback"
            :is-correct="isCorrect"
            :current-word="currentWord"
            :is-last-word="isLastWord"
            :next-word="nextWord"
          />
        </div>
        
        <Results
          :test-finished="testFinished"
          :correct-answers="correctAnswers"
          :words-to-test="wordsToTest"
          :correct-percentage="correctPercentage"
          :score-class="scoreClass"
          :restart-test="restartTest"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import { useTestLogic } from '@/composables/useTestLogic';
import { getFromLocalStorage, saveToLocalStorage } from '@/utils/localStorage';
import TestModeSelector from '@/components/test/TestModeSelector.vue';
import TestChoice from '@/components/test/TestChoice.vue';
import TestTyping from '@/components/test/TestTyping.vue';
import TestPronunciation from '@/components/test/TestPronunciation.vue';
import Feedback from '@/components/test/Feedback.vue';
import Results from '@/components/test/Results.vue';

export default {
  name: 'WordsTestView',
  components: {
    TestModeSelector,
    TestChoice,
    TestTyping,
    TestPronunciation,
    Feedback,
    Results,
  },
  data() {
    return {
      userWords: getFromLocalStorage('englishWords'),
      wordsToTest: [],
      currentWordIndex: 0,
      userAnswer: '',
      userTypedAnswer: '',
      isCorrect: false,
      showFeedback: false,
      correctAnswers: 0,
      testFinished: false,
      testStarted: false,
      learnedWords: getFromLocalStorage('learnedWords'),
      currentTestMode: 'choice',
      testModes: [
        { value: 'choice', label: 'Выбор перевода' },
        { value: 'typing', label: 'Написание слова' },
        { value: 'pronunciation', label: 'Произношение' },
      ],
      recognizedText: '',
      cachedOptions: [],
    };
  },
  computed: {
    currentWord() {
      return this.wordsToTest[this.currentWordIndex] || { russian: '', english: '' };
    },
    options() {
      return this.cachedOptions;
    },
    progressPercent() {
      return Math.round((this.currentWordIndex / this.wordsToTest.length) * 100) || 0;
    },
    correctPercentage() {
      return Math.round((this.correctAnswers / this.wordsToTest.length) * 100) || 0;
    },
    isLastWord() {
      return this.currentWordIndex === this.wordsToTest.length - 1;
    },
    scoreClass() {
      if (this.correctPercentage >= 80) return 'excellent';
      if (this.correctPercentage >= 60) return 'good';
      if (this.correctPercentage >= 40) return 'average';
      return 'poor';
    },
  },
  watch: {
    currentWord: {
      handler() {
        this.cachedOptions = this.generateOptions();
      },
      deep: true,
    },
  },
  created() {
    this.prepareTest();
    window.addEventListener('keydown', this.handleKeyPress);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeyPress);
  },
  methods: {
    prepareTest() {
      const { prepareTest } = useTestLogic();
      const { wordsToTest, learnedWords } = prepareTest(this.userWords, this.learnedWords);
      this.wordsToTest = wordsToTest;
      this.learnedWords = learnedWords;
      this.currentWordIndex = 0;
      this.correctAnswers = 0;
      this.testFinished = this.wordsToTest.length === 0;
      this.showFeedback = false;
      this.testStarted = false;
      this.cachedOptions = this.generateOptions();
    },
    startTest(mode) {
      this.currentTestMode = mode;
      this.testStarted = true;
      if (mode === 'typing') {
        this.$nextTick(() => {
          this.$refs.typingInput?.focus();
        });
      }
    },
    checkAnswer(selectedAnswer) {
      this.userAnswer = selectedAnswer;
      this.isCorrect = selectedAnswer === this.currentWord.english;
      this.processResult();
    },
    checkTypedAnswer() {
      this.isCorrect = this.userTypedAnswer.trim().toLowerCase() === this.currentWord.english.toLowerCase();
      this.processResult();
    },
    handleRecognitionResult(isCorrect) {
      this.isCorrect = isCorrect;
      this.processResult();
    },
    processResult() {
      const { processResult } = useTestLogic();
      const { isCorrect, learnedWords } = processResult(this.isCorrect, this.currentWord, this.learnedWords);
      this.isCorrect = isCorrect;
      this.learnedWords = learnedWords;
      if (this.isCorrect) this.correctAnswers++;
      saveToLocalStorage('learnedWords', this.learnedWords);
      this.showFeedback = true;
    },
    nextWord() {
      this.showFeedback = false;
      this.userAnswer = '';
      this.userTypedAnswer = '';
      this.recognizedText = '';
      if (this.currentWordIndex < this.wordsToTest.length - 1) {
        this.currentWordIndex++;
        if (this.currentTestMode === 'typing') {
          this.$nextTick(() => {
            this.$refs.typingInput?.focus();
          });
        }
      } else {
        this.testFinished = true;
      }
    },
    restartTest() {
      this.learnedWords = [];
      saveToLocalStorage('learnedWords', []);
      this.prepareTest();
      this.testFinished = false;
    },
    handleKeyPress(e) {
      if (this.showFeedback && e.key === 'Enter') {
        this.nextWord();
      }
    },
    generateOptions() {
      if (!this.currentWord || this.userWords.length < 2) return [];
      const allOptions = this.userWords.map(word => word.english);
      const uniqueOptions = [...new Set(allOptions)];
      const otherOptions = uniqueOptions.filter(opt => opt !== this.currentWord.english);
      let wrongOptions = [];
      if (otherOptions.length >= 3) {
        wrongOptions = [...otherOptions].sort(() => 0.5 - Math.random()).slice(0, 3);
      } else {
        wrongOptions = [...otherOptions];
        while (wrongOptions.length < 3) {
          wrongOptions.push(...otherOptions);
        }
        wrongOptions = wrongOptions.slice(0, 3);
      }
      return [...wrongOptions, this.currentWord.english].sort(() => 0.5 - Math.random());
    },
  },
};
</script>

<style scoped>
.page-content {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  font-family: 'Arial', sans-serif;
}

.page-title {
  text-align: center;
  margin-bottom: 30px;
  color: #ececec;
  font-size: 2.5em;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.card {
  padding: 25px;
  background: #484848;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card:hover {
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.no-words {
  text-align: center;
  padding: 40px;
}

.no-words-message {
  margin-bottom: 20px;
  color: #666;
  font-size: 1.2em;
}

.primary-button {
  padding: 12px 25px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  text-decoration: none;
  display: inline-block;
  font-size: 1em;
}

.primary-button:hover {
  background: #45a049;
}

.test-container {
  max-width: 600px;
  margin: 0 auto;
}

.progress-container {
  margin-bottom: 25px;
  text-align: center;
}

.progress-info {
  margin-bottom: 10px;
  color: #444;
  font-size: 1.1em;
}

.progress-bar {
  height: 12px;
  background: #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #4CAF50;
  transition: width 0.5s ease-in-out;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.5s ease;
}

.slide-fade-enter, .slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

.zoom-enter-active, .zoom-leave-active {
  transition: all 0.5s ease;
}

.zoom-enter, .zoom-leave-to {
  transform: scale(0.9);
  opacity: 0;
}

@media (max-width: 600px) {
  .page-content {
    padding: 15px;
  }
  .page-title {
    font-size: 2em;
  }
  .card {
    padding: 15px;
  }
}
</style>