import type { Formatter } from '../interfaces/Formatter'

export class CEPFormatter implements Formatter {
  format(cep: string | null | undefined): string {
    if (!cep) return 'N/A'
    const cleaned = String(cep).replace(/\D/g, '')
    return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2')
  }
}
