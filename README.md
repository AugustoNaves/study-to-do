# SHEMA · Estudos com propósito

PWA para organizar estudos e cultivar a fé: estudar com sabedoria, crescer em conhecimento e fortalecer a fé.

- **Início:** versículo do dia, jornada de hoje (preparar o coração, estudar, refletir), tarefas do dia e próximos estudos
- **Estudos:** tarefas com matéria, data e prioridade (já vem com a trilha de back-end de 12 semanas)
- **Devocionais:** 14 devocionais (7 para antes e 7 para depois de estudar) com anotações e oração
- **Progresso:** semana, totais e histórico, sem cobrança por dias parados
- Lembrete diário às 19h (horário de Brasília) via notificação push
- Funciona offline; tudo fica salvo só no aparelho (com exportar/importar backup)

Textos bíblicos: Bíblia Livre (BLIVRE), © 2018 Diego Santos, Mario Sérgio e Marco Teles, licença CC BY 4.0.

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
