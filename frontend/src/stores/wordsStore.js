import { defineStore } from 'pinia'

export const useWordsStore = defineStore('wordsStore', {
  state: () => ({
    words: [
      { id: 1, word: 'apple', translation: 'яблоко', status: 'learned' },
      { id: 2, word: 'book', translation: 'книга', status: 'learning' },
      { id: 3, word: 'cat', translation: 'кот', status: 'learning' },
    ]
  }),
  actions: {
    addWord(wordObj) {
      this.words.push({ id: Date.now(), status: 'learning', ...wordObj })
    },
    markAsLearned(id) {
      const word = this.words.find(w => w.id === id)
      if (word) word.status = 'learned'
    }
  },
  getters: {
    learnedWords: state => state.words.filter(w => w.status === 'learned'),
    learningWords: state => state.words.filter(w => w.status === 'learning')
  }
})
