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
      ["f0-1", "Trocar a senha do banco e o token do psico no Supabase", {
        porque: "Essas credenciais ficaram salvas no histórico do git. Quem tiver acesso ao repositório consegue entrar no banco, que tem dados de pacientes.",
        comecar: "No painel do Supabase, abra o projeto do psico → Project Settings → Database e redefina a senha do banco. Depois, em Account → Access Tokens, apague o token antigo e crie outro.",
        pronto: "As credenciais antigas não funcionam mais e o psico continua rodando com as novas (atualize-as também na Vercel).",
        termo: "Credencial: qualquer senha, token ou chave que dá acesso a um sistema.",
      }],
      ["f0-2", "Trocar a chave e o token do Trello", {
        porque: "Eles também ficaram no histórico do git e dão acesso aos seus quadros.",
        comecar: "Na área de integrações do Trello (trello.com/power-ups/admin), gere uma chave nova. Depois revogue o token antigo nas configurações da sua conta, em aplicativos autorizados.",
        pronto: "Os scripts que usam o Trello funcionam com a chave nova e a antiga não funciona mais.",
      }],
      ["f0-3", "Tirar as senhas de verdade do arquivo de exemplo do psico", {
        porque: "O arquivo .env.example serve só para mostrar quais configurações existem. Ele vai para o git, então não pode ter valores reais.",
        comecar: "Abra o .env.example e troque cada valor por um texto como coloque-aqui. Mantenha só os nomes.",
        pronto: "Nenhum valor real no arquivo, e o commit feito.",
        termo: "Variável de ambiente: uma configuração (como uma senha) que fica fora do código.",
      }],
      ["f0-4", "Remover o cupom de acesso grátis que está escrito no código", {
        porque: "Qualquer pessoa que veja o código descobre o cupom e usa o sistema de graça para sempre.",
        comecar: "Busque o nome do cupom no projeto (busca do editor) e apague do código e do seed. Se precisar de cupom, ele deve ser criado no banco, não no código.",
        pronto: "A busca não encontra mais o cupom e os testes continuam passando.",
        termo: "Seed: arquivo que coloca dados iniciais no banco.",
      }],
      ["f0-5", "Tirar do git as pastas do Claude que não deveriam estar lá", {
        porque: "Elas trazem configurações pessoais suas e até arquivos de node_modules, que só pesam no repositório.",
        comecar: "Rode git rm -r --cached .claude/worktrees .claude/settings.local.json e adicione essas duas linhas no .gitignore.",
        pronto: "Depois do commit, o git status fica limpo e as pastas continuam no seu computador.",
        termo: ".gitignore: lista de arquivos que o git deve ignorar.",
      }],
      ["f0-6", "Guardar a chave do Google num lugar seguro", {
        porque: "Um arquivo de texto solto com uma chave pode acabar num commit ou num backup sem você perceber.",
        comecar: "Copie a chave para um gerenciador de senhas (o do navegador, Bitwarden ou 1Password) e apague o ChaveAPIGoogle.txt.",
        pronto: "O arquivo não existe mais e você sabe onde achar a chave.",
      }],
      ["f0-7", "Perguntar para a usuária do psico o que mais incomoda", {
        porque: "Ter uma usuária real vale ouro. O que ela disser vira os bugs e melhorias que você vai estudar mais para frente.",
        comecar: "Mande no WhatsApp: “Oi! Estou melhorando o sistema. O que mais te atrapalha ou faz falta hoje?”",
        pronto: "Você anotou a resposta (pode ser numa tarefa nova aqui no app).",
      }],
    ],
  },
  {
    id: "f1", titulo: "Fundamentos de API", semanas: "Semanas 1–2", materia: MATERIAS.projeto,
    tarefas: [
      ["f1-1", "Criar a pasta do projeto check-in com Node e TypeScript", {
        porque: "Este é o projeto que você vai construir do zero, sozinho, nos próximos meses: um sistema onde pessoas se inscrevem em eventos e fazem check-in na entrada. Escrever cada parte é o que vai te dar segurança.",
        comecar: "Crie a pasta e rode: npm init -y, depois npm install -D typescript tsx @types/node, depois npx tsc --init.",
        pronto: "Um arquivo src/index.ts com console.log(\"oi\") roda com npx tsx src/index.ts.",
        termo: "TypeScript: JavaScript com tipos, que avisa vários erros antes de rodar.",
      }],
      ["f1-2", "Fazer o servidor responder que está vivo", {
        porque: "É o primeiro sinal de que o servidor funciona. Toda API em produção tem uma rota assim para ser monitorada.",
        comecar: "Rode npm install express e npm install -D @types/express. Crie um servidor que responde { ok: true } quando alguém acessa GET /health na porta 3000.",
        pronto: "Abrir http://localhost:3000/health no navegador mostra {\"ok\":true}.",
        termo: "Rota: um endereço da API (como /health) junto com o método (GET para ler, POST para criar).",
      }],
      ["f1-3", "Criar a rota que cadastra um evento e recusa dados errados", {
        porque: "Todo sistema recebe dados de fora, e dado de fora pode vir errado. É aqui que você aprende a se defender.",
        comecar: "Crie a rota POST /eventos, que recebe nome e data. Se o nome vier vazio, responda com o código 422 (“entendi o pedido, mas os dados estão errados”). Se estiver tudo certo, guarde o evento num array e responda 201.",
        pronto: "Pelo Insomnia, um evento sem nome recebe 422 e um evento correto recebe 201.",
        termo: "Validação: conferir se o dado faz sentido antes de usar.",
      }],
      ["f1-4", "Criar a rota que lista os eventos", {
        porque: "Cadastrar sem conseguir ver não serve. Aqui você junta as duas pontas.",
        comecar: "Crie GET /eventos, que devolve o array onde você está guardando os eventos (o banco de dados vem na próxima fase).",
        pronto: "Você cadastra dois eventos e a listagem mostra os dois.",
      }],
      ["f1-5", "Inscrever uma pessoa num evento, tratando cada erro possível", {
        porque: "Esta é a regra principal do sistema, e é onde aparecem os casos difíceis: evento que não existe, pessoa inscrita duas vezes.",
        comecar: "Crie POST /eventos/:id/inscricoes, que recebe nome e e-mail. Responda 201 se deu certo, 404 se o evento não existe, 409 se o e-mail já está inscrito e 422 se faltar algum dado.",
        pronto: "Você consegue provocar cada um dos quatro casos.",
        termo: "Código HTTP: número que diz o resultado. 2xx deu certo, 4xx erro de quem pediu, 5xx erro do servidor.",
      }],
      ["f1-6", "Listar quem se inscreveu num evento", {
        porque: "É a tela que o organizador do evento mais vai usar.",
        comecar: "Crie GET /eventos/:id/inscricoes, que devolve as inscrições daquele evento, ou 404 se o evento não existir.",
        pronto: "Duas inscrições aparecem na lista do evento certo e não aparecem na de outro evento.",
      }],
      ["f1-7", "Testar na mão todos os caminhos de erro", {
        porque: "Quem testa só o caminho feliz deixa os bugs para o usuário encontrar.",
        comecar: "No Insomnia (ou Postman), salve uma requisição para cada caso: sucesso, dado faltando, evento que não existe, inscrição repetida.",
        pronto: "Uma coleção salva com todos os casos, e cada um responde o código esperado.",
      }],
      ["f1-8", "Explicar com suas palavras a diferença entre 400, 404, 409 e 422", {
        porque: "Escolher o código certo mostra que você entende o que deu errado. É pergunta comum em entrevista.",
        comecar: "Sem IA, escreva uma frase e um exemplo do seu projeto para cada código. Depois confira na documentação da MDN (developer.mozilla.org).",
        pronto: "Você explica em voz alta sem olhar nada.",
        termo: "400: pedido mal formado. 404: não existe. 409: conflita com o que já existe. 422: formato certo, mas dado inválido.",
      }],
      ["f1-10", "Entender por que o servidor nunca confia no que o cliente manda", {
        porque: "Foi o ponto mais grave que passou na sua avaliação: o preço vindo do navegador. Qualquer pessoa consegue mudar o que o navegador envia.",
        comecar: "No Insomnia, mande uma inscrição com um campo a mais, como \"status\": \"confirmada\", e veja se o servidor aceita. Depois liste quais dados do check-in só o servidor pode decidir.",
        pronto: "Você lista 3 dados que nunca devem vir do cliente (por exemplo: data da inscrição, status, id) e explica por quê.",
      }],
      ["f1-9", "Pedir uma revisão do código", {
        porque: "Outra pessoa enxerga o que você não enxerga. É assim que se aprende mais rápido.",
        comecar: "Suba o projeto no GitHub. Antes de pedir revisão, anote o que você acha que está mais fraco. Depois peça para alguém (ou um agente) revisar e compare com a sua lista.",
        pronto: "Você recebeu comentários e corrigiu pelo menos um.",
      }],
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
