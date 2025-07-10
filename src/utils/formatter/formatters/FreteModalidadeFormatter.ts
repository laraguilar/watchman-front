import type { Formatter } from '../interfaces/Formatter'

export interface FreteFormatter {
  format(modalidade: number): string
}

export class FreteModalidadeFormatter implements Formatter {
  private readonly modalidades: Record<number, string> = {
    0: 'Por conta do emitente',
    1: 'Por conta do destinatário/remetente',
    2: 'Por conta de terceiros',
    3: 'Próprio emitente',
    4: 'Por conta do Remetente',
    9: 'Sem frete',
  }

  format(modalidade: number | null | undefined): string {
    if (modalidade === null || modalidade === undefined) return 'N/A'
    return this.modalidades[modalidade] || 'Desconhecido'
  }
}
