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
    ocultarElemento(".botao-mute", true);
    ocultarElemento(".info", true);

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
        jogoTelaCheia(true);
        audio.playBackground();
        
        statusAnuncio("Pronto! É a sua vez! Clique em uma posição do tabuleiro inimigo pra atacar! Quando você errar, será a vez da IA!");

        marcarPosicoesDosNavios();
        bloquearArrasteDosNavios();
        atualizarGifTabuleiro(tabuleiroJogador);
        if(!gifAtivado) pausarGifs();

        btnIniciarJogo.disabled = true;
        btnIniciarJogo.removeEventListener("click", posicionarNavios);

        alternarTransparenciaTabuleiro("jogador");
        alternarTransparenciaTabuleiro("inimigo");

        alternarTransparencia(".botao-iniciar-jogo")
        alternarTransparencia(".modal-terminar-jogo")

        ocultarElemento(".modal-terminar-jogo", false);
        ocultarElemento(".guia-jogo", false);
        ocultarElemento(".botoes-preferencia", false);
        ocultarElemento(".botao-mute", false);
        ocultarElemento(".info", false);
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

    // Scrolla a página de volta para a seção do jogo
    document.getElementById('jogo').scrollIntoView({
        block: 'start'
    });

    ocultarElemento(".guia-jogo", true);
    ocultarElemento(".botoes-preferencia", true);
    ocultarElemento(".modal-terminar-jogo", true);
    ocultarElemento(".botao-reiniciar-jogo", false);

    btnTerminarJogo.removeEventListener("click", terminarJogo);
    btnReiniciarJogo.addEventListener("click", reiniciarJogo);
}

function reiniciarJogo(){
    sessionStorage.setItem('scrollParaJogo', 'true');
    location.reload();
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

function pausaReproduzGifs(){
    if(gifAtivado === true){
        btnGifStop.innerHTML = `<span class="material-symbols-outlined" style="color: #e74c3c;">gif_box</span>`;
        gifAtivado = false;
        pausarGifs();
    }else{
        btnGifStop.innerHTML = `<span class="material-symbols-outlined" style="color: #2ecc71;">gif_box</span>`;
        gifAtivado = true;
        reproduzirGifs();
    }
}

function jogoTelaCheia(estado){
    let jogo = document.querySelector("#jogo");
    jogo.classList.toggle("tela-cheia",estado);

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
    ocultarElemento("#jogo", false);
}

function jogarComPilotoAutomatico(){
    ocultarElemento("#modo-de-jogo", true);
    ocultarElemento("#guia-do-usuario", true);
    ocultarElemento("#chave-api", true);

    ocultarElemento("#jogo", false);
    
    preencherChaveAPI("piloto-automatico");
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//efeito de vitória na tela
function declararVitoria() {
  const victoryScreen = document.getElementById('victory-screen');
  victoryScreen.classList.remove('hidden');

  confetti({
    particleCount: 150,
    spread: 80,
    origin: { y: 0.6 }
  });

  let duration = 3 * 1000;
  let end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 } 
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 } 
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());

  setTimeout(() => {
    victoryScreen.classList.add('hidden');
  }, 3500);
}

//efeito de derrota na tela
function declararDerrota() {
  const defeatScreen = document.getElementById('defeat-screen');
  defeatScreen.classList.remove('hidden');

  
  let duration = 3 * 1000;
  let end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 90, 
      spread: 30,
      colors: ['#ffffff',  '#e0e0e0',  '#aaaaaa',  '#ffffff'],
      scalar: 1.2, 
      gravity: 1.5, 
      drift: 0,
      origin: { x: Math.random(), y: 0 } 
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());

  setTimeout(() => {
    defeatScreen.classList.add('hidden');
  }, 3000);
}

function declararEmpate() {
  const drawScreen = document.getElementById('draw-screen');
  drawScreen.classList.remove('hidden');

  setTimeout(() => {
    drawScreen.classList.add('hidden');
  }, 3000);
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