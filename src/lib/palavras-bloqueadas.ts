/**
 * Lista de palavras proibidas para o identificador `palavra`.
 * Comparação normalizada (sem acento, minúsculas), contra a palavra inteira
 * e contra cada parte de palavras com hífen ou _.
 *
 * Nenhuma lista pega tudo: a revisão humana do pull request é a barreira final.
 * Para acrescentar uma palavra, escreva-a sem acento e em minúsculas.
 */
import { normalizar } from './normalizar';

const BLOQUEADAS = new Set([
  // português
  'arrombado', 'arrombada', 'babaca', 'bosta', 'buceta', 'boceta', 'cacete',
  'caralho', 'corno', 'cu', 'cuzao', 'escroto', 'escrota', 'foda', 'foder', 'fodido',
  'fodida', 'fuder', 'merda', 'otario', 'otaria', 'piroca', 'porra',
  'puta', 'puto', 'putaria', 'punheta', 'siririca', 'vadia', 'vagabunda',
  'vagabundo', 'viado', 'xana', 'xoxota', 'xereca', 'retardado', 'retardada',
  'crioulo', 'sapatao', 'traveco', 'baitola',
  // inglês
  'fuck', 'fucker', 'fucking', 'shit', 'bitch', 'cunt', 'dick', 'cock', 'pussy',
  'asshole', 'bastard', 'whore', 'slut', 'nigger', 'nigga', 'faggot', 'fag', 'retard',
]);

export function ehBloqueada(palavra: string): boolean {
  const n = normalizar(palavra);
  return BLOQUEADAS.has(n) || n.split(/[-_]/).some((parte) => BLOQUEADAS.has(parte));
}
