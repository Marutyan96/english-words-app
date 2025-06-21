<template>
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
</template>

<script>
export default {
  name: 'Results',
  props: {
    testFinished: {
      type: Boolean,
      default: false
    },
    correctAnswers: {
      type: Number,
      default: 0
    },
    wordsToTest: {
      type: Array,
      required: true
    },
    correctPercentage: {
      type: Number,
      default: 0
    },
    scoreClass: {
      type: String,
      default: ''
    },
    restartTest: {
      type: Function,
      required: true
    }
  }
}
</script>

<style scoped>
.results-container {
  text-align: center;
  padding: 20px;
}
.results-title {
  margin-bottom: 20px;
}
.score-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}
.percentage-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
}
.excellent { background: #4CAF50; color: white; }
.good { background: #8BC34A; color: white; }
.average { background: #FF9800; color: white; }
.poor { background: #f44336; color: white; }
.results-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
}
.primary-button {
  padding: 10px 20px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.secondary-button {
  padding: 10px 20px;
  background: #ddd;
  color: #333;
  border: none;
  border-radius: 5px;
  text-decoration: none;
}
</style>