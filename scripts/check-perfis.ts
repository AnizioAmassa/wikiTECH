/**
 * npm run check-perfis
 * Valida o nome do arquivo e o frontmatter de todos os perfis.
 * Sai com código 1 se houver qualquer erro.
 */
import { verificarPerfis, formatarErros } from '../src/lib/verificar-perfis';

const { arquivos, erros } = verificarPerfis();

if (erros.length) {
  console.error(`\n${formatarErros(erros)}\n`);
  console.error(`${erros.length} problema(s) em ${arquivos} perfil(is).`);
  process.exit(1);
}

console.log(`✔ ${arquivos} perfil(is) válidos.`);
