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
import { preencherChaveAPI } from "./script-tabuleiro.js";

import { revelarNaviosInimigos } from "./game-loop.js";

import { AudioManager } from "./script-audioManager.js";

const audio = new AudioManager();
let musicaAtivada = true;

alternarTransparencia(".botao-iniciar-jogo")
alternarTransparencia(".modal-terminar-jogo")
alternarTransparencia(".status-jogo")

function iniciarJogo() {

    criaNavios();
    criarTabuleiro(tabuleiroJogador, MATRIZ_JOGADOR);
    criarTabuleiro(tabuleiroInimigo, MATRIZ_INIMIGO);

    alternarTransparenciaTabuleiro("inimigo");
    alternarTransparencia(".botao-iniciar-jogo")
    alternarTransparencia(".status-jogo")

    ocultarElemento("#guia-do-usuario", true);
    ocultarElemento("#chave-api", true);
    ocultarElemento("#jogo", true);
    
    ocultarElemento(".colapsavel-raciocinio-ia", true);
    ocultarElemento(".modal-terminar-jogo", true);
    ocultarElemento(".botao-reiniciar-jogo", true);
    ocultarElemento(".guia-jogo", true);
    ocultarElemento(".botoes-preferencia", true);
    ocultarElemento(".info", true);
    
    ocultarElemento(".tabuleiro-container-inimigo", true);
    campoNaviosArrastaveis.classList.toggle("foco-posicionar-navios",true);

    statusMensagem("Arraste os navios pro seu tabuleiro, e clique em Iniciar Jogo!");

    btnJogarGemini.addEventListener("click", jogarComGemini);
    btnJogarPiloto.addEventListener("click", jogarComPilotoAutomatico);

    btnIniciarJogo.addEventListener("click", posicionarNavios);
    btnMute.addEventListener("click", muteMusica);
    btnGifStop.addEventListener("click", pausaReproduzGifs);
}

function posicionarNavios() {
    if(!verificarChaveAPI()){return;}

    if (verificaIniciarJogo() === true) {
        ocultarElemento(".tabuleiro-container-inimigo", false);
        campoNaviosArrastaveis.classList.toggle("foco-posicionar-navios",false);
        wait(1500);

        jogoTelaCheia(true);
        audio.playBackground();

        marcarPosicoesDosNavios();
        bloquearArrasteDosNavios();
        atualizarGifTabuleiro(tabuleiroJogador);
        if(!gifAtivado) pausarGifs();

        btnIniciarJogo.disabled = true;
        btnIniciarJogo.removeEventListener("click", posicionarNavios);

        // alternarTransparenciaTabuleiro("jogador");
        alternarTransparenciaTabuleiro("inimigo");

        alternarTransparencia(".botao-iniciar-jogo")
        alternarTransparencia(".modal-terminar-jogo")

        ocultarElemento(".modal-terminar-jogo", false);
        ocultarElemento(".guia-jogo", false);
        ocultarElemento(".botoes-preferencia", false);
        ocultarElemento(".botao-iniciar-jogo", true);
        ocultarElemento(".iniciar-jogo", true);
        ocultarElemento(".battle-canvas", true);
        ocultarElemento(".campo-navios-arrastaveis", true);

        // Permite o usuário encerrar o jogo com um empate quando quiser
        btnTerminarJogo.addEventListener("click", terminarJogo);
    } else {
        statusAlerta("Posicione todos os navios no tabuleiro antes de começar!")
    }
}

export function terminarJogo(vencedor = 0) {
    // Impede a execução da função quando o jogo já estiver encerrado
    if(tabuleiroJogador.classList.contains("encerrado")){ return; }

    desativarTabuleiros();

    audio.stopBackground();
    switch(vencedor){
        case 1:
            statusAnuncio("MISSÃO CUMPRIDA! A frota da Inteligência Naval foi completamente eliminada.");
            declararVitoria();
            audio.playWin();
            break;
        case -1:
            statusAnuncio("DERROTA! A Inteligência Naval dominou o campo de combate.");
            declararDerrota();
            audio.playLose();
            break;
        default:
            statusAnuncio("CESSAR FOGO! Foi combinado um empate entre as duas equipes.");
            declararEmpate();
    }

    revelarNaviosInimigos();

    // Scrolla a página de volta para a seção do jogo
    document.getElementById('jogo').scrollIntoView({
        block: 'start'
    });

    ocultarElemento(".guia-jogo", true);
    ocultarElemento(".botoes-preferencia", true);
    ocultarElemento(".modal-terminar-jogo", true);
    ocultarElemento(".botao-reiniciar-jogo", false);

    ocultarElemento(".status", true);
    tabuleiroJogador.classList.remove('borda-turno-ia');
    tabuleiroInimigo.classList.remove('borda-turno-jogador');

    btnTerminarJogo.removeEventListener("click", terminarJogo);
    btnReiniciarJogo.addEventListener("click", reiniciarJogo);
}

function reiniciarJogo(){
    sessionStorage.setItem('scrollParaJogo', 'true');
    location.reload();
}

function jogoTelaCheia(estado){
    let jogo = document.querySelector("#jogo");
    jogo.classList.toggle("tela-cheia",estado);
    jogo.classList.toggle("gradiente",estado);

    ocultarElemento("#header", estado);
    ocultarElemento("#modo-de-jogo", estado);
    ocultarElemento("#chave-api", estado);
    ocultarElemento("#guia-do-usuario", estado);
    ocultarElemento("#footer", estado);
}

function jogarComGemini(){
    ocultarElemento("#modo-de-jogo", true);

    ocultarElemento("#guia-do-usuario", false);
    ocultarElemento("#chave-api", false);
    ocultarElemento("#jogo", true);

    btnJogarComGemini.addEventListener("click", confirmarJogoComGemini);
}

function confirmarJogoComGemini(){
    if(!verificarChaveAPI()){return;}
    
    ocultarElemento("#modo-de-jogo", true);
    ocultarElemento("#guia-do-usuario", true);
    ocultarElemento("#chave-api", true);

    ocultarElemento("#jogo", false);

    btnJogarComGemini.removeEventListener("click", confirmarJogoComGemini);
}

export function jogarComPilotoAutomatico(){
    ocultarElemento("#modo-de-jogo", true);
    ocultarElemento("#guia-do-usuario", true);
    ocultarElemento("#chave-api", true);

    ocultarElemento("#jogo", false);
    
    preencherChaveAPI("piloto-automatico");
}

function muteMusica(){
    if(musicaAtivada === true){
        btnMute.innerHTML = `<span class="material-symbols-outlined" style="color: #e74c3c;">no_sound</span>`;
        musicaAtivada = false;
        audio.stopBackground();
    }else{
        btnMute.innerHTML = `<span class="material-symbols-outlined" style="color: #2ecc71;">brand_awareness</span>`;
        musicaAtivada = true;
        audio.playBackground();
    }
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

window.addEventListener('DOMContentLoaded', () => {
    iniciarJogo();    
});

window.addEventListener('load', () => {
    // Carrega o valor salvo no campo da Chave API ao abrir/recarregar a página
    const valorCampoAPI = sessionStorage.getItem("apiKey");

    if (valorCampoAPI !== null) {
        textarea.value = valorCampoAPI;
    }
});