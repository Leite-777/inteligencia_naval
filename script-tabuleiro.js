import { terminarJogo } from "./game-start.js";
import { inicializaOsNaviosIA } from "./script-jogador.js";
import { AudioManager } from "./script-audioManager.js";

//Instancia do AudioManager pra controlar o audio
const audio = new AudioManager();

/**
 * Converte o tabuleiro HTML para um array JSON, com o formato [0,0,0,0,0...]
 * @param {*} seletorTabuleiro A classe do tabuleiro, como ".tabuleiro-jogador"
 * @returns A matriz JSON com o tabuleiro, onde cada posição é o celula.dataset.status
 */
export function tabuleiroHTMLparaJSON(seletorTabuleiro) {
    const tabuleiro = document.querySelector(seletorTabuleiro);
    const matriz = [];

    tabuleiro.querySelectorAll(".celula").forEach(celula => {
        const linha = Number(celula.dataset.linha);
        const coluna = Number(celula.dataset.coluna);
        const status = Number(celula.dataset.status);

        if (!matriz[linha]) {
            matriz[linha] = [];
        }

        matriz[linha][coluna] = status;
    });

    return matriz;
}

/**
 * Converte uma matriz JSON para o tabuleiro HTML, atualiza navios que foram afundados, posiciona os gifs adequados pra cada posição.
 * @param {*} matriz A matriz JSON usada para substituir
 * @param {*} seletorTabuleiro A classe do tabuleiro que será substituído, como ".tabuleiro-jogador"
 * @returns Não há retorno, apenas substitui o tabuleiro no HTML
 */
export function tabuleiroJSONparaHTML(matriz, seletorTabuleiro) {
    const tabuleiro = document.querySelector(seletorTabuleiro);

    if (!tabuleiro) {
        console.error("Tabuleiro não encontrado.");
        return;
    }

    const celulas = tabuleiro.querySelectorAll(".celula");

    for (let linha = 0; linha < matriz.length; linha++) {
        for (let coluna = 0; coluna < matriz[linha].length; coluna++) {

            const indice = linha * matriz[linha].length + coluna;
            const celula = celulas[indice];

            if (!celula) continue;

            celula.dataset.linha = linha;
            celula.dataset.coluna = coluna;
            celula.dataset.status = matriz[linha][coluna];
        }
    }
    
    if(seletorTabuleiro === ".tabuleiro-inimigo"){
        if(verificarSeNaviosForamAfundados(-1) == true){
            terminarJogo(1);
        }
    }
    else{
        if(verificarSeNaviosForamAfundados(1) == true){
            terminarJogo(-1);
        };
    }
    atualizarGifTabuleiro(tabuleiro);
}

export function verificarSeNaviosForamAfundados(tipoTabuleiro) {
    let naviosAfundados = 0;
    let posicoesAfundadas = 0;
    let listaNavios = [];

    if(tipoTabuleiro === 1){
        listaNavios = naviosCriados;
    }else{
        listaNavios = naviosIA;
    }
    
    for (const navio of listaNavios.filter(Boolean)) {

        if (!navio.posicionado) continue;
        
        posicoesAfundadas = 0;
        // Conta o número de posições que foi atingido
        for (const posicao of navio.posicoesOcupadas) {
            const celula = document.getElementById(posicao);

            if (celula) {
                if(celula.dataset.status === "3" || celula.dataset.status === "4")
                    posicoesAfundadas++;
            }
        }
        // Se o navio foi completamente atingido, atualiza o navio inteiro como afundado
        if(posicoesAfundadas === navio.posicoesOcupadas.length){
            for (const posicao of navio.posicoesOcupadas) {
                const celula = document.getElementById(posicao);

                if (celula) {
                    celula.dataset.status = "4";
                }
            }

            // Atualiza a cor do navio para indicar que ele afundou (apenas para o jogador, para a IA os navios continuam invisíveis)
            let navioDiv = document.getElementById(navio.codigo);
            if(navioDiv && tipoTabuleiro === 1){
                navioDiv.style.backgroundColor = "rgb(50, 50, 50)";
            }

            if(navio.afundou === false){
                audio.playExplosion();
                // Faz com que o alerta só apareça para navios atingidos recentemente
                navio.marcarComoAfundado = true;
                if(tipoTabuleiro === 1){
                    statusAlerta("[ !! ] ALERTA CRÍTICO! Um navio da sua frota foi destruído. [ !! ]");
                }else{
                    statusMensagem("[XX] DESTRUIÇÃO TOTAL! O navio inimigo não resistiu aos danos. [XX]");
                }
            }
            naviosAfundados++;
        }
    }
    if(naviosAfundados === 5){
        return true;
    }else{
        return false;
    }
}

// Função para ativar/desativar transparência de um tabuleiro
let transparenciaJogador = false;
let transparenciaInimigo = false;

export function alternarTransparenciaTabuleiro(tipo) {

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

export function alternarTransparencia(seletorElemento){
    const elemento = document.querySelector(seletorElemento);

    elemento.classList.toggle(
        "transparente"
    );
}

export function ocultarElemento(seletorElemento, estado) {
    const elemento = document.querySelector(seletorElemento);

    // O "if" garante que o código só roda se o elemento realmente existir
    if (elemento) {
        elemento.classList.toggle("oculto", estado);
    }
}

export function desativarTabuleiros(){
    tabuleiroJogador.style.opacity = 0.2;
    tabuleiroInimigo.style.opacity = 0.2;
    tabuleiroJogador.classList.add("encerrado");
    tabuleiroInimigo.classList.add("encerrado");
    tabuleiroInimigo.querySelectorAll(".celula").forEach(celula => {
        celula.style.pointerEvents = "none";
    });
}

/**
 * Funções pra verificar se o campo da Chave API está vazia, ou se o conteúdo dentro segue os padrões de uma chave API do Gemini, respectivamente.
 */
const inputChaveAPI = document.querySelector("#api-key");
const botaoPreencherAPI = document.querySelector(".botao-preencher-api");

export function verificarChaveAPI() {
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

botaoPreencherAPI.addEventListener("click", () => {
    inputChaveAPI.value = "chave-temporaria";
});

/**
 * Funções para o Status, para adicionar informações sobre o que está ocorrendo no jogo da Batalha Naval.
 */
const statusJogo = document.querySelector(".status-jogo");

let intervaloTypeWriter;

function exibirStatus(mensagem, corTexto) {
    clearInterval(intervaloTypeWriter);

    // Pega os parágrafos atuais
    const paragrafos = statusJogo.querySelectorAll("p");

    // Empurra as mensagens para trás
    paragrafos[0].textContent = paragrafos[1].textContent;
    paragrafos[0].style.color = paragrafos[1].style.color;
    
    paragrafos[1].textContent = paragrafos[2].textContent;
    paragrafos[1].style.color = paragrafos[2].style.color;
    
    paragrafos[2].textContent = mensagem;
    paragrafos[2].style.color = corTexto
}

export function statusMensagem(mensagem) {
    exibirStatus(mensagem, "#3EE5DF");
}

export function statusAlerta(mensagem) {
    exibirStatus(mensagem, "#ff4040");
}

export function statusAnuncio(mensagem) {
    exibirStatus(mensagem, "#40ff40");
}