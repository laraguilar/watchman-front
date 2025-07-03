<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Bars3Icon } from '@heroicons/vue/24/solid';
import Sidebar from './components/Sidebar.vue';

// Estados para controlar a sidebar
const isSidebarCollapsed = ref(false);
const isMobileMenuOpen = ref(false);
const isMobile = ref(false);

// Verificar se é mobile
const checkIfMobile = () => {
  isMobile.value = window.innerWidth < 768;
  if (isMobile.value) {
    isSidebarCollapsed.value = true;
    isMobileMenuOpen.value = false;
  }
};

// Método para alternar o estado da sidebar
const toggleSidebar = () => {
  if (isMobile.value) {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
  } else {
    isSidebarCollapsed.value = !isSidebarCollapsed.value;
  }
};

// Método para fechar menu mobile
const closeMobileMenu = () => {
  if (isMobile.value) {
    isMobileMenuOpen.value = false;
  }
};

onMounted(() => {
  checkIfMobile();
  window.addEventListener('resize', checkIfMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkIfMobile);
});
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- Header com menu hambúrguer para mobile -->
    <header class="md:hidden bg-gray-900 text-white p-4 flex items-center justify-between">
      <h1 class="text-lg font-semibold">Watchman</h1>
      <button
        @click="toggleSidebar"
        class="p-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
      >
        <Bars3Icon class="h-6 w-6" />
      </button>
    </header>

    <div class="flex flex-1 relative">
      <!-- Overlay para mobile -->
      <div
        v-if="isMobile && isMobileMenuOpen"
        class="fixed inset-0 bg-black bg-opacity-50 z-40"
        @click="closeMobileMenu"
      ></div>

      <!-- Sidebar -->
      <aside
        v-if="!isMobile"
        :class="[
          'bg-gray-900 shadow-lg transition-all duration-300 flex-shrink-0 pt-4 relative text-gray-300',
          {
            'w-[250px]': !isSidebarCollapsed,
            'w-[60px]': isSidebarCollapsed,
          }
        ]"
      >
        <Sidebar
          :is-collapsed="isSidebarCollapsed"
          :is-mobile="false"
          @toggle-collapse="toggleSidebar"
          @close-mobile="closeMobileMenu"
        />
      </aside>

      <!-- Sidebar Mobile (overlay) -->
      <aside
        v-if="isMobile"
        :class="[
          'fixed top-0 left-0 h-full w-[250px] z-50 bg-gray-900 shadow-lg transition-transform duration-300 text-gray-300',
          {
            'transform translate-x-0': isMobileMenuOpen,
            'transform -translate-x-full': !isMobileMenuOpen,
          }
        ]"
      >
        <Sidebar
          :is-collapsed="false"
          :is-mobile="true"
          @toggle-collapse="toggleSidebar"
          @close-mobile="closeMobileMenu"
        />
      </aside>

      <!-- Main content -->
      <main class="flex-1 p-5 bg-gray-300 text-gray-200 overflow-y-auto transition-all duration-300">
        <RouterView />
      </main>
    </div>
  </div>
</template>
