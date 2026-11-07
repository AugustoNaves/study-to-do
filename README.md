# study-to-do

App (PWA) para manter uma trilha de estudos andando: **pelo menos uma coisinha por dia**.

- Trilha de 12 semanas para construir um sistema de inscrição e check-in (Node + TypeScript)
- Contagem de dias seguidos e mapa dos dias estudados
- Lembrete diário às 19h (horário de Brasília) via notificação push
- Funciona offline; o progresso fica salvo só no aparelho (com exportar/importar backup)

## Instalar no Android

1. Abra o site do app no **Chrome**.
2. Menu ⋮ → **Instalar app** (ou "Adicionar à tela inicial").
3. Abra pelo ícone, vá em **Ajustes → Ativar lembrete** e permita notificações.
4. Copie o código que aparece e salve no segredo `PUSH_SUBSCRIPTION` do repositório:

```bash
gh secret set PUSH_SUBSCRIPTION --repo <usuario>/study-to-do
```

## Como o lembrete funciona

O workflow `.github/workflows/lembrete.yml` roda todo dia às 22:00 UTC (19:00 em Brasília) e envia um Web Push com `scripts/enviar-lembrete.mjs`. Ele usa três segredos do repositório:

| Segredo | O que é |
|---|---|
| `VAPID_PUBLIC_KEY` | Chave pública (a mesma que está em `app.js`) |
| `VAPID_PRIVATE_KEY` | Chave privada, **nunca** vai para o código |
| `PUSH_SUBSCRIPTION` | Endereço de notificação do seu celular |

Para testar na hora: aba **Actions → Lembrete diário → Run workflow**.

Observações:
- O GitHub pode atrasar tarefas agendadas em alguns minutos.
- Tarefas agendadas são desligadas após 60 dias sem atividade; o workflow faz um commit pequeno todo dia 1º para evitar isso.

## Licença

MIT
