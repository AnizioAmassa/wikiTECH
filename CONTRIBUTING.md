# Como contribuir com a WikIMPA

Toda mudança entra por **pull request**. Você não precisa saber programar: basta criar ou editar um
arquivo Markdown (dá para fazer tudo pela interface web do GitHub).

## Regra número 1: opt-in

**Só existe perfil de quem criou o próprio perfil.**

- Você só pode criar ou editar o **seu** perfil.
- Não crie perfis nem páginas sobre outras pessoas, mesmo que sejam elogiosas, sem o consentimento explícito delas.
  Para corrigir um erro no perfil de alguém, peça para a pessoa ou anexe a autorização dela no PR.
- Páginas gerais (cultura, tradições, dicas…) não devem expor ninguém que não tenha consentido.
- **Sem fotos de pessoas**: o schema rejeita qualquer campo de foto.
- Quer sair? Abra um PR apagando o seu arquivo (ou peça para alguém da manutenção). Pedidos de remoção têm prioridade.

PRs que violem essas regras serão fechados.

## Criando o seu perfil

### 1. Escolha um identificador

Abra a página **/identificadores** do site. Ela lista tudo o que já foi usado e tem uma caixa
**"Está livre?"** para testar a sua ideia. Existem quatro tipos:

| Tipo | O que é | Pode repetir? | Exemplo no YAML |
|---|---|---|---|
| `palavra` | Uma única palavra, só com letras (hífen permitido), de 2 a 30 caracteres, nada obsceno | ❌ | `valor: Girassol` |
| `primo` | Um número primo à sua escolha | ✅ | `valor: 37` (sem aspas) |
| `patrono` | O nome de um(a) matemático(a) | ❌ | `valor: Emmy Noether` |
| `objeto` | Um objeto matemático específico, com LaTeX entre `$...$` | ❌ | `valor: 'o toro $\mathbb{T}^2$'` |

A comparação de unicidade **ignora maiúsculas, acentos e espaços**, então `Girassol`, `girassól` e
` GIRASSOL ` são o mesmo identificador. No `objeto`, todos os espaços são ignorados
(`$\mathbb{Z}/7$` = `$\mathbb{Z} / 7$`). Se dois PRs pegarem o mesmo identificador, vale o que for
aceito primeiro, e o outro precisa escolher de novo.

### 2. Crie o arquivo

Crie `src/content/pessoas/seu-nome.md`. Use só letras minúsculas sem acento, números e hífens no nome do arquivo
(ele vira o endereço da página: `/pessoas/seu-nome/`).

```markdown
---
nome: Seu Nome Completo        # obrigatório
turma: 2025                    # obrigatório: ano de entrada, sem aspas
apelido: "Seu Apelido"         # obrigatório (use aspas se tiver / : # ou começar com número)
enfase: Matemática             # opcional: Matemática, Física, Computação, Dados ou Ciclo Básico
identificador:                 # obrigatório
  tipo: palavra                # palavra | primo | patrono | objeto
  valor: Girassol
bio: Uma frase sobre você.     # opcional, até 280 caracteres, aceita $\LaTeX$
---

Aqui vai o texto livre do seu perfil, em Markdown. Pode usar LaTeX: $e^{i\pi} + 1 = 0$, ou

$$
\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}.
$$
```

> **Dica de YAML:** com LaTeX no frontmatter, use **aspas simples** (`'...'`), para que as barras
> invertidas (`\mathbb`) não sejam interpretadas.

### 3. Valide localmente (opcional, mas recomendado)

```bash
npm install
npm run check-ids
```

Se algo estiver errado, a mensagem diz o arquivo e o campo:

```
✖ src/content/pessoas/seu-nome.md
    identificador.valor: 15 não é primo
```

### 4. Abra o pull request

O GitHub Actions roda a mesma validação em todo PR. Se ficar verde e o checklist estiver ok, alguém da
manutenção faz o merge e o site é atualizado sozinho.

## Páginas gerais da wiki

Crie `src/content/wiki/nome-da-pagina.md`:

```markdown
---
titulo: Nome da página
categoria: cultura    # cultura | tradicoes | disciplinas | dicas | glossario
descricao: Uma linha resumindo a página (opcional).
---

Conteúdo em Markdown, com LaTeX.
```

## Revisão

O filtro de palavras obscenas é uma lista e não pega tudo. **A revisão humana do PR é a barreira
final**: quem revisa deve conferir que o identificador é apropriado e que o perfil pertence a quem abriu o PR.
