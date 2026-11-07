// Trilha de 12 semanas: sistema de inscrição e check-in (Node + TypeScript).
// Cada tarefa é uma "coisinha" que cabe num dia curto de estudo.
const TRILHA = [
  {
    id: "f1", titulo: "Fundamentos de API", semanas: "Semana 1",
    tarefas: [
      ["f1-1", "Criar projeto Node + TypeScript (npm init, tsconfig)"],
      ["f1-2", "Instalar Express e subir GET /health"],
      ["f1-3", "POST /eventos com validação (422 se inválido)"],
      ["f1-4", "GET /eventos listando tudo"],
      ["f1-5", "POST /eventos/:id/inscricoes (201, 404, 409, 422)"],
      ["f1-6", "GET /eventos/:id/inscricoes"],
      ["f1-7", "Testar todos os casos de erro com curl ou Insomnia"],
      ["f1-8", "Explicar com suas palavras: 400 vs 404 vs 409 vs 422"],
      ["f1-9", "Mandar o código para revisão"],
    ],
  },
  {
    id: "f2", titulo: "Banco de dados", semanas: "Semanas 2–3",
    tarefas: [
      ["f2-1", "Instalar PostgreSQL (direto ou via Docker)"],
      ["f2-2", "Desenhar no papel as tabelas eventos e inscricoes"],
      ["f2-3", "Escrever CREATE TABLE na mão (PK, FK, NOT NULL, UNIQUE)"],
      ["f2-4", "Conectar o app ao banco com o pacote pg"],
      ["f2-5", "Trocar o array por INSERT e SELECT"],
      ["f2-6", "Usar parâmetros ($1, $2) e entender SQL injection"],
      ["f2-7", "Garantir o limite de vagas com transação"],
      ["f2-8", "Criar um índice e explicar por que ele ajuda"],
      ["f2-9", "Mandar o código para revisão"],
    ],
  },
  {
    id: "f3", titulo: "Login do organizador", semanas: "Semanas 4–5",
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
    id: "f4", titulo: "Front + check-in", semanas: "Semanas 6–7",
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
    id: "f5", titulo: "Segurança", semanas: "Semanas 8–9",
    tarefas: [
      ["f5-1", "Ler o OWASP Top 10 (um item por dia vale!)"],
      ["f5-2", "Tentar SQL injection no próprio app"],
      ["f5-3", "Tentar acessar dados trocando IDs na URL"],
      ["f5-4", "Rate limit na rota de login"],
      ["f5-5", "Segredos em .env e .env no .gitignore"],
      ["f5-6", "Configurar Helmet e CORS"],
      ["f5-7", "Testes automatizados das rotas principais"],
      ["f5-8", "Mandar o código para revisão"],
    ],
  },
  {
    id: "f6", titulo: "Open source", semanas: "Semanas 10–12",
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
    id: "fp", titulo: "Em paralelo", semanas: "A partir do mês 2",
    tarefas: [
      ["fp-1", "Achar um projeto com good first issue"],
      ["fp-2", "1ª contribuição open source"],
      ["fp-3", "2ª contribuição open source"],
      ["fp-4", "3ª contribuição open source"],
    ],
  },
];
