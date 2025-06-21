<template>
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
</template>

<script>
export default {
  name: 'Feedback',
  props: {
    showFeedback: {
      type: Boolean,
      default: false
    },
    isCorrect: {
      type: Boolean,
      default: false
    },
    currentWord: {
      type: Object,
      required: true
    },
    isLastWord: {
      type: Boolean,
      default: false
    },
    nextWord: {
      type: Function,
      required: true
    }
  }
}
</script>

<style scoped>
.feedback-container {
  text-align: center;
  margin-top: 20px;
}
.feedback-message {
  margin-bottom: 15px;
  font-size: 18px;
}
.correct {
  color: #4CAF50;
}
.incorrect {
  color: #f44336;
}
.feedback-icon {
  margin-right: 5px;
}
.next-button {
  padding: 10px 20px;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>