// Para os botões de conteúdo colapsáveis
const botoes = document.querySelectorAll(".colapsavel-expandir");
const conteudos = document.querySelectorAll(".colapsavel-conteudo");

// Função para ocultar/exibir conteúdos colapsáveis
botoes.forEach(botao => {
    botao.addEventListener("click", () => {
        const conteudo = botao.nextElementSibling;

        const displayAtual = getComputedStyle(conteudo).display;

        if (displayAtual === "none") {
            conteudo.style.display = "block";
        } else {
            conteudo.style.display = "none";
        }
    });
});

// Inicialmente deixa os conteúdos colapsáveis ocultos
conteudos.forEach(cont => {
    cont.style.display = "none";
})

// Para os botões de Modal
const modais = document.querySelectorAll(".modal");

modais.forEach(modal => {
    // Busca os elementos APENAS dentro DESTE bloco modal específico
    const botaoAbrir = modal.querySelector(".modal-expandir");
    const container = modal.querySelector(".modal-container");
    const botaoFechar = modal.querySelector(".modal-fechar");

    // Abre o modal ao clicar no botão correspondente
    botaoAbrir.addEventListener("click", () => {
        container.classList.add("ativo");
    });

    // Fecha o modal ao clicar no botão de fechar (X) correspondente (se existir)
    if (botaoFechar) {
        botaoFechar.addEventListener("click", () => {
            container.classList.remove("ativo");
        });
    }

    // Fecha o modal se o usuário clicar no fundo escuro deste container
    container.addEventListener("click", (event) => {
        if (event.target === container) {
            container.classList.remove("ativo");
        }
    });
});

// Função para ativar/desativar transparência de um tabuleiro
let transparenciaJogador = false;
let transparenciaInimigo = false;

function alternarTransparenciaTabuleiro(tipo) {

    if (tipo === "jogador") {
        transparenciaJogador = !transparenciaJogador;

        tabuleiroJogador.classList.toggle(
            "transparente",
            transparenciaJogador
        );
    }

    if (tipo === "inimigo") {
        transparenciaInimigo = !transparenciaInimigo;

        tabuleiroInimigo.classList.toggle(
            "transparente",
            transparenciaInimigo
        );
    }
}

function alternarTransparencia(seletorElemento){
    const elemento = document.querySelector(seletorElemento);

    elemento.classList.toggle(
        "transparente"
    );
}

// Funções para utilização de gifs

/**
 *  Função responsável por adicionar o gif de ondas em uma celula.
 * 
 * @param celula referente ao campo a receber o gif de ondas.
 */
function addGifOndas(celula){
    const gifOnda = document.createElement('img');
    gifOnda.style.width = '40px';
    gifOnda.style.height = '40px';
    gifOnda.style.borderRadius = '5px';
    gifOnda.src = 'assets/gifs/ondas.gif';
    gifOnda.alt = 'Gif de Ondas';
    celula.appendChild(gifOnda);
}

/**
 *  Função responsável por adicionar o gif de nuvens em uma celula.
 * 
 * @param celula referente ao campo a receber o gif de nuvens.
 */
function addGifNuvens(celula){
    const gifNuvens = document.createElement('img');
    gifNuvens.style.width = '40px';
    gifNuvens.style.height = '40px';
    gifNuvens.style.borderRadius = '5px';
    gifNuvens.src = 'assets/gifs/nuvens.gif';
    gifNuvens.alt = 'Gif de Nuvens';
    celula.appendChild(gifNuvens);
}

/**
 *  Função responsável por adicionar o gif de fogo em uma célula de navio parcialmente atingido.
 * 
 * @param celula referente ao campo a receber o gif de fogo.
 */
function addGifFogo(celula){
    const gifFogo = document.createElement('img');
    gifFogo.style.width = '40px';
    gifFogo.style.height = '40px';
    gifFogo.style.borderRadius = '5px';
    gifFogo.src = 'assets/gifs/fogo.gif';
    gifFogo.alt = 'Gif de Fogo';
    celula.appendChild(gifFogo);
}

/**
 *  Função responsável por adicionar o gif de caveiras em uma célula de navio completamente afundado.
 * 
 * @param celula referente ao campo a receber o gif de fogo.
 */
function addGifCaveira(celula){
    const gifCaveira = document.createElement('img');
    gifCaveira.style.width = '40px';
    gifCaveira.style.height = '40px';
    gifCaveira.style.borderRadius = '5px';
    gifCaveira.src = 'assets/gifs/caveira.gif';
    gifCaveira.alt = 'Gif de Fogo';
    celula.appendChild(gifCaveira);
}

/**
 *  Função responsável por adicionar um gif específico ao campo de acordo com o status da celula.
 *  Status disponíveis: 
 *      0: Desconhecido - Nuvens
 *      1: Água - Ondas
 *      2: Navio - (sem alteração)
 *      3: Navio atingido - Fogo
 *      4: Navio afundado - Caveira
 * 
 * @param celula referente ao campo a receber o gif específico.
 */
function estadoCampo(celula){
    switch(celula.dataset.status){
        case "0": // Desconhecido
            addGifNuvens(celula);
            break;
        case "1": // Água
            addGifOndas(celula);
            break;
        case "3": // Navio parcialmente atingido
            addGifFogo(celula);
            break;
        case "4": // Navio completamente afundado
            celula.style.backgroundColor = 'gray';    
            addGifCaveira(celula);
            break;
    }
}

// Função para alteração do status-jogo
const statusJogo = document.querySelector(".status-jogo");

let intervaloTypeWriter;

function typeWriter(mensagem, corFundo, velocidade = 30) {
    clearInterval(intervaloTypeWriter);

    statusJogo.innerHTML = "";
    statusJogo.style.backgroundColor = corFundo;

    let i = 0;

    intervaloTypeWriter = setInterval(() => {
        statusJogo.innerHTML += mensagem.charAt(i);
        i++;

        if (i >= mensagem.length) {
            clearInterval(intervaloTypeWriter);
        }
    }, velocidade);
}

function statusMensagem(mensagem) {
    typeWriter(mensagem, "#014177");
}

function statusAlerta(mensagem) {
    typeWriter(mensagem, "#aa2a2a");
}
