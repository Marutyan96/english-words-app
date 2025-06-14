<template>
  <div id="app">
    <!--  навигационное меню -->
    <nav class="main-nav">
      <router-link to="/">Главная</router-link> 
      <router-link to="/words-test">Тест слов</router-link> 
      <router-link to="/add-word">Добавить слово</router-link>
      <router-link to="/dictionary">Словарь</router-link>

    </nav>
    
    <!-- Основной контент -->
    <main class="content-container">
      <router-view/>
    </main>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* Базовые стили */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  min-height: 100vh;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  background-color: rgb(6, 67, 118); /* Перенесли фон сюда */
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  color: #fff; /* Белый текст для контраста с синим фоном */
}

.main-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 100;
  text-align: center;
  width: 100%;
}

.main-nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  margin: 0 10px;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.main-nav a:hover {
  background-color: #f5f5f5;
}

.main-nav a.router-link-exact-active {
  color: #42b983;
}

.content-container {
  margin: 70px auto 0; /* Убрали нижний отступ, так как фон теперь на body */
  padding: 20px;
  width: 100%;
  flex: 1;
  background-color: white; /* Белый фон для контента */
  color: #2c3e50; /* Стандартный цвет текста */
}
</style>