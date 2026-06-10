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
import { ocultarElemento } from "./script-tabuleiro.js";
import { desativarTabuleiros } from "./script-tabuleiro.js";
import { verificarChaveAPI } from "./script-tabuleiro.js";

import { AudioManager } from "./script-audioManager.js";

const audio = new AudioManager();
let musicaAtivada = true;

alternarTransparencia(".botao-iniciar-jogo")
alternarTransparencia(".botao-terminar-jogo")
alternarTransparencia(".status-jogo")

function iniciarJogo() {
    // Se não há nada no campo da Chave API, instrui ao usuário inserir um valor lá
    
    criaNavios();
    criarTabuleiro(tabuleiroJogador, MATRIZ_JOGADOR);
    criarTabuleiro(tabuleiroInimigo, MATRIZ_INIMIGO);

    alternarTransparenciaTabuleiro("inimigo");
    alternarTransparencia(".botao-iniciar-jogo")
    alternarTransparencia(".status-jogo")

    ocultarElemento(".colapsavel-raciocinio-ia", true);
    ocultarElemento(".botao-terminar-jogo", true);

    statusMensagem("Arraste os navios pro seu tabuleiro, e clique em Posicionar Navios!");

    btnIniciarJogo.removeEventListener("click", iniciarJogo);

    btnIniciarJogo.addEventListener("click", posicionarNavios);
    btnMute.addEventListener("click", muteMusica);
}

function posicionarNavios() {
    if(!verificarChaveAPI()){return;}

    audio.playBackground();

    if (verificaIniciarJogo() === true) {
        jogoTelaCheia(true);
        
        statusAnuncio("Pronto! É a sua vez! Clique em uma posição do tabuleiro inimigo pra atacar! Quando você errar, será a vez da IA!");

        marcarPosicoesDosNavios();
        bloquearArrasteDosNavios();
        atualizarGifTabuleiro(tabuleiroJogador);

        btnIniciarJogo.disabled = true;
        btnIniciarJogo.removeEventListener("click", posicionarNavios);

        alternarTransparenciaTabuleiro("jogador");
        alternarTransparenciaTabuleiro("inimigo");

        alternarTransparencia(".botao-iniciar-jogo")
        alternarTransparencia(".botao-terminar-jogo")

        ocultarElemento(".botao-terminar-jogo", false);
        ocultarElemento(".botao-iniciar-jogo", true);

        // Permite o usuário encerrar o jogo com um empate quando quiser
        btnTerminarJogo.addEventListener("click", terminarJogo);
    } else {
        statusAlerta("Posicione todos os navios no tabuleiro antes de começar!")
    }
}

export async function terminarJogo(vencedor = 0) {
    // Impede a execução da função quando o jogo já estiver encerrado
    if(tabuleiroJogador.classList.contains("encerrado")){ return; }

    alternarTransparencia(".botao-terminar-jogo");
    desativarTabuleiros();

    audio.stopBackground();
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

    // Scrolla a página de volta para a seção do jogo
    document.getElementById('jogo').scrollIntoView({
        block: 'start'
    });

    // Espera 3 segundos, recarrega a página, e volta pra seção do jogo
    await wait(2000);
    
    sessionStorage.setItem('scrollParaJogo', 'true');
    location.reload();
}

function muteMusica(){
    if(musicaAtivada === true){
        btnMute.innerHTML = "Ativar Música"
        musicaAtivada = false;
        audio.stopBackground();
    }else{
        btnMute.innerHTML = "Desativar Música"
        musicaAtivada = true;
        audio.playBackground();
    }
}

function jogoTelaCheia(estado){
    let jogo = document.querySelector("#jogo");
    jogo.classList.toggle("tela-cheia",estado);

    ocultarElemento("#nav", estado);
    ocultarElemento("#header", estado);
    ocultarElemento("#chave-api", estado);
    ocultarElemento("#guia-do-usuario", estado);
    ocultarElemento("#sobre", estado);
    ocultarElemento("#footer", estado);
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

window.addEventListener('DOMContentLoaded', () => {
    iniciarJogo();    
});


window.addEventListener('load', () => {
    if (sessionStorage.getItem('scrollParaJogo') === 'true') {
        sessionStorage.removeItem('scrollParaJogo');

        document.getElementById('jogo').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
});