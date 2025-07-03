<script setup lang="ts">
import { ref } from 'vue'
import { uploadInvoiceFile } from '@/services/notaFiscalService'; // Importe o novo serviço

// Ref para armazenar o arquivo XML selecionado
const xmlFile = ref<File | null>(null)
const uploadMessage = ref<string>('') // Adiciona uma ref para mensagens de upload
const uploadSuccess = ref<boolean | null>(null) // Adiciona uma ref para status de sucesso/erro
const isDragOver = ref<boolean>(false) // Estado para controlar o visual durante drag over

// Função para processar o arquivo selecionado
const processFile = (file: File) => {
  // Limpar mensagens anteriores
  uploadMessage.value = ''
  uploadSuccess.value = null

  if (file && file.type === 'text/xml' || file.name.endsWith('.xml')) {
    xmlFile.value = file
    // Opcional: Ler o conteúdo do arquivo no frontend para debug ou pré-visualização
    const reader = new FileReader()
    reader.onload = () => {
      const xmlContent = reader.result as string
      console.log('Conteúdo do XML:', xmlContent)
    }
    reader.readAsText(xmlFile.value)
  } else {
    uploadMessage.value = 'Por favor, selecione apenas arquivos XML.'
    uploadSuccess.value = false
  }
}

// Função para lidar com a seleção do arquivo
const handleFileUpload = (event: Event) => {
  const fileInput = event.target as HTMLInputElement
  if (fileInput.files && fileInput.files[0]) {
    processFile(fileInput.files[0])
  }
}

// Funções para drag and drop
const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false

  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    processFile(files[0])
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

    // Limpar o arquivo selecionado e o input
    xmlFile.value = null
    const fileInput = document.getElementById('fileinput') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
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
  <main class="min-h-screen flex items-center justify-center p-5 bg-gray-50 text-gray-700 rounded-lg shadow-sm  dark:bg-gray-900 dark:text-gray-100">
    <div class="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 space-y-6">
      <h1 class="text-4xl font-extrabold text-center text-gray-800 dark:text-gray-200">Upload de Nota Fiscal</h1>

      <form @submit.prevent="submitFile" class="space-y-6">
        <div>
          <label for="fileinput" class="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Selecione a NF em XML
          </label>

          <!-- Área de drag and drop -->
          <div
            @dragover="handleDragOver"
            @dragleave="handleDragLeave"
            @drop="handleDrop"
            :class="{
              'border-blue-400 bg-blue-50 dark:bg-blue-900/20': isDragOver,
              'border-gray-300 dark:border-gray-600': !isDragOver
            }"
            class="relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 hover:border-gray-400 dark:hover:border-gray-500"
          >
            <input
              type="file"
              id="fileinput"
              accept=".xml"
              @change="handleFileUpload"
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            <div class="space-y-3">
              <!-- Ícone de upload -->
              <div class="mx-auto w-12 h-12 text-gray-400 dark:text-gray-500">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
              </div>

              <!-- Texto principal -->
              <div v-if="!xmlFile">
                <p class="text-lg font-medium text-gray-700 dark:text-gray-300">
                  Arraste e solte seu arquivo aqui
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  ou clique para selecionar
                </p>
                <p class="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  Apenas arquivos XML são aceitos
                </p>
              </div>

              <!-- Arquivo selecionado -->
              <div v-else class="space-y-2">
                <p class="text-sm text-green-600 dark:text-green-400 font-medium">
                  ✓ Arquivo selecionado
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ xmlFile.name }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Clique aqui para selecionar outro arquivo
                </p>
              </div>
            </div>
          </div>
        </div>

        <button type="submit"
                :disabled="!xmlFile"
                :class="{
                  'bg-green-600 hover:bg-green-700 focus:ring-green-500 dark:bg-green-700 dark:hover:bg-green-600 cursor-pointer': xmlFile,
                  'bg-gray-400 cursor-not-allowed dark:bg-gray-600': !xmlFile
                }"
                class="w-full py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white
                       focus:outline-none focus:ring-2 focus:ring-offset-2
                       dark:focus:ring-offset-gray-800 transition-colors duration-200">
          Enviar XML
        </button>
      </form>

      <div v-if="uploadMessage"
           :class="{
             'bg-green-100 border-green-400 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-300': uploadSuccess,
             'bg-red-100 border-red-400 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-300': uploadSuccess === false,
             'p-4 rounded-md flex items-center space-x-3': true
           }"
           class="mt-4">
           <svg v-if="uploadSuccess" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
           <svg v-else class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <p class="font-medium">{{ uploadMessage }}</p>
      </div>
    </div>
  </main>
</template>
