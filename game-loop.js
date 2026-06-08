import { criarTabuleiro } from "./script-jogador.js";
import { criaNavios } from "./script-jogador.js";
import { bloquearArrasteDosNavios } from "./script-jogador.js";
import { verificaIniciarJogo } from "./script-jogador.js";
import { marcarPosicoesDosNavios } from "./script-jogador.js";

import { statusMensagem } from "./script-tabuleiro.js";
import { statusAlerta } from "./script-tabuleiro.js";
import { statusAnuncio } from "./script-tabuleiro.js";
import { tabuleiroHTMLparaJSON } from "./script-tabuleiro.js";
import { alternarTransparenciaTabuleiro } from "./script-tabuleiro.js";
import { alternarTransparencia } from "./script-tabuleiro.js";
import { desativarTabuleiros } from "./script-tabuleiro.js";

import { AudioManager } from "./script-audioManager.js";

const audio = new AudioManager();

alternarTransparencia(".botao-posicionar-navios")
alternarTransparencia(".botao-terminar-jogo")
alternarTransparencia(".status-jogo")

function iniciarJogo() {
    // Se não há nada no campo da Chave API, instrui ao usuário inserir um valor lá
    if(!verificarChaveAPI()){return;}

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
        statusAnuncio("Pronto! É a sua vez! Clique em uma posição do tabuleiro inimigo pra atacar! Quando você errar, será a vez da IA!");

        marcarPosicoesDosNavios();
        bloquearArrasteDosNavios();
        atualizarGifTabuleiro(tabuleiroJogador);

        btnPosicionarNavios.removeEventListener("click", posicionarNavios);

        alternarTransparenciaTabuleiro("jogador");
        alternarTransparenciaTabuleiro("inimigo");

        alternarTransparencia(".botao-posicionar-navios")
        alternarTransparencia(".botao-terminar-jogo")

        // Permite o usuário encerrar o jogo com um empate quando quiser
        btnTerminarJogo.addEventListener("click", terminarJogo);
    } else {
        statusAlerta("Posicione todos os navios no tabuleiro antes de começar!")
    }
}

export function terminarJogo(vencedor = 0) {
    desativarTabuleiros();
    switch(vencedor){
        case 1:
            statusAnuncio("MISSÃO CUMPRIDA! A frota da Inteligência Naval foi completamente eliminada.");
            break;
        case -1:
            statusAnuncio("DERROTA! A Inteligência Naval dominou o campo de combate.");
            break;
        default:
            statusAnuncio("CESSAR FOGO! Foi combinado um empate entre as duas equipes.");
    }

    alternarTransparencia(".botao-terminar-jogo")
}

btnIniciarJogo.addEventListener("click", iniciarJogo);