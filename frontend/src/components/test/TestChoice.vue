<template>
  <div class="test-content">
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
</template>

<script>
export default {
  name: 'TestChoice',
  props: {
    currentWord: {
      type: Object,
      required: true
    },
    options: {
      type: Array,
      required: true
    },
    showFeedback: {
      type: Boolean,
      default: false
    },
    userAnswer: {
      type: String,
      default: ''
    },
    isCorrect: {
      type: Boolean,
      default: false
    },
    checkAnswer: {
      type: Function,
      required: true
    }
  }
}
</script>

<style scoped>
.test-content {
  text-align: center;
}
.word-display {
  margin-bottom: 20px;
}
.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  max-width: 400px;
  margin: 0 auto;
}
.option-button {
  padding: 10px;
  background: #f0f0f0;
  color: black;
  border: 1px solid #04d592;
  border-radius: 5px;
  cursor: pointer;
}
.option-button.correct {
  background: #4CAF50;
  color: rgb(2, 2, 2);
}
.option-button.incorrect {
  background: #f44336;
  color: white;
}
.option-button.pulse {
  animation: pulse 1s infinite;
}
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
</style>