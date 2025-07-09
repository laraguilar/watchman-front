import { CEPFormatter } from '../formatters/CEPFormatter'
import { CurrencyFormatter } from '../formatters/CurrencyFormatter'
import { DateFormatter } from '../formatters/DateFormatter'
import { DocumentFormatter } from '../formatters/DocumentFormatter'
import type { Formatter } from '../interfaces/Formatter'
import type { FreteStrategy } from '../interfaces/FreteStrategy'
import { FreteModalidadeStrategy } from '../strategies/FreteModalidadeStrategy'

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

  static createFreteFormatter(): FreteStrategy {
    return new FreteModalidadeStrategy()
  }
}
