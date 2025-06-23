<template>
  <div class="notes-list-container">
    <h2>Lista de Notas Fiscais</h2>
    <div v-if="loading" class="loading-message">Carregando notas...</div>
    <div v-else-if="error" class="error-message">Erro ao carregar notas: {{ error.message }}</div>
    <div v-else>
      <table class="notes-table">
        <thead>
          <tr>
            <th>Número</th>
            <th>Série</th>
            <th>Chave de Acesso</th>
            <th>Data de Emissão</th>
            <th>Natureza da Operação</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="note in notes" :key="note.id">
            <td>{{ note.numero }}</td>
            <td>{{ note.serie }}</td>
            <td>{{ note.chave_acesso }}</td>
            <td>{{ note.data_emissao }}</td>
            <td>{{ note.natureza_operacao }}</td>
            <td>
              <button @click="openModal(note.id)" class="view-button">Visualizar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <NoteDetailsModal
      :isVisible="isModalOpen"
      :chaveAcesso="selectedChaveAcesso"
      @close="closeModal"
    />
  </div>
</template>

<script>
// ... seu script Vue (sem alterações aqui, já que são apenas estilos)
import NoteDetailsModal from '@/components/NoteDetailsModal.vue';
import axios from 'axios';

export default {
  name: 'NotesListView',
  components: {
    NoteDetailsModal
  },
  data() {
    return {
      notes: [],
      isModalOpen: false,
      selectedChaveAcesso: null,
      loading: true,
      error: null
    };
  },
  methods: {
    async fetchNotes() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get('http://localhost:8000/api/notas-fiscais');
        this.notes = response.data;
      } catch (err) {
        console.error("Erro ao buscar notas fiscais:", err);
        this.error = err;
      } finally {
        this.loading = false;
      }
    },
    openModal(chaveAcesso) {
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
};
</script>

<style scoped>
.notes-list-container {
  padding: 20px;
  background-color: #f8f9fa; /* Fundo levemente cinza claro para a área de conteúdo */
  color: #343a40; /* Texto principal em cinza escuro */
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); /* Sombra sutil */
}

h2 {
  color: #212529; /* Título mais escuro */
  margin-bottom: 25px;
  font-size: 1.8em;
  border-bottom: 2px solid #dee2e6; /* Linha sutil abaixo do título */
  padding-bottom: 10px;
}

.notes-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #ffffff; /* Fundo branco para a tabela */
  border-radius: 6px;
  overflow: hidden; /* Garante bordas arredondadas */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.notes-table thead {
  background-color: #e9ecef; /* Cabeçalho da tabela em cinza claro */
  color: #495057; /* Texto do cabeçalho em cinza escuro */
}

.notes-table th, .notes-table td {
  border: 1px solid #dee2e6; /* Bordas finas e suaves */
  padding: 12px 15px;
  text-align: left;
}

.notes-table th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.9em;
}

.notes-table tbody tr:nth-child(even) {
  background-color: #f6f6f6; /* Listras zebradas para melhor legibilidade */
}

.notes-table tbody tr:hover {
  background-color: #e2e6ea; /* Fundo cinza suave no hover da linha */
  cursor: pointer;
}

.view-button {
  background-color: #007bff; /* Azul primário para o botão de visualizar */
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.2s ease, transform 0.1s ease;
}

.view-button:hover {
  background-color: #0056b3; /* Azul mais escuro no hover */
  transform: translateY(-1px); /* Pequeno efeito de levantamento */
}

.view-button:active {
  background-color: #004085;
  transform: translateY(0);
}

/* Mensagens de estado */
.loading-message, .error-message {
  padding: 15px;
  border-radius: 5px;
  margin-top: 15px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
}

.loading-message {
  background-color: #e9f7ef; /* Verde claro suave */
  border: 1px solid #c3e6cb;
  color: #155724;
}
.loading-message::before {
  content: '\f110'; /* Ícone de spinner do Font Awesome */
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  animation: spin 1s linear infinite;
}

.error-message {
  background-color: #f8d7da; /* Vermelho claro suave */
  border: 1px solid #f5c6cb;
  color: #721c24;
}
.error-message::before {
  content: '\f06a'; /* Ícone de exclamação do Font Awesome */
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>