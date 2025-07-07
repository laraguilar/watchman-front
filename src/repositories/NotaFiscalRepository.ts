export interface UploadResponse {
  message: string
  filename?: string
  filepath?: string
}

export interface NotaFiscalPessoa {
  cnae: string | null
  cnpj: string | null
  cpf: string | null
  data_atualizacao: string
  data_criacao: string
  email: string | null
  id: number
  id_estrangeiro: string | null
  inscricao_estadual: string | null
  inscricao_municipal: string | null
  inscricao_suframa: string | null
  nome: string
  nome_fantasia: string | null
  regime_tributario: number | null
  tipo_pessoa: 'DESTINATARIO' | 'EMITENTE'
}

export interface NotaFiscalEndereco {
  bairro: string
  cep: string
  cnpj: string | null
  codigo_municipio: string
  codigo_pais: string | null
  complemento: string | null
  cpf: string | null
  data_atualizacao: string
  data_criacao: string
  id: number
  logradouro: string
  municipio: string
  nfe_id: number | null
  numero: string
  pais: string | null
  pessoa_id: number
  telefone: string | null
  tipo_endereco: 'PRINCIPAL'
  uf: string
}

export interface NotaFiscalImposto {
  aliquota_percentual: number | null
  aliquota_st: number | null
  aliquota_valor: number | null
  classe_enquadramento: string | null
  cnpj_produtor: string | null
  codigo_enquadramento: string | null
  codigo_selo: string | null
  csosn: string | null
  cst: string | null
  data_atualizacao: string
  data_criacao: string
  id: number
  item_nfe_id: number
  modalidade_base_calculo: number | null
  modalidade_base_calculo_st: number | null
  origem: number | null
  percentual_credito_sn: number | null
  percentual_margem_valor_adicionado_st: number | null
  percentual_reducao_base_calculo: number | null
  percentual_reducao_base_calculo_st: number | null
  quantidade_selo: number | null
  quantidade_unidade: number | null
  tipo_calculo: string | null
  tipo_imposto: 'COFINS' | 'ICMS' | 'IPI' | 'PIS'
  valor: number | null
  valor_base_calculo: number | null
  valor_base_calculo_st: number | null
  valor_credito_sn: number | null
  valor_st: number | null
  valor_unidade: number | null
}

export interface NotaFiscalItem {
  cfop: string
  codigo_produto: string
  data_atualizacao: string
  data_criacao: string
  descricao: string
  gtin: string
  gtin_tributavel: string
  id: number
  impostos: NotaFiscalImposto[]
  ncm: string
  nfe_id: number
  numero_item: number
  origem_mercadoria: number
  quantidade_comercial: number
  quantidade_tributavel: number
  unidade_comercial: string
  unidade_tributavel: string
  valor_total_bruto: number
  valor_unitario_comercial: number
  valor_unitario_tributavel: number
}

export interface Veiculo {
  placa: string
  uf: string
  rntc: string | null
}

export interface Lacre {
  numero_lacre: string
}

export interface Volume {
  quantidade: number
  especie: string
  peso_liquido: number
  peso_bruto: number
  lacres?: Lacre[]
}

export interface Transporte {
  id: number
  nfe_id: number
  modalidade_frete: number // Agora é um número
  transportadora?: NotaFiscalPessoa
  transportadora_endereco?: NotaFiscalEndereco
  volumes?: Volume[]
  veiculos?: Veiculo[]
  data_atualizacao: string
  data_criacao: string
  transportadora_id: number | null
}

export interface Totais {
  base_calculo_icms: number
  base_calculo_icms_st: number
  data_atualizacao: string
  data_criacao: string
  id: number
  nfe_id: number
  valor_cofins: number
  valor_desconto: number
  valor_frete: number
  valor_icms: number
  valor_icms_st: number
  valor_ii: number
  valor_ipi: number
  valor_outros: number
  valor_pis: number
  valor_produtos: number
  valor_seguro: number
  valor_total_nfe: number
}

export interface InformacoesAdicionais {
  data_atualizacao: string
  data_criacao: string
  id: number
  info_contribuinte: string
  info_fisco: string
  nfe_id: number
}

export interface NotaFiscal {
  ambiente: number
  chave_acesso: string
  codigo_municipio_fato_gerador: string
  codigo_nf: string
  codigo_uf: number
  data_emissao: string
  data_saida_entrada: string | null
  destinatario: NotaFiscalPessoa
  destinatario_endereco: NotaFiscalEndereco
  digito_verificador: number
  emitente: NotaFiscalPessoa
  emitente_endereco: NotaFiscalEndereco
  finalidade_nf: number
  id: number
  indicador_pagamento: number
  informacoes_adicionais: InformacoesAdicionais
  itens: NotaFiscalItem[]
  modelo: number
  natureza_operacao: string
  numero: number
  processo_emissao: number
  serie: number
  tipo_emissao: number
  tipo_impressao: number
  tipo_nf: number
  totais: Totais
  transporte: Transporte
  versao: string
  versao_processo: string
}

export interface NotaFiscalItem {
  chave_acesso: string
  data_emissao: string
  destinatario_nome: string
  emitente_nome: string
  id: number
  natureza_operacao: string
  numero: number
  serie: number
}

export interface NotaFiscalRepository {
  upload(file: File): Promise<UploadResponse>
  getAll(): Promise<NotaFiscalItem[]>
  getById(chaveAcesso: string): Promise<NotaFiscal>
}

export class ApiNotaFiscalRepository implements NotaFiscalRepository {
  private readonly baseUrl = 'http://localhost:8000/api'

  async upload(file: File): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append('nota_fiscal', file)

    const response = await fetch(`${this.baseUrl}/nota-fiscal`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`)
    }

    return response.json()
  }

  async getAll(): Promise<NotaFiscalItem[]> {
    const response = await fetch(`${this.baseUrl}/notas-fiscais`)
    return response.json()
  }

  async getById(chaveAcesso: string): Promise<NotaFiscal> {
    const response = await fetch(`${this.baseUrl}/nota-fiscal/${chaveAcesso}`)
    return response.json()
  }
}
