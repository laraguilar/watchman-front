import type { Formatter } from '../interfaces/Formatter'

export class DateFormatter implements Formatter {
  format(date: string | Date | null): string {
    if (!date) return 'N/A'
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat('pt-BR').format(dateObj)
  }
}
