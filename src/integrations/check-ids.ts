import type { AstroIntegration } from 'astro';
import { fileURLToPath } from 'node:url';
import { verificarPerfis, formatarErros } from '../lib/verificar-perfis';

/**
 * Roda a mesma validação do `npm run check-ids` dentro do Astro.
 * No build, qualquer erro interrompe o processo. No dev, só avisa.
 */
export default function checkIds(): AstroIntegration {
  return {
    name: 'wikimpa:check-ids',
    hooks: {
      'astro:config:setup': ({ command, config, logger }) => {
        const { erros } = verificarPerfis(fileURLToPath(config.root));
        if (!erros.length) return;
        const msg = `Perfis com problema:\n\n${formatarErros(erros)}\n`;
        if (command === 'build') throw new Error(msg);
        logger.warn(msg);
      },
    },
  };
}
