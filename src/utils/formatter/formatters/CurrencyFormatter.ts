import type { Formatter } from '../interfaces/Formatter'

export class CurrencyFormatter implements Formatter {
  format(value: string | number | null): string {
    if (value === null || value === undefined) return 'N/A'
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numValue)
  }
}
