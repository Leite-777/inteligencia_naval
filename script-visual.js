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

// Funções para utilização de gifs

/**
 *  Função responsável por adicionar o gif de ondas em uma celula. (gifs default)
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
 *  Função responsável por adicionar o gif de nuvens em uma celula. (gifs default)
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
 *  Função responsável por adicionar o gif de água atingida em uma celula.
 * 
 * @param celula referente ao campo a receber o gif de água atingida.
 */
function addGifAguaAtingida(celula){
    const gifAguaAtingida = document.createElement('img');
    gifAguaAtingida.style.width = '40px';
    gifAguaAtingida.style.height = '40px';
    gifAguaAtingida.style.borderRadius = '5px';
    gifAguaAtingida.src = 'assets/gifs/aguaAtingida.gif';
    gifAguaAtingida.alt = 'Gif de Água Atingida';
    celula.appendChild(gifAguaAtingida);
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
    // Faz o gif aparecer sobre o navio
    gifFogo.style.zIndex = 100;
    celula.style.boxShadow = '0 0 10px 5px rgba(255, 69, 0, 0.7)'; // Adiciona um brilho vermelho ao redor do gif de fogo
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
    // Faz o gif aparecer sobre o navio
    gifCaveira.style.zIndex = 100;
    celula.style.boxShadow = ""; // Remove qualquer brilho anterior
    gifCaveira.style.boxShadow = '0 0 10px 5px rgba(0, 0, 0, 0.7)'; // Adiciona um brilho escuro ao redor do gif de caveira
    celula.appendChild(gifCaveira);
}

// /**
//  *  Função responsável por adicionar um gif específico ao campo de acordo com o status da celula.
//  *  Status disponíveis: 
//  *      0: Desconhecido - Nuvens
//  *      1: Água - Ondas
//  *      2: Navio - (sem alteração)
//  *      3: Navio atingido - Fogo
//  *      4: Navio afundado - Caveira
//  * 
//  * @param celula referente ao campo a receber o gif específico.
//  */
function estadoCampo(celula){
    switch(celula.dataset.status){
        case "0": // Desconhecido
            addGifNuvens(celula);
            break;
        case "1": // Água
            celula.style.backgroundColor = "#002341"
            addGifOndas(celula);
            break;
        case "2":
            celula.style.backgroundColor = "#002341"
            addGifOndas(celula);
            break;
        case "3": // Navio parcialmente atingido
            celula.style.backgroundColor = "#4d2727"
            addGifFogo(celula);
            break;
        case "4": // Navio completamente afundado
            celula.style.backgroundColor = "rgb(46, 19, 19)"
            addGifCaveira(celula);
            break;
    }
}

/**
 * Percorre todas as posições do tabuleiro e atualiza visualmente os gifs de acordo com o dataset.status.
 * Essa função deve ser chamada sempre que o estado do tabuleiro for alterado durante as rodadas.
 * 
 * @param tabuleiro Elemento HTML do tabuleiro
 */
function atualizarGifTabuleiro(tabuleiro){

    // Percorre todas as células do tabuleiro
    const celulas = tabuleiro.querySelectorAll(".celula");

    celulas.forEach(celula => {

        // Remove gifs antigos antes de atualizar
        const temImagem = celula.querySelector("img");
        if(temImagem){ celula.removeChild(temImagem)}

        // Remove estilos antigos
        celula.style.backgroundColor = "#014177";

        // Status atual da célula
        const status = celula.dataset.status;

        switch(status){
            case "0":
                // No tabuleiro do jogador, todas as posições sem navios são reveladas com água
                if(tabuleiro.classList.contains("tabuleiro-jogador")){
                    addGifOndas(celula);
                }
                else{
                    addGifNuvens(celula);
                }
                break;
            default:
                estadoCampo(celula);
                break;
        }
    });
}

/**
 * Funções pra verificar se o campo da Chave API está vazia, ou se o conteúdo dentro segue os padrões de uma chave API do Gemini, respectivamente.
 */
const inputChaveAPI = document.querySelector("#api-key");
const botaoPreencherAPI = document.querySelector(".botao-preencher-api");

function verificarChaveAPI() {
    const apiKey = inputChaveAPI.value.trim();

    if (apiKey === "") {
        inputChaveAPI.style.border = "2px solid red";

        inputChaveAPI.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        inputChaveAPI.focus();

        return false;
    }

    // Remove a borda vermelha caso o campo esteja preenchido
    inputChaveAPI.style.border = "";

    return true;
}

function validaEstruturaChaveAPI() {
    const apiKey= inputChaveAPI.value.trim();

    // Regex para o padrao da chave do Google API: Começa com 'AIza' e
    //  tem mais 35 caracteres letras, numeros, hifens ou underscores
    const regexChave = /^AIza[0-9A-Za-z\-_]{35}$/;
    
    // verifica se a chave existe dentro das especificacoes e retorna true or flase
    return regexChave.test(apiKey);
}

botaoPreencherAPI.addEventListener("click", () => {
    inputChaveAPI.value = "chave-temporaria";
});