<template>
  <nav class="sidebar-nav">
    <div class="toggle-button-container">
      <button @click="toggleSidebar" class="sidebar-toggle-button">
        <i :class="isCollapsed ? 'fas fa-angle-right' : 'fas fa-angle-left'"></i>
        </button>
    </div>

    <ul class="menu-list">
      <li class="menu-item">
        <router-link to="/" class="menu-link" :class="{ 'collapsed-link': isCollapsed }">
          <i class="fas fa-home menu-icon"></i> <span v-if="!isCollapsed" class="menu-text">Carregar Nota fiscal</span>
        </router-link>
      </li>
      <li class="menu-item">
        <router-link to="/notas-fiscais" class="menu-link" :class="{ 'collapsed-link': isCollapsed }">
          <i class="fas fa-list-alt menu-icon"></i> <span v-if="!isCollapsed" class="menu-text">Listagem de Notas Fiscais</span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'Sidebar',
  props: {
    isCollapsed: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    toggleSidebar() {
      this.$emit('toggle-collapse'); 
    },
  },
};
</script>

<style scoped>
.sidebar-nav {
  height: 100%; /* Ocupa a altura total do aside */
  display: flex;
  flex-direction: column;
  padding-top: 20px; 
  background-color: #1a1a1a; 
  color: #e0e0e0; 
}

.toggle-button-container {
  text-align: right;
  padding: 0 10px 20px 0; 
}

.sidebar-toggle-button {
  background: none;
  border: none;
  color: #a0a0a0; 
  font-size: 1.5em;
  cursor: pointer;
  padding: 5px;
  border-radius: 5px;
  transition: background-color 0.2s;
}

.sidebar-toggle-button:hover {
  background-color: rgba(255, 255, 255, 0.08); 
  color: #ffffff; 
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  margin-bottom: 5px;
}

.menu-link {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: #e0e0e0; 
  text-decoration: none;
  transition: background-color 0.2s, padding 0.3s ease, color 0.2s ease;
  white-space: nowrap; 
  overflow: hidden; 
}

.menu-link:hover {
  background-color: #2c3e50; 
  color: #ffffff; 
}

.menu-link.router-link-exact-active {
  background-color: #007bff; 
  color: #ffffff; 
  font-weight: bold;
}

.menu-icon {
  margin-right: 15px; 
  font-size: 1.2em;
  width: 25px; 
  text-align: center;
}

.menu-text {
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

.collapsed-link {
  justify-content: center; 
  padding: 12px 0px; 
}

.collapsed-link .menu-icon {
  margin-right: 0; 
}

.collapsed-link .menu-text {
  opacity: 0;
  visibility: hidden;
  width: 0;
}
</style>