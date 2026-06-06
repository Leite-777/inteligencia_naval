import { verificarSeNaviosForamAfundados } from "./script-jogador.js";

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
    
    verificarSeNaviosForamAfundados();
    atualizarGifTabuleiro(tabuleiro);
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

export function statusMensagem(mensagem) {
    typeWriter(mensagem, "#014177");
}

export function statusAlerta(mensagem) {
    typeWriter(mensagem, "#aa2a2a");
}