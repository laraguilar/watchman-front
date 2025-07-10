<template>
  <div class="p-5 bg-gray-50 text-gray-700 rounded-lg shadow-sm">
    <h2 class="text-2xl text-gray-800 mb-6 pb-2 border-b-2 border-gray-200">Lista de Notas Fiscais</h2>
    <div v-if="loading" class="p-4 mt-4 font-medium flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-800 rounded">
      <svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Carregando notas...
    </div>
    <div v-else-if="error" class="p-4 mt-4 font-medium flex items-center gap-2 bg-red-100 border border-red-200 text-red-800 rounded">
       <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      Erro ao carregar notas: {{ error instanceof Error ? error.message : error }}
    </div>
    <div v-else class="overflow-x-auto">
      <table class="w-full border-collapse mt-5 bg-white rounded-md overflow-hidden shadow">
        <thead class="bg-gray-100 text-gray-600">
          <tr>
            <th class="border border-gray-200 py-3 px-4 text-left font-semibold uppercase text-sm">Número</th>
            <th class="border border-gray-200 py-3 px-4 text-left font-semibold uppercase text-sm">Série</th>
            <th class="border border-gray-200 py-3 px-4 text-left font-semibold uppercase text-sm">Chave de Acesso</th>
            <th class="border border-gray-200 py-3 px-4 text-left font-semibold uppercase text-sm">Data de Emissão</th>
            <th class="border border-gray-200 py-3 px-4 text-left font-semibold uppercase text-sm">Natureza da Operação</th>
            <th class="border border-gray-200 py-3 px-4 text-left font-semibold uppercase text-sm">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="note in notes" :key="note.id" class="even:bg-gray-50 hover:bg-gray-200 cursor-pointer">
            <td class="border border-gray-200 py-3 px-4 text-left">{{ note.numero }}</td>
            <td class="border border-gray-200 py-3 px-4 text-left">{{ note.serie }}</td>
            <td class="border border-gray-200 py-3 px-4 text-left">{{ note.chave_acesso }}</td>
            <td class="border border-gray-200 py-3 px-4 text-left">{{ formatter.formatDate(note.data_emissao) }}</td>
            <td class="border border-gray-200 py-3 px-4 text-left">{{ note.natureza_operacao }}</td>
            <td class="border border-gray-200 py-3 px-4 text-left">
              <button @click="openModal(note.chave_acesso)" class="bg-blue-500 text-white border-none py-2 px-4 rounded cursor-pointer text-sm transition-colors duration-200 ease-in-out transform hover:bg-blue-700 hover:-translate-y-px active:bg-blue-800 active:translate-y-0">Visualizar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <NoteDetailsModal
      :isVisible="isModalOpen"
      :chaveAcesso="selectedChaveAcesso || undefined"
      @close="closeModal"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NoteDetailsModal from '@/components/NoteDetailsModal.vue';
import { FormatterFacade } from '@/utils/formatter/facades/FormatterFacade';
import { ApiNotaFiscalService, type NotaFiscalItem } from '@/services/NotaFiscal/NotaFiscalService';

export default defineComponent({
  name: 'NotesListView',
  components: {
    NoteDetailsModal
  },
  data() {
    return {
      notes: [] as NotaFiscalItem[],
      isModalOpen: false,
      selectedChaveAcesso: null as string | null,
      loading: true,
      error: null as Error | string | null,
      formatter: new FormatterFacade(),
    };
  },
  methods: {
    async fetchNotes() {
      this.loading = true;
      this.error = null;
      try {
        const repository = new ApiNotaFiscalService();
        this.notes = await repository.getAll();
      } catch (err) {
        console.error("Erro ao buscar notas fiscais:", err);
        this.error = err instanceof Error ? err : 'Erro desconhecido';
      } finally {
        this.loading = false;
      }
    },
    openModal(chaveAcesso: string) {
      this.selectedChaveAcesso = chaveAcesso;
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
      this.selectedChaveAcesso = null;
    }
  },
  created() {
    this.fetchNotes();
  }
});
</script>

<style scoped>
</style>
