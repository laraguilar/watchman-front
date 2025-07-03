<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in" @click.self="closeModal">
    <div class="bg-white rounded-2xl shadow-2xl w-[95%] max-w-4xl max-h-[90vh] overflow-hidden animate-slide-in flex flex-col">
      <div class="bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-8 py-6 flex justify-between items-center">
        <div class="flex items-center gap-4">
          <div class="bg-white bg-opacity-20 p-2.5 rounded-xl flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z" fill="currentColor"/>
              <path d="M7 7H17V9H7V7ZM7 11H17V13H7V11ZM7 15H13V17H7V15Z" fill="currentColor"/>
            </svg>
          </div>
          <div>
            <h3 class="text-2xl font-semibold leading-tight">Detalhes da Nota Fiscal</h3>
            <p v-if="note" class="text-sm opacity-90 font-normal mt-1">NF-e {{ note.numero }}/{{ note.serie }}</p>
          </div>
        </div>
        <button class="bg-white bg-opacity-20 border-none text-white p-2.5 rounded-lg cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-opacity-30 hover:rotate-90" @click="closeModal">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto">
        <div v-if="loading" class="flex items-center justify-center gap-3 py-10 px-8 text-center text-blue-600">
          <div class="w-6 h-6 border-3 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          <span>Carregando detalhes...</span>
        </div>

        <div v-else-if="error" class="flex items-center justify-center gap-3 py-10 px-8 text-center text-red-600 bg-red-50 border border-red-200 rounded-lg mx-5 mt-5">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="2"/>
            <path d="M10 6V10M10 14H10.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span>Erro ao carregar detalhes: {{ error.message }}</span>
        </div>

        <div v-else-if="note">
          <div class="p-8 bg-gradient-to-br from-slate-50 to-slate-100 border-b border-gray-200">
            <h4 class="flex items-center gap-2.5 mb-6 text-xl font-semibold text-gray-800 pb-3 border-b-2 border-gray-300">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-indigo-500">
                <path d="M8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C12.42 16 16 12.42 16 8C16 3.58 12.42 0 8 0ZM7 4H9V6H7V4ZM9 12H7V8H9V12Z" fill="currentColor"/>
              </svg>
              Informações Principais
            </h4>
            <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
              <div class="col-span-full bg-white p-5 rounded-xl border-2 border-gray-300 shadow-sm">
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Chave de Acesso</label>
                <span class="block font-mono text-sm bg-slate-50 p-3 rounded-md border border-gray-300 mt-1.5 break-all">{{ note.chave_acesso }}</span>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Número</label>
                <span class="text-base text-gray-800 font-medium">{{ note.numero }}</span>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Série</label>
                <span class="text-base text-gray-800 font-medium">{{ note.serie }}</span>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Data de Emissão</label>
                <span class="text-base text-gray-800 font-medium">{{ formatDate(note.data_emissao) }}</span>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Natureza da Operação</label>
                <span class="text-base text-gray-800 font-medium">{{ note.natureza_operacao }}</span>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Ambiente</label>
                <span class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wide" :class="note.ambiente === 1 ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-yellow-100 text-yellow-800 border border-yellow-200'">
                  {{ note.ambiente === 1 ? 'Produção' : 'Homologação' }}
                </span>
              </div>
            </div>
          </div>

          <div class="p-8 border-b border-gray-200">
            <h4 class="flex items-center gap-2.5 mb-6 text-xl font-semibold text-gray-800 pb-3 border-b-2 border-gray-300">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-indigo-500">
                <path d="M2 3C2 2.45 2.45 2 3 2H13C13.55 2 14 2.45 14 3V13C14 13.55 13.55 14 13 14H3C2.45 14 2 13.55 2 13V3ZM4 4V12H12V4H4ZM6 6H10V8H6V6Z" fill="currentColor"/>
              </svg>
              Informações Técnicas
            </h4>
            <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Código Município Fato Gerador</label>
                <span class="text-base text-gray-800 font-medium">{{ note.codigo_municipio_fato_gerador }}</span>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Código NF</label>
                <span class="text-base text-gray-800 font-medium">{{ note.codigo_nf }}</span>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Código UF</label>
                <span class="text-base text-gray-800 font-medium">{{ note.codigo_uf }}</span>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Data Saída/Entrada</label>
                <span class="text-base text-gray-800 font-medium">{{ note.data_saida_entrada ? formatDate(note.data_saida_entrada) : 'N/A' }}</span>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Dígito Verificador</label>
                <span class="text-base text-gray-800 font-medium">{{ note.digito_verificador }}</span>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Finalidade NF</label>
                <span class="text-base text-gray-800 font-medium">{{ note.finalidade_nf }}</span>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Indicador Pagamento</label>
                <span class="text-base text-gray-800 font-medium">{{ note.indicador_pagamento }}</span>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Modelo</label>
                <span class="text-base text-gray-800 font-medium">{{ note.modelo }}</span>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Processo Emissão</label>
                <span class="text-base text-gray-800 font-medium">{{ note.processo_emissao }}</span>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tipo Emissão</label>
                <span class="text-base text-gray-800 font-medium">{{ note.tipo_emissao }}</span>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tipo Impressão</label>
                <span class="text-base text-gray-800 font-medium">{{ note.tipo_impressao }}</span>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tipo NF</label>
                <span class="text-base text-gray-800 font-medium">{{ note.tipo_nf }}</span>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Versão</label>
                <span class="text-base text-gray-800 font-medium">{{ note.versao }}</span>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Versão Processo</label>
                <span class="text-base text-gray-800 font-medium">{{ note.versao_processo }}</span>
              </div>
            </div>

            <div v-if="note.informacoes_adicionais" class="col-span-full mt-5">
              <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Informações Adicionais</label>
              <div class="mt-2">
                <div class="flex flex-col gap-6">
                  <div class="grid gap-5">
                    <div v-if="note.informacoes_adicionais.info_contribuinte" class="bg-white border-l-4 border-green-500 bg-gradient-to-br from-white to-green-50 rounded-xl p-5 shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
                      <div class="flex items-center gap-2.5 mb-4 pb-3 border-b border-gray-200">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-green-500">
                          <path d="M8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C12.42 16 16 12.42 16 8C16 3.58 12.42 0 8 0ZM7 4H9V6H7V4ZM9 12H7V8H9V12Z" fill="currentColor"/>
                        </svg>
                        <h5 class="text-base font-semibold text-gray-800 m-0">Informações ao Contribuinte</h5>
                      </div>
                      <p class="m-0 leading-relaxed text-gray-700 text-sm">{{ note.informacoes_adicionais.info_contribuinte }}</p>
                    </div>

                    <div v-if="note.informacoes_adicionais.info_fisco" class="bg-white border-l-4 border-blue-500 bg-gradient-to-br from-white to-blue-50 rounded-xl p-5 shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
                      <div class="flex items-center gap-2.5 mb-4 pb-3 border-b border-gray-200">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-blue-500">
                          <path d="M2 1C1.45 1 1 1.45 1 2V14C1 14.55 1.45 15 2 15H14C14.55 15 15 14.55 15 14V2C15 1.45 14.55 1 14 1H2ZM3 3H13V13H3V3ZM5 5V7H11V5H5ZM5 9V11H9V9H5Z" fill="currentColor"/>
                        </svg>
                        <h5 class="text-base font-semibold text-gray-800 m-0">Informações do Fisco</h5>
                      </div>
                      <p class="m-0 leading-relaxed text-gray-700 text-sm">{{ note.informacoes_adicionais.info_fisco }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="note.emitente" class="p-8 border-b border-gray-200">
            <h4 class="flex items-center gap-2.5 mb-6 text-xl font-semibold text-gray-800 pb-3 border-b-2 border-gray-300">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-indigo-500">
                <path d="M8 8C10.21 8 12 6.21 12 4C12 1.79 10.21 0 8 0C5.79 0 4 1.79 4 4C4 6.21 5.79 8 8 8ZM8 10C5.33 10 0 11.34 0 14V16H16V14C16 11.34 10.67 10 8 10Z" fill="currentColor"/>
              </svg>
              Dados do Emitente
            </h4>
            <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nome/Razão Social</label>
                <span class="text-base text-gray-800 font-medium">{{ note.emitente.nome }}</span>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">CNPJ/CPF</label>
                <span class="text-base text-gray-800 font-medium font-mono">{{ formatDocument(note.emitente.cnpj || note.emitente.cpf) }}</span>
              </div>
              <div v-if="note.emitente_endereco" class="col-span-full">
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 block">Endereço</label>
                <div class="bg-slate-50 p-4 rounded-lg border-2 border-gray-300">
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div class="flex flex-col gap-1">
                      <label class="text-xs font-medium text-gray-500">Logradouro</label>
                      <span class="text-sm text-gray-800">{{ note.emitente_endereco.logradouro }}, {{ note.emitente_endereco.numero }}</span>
                    </div>
                    <div class="flex flex-col gap-1">
                      <label class="text-xs font-medium text-gray-500">Bairro</label>
                      <span class="text-sm text-gray-800">{{ note.emitente_endereco.bairro }}</span>
                    </div>
                    <div class="flex flex-col gap-1">
                      <label class="text-xs font-medium text-gray-500">Cidade/UF</label>
                      <span class="text-sm text-gray-800">{{ note.emitente_endereco.municipio }}/{{ note.emitente_endereco.uf }}</span>
                    </div>
                    <div class="flex flex-col gap-1">
                      <label class="text-xs font-medium text-gray-500">CEP</label>
                      <span class="text-sm text-gray-800 font-mono">{{ formatCEP(note.emitente_endereco.cep) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="note.destinatario" class="p-8 border-b border-gray-200">
            <h4 class="flex items-center gap-2.5 mb-6 text-xl font-semibold text-gray-800 pb-3 border-b-2 border-gray-300">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-indigo-500">
                <path d="M8 8C10.21 8 12 6.21 12 4C12 1.79 10.21 0 8 0C5.79 0 4 1.79 4 4C4 6.21 5.79 8 8 8ZM8 10C5.33 10 0 11.34 0 14V16H16V14C16 11.34 10.67 10 8 10Z" fill="currentColor"/>
              </svg>
              Dados do Destinatário
            </h4>
            <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nome/Razão Social</label>
                <span class="text-base text-gray-800 font-medium">{{ note.destinatario.nome }}</span>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">CNPJ/CPF</label>
                <span class="text-base text-gray-800 font-medium font-mono">{{ formatDocument(note.destinatario.cnpj || note.destinatario.cpf) }}</span>
              </div>
              <div v-if="note.destinatario_endereco" class="col-span-full">
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 block">Endereço</label>
                <div class="bg-slate-50 p-4 rounded-lg border-2 border-gray-300">
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div class="flex flex-col gap-1">
                      <label class="text-xs font-medium text-gray-500">Logradouro</label>
                      <span class="text-sm text-gray-800">{{ note.destinatario_endereco.logradouro }}, {{ note.destinatario_endereco.numero }}</span>
                    </div>
                    <div class="flex flex-col gap-1">
                      <label class="text-xs font-medium text-gray-500">Bairro</label>
                      <span class="text-sm text-gray-800">{{ note.destinatario_endereco.bairro }}</span>
                    </div>
                    <div class="flex flex-col gap-1">
                      <label class="text-xs font-medium text-gray-500">Cidade/UF</label>
                      <span class="text-sm text-gray-800">{{ note.destinatario_endereco.municipio }}/{{ note.destinatario_endereco.uf }}</span>
                    </div>
                    <div class="flex flex-col gap-1">
                      <label class="text-xs font-medium text-gray-500">CEP</label>
                      <span class="text-sm text-gray-800 font-mono">{{ formatCEP(note.destinatario_endereco.cep) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="note.totais" class="p-8 bg-gradient-to-br from-green-50 to-green-100 border-b border-gray-200">
            <h4 class="flex items-center gap-2.5 mb-6 text-xl font-semibold text-gray-800 pb-3 border-b-2 border-gray-300">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-indigo-500">
                <path d="M1 3C1 2.45 1.45 2 2 2H14C14.55 2 15 2.45 15 3C15 3.55 14.55 4 14 4H2C1.45 4 1 3.55 1 3ZM3 6C2.45 6 2 6.45 2 7C2 7.55 2.45 8 3 8H13C13.55 8 14 7.55 14 7C14 6.45 13.55 6 13 6H3ZM4 10C3.45 10 3 10.45 3 11C3 11.55 3.45 12 4 12H12C12.55 12 13 11.55 13 11C13 10.45 12.55 10 12 10H4Z" fill="currentColor"/>
              </svg>
              Totais
            </h4>
            <div class="grid gap-4">
              <div class="bg-white rounded-xl p-6 border-2 border-green-500 shadow-lg shadow-green-500/10">
                <div class="flex justify-between items-center">
                  <label class="text-lg font-semibold text-green-800">Valor Total da NF-e</label>
                  <span class="text-3xl font-bold text-green-600 font-mono">{{ formatCurrency(note.totais.valor_total_nfe) }}</span>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div class="bg-white rounded-xl p-5 border-2 border-blue-300 shadow-md">
                  <div class="flex justify-between items-center">
                    <label class="text-base font-semibold text-blue-800">Valor Total dos Produtos</label>
                    <span class="text-xl font-bold text-blue-600 font-mono">{{ formatCurrency(note.totais.valor_produtos) }}</span>
                  </div>
                </div>
                <div class="bg-white rounded-xl p-5 border-2 border-orange-300 shadow-md">
                  <div class="flex justify-between items-center">
                    <label class="text-base font-semibold text-orange-800">Valor Total dos Impostos</label>
                    <span class="text-xl font-bold text-orange-600 font-mono">{{ formatCurrency(note.totais.valor_icms + note.totais.valor_cofins + note.totais.valor_pis) }}</span>
                  </div>
                </div>
                <div class="bg-white rounded-xl p-5 border-2 border-red-300 shadow-md">
                  <div class="flex justify-between items-center">
                    <label class="text-base font-semibold text-red-800">Valor Total dos Descontos</label>
                    <span class="text-xl font-bold text-red-600 font-mono">{{ formatCurrency(note.totais.valor_desconto) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="note.transporte" class="p-8 border-b border-gray-200">
            <h4 class="flex items-center gap-2.5 mb-6 text-xl font-semibold text-gray-800 pb-3 border-b-2 border-gray-300">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-indigo-500">
                <path d="M0 11.5C0 12.33 0.67 13 1.5 13S3 12.33 3 11.5S2.33 10 1.5 10S0 10.67 0 11.5ZM13 11.5C13 12.33 13.67 13 14.5 13S16 12.33 16 11.5S15.33 10 14.5 10S13 10.67 13 11.5ZM1.5 9H14.5C15.33 9 16 8.33 16 7.5V3.5C16 2.67 15.33 2 14.5 2H1.5C0.67 2 0 2.67 0 3.5V7.5C0 8.33 0.67 9 1.5 9Z" fill="currentColor"/>
              </svg>
              Transporte
            </h4>
            <div class="space-y-6">
              <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Modalidade Frete</label>
                  <span class="text-base text-gray-800 font-medium">{{ formatModalidadeFrete(note.transporte.modalidade_frete) || 'N/A' }}</span>
                </div>
              </div>

              <div v-if="note.transporte.transportadora" class="bg-slate-50 p-5 rounded-xl border-2 border-gray-300">
                <h5 class="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-300">Dados da Transportadora</h5>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div class="flex flex-col gap-1">
                    <label class="text-xs font-medium text-gray-500">Nome/Razão Social</label>
                    <span class="text-sm text-gray-800 font-medium">{{ note.transporte.transportadora.nome }}</span>
                  </div>
                  <div class="flex flex-col gap-1">
                    <label class="text-xs font-medium text-gray-500">CNPJ/CPF</label>
                    <span class="text-sm text-gray-800 font-mono">{{ formatDocument(note.transporte.transportadora.documento) }}</span>
                  </div>
                </div>

                <div v-if="note.transporte.transportadora_endereco" class="mt-4 pt-4 border-t border-gray-300">
                  <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Endereço</label>
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div class="flex flex-col gap-1">
                      <label class="text-xs font-medium text-gray-500">Logradouro</label>
                      <span class="text-sm text-gray-800">{{ note.transporte.transportadora_endereco.logradouro }}, {{ note.transporte.transportadora_endereco.numero }}</span>
                    </div>
                    <div class="flex flex-col gap-1">
                      <label class="text-xs font-medium text-gray-500">Bairro</label>
                      <span class="text-sm text-gray-800">{{ note.transporte.transportadora_endereco.bairro }}</span>
                    </div>
                    <div class="flex flex-col gap-1">
                      <label class="text-xs font-medium text-gray-500">Cidade/UF</label>
                      <span class="text-sm text-gray-800">{{ note.transporte.transportadora_endereco.municipio }}/{{ note.transporte.transportadora_endereco.uf }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="note.transporte.volumes && note.transporte.volumes.length > 0" class="bg-blue-50 p-5 rounded-xl border-2 border-blue-300">
                <h5 class="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-blue-300">Volumes ({{ note.transporte.volumes.length }})</h5>
                <div class="grid gap-4">
                  <div v-for="(volume, index) in note.transporte.volumes" :key="index" class="bg-white p-4 rounded-lg border border-blue-200">
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                      <div class="flex flex-col gap-1">
                        <label class="text-xs font-medium text-gray-500">Quantidade</label>
                        <span class="text-sm text-gray-800 font-medium">{{ volume.quantidade }}</span>
                      </div>
                      <div class="flex flex-col gap-1">
                        <label class="text-xs font-medium text-gray-500">Espécie</label>
                        <span class="text-sm text-gray-800">{{ volume.especie }}</span>
                      </div>
                      <div class="flex flex-col gap-1">
                        <label class="text-xs font-medium text-gray-500">Peso Líquido</label>
                        <span class="text-sm text-gray-800 font-mono">{{ volume.peso_liquido }} kg</span>
                      </div>
                      <div class="flex flex-col gap-1">
                        <label class="text-xs font-medium text-gray-500">Peso Bruto</label>
                        <span class="text-sm text-gray-800 font-mono">{{ volume.peso_bruto }} kg</span>
                      </div>
                    </div>
                    <div v-if="volume.lacres && volume.lacres.length > 0" class="pt-3 border-t border-blue-200">
                      <label class="text-xs font-medium text-gray-500 mb-2 block">Lacres</label>
                      <div class="flex flex-wrap gap-2">
                        <span v-for="lacre in volume.lacres" :key="lacre.numero_lacre" class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                          {{ lacre.numero_lacre }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="note.transporte.veiculos && note.transporte.veiculos.length > 0" class="bg-green-50 p-5 rounded-xl border-2 border-green-300">
                <h5 class="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-green-300">Veículos ({{ note.transporte.veiculos.length }})</h5>
                <div class="grid gap-3">
                  <div v-for="(veiculo, index) in note.transporte.veiculos" :key="index" class="bg-white p-4 rounded-lg border border-green-200">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div class="flex flex-col gap-1">
                        <label class="text-xs font-medium text-gray-500">Placa</label>
                        <span class="text-sm text-gray-800 font-mono font-medium">{{ veiculo.placa }}</span>
                      </div>
                      <div class="flex flex-col gap-1">
                        <label class="text-xs font-medium text-gray-500">UF</label>
                        <span class="text-sm text-gray-800 font-medium">{{ veiculo.uf }}</span>
                      </div>
                      <div class="flex flex-col gap-1">
                        <label class="text-xs font-medium text-gray-500">RNTC</label>
                        <span class="text-sm text-gray-800 font-mono">{{ veiculo.rntc || 'N/A' }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="note.itens && note.itens.length > 0" class="p-8 border-b border-gray-200">
            <h4 class="flex items-center gap-2.5 mb-6 text-xl font-semibold text-gray-800 pb-3 border-b-2 border-gray-300">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-indigo-500">
                <path d="M2 2H14V4H2V2ZM2 6H14V8H2V6ZM2 10H14V12H2V10ZM2 14H10V16H2V14Z" fill="currentColor"/>
              </svg>
              Itens da Nota ({{ note.itens.length }})
            </h4>
            <div class="grid gap-4">
              <div v-for="item in note.itens" :key="item.id" class="bg-white border-2 border-gray-300 rounded-xl overflow-hidden transition-all duration-200 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10">
                <div class="bg-slate-50 px-5 py-4 border-b border-gray-300">
                  <div class="flex justify-between items-center">
                    <span class="font-semibold text-gray-700 text-sm">Item {{ item.numero_item }}</span>
                    <span class="text-lg font-bold text-indigo-600 font-mono">{{ formatCurrency(item.valor_total_bruto) }}</span>
                  </div>
                </div>
                <div class="px-5 py-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div class="md:col-span-2 lg:col-span-3">
                      <label class="text-xs font-medium text-gray-500">Descrição</label>
                      <p class="text-sm text-gray-800 font-medium mt-1">{{ item.descricao }}</p>
                    </div>
                    <div class="flex flex-col gap-1">
                      <label class="text-xs font-medium text-gray-500">Código</label>
                      <span class="text-sm text-gray-800 font-mono">{{ item.codigo_produto }}</span>
                    </div>
                    <div class="flex flex-col gap-1">
                      <label class="text-xs font-medium text-gray-500">Quantidade</label>
                      <span class="text-sm text-gray-800 font-medium">{{ item.quantidade_comercial }} {{ item.unidade_comercial }}</span>
                    </div>
                    <div class="flex flex-col gap-1">
                      <label class="text-xs font-medium text-gray-500">Valor Unitário</label>
                      <span class="text-sm text-gray-800 font-mono">{{ formatCurrency(item.valor_unitario_comercial) }}</span>
                    </div>
                  </div>

                  <div v-if="item.impostos && item.impostos.length > 0" class="mt-4 pt-4 border-t border-gray-200">
                    <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 block">Impostos</label>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div v-for="imposto in item.impostos" :key="imposto.id" class="bg-slate-50 p-3 rounded-lg border border-gray-200">
                        <div class="text-xs font-medium text-gray-500 mb-1">{{ imposto.tipo_imposto }}</div>
                        <div class="flex justify-between items-center">
                          <span class="text-sm text-gray-800 font-mono">{{ formatCurrency(imposto.valor) }}</span>
                          <span v-if="imposto.aliquota_percentual" class="text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded-md">{{ imposto.aliquota_percentual }}%</span>
                          <span v-else class="text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded-md">N/A</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="flex flex-col items-center justify-center gap-4 py-10 text-gray-500">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="2"/>
            <path d="M24 16V24M24 32H24.02" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span>Nenhum detalhe de nota disponível.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios';

// --- Interfaces Atualizadas ---

interface Pessoa {
  id: number;
  nome: string;
  documento?: string; // Pode ser CPF ou CNPJ
  cnpj?: string;
  cpf?: string;
  cnae?: string | null;
  data_atualizacao: string;
  data_criacao: string;
  email?: string | null;
  id_estrangeiro?: string | null;
  inscricao_estadual?: string | null;
  inscricao_municipal?: string | null;
  inscricao_suframa?: string | null;
  nome_fantasia?: string | null;
  regime_tributario?: number | null;
  tipo_pessoa: string;
}

interface Endereco {
  id: number;
  logradouro: string;
  numero: string;
  bairro: string;
  codigo_municipio: string; // Pode ser string
  municipio: string;
  uf: string;
  cep: string;
  cnpj?: string | null;
  cpf?: string | null;
  codigo_pais?: string | null;
  complemento?: string | null;
  data_atualizacao: string;
  data_criacao: string;
  nfe_id?: number | null;
  pais?: string | null;
  pessoa_id?: number;
  telefone?: string | null;
  tipo_endereco: string;
}

interface Imposto {
  id: number;
  tipo_imposto: string;
  valor: number | null; // Pode ser null
  aliquota_percentual: number | null; // Alíquota agora é percentual e pode ser null
  aliquota_st?: number | null;
  aliquota_valor?: number | null;
  classe_enquadramento?: string | null;
  cnpj_produtor?: string | null;
  codigo_enquadramento?: string | null;
  codigo_selo?: string | null;
  csosn?: string | null;
  cst?: string | null;
  data_atualizacao: string;
  data_criacao: string;
  item_nfe_id: number;
  modalidade_base_calculo?: number | null;
  modalidade_base_calculo_st?: number | null;
  origem?: number | null;
  percentual_credito_sn?: number | null;
  percentual_margem_valor_adicionado_st?: number | null;
  percentual_reducao_base_calculo?: number | null;
  percentual_reducao_base_calculo_st?: number | null;
  quantidade_selo?: number | null;
  quantidade_unidade?: number | null;
  tipo_calculo?: string | null;
  valor_base_calculo?: number | null;
  valor_base_calculo_st?: number | null;
  valor_credito_sn?: number | null;
  valor_st?: number | null;
  valor_unidade?: number | null;
}

interface Item {
  id: number;
  numero_item: number;
  codigo_produto: string;
  descricao: string;
  quantidade_comercial: number; // Nova propriedade
  valor_unitario_comercial: number; // Nova propriedade
  valor_total_bruto: number; // Nova propriedade, substitui valor_total
  impostos?: Imposto[];
  cfop: string;
  data_atualizacao: string;
  data_criacao: string;
  gtin: string;
  gtin_tributavel: string;
  ncm: string;
  nfe_id: number;
  origem_mercadoria: number;
  quantidade_tributavel: number;
  unidade_comercial: string;
  unidade_tributavel: string;
  valor_unitario_tributavel: number;
}

interface Totais {
  id: number;
  nfe_id: number;
  valor_produtos: number; // Substitui valor_total_produtos
  valor_icms: number; // Impostos detalhados
  valor_cofins: number;
  valor_pis: number;
  valor_total_nfe: number;
  base_calculo_icms: number;
  base_calculo_icms_st: number;
  data_atualizacao: string;
  data_criacao: string;
  valor_desconto: number;
  valor_frete: number;
  valor_icms_st: number;
  valor_ii: number;
  valor_ipi: number;
  valor_outros: number;
  valor_seguro: number;
}

interface Lacre {
  numero_lacre: string;
}

interface Volume {
  quantidade: number;
  especie: string;
  peso_liquido: number;
  peso_bruto: number;
  lacres?: Lacre[];
}

interface Veiculo {
  placa: string;
  uf: string;
  rntc: string | null;
}

interface Transporte {
  id: number;
  nfe_id: number;
  modalidade_frete: number; // Agora é um número
  transportadora?: Pessoa;
  transportadora_endereco?: Endereco;
  volumes?: Volume[];
  veiculos?: Veiculo[];
  data_atualizacao: string;
  data_criacao: string;
  transportadora_id: number | null;
}

interface InformacoesAdicionais {
  id: number;
  nfe_id: number;
  info_fisco: string | null; // Mudou de informacoes_fisco para info_fisco
  info_contribuinte: string | null; // Mudou de informacoes_contribuinte para info_contribuinte
  data_atualizacao: string;
  data_criacao: string;
}

interface NotaFiscal {
  id: number;
  chave_acesso: string;
  versao: string;
  codigo_uf: number;
  codigo_nf: string;
  natureza_operacao: string;
  indicador_pagamento: number;
  modelo: number; // Agora é um número
  serie: number; // Agora é um número
  numero: number; // Agora é um número
  data_emissao: string;
  data_saida_entrada: string | null;
  tipo_nf: number; // Agora é um número
  codigo_municipio_fato_gerador: string; // Pode ser string
  tipo_impressao: number; // Agora é um número
  tipo_emissao: number; // Agora é um número
  digito_verificador: number; // Agora é um número
  ambiente: number; // Agora é um número
  finalidade_nf: number; // Agora é um número
  processo_emissao: number; // Agora é um número
  versao_processo: string;
  emitente?: Pessoa;
  emitente_endereco?: Endereco;
  destinatario?: Pessoa;
  destinatario_endereco?: Endereco;
  itens?: Item[];
  totais?: Totais;
  transporte?: Transporte;
  informacoes_adicionais?: InformacoesAdicionais;
}

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
      note: null as NotaFiscal | null,
      loading: false,
      error: null as Error | null
    };
  },
  watch: {
    isVisible(newValue: boolean) {
      if (newValue && this.chaveAcesso) {
        this.fetchNoteDetails(this.chaveAcesso);
      } else if (!newValue) {
        this.note = null;
        this.error = null;
      }
    },
    chaveAcesso(newValue: string) {
        if (this.isVisible && newValue) {
            this.fetchNoteDetails(newValue);
        }
    }
  },
  methods: {
    async fetchNoteDetails(chaveAcesso: string) {
      this.loading = true;
      this.error = null;
      this.note = null;
      try {
        const response = await axios.get(`http://localhost:8000/api/nota-fiscal/${chaveAcesso}`);
        console.log(response.data)
        this.note = response.data;
      } catch (err) {
        console.error("Erro ao buscar detalhes da nota fiscal:", err);
        this.error = err as Error;
      } finally {
        this.loading = false;
      }
    },
    closeModal() {
      this.$emit('close');
    },
    // Removida a função isJsonObject pois informacoes_adicionais agora é sempre um objeto
    formatDate(dateString: string | null) {
      if (!dateString) return 'N/A';
      try {
        const date = new Date(dateString);
        // Considerando o fuso horário local, que é GMT-3 em Serra/ES
        // Para garantir que a data seja formatada corretamente sem ajuste de fuso horário indesejado,
        // é melhor construir a data manualmente ou garantir que a string ISO esteja no UTC correto.
        // Já que a data_emissao é 'YYYY-MM-DD', a conversão direta para Date pode resultar em um dia anterior se for considerado UTC.
        // Para exibir a data como ela vem, podemos usar um split e reconstruir.

        const parts = dateString.split('-');
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1; // Mês é zero-indexed
        const day = parseInt(parts[2]);

        const localDate = new Date(year, month, day);

        return localDate.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      } catch {
        return dateString;
      }
    },
    formatCurrency(value: string | number | null) {
      if (value === null || value === undefined) return 'N/A';
      try {
        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(numValue);
      } catch {
        return value;
      }
    },
    formatDocument(document: string | null | undefined) {
      if (!document) return 'N/A';

      // Remove caracteres não numéricos
      const cleaned = String(document).replace(/\D/g, '');

      // Formata CNPJ (14 dígitos)
      if (cleaned.length === 14) {
        return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
      }

      // Formata CPF (11 dígitos)
      if (cleaned.length === 11) {
        return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      }

      return document;
    },
    formatCEP(cep: string | null | undefined) {
      if (!cep) return 'N/A';

      // Remove caracteres não numéricos
      const cleaned = String(cep).replace(/\D/g, '');

      // Formata CEP (8 dígitos)
      if (cleaned.length === 8) {
        return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2');
      }

      return cep;
    },
    formatModalidadeFrete(modalidade: number | null) {
      if (modalidade === null || modalidade === undefined) return 'N/A';
      switch (modalidade) {
        case 0: return 'Por conta do emitente';
        case 1: return 'Por conta do destinatário/remetente';
        case 2: return 'Por conta de terceiros';
        case 3: return 'Próprio emitente';
        case 4: return 'Por conta do Remetente'; // Nova modalidade conforme NT 2020.006
        case 9: return 'Sem frete';
        default: return 'Desconhecido';
      }
    }
  }
};
</script>

<style scoped>
/* Adicione estilos Tailwind CSS ou personalize conforme necessário */
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { transform: translateY(-20px) scale(0.95); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
}
</style>
