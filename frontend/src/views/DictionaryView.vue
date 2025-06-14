<template>
  <div class="dictionary-view">
    <h1>📘 Мой словарь</h1>

    <div class="stats">
      <p>🔵 В процессе: {{ learningWords.length }}</p>
      <p>🟢 Выучено: {{ learnedWords.length }}</p>
      <p>📈 Всего: {{ totalWords.length }}</p>
    </div>

    <input
      v-model="searchTerm"
      type="text"
      placeholder="🔍 Поиск слова..."
      class="search-input"
    />

    <div class="words-container">
      <section v-if="learningWordsFiltered.length" class="word-section learning">
        <h2>🔵 В процессе изучения</h2>
        <ul class="word-list">
          <li v-for="word in learningWordsFiltered" :key="word.id">
            <span class="word-pair">
              <span class="russian-word">{{ word.russian }}</span>
              <span class="separator">→</span>
              <span class="english-word">{{ word.english }}</span>
            </span>
          </li>
        </ul>
      </section>

      <section v-if="learnedWordsFiltered.length" class="word-section learned">
        <h2>🟢 Выученные слова</h2>
        <ul class="word-list">
          <li v-for="word in learnedWordsFiltered" :key="word.id">
            <span class="word-pair">
              <span class="russian-word">{{ word.russian }}</span>
              <span class="separator">→</span>
              <span class="english-word">{{ word.english }}</span>
            </span>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'DictionaryView',
  setup() {
    const searchTerm = ref('')
    const userWords = ref([])

    onMounted(() => {
      const saved = JSON.parse(localStorage.getItem('englishWords')) || []
      userWords.value = saved
    })

    const totalWords = computed(() => userWords.value)

    const learnedWords = computed(() =>
      userWords.value.filter(w => w.status === 'learned')
    )

    const learningWords = computed(() =>
      userWords.value.filter(w => w.status !== 'learned')
    )

    const filterWords = (words) => {
      return words.filter(w =>
        w.russian.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        w.english.toLowerCase().includes(searchTerm.value.toLowerCase())
      )
    }

    return {
      searchTerm,
      totalWords,
      learnedWords,
      learningWords,
      learnedWordsFiltered: computed(() => filterWords(learnedWords.value)),
      learningWordsFiltered: computed(() => filterWords(learningWords.value))
    }
  }
}
</script>

<style scoped>
.dictionary-view {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Arial', sans-serif;
  box-sizing: border-box;
}

h1 {
  font-size: 1.8rem;
  color: #333;
  text-align: center;
  margin-bottom: 1.2rem;
}

.stats {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1.2rem;
  font-size: 0.9rem;
  color: #555;
  background: #f5f5f5;
  padding: 0.8rem;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 0.6rem;
  margin: 0 auto 1.5rem;
  display: block;
  font-size: 0.9rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
}

.words-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.word-section {
  padding: 1rem;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  box-sizing: border-box;
  overflow-x: auto;
}

.word-section.learning {
  background: #e6f0ff;
  border: 1px solid #007bff;
}

.word-section.learned {
  background: #e6ffe6;
  border: 1px solid #28a745;
}



.word-section h2 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 0.8rem;
}

.word-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.word-list li {
  padding: 0.6rem 0;
  font-size: 0.95rem;
  border-bottom: 1px solid #eee;
}

.word-list li:last-child {
  border-bottom: none;
}

.word-pair {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.russian-word {
  font-weight: 600;
  color: #333;
}

.english-word {
  color: #555;
}

.separator {
  color: #007bff;
  font-weight: bold;
}

/* Адаптивность */
@media (max-width: 768px) {
  .words-container {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .word-section {
    padding: 0.8rem;
  }

  h1 {
    font-size: 1.5rem;
  }

  .stats {
    flex-direction: column;
    gap: 0.5rem;
    font-size: 0.85rem;
  }

  .search-input {
    max-width: 100%;
  }

  .word-list li {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .dictionary-view {
    padding: 1rem;
  }

  .word-section h2 {
    font-size: 1.1rem;
  }

  .word-list li {
    font-size: 0.85rem;
  }
}
</style>