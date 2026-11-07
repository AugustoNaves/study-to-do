// Envia o lembrete diário via Web Push. Roda no GitHub Actions.
import webpush from "web-push";

const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, PUSH_SUBSCRIPTION } = process.env;

if (!PUSH_SUBSCRIPTION) {
  console.log("Nenhum celular inscrito ainda (segredo PUSH_SUBSCRIPTION vazio). Nada a enviar.");
  process.exit(0);
}
if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
  console.error("Faltam os segredos VAPID_PUBLIC_KEY e VAPID_PRIVATE_KEY.");
  process.exit(1);
}

const MENSAGENS = [
  "Que tal um momento de estudo hoje? Sem pressa.",
  "Um passo de cada vez. Seus estudos te esperam.",
  "Prepare o coração e comece com uma coisa pequena.",
  "Estudar também é cuidar do que Deus te confiou.",
  "Alguns minutos já contam. Bora?",
  "Hora boa para aprender algo novo.",
  "Seu caminho é seu. Dê o próximo passo quando puder.",
];
const diaDoAno = Math.floor((Date.now() - Date.UTC(new Date().getUTCFullYear(), 0, 0)) / 86400000);
const body = MENSAGENS[diaDoAno % MENSAGENS.length];

webpush.setVapidDetails("https://github.com/actions", VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

try {
  const res = await webpush.sendNotification(
    JSON.parse(PUSH_SUBSCRIPTION),
    JSON.stringify({ title: "study-to-do", body, url: "./" }),
    { TTL: 60 * 60 * 6 }
  );
  console.log("Lembrete enviado. Status:", res.statusCode);
} catch (err) {
  if (err.statusCode === 404 || err.statusCode === 410) {
    console.error("A inscrição do celular expirou. Abra o app, toque em Ativar lembrete e atualize o segredo PUSH_SUBSCRIPTION.");
  } else {
    console.error("Falha ao enviar:", err.statusCode, err.body || err.message);
  }
  process.exit(1);
}
