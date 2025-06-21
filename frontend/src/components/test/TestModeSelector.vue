<template>
  <div class="card test-mode-selector">
    <h2>Выберите режим тестирования:</h2>
    <div class="mode-options">
      <button 
        v-for="mode in testModes" 
        :key="mode.value"
        @click="startTest(mode.value)"
        class="mode-button"
        :data-mode="mode.value"
      >
        {{ mode.label }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TestModeSelector',
  props: {
    testModes: {
      type: Array,
      required: true
    },
    startTest: {
      type: Function,
      required: true
    }
  }
}
</script>

<style scoped>
.card.test-mode-selector {
  padding: 20px;
  margin-bottom: 20px;
  background: #2c2c2c;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.mode-options {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.mode-button {
  padding: 10px 20px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.mode-button:hover {
  background: #45a049;
}
</style>