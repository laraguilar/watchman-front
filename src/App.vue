<script setup lang="ts">
import { ref } from 'vue'; // Importe 'ref' para criar variáveis reativas
import Sidebar from './components/Sidebar.vue'; // Importe o componente da Sidebar

// Estado para controlar o recuo da sidebar
const isSidebarCollapsed = ref(false);

// Método para alternar o estado da sidebar
const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};
</script>

<template>
  <div id="app-layout">
    <header class="app-header">
      <div class="logo-container">
        <img src="@/assets/logo.png" alt="Logo" class="header-logo">
      </div>
      <h1 class="system-title">Controle de Notas Ficais</h1>
      </header>

    <div class="main-content-wrapper">
      <aside :class="['app-sidebar', { 'sidebar-collapsed': isSidebarCollapsed }]">
        <Sidebar :is-collapsed="isSidebarCollapsed" @toggle-collapse="toggleSidebar" />
      </aside>

      <main :class="['app-main', { 'main-expanded': isSidebarCollapsed }]">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
#app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Ocupa a altura total da viewport */
}

.app-header {
  background-color: #242424; /* Um tom de preto para a barra superior */
  color: #E0E0E0; /* Cor do texto claro */
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); /* Sombra mais escura */
  height: 60px;
}

.logo-container {
  display: flex;
  align-items: center;
}

.header-logo {
  height: 75px;
  align: center;
  filter: invert(1);
}

.system-title {
  margin: 0 auto;
  font-size: 1.5em;
  font-weight: normal;
}

.main-content-wrapper {
  display: flex;
  flex: 1;
}

.app-sidebar {
  width: 250px;
  background-color: #1A1A1A; /* Fundo mais escuro para a sidebar */
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.4); /* Sombra mais escura */
  transition: width 0.3s ease;
  flex-shrink: 0;
  padding-top: 15px;
  position: relative;
  color: #B0B0B0; /* Cor do texto geral na sidebar */
}

.sidebar-collapsed {
  width: 60px;
}

.app-main {
  flex: 1;
  padding: 20px;
  background-color: #242424; /* O mesmo tom da barra superior para o fundo do conteúdo */
  color: #E0E0E0; /* Cor do texto claro para o conteúdo */
  overflow-y: auto;
  transition: margin-left 0.3s ease;
}

.main-expanded {
  margin-left: 0;
}

/* Responsividade (exemplo) */
@media (max-width: 768px) {
  .app-sidebar {
    width: 0;
    overflow: hidden;
  }

  .sidebar-collapsed {
    width: 60px;
  }

  .app-main {
    margin-left: 0;
  }
}
</style>