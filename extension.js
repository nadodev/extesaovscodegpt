const vscode = require('vscode');
const openai = require('openai');

// Configurar as credenciais da API do ChatGPT
const chatGptApikey = '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'; // Substitua pela sua chave de API do ChatGPT

// Criar uma instância do ChatGPT
// @ts-ignore
const chatGpt = new openai.ChatCompletion({
  apiKey: chatGptApikey,
});

// Função para enviar uma solicitação à API do ChatGPT
async function sendChatRequest(message) {
  const response = await chatGpt.create({
    messages: [
      { role: 'system', content: 'Você é um bot de sugestões de código.' },
      { role: 'user', content: message },
    ],
  });

  const { choices } = response.data;
  const reply = choices[0].message.content;

  return reply;
}

// Comando para solicitar uma sugestão de código
async function suggestCode() {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const document = editor.document;
    const selection = editor.selection;

    const selectedText = document.getText(selection);
    const userMessage = `Sugerir código para: ${selectedText}`;

    try {
      const reply = await sendChatRequest(userMessage);
      vscode.window.showInformationMessage(reply);
    } catch (error) {
      vscode.window.showErrorMessage('Erro ao solicitar sugestão de código.');
      console.error(error);
    }
  }
}

// Ativar a extensão
function activate(context) {
  console.log('A extensão "ChatGPT Code Suggestions" foi ativada.');

  // Registrar o comando para solicitar sugestões de código
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.suggestCode', suggestCode)
  );
}
exports.activate = activate;

// Desativar a extensão
function deactivate() {
  console.log('A extensão "ChatGPT Code Suggestions" foi desativada.');
}
exports.deactivate = deactivate;
