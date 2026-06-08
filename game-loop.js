import { criarTabuleiro } from "./script-jogador.js";
import { criaNavios } from "./script-jogador.js";
import { bloquearArrasteDosNavios } from "./script-jogador.js";
import { verificaIniciarJogo } from "./script-jogador.js";
import { marcarPosicoesDosNavios } from "./script-jogador.js";

import { statusMensagem } from "./script-tabuleiro.js";
import { statusAlerta } from "./script-tabuleiro.js";
import { tabuleiroHTMLparaJSON } from "./script-tabuleiro.js";
import { alternarTransparenciaTabuleiro } from "./script-tabuleiro.js";
import { alternarTransparencia } from "./script-tabuleiro.js";

import { AudioManager } from "./script-audioManager.js";

const audio = new AudioManager();

alternarTransparencia(".botao-posicionar-navios")
alternarTransparencia(".botao-terminar-jogo")
alternarTransparencia(".status-jogo")

function iniciarJogo() {
    audio.playBackground();
    criaNavios();
    criarTabuleiro(tabuleiroJogador, MATRIZ_JOGADOR);
    criarTabuleiro(tabuleiroInimigo, MATRIZ_INIMIGO);

    alternarTransparenciaTabuleiro("inimigo");
    alternarTransparencia(".botao-iniciar-jogo")
    alternarTransparencia(".botao-posicionar-navios")
    alternarTransparencia(".status-jogo")

    statusMensagem("Arraste os navios pro seu tabuleiro, e clique em Posicionar Navios!");

    btnIniciarJogo.removeEventListener("click", iniciarJogo);

    btnPosicionarNavios.addEventListener("click", posicionarNavios);
}

function posicionarNavios() {
    if (verificaIniciarJogo() === true) {
        statusMensagem("Pronto! É a sua vez! Clique em uma posição do tabuleiro inimigo pra atacar! Quando você errar, será a vez da IA!");

        marcarPosicoesDosNavios();
        bloquearArrasteDosNavios();
        atualizarGifTabuleiro(tabuleiroJogador);

        btnPosicionarNavios.removeEventListener("click", posicionarNavios);

        alternarTransparenciaTabuleiro("jogador");
        alternarTransparenciaTabuleiro("inimigo");

        gameLoop();
    } else {
        statusAlerta("Posicione todos os navios no tabuleiro antes de começar!")
    }
}

function gameLoop() {

}

btnIniciarJogo.addEventListener("click", iniciarJogo);