<template>
  <div class="page-content">
    <h1>Добавить новое слово</h1>

    <WordThemes @add-theme="addThemeWords" />

    <WordInputForm
      :newRussian="newRussian"
      :newEnglish="newEnglish"
      :message="message"
      :messageType="messageType"
      @update:newRussian="val => newRussian = val"
      @update:newEnglish="val => newEnglish = val"
      @add-word="addWord"
    />

    <WordList
      v-if="userWords.length > 0"
      :words="sortedWords"
      :sortAscending="sortAscending"
      @toggle-sort="toggleSort"
      @remove-word="removeWord"
      @export-words="exportWords"
      @clear-all="confirmClearAll"
      @update-words="updateWords"
    />
  </div>
</template>

<script>
import WordInputForm from '@/components/WordInputForm.vue'
import WordThemes from '@/components/WordThemes.vue'
import WordList from '@/components/WordList.vue'
import wordMixin from '@/mixins/wordMixin.js'

export default {
  name: 'AddWordView',
  components: {
    WordInputForm,
    WordList,
    WordThemes
  },
  mixins: [wordMixin],
  data() {
    return {
      newRussian: '',
      newEnglish: '',
      message: '',
      messageType: '',
      sortAscending: true,
      userWords: JSON.parse(localStorage.getItem('englishWords')) || []
    }
  },
  computed: {
    sortedWords() {
      return [...this.userWords].sort((a, b) => {
        return this.sortAscending
          ? a.russian.localeCompare(b.russian)
          : b.russian.localeCompare(a.russian)
      })
    }
  },
  methods: {
    updateWords(updatedWords) {
      this.userWords = updatedWords;
      localStorage.setItem('englishWords', JSON.stringify(updatedWords));
    },

    toggleSort() {
      this.sortAscending = !this.sortAscending;
    },

    removeWord(index) {
      this.userWords.splice(index, 1);
      localStorage.setItem('englishWords', JSON.stringify(this.userWords));
    },

    isDuplicate(word) {
      return this.userWords.some(w => 
        w && w.russian && w.english &&
        w.russian.trim().toLowerCase() === word.russian.trim().toLowerCase() &&
        w.english.trim().toLowerCase() === word.english.trim().toLowerCase()
      );
    },

    addWord() {
      const russian = this.newRussian.trim();
      const english = this.newEnglish.trim().toLowerCase();

      if (!russian || !english) {
        this.showMessage('Оба поля должны быть заполнены', 'error');
        return;
      }

      const newWord = { russian, english, status: 'learning' };

      if (this.isDuplicate(newWord)) {
        this.showMessage('Это слово уже есть в словаре!', 'error');
        return;
      }

      this.userWords.push(newWord);
      localStorage.setItem('englishWords', JSON.stringify(this.userWords));
      this.showMessage(`Слово "${russian} - ${english}" добавлено!`, 'success');

      // Очистить поля ввода после добавления
      this.newRussian = '';
      this.newEnglish = '';
    },

    addThemeWords(words) {
      const filtered = words.filter(word => !this.isDuplicate(word));
      if (filtered.length === 0) {
        this.showMessage('Все слова из темы уже есть в словаре!', 'info');
        return;
      }
      this.userWords.push(...filtered);
      localStorage.setItem('englishWords', JSON.stringify(this.userWords));
      this.showMessage(`Добавлено ${filtered.length} новых слов из темы.`, 'success');
    },

    showMessage(text, type = 'success') {
      this.message = text;
      this.messageType = type;
      setTimeout(() => {
        this.message = '';
        this.messageType = '';
      }, 3000);
    },

    exportWords() {
      // Реализация экспорта
    },

    confirmClearAll() {
      if (confirm('Вы уверены, что хотите удалить все слова?')) {
        this.userWords = [];
        localStorage.removeItem('englishWords');
      }
    }
  }
}
</script>




<style scoped>
.page-content {
  max-width: 800px;
  margin: 0 auto;

}

h1 {
  color: #e8e8e8;
  margin-bottom: 30px;
}
</style>