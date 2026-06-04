import { tabuleiroHTMLparaJSON } from "./script-tabuleiro.js";

alternarTransparencia(".botao-posicionar-navios")
alternarTransparencia(".botao-terminar-jogo")
alternarTransparencia(".status-jogo")

function iniciarJogo(){
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

function posicionarNavios(){
    if(verificaIniciarJogo() === true ){
        //statusMensagem("Pronto! É a sua vez! Clique em uma posição do tabuleiro inimigo pra atacar!");
        statusMensagem("Abra o console pressionando F12, e clique em uma posição do tabuleiro inimigo para ver o jogo em ação!");

        // TESTE DA MUDANÇA DE GIFS
            // document.getElementById('-1_0x3').dataset.status = "0";      // Possíveis ids
            // document.getElementById('1_2x6').dataset.status = "1";
            // document.getElementById('-1_5x3').dataset.status = "2";
            // // document.getElementById('0x3').dataset.status = "0";     // Ids antigos
            // // document.getElementById('2x6').dataset.status = "1";
            // // document.getElementById('5x3').dataset.status = "2";
            // atualizarGifTabuleiro(tabuleiroJogador);
            // atualizarGifTabuleiro(tabuleiroInimigo);

        
        marcarPosicoesDosNavios();
        bloquearArrasteDosNavios();

        //console.log(tabuleiroHTMLparaJSON(".tabuleiro-jogador"));

        btnPosicionarNavios.removeEventListener("click", posicionarNavios);

        alternarTransparenciaTabuleiro("jogador");
        alternarTransparenciaTabuleiro("inimigo");

        // Atualmente, a funcionalidade do jogo está visível somente no console.
        
        // Na função chamarApi() de script-prompt.ts, na linha 277,
        // o botão Posicionar Navios está temporariamente configurado
        // para fazer cada célula do tabuleiro inimigo fazer a chamada
        // da API ou do fallback, exibindo a posição atacada e o tabuleiro inteiro no console.

        gameLoop();
    }else{
        statusAlerta("Posicione todos os navios no tabuleiro antes de começar!")
    }
}

function gameLoop(){

}

btnIniciarJogo.addEventListener("click", iniciarJogo);