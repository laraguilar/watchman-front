import type { FreteStrategy } from '../interfaces/FreteStrategy'

export class FreteModalidadeStrategy implements FreteStrategy {
  private readonly modalidades: Record<number, string> = {
    0: 'Por conta do emitente',
    1: 'Por conta do destinatário/remetente',
    2: 'Por conta de terceiros',
    3: 'Próprio emitente',
    4: 'Por conta do Remetente',
    9: 'Sem frete',
  }

  format(modalidade: number): string {
    return this.modalidades[modalidade] || 'Desconhecido'
  }
}
