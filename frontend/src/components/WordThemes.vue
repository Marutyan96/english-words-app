<template>
  <div>
    <!-- Кнопка для открытия модального окна -->
    <button @click="openModal" class="open-themes-btn">
      Темы для изучения
    </button>

    <!-- Модальное окно с темами -->
    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Темы для изучения</h2>
          <button @click="closeModal" class="close-btn">&times;</button>
        </div>
        
        <div class="themes-container">
          <div 
            v-for="theme in visibleThemes" 
            :key="theme.name" 
            class="theme-card"
          >
            <div class="theme-header" @click="toggleTheme(theme.name)">
              <h3>{{ theme.name }}</h3>
              <span class="toggle-icon">{{ isOpen(theme.name) ? '−' : '+' }}</span>
            </div>
            <div v-if="isOpen(theme.name)" class="theme-content">
              <button 
                @click.stop="addTheme(theme)"
                class="add-all-btn"
              >
                ➕ Добавить все слова ({{ theme.words.length }})
              </button>
              <ul class="words-list">
                <li v-for="word in theme.words" :key="word.english" class="word-item">
                  <span class="russian">{{ word.russian }}</span>
                  <span class="separator">—</span>
                  <span class="english">{{ word.english }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { themes } from '@/data/themes'

export default {
  name: 'WordThemesModal',
  data() {
    return {
      themes,
      openedThemes: [],
      addedThemes: JSON.parse(localStorage.getItem('addedThemes')) || [],
      isModalOpen: false
    }
  },
  computed: {
    visibleThemes() {
      return this.themes.filter(theme => !this.addedThemes.includes(theme.name))
    }
  },
  methods: {
    openModal() {
      this.isModalOpen = true
      document.body.style.overflow = 'hidden' // Блокируем скролл страницы
    },
    closeModal() {
      this.isModalOpen = false
      document.body.style.overflow = '' // Восстанавливаем скролл
    },
    toggleTheme(themeName) {
      const index = this.openedThemes.indexOf(themeName)
      if (index > -1) {
        this.openedThemes.splice(index, 1)
      } else {
        this.openedThemes.push(themeName)
      }
    },
    isOpen(themeName) {
      return this.openedThemes.includes(themeName)
    },
    addTheme(theme) {
      this.$emit('add-theme', theme.words)
      
      // Добавляем тему в список добавленных
      this.addedThemes.push(theme.name)
      localStorage.setItem('addedThemes', JSON.stringify(this.addedThemes))
      
      // Закрываем тему после добавления
      const index = this.openedThemes.indexOf(theme.name)
      if (index > -1) {
        this.openedThemes.splice(index, 1)
      }
    }
  }
}
</script>

<style scoped>
/* Стили для кнопки открытия */
.open-themes-btn {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.open-themes-btn:hover {
  background-color: #3aa876;
}

/* Стили модального окна */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: rgb(82, 82, 82);
  color: rgb(249, 255, 254);
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #48dc92;
}

.modal-header h2 {
  margin: 0;
  color: #eafffb;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #48dc92;
  padding: 0 10px;
}

.close-btn:hover {
  color: #309160;
}

/* Остальные стили остаются без изменений */
.themes-container {
  margin-bottom: 20px;
}

.theme-card {
  border: 1px solid #48dc92;
  border-radius: 8px;
  margin-bottom: 12px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.theme-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #717575;
  color: #f8fbff;
  cursor: pointer;
  transition: background-color 0.2s;
}

.theme-header:hover {
  background-color: #549b83;
}

.theme-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #eaf4ff;
}

.toggle-icon {
  font-size: 1.2rem;
  font-weight: bold;
}

.theme-content {
  padding: 0 16px 16px;
}

.add-all-btn {
  display: block;
  width: 100%;
  padding: 8px;
  margin: 12px 0;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-all-btn:hover {
  background-color: #3aa876;
}

.words-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.word-item {
  display: flex;
  padding: 8px 0;
  border-bottom: 1px solid #48dc92;
  align-items: center;
}

.word-item:last-child {
  border-bottom: none;
}

.russian {
  flex: 1;
  font-weight: 500;
}

.english {
  flex: 1;
  color: #2c3e50;
}

.separator {
  margin: 0 10px;
  color: #bbb;
}
</style>