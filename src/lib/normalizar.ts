/**
 * Normalização usada para comparar identificadores (palavras).
 * Sem dependências de Node: também é importada no navegador
 * (verificador de disponibilidade em /identificadores).
 */

/** Uma palavra só com letras; hífen permitido entre partes (ex.: guarda-chuva). */
export const FORMATO_PALAVRA = /^\p{L}+(?:-\p{L}+)*$/u;

/** Remove acentos, passa para minúsculas e tira espaços: "  Girassól " → "girassol". */
export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, '');
}
