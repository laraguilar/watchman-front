import { FormatterFactory } from '../factories/FormatterFactory'

export class FormatterFacade {
  private currencyFormatter = FormatterFactory.createCurrencyFormatter()
  private documentFormatter = FormatterFactory.createDocumentFormatter()
  private dateFormatter = FormatterFactory.createDateFormatter()
  private cepFormatter = FormatterFactory.createCEPFormatter()
  private freteFormatter = FormatterFactory.createFreteFormatter()

  formatCurrency(value: string | number | null): string {
    return this.currencyFormatter.format(value)
  }

  formatDocument(document: string | null | undefined): string {
    return this.documentFormatter.format(document)
  }

  formatDate(dateString: string | null): string {
    if (!dateString) return 'N/A'
    try {
      return this.dateFormatter.format(dateString)
    } catch {
      return dateString
    }
  }

  formatCEP(cep: string | null | undefined): string {
    return this.cepFormatter.format(cep)
  }

  formatModalidadeFrete(modalidade: number | null): string {
    if (modalidade === null || modalidade === undefined) return 'N/A'
    return this.freteFormatter.format(modalidade)
  }
}
