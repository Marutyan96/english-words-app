<template>
  <div class="card word-list">
    <div class="word-list-header">
      <h3>Ваш словарь ({{ words.length }} {{ pluralize(words.length, ['слово', 'слова', 'слов']) }})</h3>
      <button 
        @click="$emit('toggle-sort')" 
        class="sort-button"
        :aria-label="sortAscending ? 'Сортировка по возрастанию' : 'Сортировка по убыванию'"
      >
        {{ sortAscending ? 'А-Я ↑' : 'Я-А ↓' }}
        <span class="visually-hidden">Текущая сортировка: {{ sortAscending ? 'по возрастанию' : 'по убыванию' }}</span>
      </button>
    </div>
    
    <ul class="words-container" v-if="words.length > 0">
      <li 
        v-for="(word, index) in words" 
        :key="word.id || index"
        class="word-item"
        :class="{ 
          'even-item': index % 2 === 0,
          'learned': word.status === 'learned'
        }"
      >
        <span class="word-pair">
          <span class="russian-word">{{ word.russian }}</span>
          <span class="separator" aria-hidden="true">→</span>
          <span class="english-word">{{ word.english }}</span>
        </span>

        <div class="word-actions">
          <button 
            @click="toggleStatus(word)" 
            class="status-button"
            :class="{ 'repeat': word.status === 'learned' }"
            :aria-label="word.status === 'learned' ? 'Пометить для повторения' : 'Пометить как выученное'"
          >
            {{ word.status === 'learned' ? 'Повторить' : 'Выучено' }}
          </button>

          <button 
            @click="$emit('remove-word', word.id || index)" 
            class="delete-button"
            aria-label="Удалить слово"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </li>
    </ul>
    
    <div class="empty-state" v-else>
      <p>Ваш словарь пуст. Добавьте первое слово!</p>
    </div>
    
    <div class="word-list-actions" v-if="words.length > 0">
      <button 
        @click="$emit('export-words')" 
        class="action-button export-button"
      >
        Экспорт в CSV
      </button>
      <button 
        @click="$emit('clear-all')" 
        class="action-button clear-button"
        :disabled="words.length === 0"
      >
        Очистить всё
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WordList',
  props: {
    words: {
      type: Array,
      required: true,
      validator: value => value.every(word => 'russian' in word && 'english' in word && 'status' in word)
    },
    sortAscending: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    toggleStatus(word) {
      const newStatus = word.status === 'learned' ? 'learning' : 'learned';
      const updatedWord = { ...word, status: newStatus };
      
      // Создаем новый массив с обновленным словом
      const updatedWords = this.words.map(w => 
        (w.id && w.id === word.id) || 
        (w.russian === word.russian && w.english === word.english) 
          ? updatedWord 
          : w
      );
      
      // Обновляем localStorage
      localStorage.setItem('englishWords', JSON.stringify(updatedWords));
      
      // Отправляем событие родителю
      this.$emit('update-words', updatedWords);
    },
    pluralize(count, words) {
      const cases = [2, 0, 1, 1, 1, 2];
      return words[
        count % 100 > 4 && count % 100 < 20 ? 2 : cases[Math.min(count % 10, 5)]
      ];
    }
  }
}
</script>

<style scoped>
.word-list {
  margin-top: 30px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  background-color: #fff;
}

.word-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eaeaea;
}

.word-list-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
  font-weight: 600;
}

.sort-button {
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 5px;
}

.sort-button:hover {
  background: #f0f0f0;
  border-color: #ccc;
}

.words-container {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 400px;
  overflow-y: auto;
}

.word-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  transition: all 0.2s;
}

.word-item:hover {
  background-color: #f8f9fa;
}

.word-item.learned {
  opacity: 0.8;
}

.word-item.learned .word-pair {
  text-decoration: line-through;
}

.word-item.learned .english-word {
  color: #4caf50;
}

.even-item {
  background-color: #fafafa;
}

.word-pair {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-grow: 1;
  min-width: 0;
}

.russian-word, .english-word {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.english-word {
  font-weight: 500;
  color: #1976d2;
}

.separator {
  color: #999;
}

.word-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 15px;
}

.status-button {
  padding: 5px 10px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #f5f5f5;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 13px;
  white-space: nowrap;
}

.status-button:hover {
  background-color: #e0e0e0;
}

.status-button.repeat {
  background-color: #fff8e1;
  color: #ff8f00;
}

.status-button.repeat:hover {
  background-color: #ffe0b2;
}

.delete-button {
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.delete-button:hover {
  background-color: #ffeeee;
  color: #c0392b;
}

.delete-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.delete-button svg {
  display: block;
}

.word-list-actions {
  display: flex;
  gap: 10px;
  padding: 15px 20px;
  background-color: #f8f9fa;
  border-top: 1px solid #eaeaea;
}

.action-button {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.action-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.export-button {
  background-color: #e3f2fd;
  color: #1976d2;
}

.export-button:hover:not(:disabled) {
  background-color: #bbdefb;
}

.clear-button {
  background-color: #ffebee;
  color: #d32f2f;
}

.clear-button:hover:not(:disabled) {
  background-color: #ffcdd2;
}

.empty-state {
  padding: 30px 20px;
  text-align: center;
  color: #666;
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

@media (max-width: 600px) {
  .word-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .word-actions {
    margin-left: 0;
    align-self: flex-end;
  }
  
  .word-list-actions {
    flex-direction: column;
  }
}
</style>