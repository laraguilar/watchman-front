<template>
  <div v-if="isVisible" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <button class="close-button" @click="closeModal">&times;</button>
      <h3>Detalhes da Nota Fiscal</h3>

      <div v-if="loading" class="loading-message">Carregando detalhes...</div>
      <div v-else-if="error" class="error-message">Erro ao carregar detalhes: {{ error.message }}</div>
      <div v-else-if="note">
        <div class="details-grid">
          <p><strong>Chave de Acesso:</strong> <span>{{ note.chave_acesso }}</span></p>
          <p><strong>Número:</strong> <span>{{ note.numero }}</span></p>
          <p><strong>Série:</strong> <span>{{ note.serie }}</span></p>
          <p><strong>Data de Emissão:</strong> <span>{{ note.data_emissao }}</span></p>
          <p><strong>Natureza da Operação:</strong> <span>{{ note.natureza_operacao }}</span></p>
          <p><strong>Ambiente:</strong> <span>{{ note.ambiente }}</span></p>
          <p><strong>Código Município Fato Gerador:</strong> <span>{{ note.codigo_municipio_fato_gerador }}</span></p>
          <p><strong>Código NF:</strong> <span>{{ note.codigo_nf }}</span></p>
          <p><strong>Código UF:</strong> <span>{{ note.codigo_uf }}</span></p>
          <p><strong>Data Saída/Entrada:</strong> <span>{{ note.data_saida_entrada || 'N/A' }}</span></p>
          <p><strong>Dígito Verificador:</strong> <span>{{ note.digito_verificador }}</span></p>
          <p><strong>Finalidade NF:</strong> <span>{{ note.finalidade_nf }}</span></p>
          <p><strong>Indicador Pagamento:</strong> <span>{{ note.indicador_pagamento }}</span></p>
          <p><strong>Informações Adicionais:</strong> <span>{{ note.informacoes_adicionais || 'N/A' }}</span></p>
          <p><strong>Modelo:</strong> <span>{{ note.modelo }}</span></p>
          <p><strong>Processo Emissão:</strong> <span>{{ note.processo_emissao }}</span></p>
          <p><strong>Tipo Emissão:</strong> <span>{{ note.tipo_emissao }}</span></p>
          <p><strong>Tipo Impressão:</strong> <span>{{ note.tipo_impressao }}</span></p>
          <p><strong>Tipo NF:</strong> <span>{{ note.tipo_nf }}</span></p>
          <p><strong>Versão:</strong> <span>{{ note.versao }}</span></p>
          <p><strong>Versão Processo:</strong> <span>{{ note.versao_processo }}</span></p>
        </div>

        <div v-if="note.itens && note.itens.length > 0">
          <h4>Itens da Nota:</h4>
          <ul class="items-list">
            <li v-for="(item, index) in note.itens" :key="index" class="item-card">
              Item {{ index + 1 }}
              </li>
          </ul>
        </div>

        <div v-if="note.totais">
          <h4>Totais:</h4>
          <div class="totals-section">
             <p><strong>Valor Total NF:</strong> {{ note.totais.valor_total_nf || 'N/A' }}</p>
             </div>
        </div>

        <div v-if="note.transporte">
          <h4>Transporte:</h4>
          <div class="transport-section">
            <p><strong>Modalidade Frete:</strong> {{ note.transporte.modalidade_frete || 'N/A' }}</p>
            </div>
        </div>

      </div>
      <div v-else class="no-data-message">Nenhum detalhe de nota disponível.</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'NoteDetailsModal',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    chaveAcesso: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      note: null,
      loading: false,
      error: null
    };
  },
  watch: {
    isVisible(newValue) {
      if (newValue && this.chaveAcesso) {
        this.fetchNoteDetails(this.chaveAcesso);
      } else if (!newValue) {
        this.note = null;
        this.error = null;
      }
    },
    chaveAcesso(newValue) {
        if (this.isVisible && newValue) {
            this.fetchNoteDetails(newValue);
        }
    }
  },
  methods: {
    async fetchNoteDetails(chaveAcesso) {
      this.loading = true;
      this.error = null;
      this.note = null;
      try {
        const response = await axios.get(`http://localhost:8000/api/nota-fiscal/${chaveAcesso}`);
        this.note = response.data;
      } catch (err) {
        console.error("Erro ao buscar detalhes da nota fiscal:", err);
        this.error = err;
      } finally {
        this.loading = false;
      }
    },
    closeModal() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6); /* Fundo semi-transparente escuro para o overlay */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #ffffff; /* Fundo branco puro para o modal */
  padding: 30px;
  border-radius: 10px; /* Bordas mais arredondadas */
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25); /* Sombra mais pronunciada para destaque */
  width: 90%;
  max-width: 800px; /* Um pouco mais largo para acomodar mais dados */
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
  animation: fadeInScale 0.3s ease-out; /* Animação de entrada */
  color: #343a40; /* Cor padrão do texto */
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.8em; /* Ícone maior para fechar */
  cursor: pointer;
  color: #6c757d; /* Cinza suave */
  transition: color 0.2s ease, transform 0.1s ease;
}

.close-button:hover {
  color: #007bff; /* Azul primário no hover */
  transform: rotate(90deg); /* Pequena rotação */
}
.close-button:active {
  transform: rotate(90deg) translateY(1px);
}

h3 {
  margin-top: 0;
  color: #212529; /* Título mais escuro */
  border-bottom: 2px solid #e9ecef; /* Linha sutil abaixo do título */
  padding-bottom: 12px;
  margin-bottom: 25px;
  font-size: 1.6em;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); /* Layout responsivo em colunas */
  gap: 15px 30px; /* Espaçamento entre itens */
  margin-bottom: 30px;
}

.details-grid p {
  margin: 0; /* Remove margem padrão dos parágrafos */
  display: flex;
  flex-direction: column; /* Stack label and value */
}

.details-grid strong {
  color: #495057; /* Cor para os labels (negrito) */
  font-weight: 600;
  font-size: 0.9em;
  margin-bottom: 4px;
}

.details-grid span {
  color: #343a40; /* Cor para os valores */
  font-size: 1.05em;
  word-break: break-all; /* Quebra palavras longas como a chave de acesso */
}

h4 {
  color: #212529;
  margin-top: 30px;
  margin-bottom: 15px;
  border-bottom: 1px dashed #ced4da; /* Linha tracejada para seções */
  padding-bottom: 8px;
}

.items-list, .totals-section, .transport-section {
  background-color: #f8f9fa; /* Fundo levemente cinza para seções */
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.03); /* Sombra interna sutil */
}

.items-list {
  list-style: none;
  padding: 0;
}

.item-card {
  background-color: #ffffff;
  border: 1px solid #e9ecef;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  font-size: 0.95em;
}

/* Mensagens de estado no modal */
.loading-message, .error-message, .no-data-message {
  padding: 15px;
  border-radius: 5px;
  margin-top: 15px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
}

.loading-message {
  background-color: #e9f7ef;
  border: 1px solid #c3e6cb;
  color: #155724;
}
.loading-message::before {
  content: '\f110';
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  animation: spin 1s linear infinite;
}

.error-message {
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}
.error-message::before {
  content: '\f06a';
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
}

.no-data-message {
  background-color: #e2e6ea;
  border: 1px solid #cdd3da;
  color: #495057;
  text-align: center;
}
</style>