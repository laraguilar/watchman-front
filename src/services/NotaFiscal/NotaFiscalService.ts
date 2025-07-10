import type { UploadResponse, NotaFiscalListItem, NotaFiscal } from './interfaces'

export interface NotaFiscalService {
  upload(file: File): Promise<UploadResponse>
  getAll(): Promise<NotaFiscalListItem[]>
  getById(chaveAcesso: string): Promise<NotaFiscal>
}

export class ApiNotaFiscalService implements NotaFiscalService {
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

  async getAll(): Promise<NotaFiscalListItem[]> {
    const response = await fetch(`${this.baseUrl}/notas-fiscais`)
    return response.json()
  }

  async getById(chaveAcesso: string): Promise<NotaFiscal> {
    const response = await fetch(`${this.baseUrl}/nota-fiscal/${chaveAcesso}`)
    return response.json()
  }
}
