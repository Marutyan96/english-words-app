<template>
  <div class="test-content">
    <div class="word-display">
      <h2 class="word-text">{{ currentWord.russian }}</h2>
    </div>
    <div class="typing-container">
      <input
        :value="typedAnswer"
        @input="$emit('update:typed-answer', $event.target.value)"
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
</template>

<script>
export default {
  name: 'TestTyping',
  props: {
    currentWord: {
      type: Object,
      required: true
    },
    showFeedback: {
      type: Boolean,
      default: false
    },
    typedAnswer: {
      type: String,
      default: ''
    },
    checkTypedAnswer: {
      type: Function,
      required: true
    }
  },
  mounted() {
    if (!this.showFeedback) {
      this.$refs.typingInput.focus();
    }
  }
}
</script>

<style scoped>
.typing-container {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}
.typing-input {
  background-color: #343434;
  color: rgb(254, 254, 254);
  padding: 10px;
  width: 200px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
.check-button {
  padding: 10px 20px;
  background: #4CAF50;
  color: rgb(0, 0, 0);
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.check-button:disabled {
  background: #cccccc;
  color: rgb(29, 29, 29);
  cursor: not-allowed;
}
</style>