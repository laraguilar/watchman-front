<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
import { ref } from 'vue'

// Ref para armazenar o arquivo XML selecionado
const xmlFile = ref<File | null>(null)

// Função para ler o arquivo XML
const handleFileUpload = (event: Event) => {
  const fileInput = event.target as HTMLInputElement
  if (fileInput.files && fileInput.files[0]) {
    xmlFile.value = fileInput.files[0]
    // Lê o arquivo XML
    const reader = new FileReader()
    reader.onload = () => {
      // Aqui você pode fazer algo com o conteúdo do arquivo XML
      const xmlContent = reader.result as string
      console.log('Conteúdo do XML:', xmlContent)
      // Aqui você pode parsear o XML ou processá-lo como necessário
    }
    reader.readAsText(xmlFile.value)
  }
}
</script>

<template>
  <main class="flex flex-col w-full h-screen justify-center align-middle p-4 text-center">
    <!-- Header -->
    <div class=""> 
      <h1 class="text-4xl font-bold">Watchman</h1>
      <p class="">Controle de Notas Fiscais</p>
    </div>

    <!-- Campo para enviar o XML -->
    <div class="mt-8 flex flex-col w-full justify-items-center p-2">
      <form action="" class="">
        <label for="fileinput">Selecione a NF em XML</label>
        <div class="w-full my-2">
          <input 
          type="file" 
          accept=".xml" 
          @change="handleFileUpload" 
          class="border p-2 w-80 justify-self-center"
        />
        </div>
        <p v-if="xmlFile">Arquivo selecionado: {{ xmlFile.name }}</p>
        <button type="submit"
        class="bg-green-600 p-2 rounded text-white font-bold">Enviar</button>
      </form>
    </div>
  </main>
</template>
