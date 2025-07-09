import type { Formatter } from '../interfaces/Formatter'

export class DocumentFormatter implements Formatter {
  format(document: string | null | undefined): string {
    if (!document) return 'N/A'
    const cleaned = String(document).replace(/\D/g, '')

    if (cleaned.length === 14) {
      return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
    }
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    }
    return document
  }
}
