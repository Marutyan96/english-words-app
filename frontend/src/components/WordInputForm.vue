<template>
  <div class="card">
    <form class="add-word-form" @submit.prevent="$emit('add-word')">
      <div class="form-group">
        <label for="russian-word" class="visually-hidden">Russian word</label>
        <input
          id="russian-word"
          :value="newRussian"
          @input="$emit('update:newRussian', $event.target.value)"
          placeholder="Russian"
          class="form-input"
          required
          autocomplete="off"
        >
      </div>
      
      <div class="form-group">
        <label for="english-word" class="visually-hidden">English word</label>
        <input
          id="english-word"
          :value="newEnglish"
          @input="$emit('update:newEnglish', $event.target.value)"
          placeholder="English"
          class="form-input"
          required
          autocomplete="off"
        >
      </div>
      
      <button type="submit" class="primary-button">Добавить слово</button>
      
      <transition name="fade">
        <div v-if="message" :class="['message', messageType]">
          {{ message }}
        </div>
      </transition>
    </form>
  </div>
</template>

<script>
export default {
  name: 'WordInputForm',
  props: {
    newRussian: String,
    newEnglish: String,
    message: String,
    messageType: String
  }
}
</script>

<style scoped>
.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.add-word-form {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  border-color: #42b983;
  outline: none;
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2);
}

.message {
  margin-top: 15px;
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.message.success {
  background-color: #e8f5e9;
  color: #2e7d32;
  border-left: 4px solid #2e7d32;
}

.message.error {
  background-color: #ffebee;
  color: #c62828;
  border-left: 4px solid #c62828;
}

.message.info {
  background-color: #e3f2fd;
  color: #1565c0;
  border-left: 4px solid #1565c0;
}

.primary-button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  font-weight: 500;
}

.primary-button:hover {
  background-color: #3aa876;
  transform: translateY(-1px);
}

.primary-button:active {
  transform: translateY(0);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 480px) {
  .form-input {
    padding: 10px;
    font-size: 14px;
  }
  
  .primary-button {
    padding: 10px 16px;
    font-size: 15px;
  }
}
</style>