<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue' // Mantenha se você realmente usa este componente
import { ref } from 'vue'
import { uploadInvoiceFile } from '@/services/notaFiscalService'; // Importe o novo serviço

// Ref para armazenar o arquivo XML selecionado
const xmlFile = ref<File | null>(null)
const uploadMessage = ref<string>('') // Adiciona uma ref para mensagens de upload
const uploadSuccess = ref<boolean | null>(null) // Adiciona uma ref para status de sucesso/erro

// Função para lidar com a seleção do arquivo
const handleFileUpload = (event: Event) => {
  const fileInput = event.target as HTMLInputElement
  if (fileInput.files && fileInput.files[0]) {
    xmlFile.value = fileInput.files[0]
    // Opcional: Ler o conteúdo do arquivo no frontend para debug ou pré-visualização
    const reader = new FileReader()
    reader.onload = () => {
      const xmlContent = reader.result as string
      console.log('Conteúdo do XML:', xmlContent)
    }
    reader.readAsText(xmlFile.value)
  }
}

// Função para enviar o arquivo para a API
const submitFile = async () => {
  uploadMessage.value = ''
  uploadSuccess.value = null

  if (!xmlFile.value) {
    uploadMessage.value = 'Por favor, selecione um arquivo XML primeiro.'
    uploadSuccess.value = false
    return
  }

  try {
    const responseData = await uploadInvoiceFile(xmlFile.value);

    uploadMessage.value = responseData.message || 'Arquivo enviado com sucesso!'
    uploadSuccess.value = true
    console.log('Resposta da API:', responseData)
    
    xmlFile.value = null
  } catch (error) {
    let errorMessage = 'Erro desconhecido ao processar requisição.';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      errorMessage = (error as { message: string }).message;
    }

    uploadMessage.value = errorMessage;
    uploadSuccess.value = false;
    console.error('Erro ao enviar o arquivo:', error);
  }
}
</script>

<template>
  <main class="flex flex-col w-full h-screen justify-center align-middle p-4 text-center">
    <div class="">
      <h1 class="text-4xl font-bold">Upload nota fiscal</h1>
     
    </div>

    <div class="mt-8 flex flex-col w-full justify-items-center p-2">
      <form @submit.prevent="submitFile" class="">
        <label for="fileinput" class="block text-lg font-medium text-gray-700 mb-2">Selecione a NF em XML</label>
        <div class="w-full my-2 flex justify-center">
          <input
            type="file"
            id="fileinput"
            accept=".xml"
            @change="handleFileUpload"
            class="block w-full max-w-sm text-sm text-gray-500
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0
                   file:text-sm file:font-semibold
                   file:bg-violet-50 file:text-violet-700
                   hover:file:bg-violet-100"
          />
        </div>
        <p v-if="xmlFile" class="text-sm text-gray-600 mt-2">Arquivo selecionado: <span class="font-semibold">{{ xmlFile.name }}</span></p>
        
        <button type="submit"
                class="mt-4 bg-green-600 p-2 px-6 rounded-lg text-white font-bold
                       hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
          Enviar
        </button>
      </form>

      <div v-if="uploadMessage"
           :class="{
             'text-green-600': uploadSuccess,
             'text-red-600': uploadSuccess === false,
             'p-3 mt-4 rounded-md': true,
             'bg-green-100 border border-green-400': uploadSuccess,
             'bg-red-100 border border-red-400': uploadSuccess === false
           }"
           class="mt-4 max-w-sm mx-auto">
        {{ uploadMessage }}
      </div>
    </div>
    
    </main>
</template>