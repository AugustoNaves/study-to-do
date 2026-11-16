// Trilha de 6 meses: back-end de verdade + entender os próprios sistemas.
// Cada tarefa é uma "coisinha" que cabe num dia curto de estudo.
//
// Regra da trilha: nos temas de estudo, a IA é tutora, não autora.
// Nada entra no projeto sem que você consiga explicar em voz alta.
//
// Os ids são estáveis: o app usa o id para guardar seu progresso.
// Pode mudar título, ordem e fase à vontade; não reaproveite um id para outra tarefa.

const MATERIAS = {
  casa: "Arrumar a casa",
  projeto: "Projeto open source: check-in",
  psico: "Psico: entender o que já existe",
  jungle: "Desafio Jungle: concorrência",
  ia: "IA aplicada com eval",
  carreira: "Carreira e entrevistas",
  contrib: "Contribuir em outros projetos",
};

const TRILHA = [
  {
    id: "f0", titulo: "Arrumar a casa", semanas: "Semana 0", materia: MATERIAS.casa, prioridade: "alta",
    tarefas: [
      ["f0-1", "Psico: trocar token e senha do banco no Supabase"],
      ["f0-2", "Psico: revogar e gerar nova chave e token do Trello"],
      ["f0-3", "Psico: deixar só placeholders no .env.example"],
      ["f0-4", "Psico: remover o cupom fixo de acesso grátis (código e seed)"],
      ["f0-5", "Psico: tirar .claude/worktrees e settings.local.json do git"],
      ["f0-6", "Guardar ChaveAPIGoogle.txt num gerenciador de senhas e apagar o arquivo"],
      ["f0-7", "Mandar mensagem para a usuária do psico: o que mais incomoda hoje?"],
    ],
  },
  {
    id: "f1", titulo: "Fundamentos de API", semanas: "Semanas 1–2", materia: MATERIAS.projeto,
    tarefas: [
      ["f1-1", "Criar projeto Node + TypeScript (npm init, tsconfig)"],
      ["f1-2", "Instalar Express e subir GET /health"],
      ["f1-3", "POST /eventos com validação (422 se inválido)"],
      ["f1-4", "GET /eventos listando tudo"],
      ["f1-5", "POST /eventos/:id/inscricoes (201, 404, 409, 422)"],
      ["f1-6", "GET /eventos/:id/inscricoes"],
      ["f1-7", "Testar todos os casos de erro com curl ou Insomnia"],
      ["f1-8", "Explicar com suas palavras: 400 vs 404 vs 409 vs 422"],
      ["f1-10", "Explicar: por que o servidor nunca confia em valor vindo do cliente"],
      ["f1-9", "Mandar o código para revisão"],
    ],
  },
  {
    id: "f2", titulo: "Banco de dados", semanas: "Semanas 3–4", materia: MATERIAS.projeto,
    tarefas: [
      ["f2-1", "Instalar PostgreSQL (direto ou via Docker)"],
      ["f2-2", "Desenhar no papel as tabelas eventos e inscricoes"],
      ["f2-3", "Escrever CREATE TABLE na mão (PK, FK, NOT NULL, UNIQUE)"],
      ["f2-4", "Conectar o app ao banco com o pacote pg"],
      ["f2-5", "Trocar o array por INSERT e SELECT"],
      ["f2-6", "Usar parâmetros ($1, $2) e entender SQL injection"],
      ["f2-7", "Garantir o limite de vagas com transação"],
      ["f2-10", "Teste: duas inscrições na última vaga ao mesmo tempo, só uma passa"],
      ["f2-11", "Explicar: por que UNIQUE no banco protege mais que um if no código"],
      ["f2-8", "Criar um índice e explicar por que ele ajuda"],
      ["f2-9", "Mandar o código para revisão"],
    ],
  },
  {
    id: "f3", titulo: "Login do organizador", semanas: "Semanas 5–6", materia: MATERIAS.projeto,
    tarefas: [
      ["f3-1", "Criar a tabela organizadores"],
      ["f3-2", "Cadastro com senha em hash (argon2 ou bcrypt)"],
      ["f3-3", "Login devolvendo sessão ou JWT"],
      ["f3-4", "Middleware que protege as rotas"],
      ["f3-5", "Organizador só vê os próprios eventos (testar troca de ID)"],
      ["f3-6", "Logout e expiração da sessão"],
      ["f3-7", "Explicar: autenticação vs autorização"],
      ["f3-8", "Mandar o código para revisão"],
    ],
  },
  {
    id: "p1", titulo: "Psico: RLS e dados sensíveis", semanas: "Semanas 7–8", materia: MATERIAS.psico,
    tarefas: [
      ["p1-1", "Ler as policies de RLS de cada tabela e anotar o que cada uma faz"],
      ["p1-2", "Desenhar o caminho: login → JWT → public.tenant_id() → policy"],
      ["p1-3", "Explicar USING vs WITH CHECK com um exemplo do psico"],
      ["p1-4", "Listar onde o psico usa service_role ou SECURITY DEFINER e por quê"],
      ["p1-5", "Testar: usuário de um consultório tenta ler dados de outro"],
      ["p1-6", "Parar de logar o erro completo do Postgres (dado clínico no log)"],
      ["p1-7", "Desenhar no papel: evolução clínica visível só para quem atendeu"],
      ["p1-8", "Checkpoint mês 2: explicar o RLS do psico em voz alta, sem IA"],
    ],
  },
  {
    id: "f4", titulo: "Front + check-in", semanas: "Semanas 9–10", materia: MATERIAS.projeto,
    tarefas: [
      ["f4-1", "Página pública de inscrição"],
      ["f4-2", "Validação no front e no back (e entender por que nos dois)"],
      ["f4-3", "Painel do organizador com a lista de inscritos"],
      ["f4-4", "Gerar token único e QR code por inscrição"],
      ["f4-5", "Tela de check-in lendo o QR code"],
      ["f4-6", "Impedir check-in duplicado"],
      ["f4-7", "Mandar o código para revisão"],
    ],
  },
  {
    id: "f5", titulo: "Segurança", semanas: "Semanas 11–12", materia: MATERIAS.projeto,
    tarefas: [
      ["f5-1", "Ler o OWASP Top 10 (um item por dia vale!)"],
      ["f5-2", "Tentar SQL injection no próprio app"],
      ["f5-3", "Tentar acessar dados trocando IDs na URL"],
      ["f5-4", "Rate limit na rota de login"],
      ["f5-5", "Segredos em .env e .env no .gitignore"],
      ["f5-6", "Configurar Helmet e CORS"],
      ["f5-7", "Testes automatizados das rotas principais"],
      ["f5-9", "Barzinho: preço vem do catálogo, não do cliente"],
      ["f5-10", "Barzinho: checar o papel (role) no servidor, não só na tela"],
      ["f5-8", "Mandar o código para revisão"],
    ],
  },
  {
    id: "j1", titulo: "Concorrência e idempotência", semanas: "Semanas 13–15", materia: MATERIAS.jungle,
    tarefas: [
      ["j1-1", "Reler o enunciado da Jungle e listar o que pontua"],
      ["j1-2", "Dinheiro em centavos inteiros (nunca number com vírgula)"],
      ["j1-3", "Constraints no banco: saldo ≥ 0, UNIQUE onde precisa"],
      ["j1-4", "Lock por carteira e explicar a corrida entre checar e gravar"],
      ["j1-5", "Idempotência persistente: mesma chave, mesmo resultado"],
      ["j1-6", "Outbox: gravar o evento na mesma transação"],
      ["j1-7", "Teste de concorrência: 50 transferências ao mesmo tempo"],
      ["j1-8", "Escrever o ARCHITECTURE.md com as decisões"],
      ["j1-9", "Psico: estudar a cobrança idempotente (create_charge) linha a linha"],
      ["j1-10", "Refazer a etapa 1 da avaliação (revisão do endpoint de venda)"],
    ],
  },
  {
    id: "d1", titulo: "Depuração e observabilidade", semanas: "Semanas 16–17", materia: MATERIAS.psico,
    tarefas: [
      ["d1-1", "Escrever seu roteiro: evidência → hipóteses → confirmar → corrigir → teste"],
      ["d1-2", "Logs estruturados no psico (sem dado sensível)"],
      ["d1-3", "Configurar rastreio de erros (Sentry ou parecido)"],
      ["d1-4", "Resolver um bug real relatado pela usuária, seguindo o roteiro"],
      ["d1-5", "Resolver um segundo bug real"],
      ["d1-6", "Escrever um postmortem curto: causa, correção, prevenção"],
      ["d1-7", "Checkpoint mês 4: refazer a etapa 2 (cobrança duplicada)"],
    ],
  },
  {
    id: "f6", titulo: "Open source", semanas: "Semanas 18–20", materia: MATERIAS.projeto,
    tarefas: [
      ["f6-1", "README com o que faz, como instalar e prints"],
      ["f6-2", "Adicionar licença MIT"],
      ["f6-3", "Docker Compose (app + banco)"],
      ["f6-4", "Deploy (Render, Railway ou Fly)"],
      ["f6-5", "Teste de carga com k6: simular abertura de inscrições"],
      ["f6-6", "Publicar o repositório no GitHub"],
      ["f6-7", "Convidar pessoas reais para testar"],
      ["f6-8", "Responder a primeira issue"],
    ],
  },
  {
    id: "a1", titulo: "IA aplicada com eval", semanas: "Semanas 21–22", materia: MATERIAS.ia,
    tarefas: [
      ["a1-1", "Ler “Demystifying evals for AI agents” (Anthropic)"],
      ["a1-2", "Finance: trocar Float por centavos inteiros"],
      ["a1-3", "Finance: separar 30 transações reais como casos de teste"],
      ["a1-4", "Categorização automática com IA"],
      ["a1-5", "Eval: medir acertos e listar onde o modelo erra"],
      ["a1-6", "Melhorar o prompt ou as regras e medir de novo"],
    ],
  },
  {
    id: "v1", titulo: "Vitrine e entrevistas", semanas: "Semanas 23–24", materia: MATERIAS.carreira,
    tarefas: [
      ["v1-1", "README de verdade no psico: problema, arquitetura, decisões"],
      ["v1-2", "README de verdade no simullab (IC)"],
      ["v1-3", "README de verdade no finance"],
      ["v1-4", "Currículo: “SaaS em produção com usuária real”"],
      ["v1-5", "Entrevista simulada 1 (técnica, sem IA)"],
      ["v1-6", "Entrevista simulada 2"],
      ["v1-7", "Checkpoint mês 6: refazer a avaliação completa"],
    ],
  },
  {
    id: "fp", titulo: "Em paralelo", semanas: "A partir do mês 2", materia: MATERIAS.contrib,
    tarefas: [
      ["fp-1", "Achar um projeto com good first issue"],
      ["fp-2", "1ª contribuição open source"],
      ["fp-3", "2ª contribuição open source"],
      ["fp-4", "3ª contribuição open source"],
    ],
  },
];
