/**
 * Normalização usada para comparar identificadores.
 * Sem dependências de Node: também é importada no navegador
 * (verificador de disponibilidade em /identificadores).
 */

export const TIPOS = ['palavra', 'primo', 'patrono', 'objeto'] as const;
export type TipoIdentificador = (typeof TIPOS)[number];

/** Tipos cujo valor NÃO pode se repetir entre perfis. Primos podem repetir. */
export const TIPOS_UNICOS: readonly TipoIdentificador[] = ['palavra', 'patrono', 'objeto'];

export const ROTULO_TIPO: Record<TipoIdentificador, string> = {
  palavra: 'Palavra',
  primo: 'Primo',
  patrono: 'Patrono',
  objeto: 'Objeto matemático',
};

/** Remove acentos, passa para minúsculas e colapsa espaços. */
export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Chave de comparação de um identificador.
 * Em `objeto` (LaTeX), espaços não têm significado, então são removidos:
 * `\mathbb{Z} / 7` e `\mathbb{Z}/7` colidem.
 */
export function chaveIdentificador(tipo: TipoIdentificador, valor: string | number): string {
  if (tipo === 'primo') return String(Number(valor));
  const n = normalizar(String(valor));
  return tipo === 'objeto' ? n.replace(/\s+/g, '') : n;
}
