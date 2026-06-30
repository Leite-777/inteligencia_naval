// Para preenchimento dos tabuleiros com divs
let tabuleiroJogador = document.querySelector(".tabuleiro-jogador");
let tabuleiroInimigo = document.querySelector(".tabuleiro-inimigo");
let campoNaviosArrastaveis = document.querySelector(".campo-navios-arrastaveis");
let campoDosNavios = document.querySelector(".navios-arrastaveis");
let btnIniciarJogo = document.querySelector(".botao-iniciar-jogo");
let btnTerminarJogo = document.querySelector(".botao-terminar-jogo");
let btnReiniciarJogo = document.querySelector(".botao-reiniciar-jogo");
let btnMute = document.querySelector(".botao-mute");
let btnGifStop = document.querySelector(".botao-gif-stop");
let btnJogarGemini = document.querySelector(".jogar-gemini");
let btnJogarComGemini = document.querySelector(".botao-jogar-gemini");
let btnJogarPiloto = document.querySelector(".jogar-piloto-automatico");

const MATRIZ_JOGADOR = 1; //Cria a matriz com as opções disponinveis de arrastar navios para o jogador.
const MATRIZ_INIMIGO = -1; //Desabilita a opção de arrastar, criando apenas uma matriz visual.
const TAMANHO_MATRIZ = 10;

//Constantes para definir a direção do navio.
const HORIZONTAL = 1;
const VERTICAL = -1;

//Guarda o Elemento do navio sendo arrastado em tempo de execução.
let navioSendoArrastado = null;
//Objeto do navio sendo arrastado naquele momento.
let objNavioSendoArrastado = null;

/*Guarda o tamanho de cada um dos navios criados referente a posição:
 * carrierTam, battleshipTam, destroyerTam, submarineTam, patrolBoatTam
*/
let tamanhoNavios = [5, 4, 3, 3, 2];

/* Quantia de cada navio referente a posição:
 * carrierQuant, battleshipQuant, destroyerQuant, submarineQuant, patrolBoatQuant
*/
let quantiaNavios = [1, 1, 1, 1, 1];

//Cria o vetor da classe Navios com base no total de navios criados no jogo.
let naviosCriados = [];
let naviosIA = [];
let contNaviosCriados=0;//Index para saber quantos navios ja foram criados em tempo de execução.

// Identifica se os gifs estão ativados ou não
let gifAtivado = true;