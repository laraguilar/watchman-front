import { CEPFormatter } from '../formatters/CEPFormatter'
import { CurrencyFormatter } from '../formatters/CurrencyFormatter'
import { DateFormatter } from '../formatters/DateFormatter'
import { DocumentFormatter } from '../formatters/DocumentFormatter'
import {
  FreteModalidadeFormatter,
  type FreteFormatter,
} from '../formatters/FreteModalidadeFormatter'
import type { Formatter } from '../interfaces/Formatter'

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

  static createFreteFormatter(): FreteFormatter {
    return new FreteModalidadeFormatter()
  }
}
