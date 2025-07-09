export interface Formatter {
  format(value: unknown): string
}

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

export class DateFormatter implements Formatter {
  format(date: string | Date | null): string {
    if (!date) return 'N/A'
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat('pt-BR').format(dateObj)
  }
}

export class CEPFormatter implements Formatter {
  format(cep: string | null | undefined): string {
    if (!cep) return 'N/A'
    const cleaned = String(cep).replace(/\D/g, '')
    return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2')
  }
}

export class FormatterFactory {
  static createCurrencyFormatter(): Formatter {
    return new CurrencyFormatter()
  }

  static createDocumentFormatter(): Formatter {
    return new DocumentFormatter()
  }

  static createDateFormatter(): Formatter {
    return new DateFormatter()
  }

  static createCEPFormatter(): Formatter {
    return new CEPFormatter()
  }
}
