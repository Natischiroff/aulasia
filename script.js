const mensagens = [];

const chat = document.getElementById('chat');
const form = document.getElementById('form');
const pergunta = document.getElementById('pergunta');
const enviar = document.getElementById('enviar');

function mostrar(role, texto) {
    const div = document.createElement('div');
    div.className = 'msg ' + role;
    div.textContent = texto;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
    return div;
}

form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const texto = pergunta.value.trim();
    if (!texto) return;

    mensagens.push({ role: 'user', content: texto });
    mostrar('user', texto);
    pergunta.value = '';
    enviar.disabled = true;
    const balao = mostrar('assistant', 'Pensando...');

    try {
        const resposta = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({mensagens: mensagens})
        });
        if (!resposta.ok) throw new Error('HTTP ' + resposta.status);
        const dados = await resposta.json();
        mensagens.push({role: 'assistent',content:dados.resposta});
        if(dados.ferramentas.lenght >0){
            mostrar('ferramentas','Consultou:'+dados.ferramentas.join(','));

        }
        balao.textContent = dados.message.content;
    } catch (erro) {
        mensagens.pop();
        balao.textContent = 'Erro ao falar com o Ollama: ' + erro.message + '. O Ollama está rodando?';
    }
    enviar.disabled = false;
    pergunta.focus();
});