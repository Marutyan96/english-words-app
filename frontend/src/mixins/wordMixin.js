export default {
  methods: {
    addWord() {
      if (!this.newRussian.trim() || !this.newEnglish.trim()) {
        this.showMessage('Оба поля должны быть заполнены', 'error')
        return
      }
      
      const newWord = {
        russian: this.newRussian.trim(),
        english: this.newEnglish.trim().toLowerCase(),
        status: 'learning'
      }
      
      const exists = this.userWords.some(word => 
        word.russian === newWord.russian || 
        word.english === newWord.english
      )
      
      if (exists) {
        this.showMessage('Такое слово уже есть в словаре', 'error')
        return
      }
      
      this.userWords.push(newWord)
      this.saveWords()
      this.showMessage(`Слово "${newWord.russian} - ${newWord.english}" добавлено!`, 'success')
      this.newRussian = ''
      this.newEnglish = ''
    },
    
    removeWord(index) {
      this.userWords.splice(index, 1)
      this.saveWords()
      this.showMessage('Слово удалено', 'info')
    },
    
    saveWords() {
      localStorage.setItem('englishWords', JSON.stringify(this.userWords))
    },
    
    showMessage(text, type) {
      this.message = text
      this.messageType = type
      setTimeout(() => {
        this.message = ''
        this.messageType = ''
      }, 3000)
    },
    
    toggleSort() {
      this.sortAscending = !this.sortAscending
    },
    
    confirmClearAll() {
      if (confirm('Вы уверены, что хотите удалить все слова?')) {
        this.userWords = []
        this.saveWords()
        this.showMessage('Все слова удалены', 'info')
      }
    },
    
    exportWords() {
      if (this.userWords.length === 0) {
        this.showMessage('Нет слов для экспорта', 'error')
        return
      }
      
      const csvContent = this.userWords
        .map(word => `${word.russian},${word.english}`)
        .join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'english_words.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      this.showMessage('Слова экспортированы в CSV', 'success')
    },
    
    importWords(event) {
      const file = event.target.files[0]
      if (!file) return
      
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const content = e.target.result
          const lines = content.split('\n').filter(line => line.trim())
          
          const importedWords = lines.map(line => {
            const [russian, english] = line.split(',')
            return {
              russian: russian.trim(),
              english: english?.trim().toLowerCase() || ''
            }
          }).filter(word => word.russian && word.english)
          
          const uniqueWords = importedWords.filter(newWord => 
            !this.userWords.some(existingWord => 
              existingWord.russian === newWord.russian || 
              existingWord.english === newWord.english
            )
          )
          
          if (uniqueWords.length === 0) {
            this.showMessage('Все слова уже есть в словаре или файл пуст', 'error')
            return
          }
          
          this.userWords = [...this.userWords, ...uniqueWords]
          this.saveWords()
          this.showMessage(`Добавлено ${uniqueWords.length} новых слов`, 'success')
          
        } catch (error) {
          this.showMessage('Ошибка при чтении файла', 'error')
          console.error(error)
        }
      }
      reader.readAsText(file)
      event.target.value = ''
    }
  }
}