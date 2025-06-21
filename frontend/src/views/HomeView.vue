<template>
  <div class="page-content">
    <h1>Приложение для изучения английских слов</h1>
    <div class="card">
      <p>Тестируйте свои знания, выбирая правильный перевод из 4 вариантов.</p>
      <p>Выученные слова больше не будут появляться в тесте.</p>
      <router-link to="/words-test" class="primary-button">Начать тест</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView'
}
</script>

<style scoped>
.page-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: rgb(210, 210, 210);
}

.card {
  background: rgb(58, 58, 58);
  color: rgb(241, 241, 241);
  
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
  max-width: 600px;
  width: 100%;
  margin-top: 20px;
}

.primary-button {
  display: inline-block;
  margin-top: 20px;
  padding: 12px 24px;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-size: 16px;
  transition: background-color 0.3s;
}

.primary-button:hover {
  background-color: #369f6e;
}
</style>