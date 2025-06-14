import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import WordsTestView from '../views/WordsTestView.vue'
import AddWordView from '../views/AddWordView.vue'
import DictionaryView from '../views/DictionaryView.vue' // 🔹 Добавили импорт

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/words-test',
    name: 'words-test',
    component: WordsTestView
  },
  {
    path: '/add-word',
    name: 'add-word',
    component: AddWordView
  },
  {
    path: '/dictionary',
    name: 'dictionary',
    component: DictionaryView // 🔹 Добавили маршрут
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
