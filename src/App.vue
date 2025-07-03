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
  <div class="flex flex-col min-h-screen">
    <div class="flex flex-1">
      <aside :class="[
        'w-[250px] bg-gray-900 shadow-lg transition-all duration-300 flex-shrink-0 pt-4 relative text-gray-300',
        { 'w-[60px]': isSidebarCollapsed }
      ]">
        <Sidebar :is-collapsed="isSidebarCollapsed" @toggle-collapse="toggleSidebar" />
      </aside>

      <main class="flex-1 p-5 bg-gray-300 text-gray-200 overflow-y-auto transition-all duration-300">
        <RouterView />
      </main>
    </div>
  </div>
</template>
