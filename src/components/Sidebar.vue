<template>
  <nav class="h-full flex flex-col pt-5 bg-gray-900 text-gray-300">
    <div class="flex justify-center pb-4">
      <router-link to="/" class="cursor-pointer">
        <img
          src="@/assets/logo.png"
          alt="Logo"
          class="w-auto brightness-0 invert transition-all duration-300 hover:opacity-80"
          :class="{ 'h-20': !isCollapsed, 'h-10': isCollapsed }"
        >
      </router-link>
    </div>

    <div class="text-right px-2.5 pb-5">
      <button
        @click="toggleSidebar"
        class="bg-transparent border-none text-gray-400 text-2xl cursor-pointer p-1.5 rounded-md transition-colors duration-200 hover:bg-white hover:bg-opacity-10 hover:text-white"
      >
        <ChevronRightIcon v-if="isCollapsed" class="h-6 w-6" />
        <ChevronLeftIcon v-else class="h-6 w-6" />
      </button>
    </div>

    <ul class="list-none p-0 m-0">
      <li class="mb-1">
        <router-link
          to="/"
          class="flex items-center py-3 text-gray-300 no-underline transition-all duration-200 whitespace-nowrap overflow-hidden hover:bg-slate-700 hover:text-white"
          :class="{
            'px-3 justify-center': isCollapsed,
            'px-5': !isCollapsed,
            'bg-blue-600 text-white font-bold': $route.path === '/'
          }"
        >
          <ArrowUpTrayIcon class="h-6 w-6" :class="{ 'mr-0': isCollapsed, 'mr-3': !isCollapsed }" />
          <span
            v-if="!isCollapsed"
            class="transition-all duration-300 w-full"
            :class="{ 'opacity-0 invisible w-0': isCollapsed }"
          >
            Carregar Nota fiscal
          </span>
        </router-link>
      </li>
      <li class="mb-1">
        <router-link
          to="/notas-fiscais"
          class="flex items-center py-3 text-gray-300 no-underline transition-all duration-200 whitespace-nowrap overflow-hidden hover:bg-slate-700 hover:text-white"
          :class="{
            'px-3 justify-center': isCollapsed,
            'px-5': !isCollapsed,
            'bg-blue-600 text-white font-bold': $route.path === '/notas-fiscais'
          }"
        >
          <DocumentTextIcon class="h-6 w-6" :class="{ 'mr-0': isCollapsed, 'mr-3': !isCollapsed }" />
          <span
            v-if="!isCollapsed"
            class="transition-all duration-300 w-full"
            :class="{ 'opacity-0 invisible w-0': isCollapsed }"
          >
            Listagem de Notas Fiscais
          </span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import {
  ArrowUpTrayIcon,
  DocumentTextIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/solid'

export default {
  name: 'SidebarNav',
  components: {
    ArrowUpTrayIcon,
    DocumentTextIcon,
    ChevronLeftIcon,
    ChevronRightIcon
  },
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
