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
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  min-height: 100vh;
  background-color: var(--color-background);
  color: var(--color-text);
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  color: var(--color-text);
}

.main-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: var(--color-background-soft);
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.5);
  z-index: 100;
  text-align: center;
}

.main-nav a {
  font-weight: bold;
  color: var(--color-heading);
  text-decoration: none;
  margin: 0 10px;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.main-nav a:hover {
  background-color: var(--color-background-mute);
}

.main-nav a.router-link-exact-active {
  color: var(--color-accent);
}

.content-container {
  margin: 70px auto 0;
  padding: 20px;
  width: 100%;
  flex: 1;
  background-color: var(--color-background-soft);
  color: var(--color-heading);
}

</style>