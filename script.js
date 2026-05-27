// Para preenchimento dos tabuleiros com divs
let tabuleiroJogador = document.querySelector(".tabuleiro-jogador");
let tabuleiroInimigo = document.querySelector(".tabuleiro-inimigo");
let campoDosNavios = document.querySelector(".navios-arrastaveis");
let btnIniciarJogo = document.querySelector(".botao-iniciar-jogo");

// Para os botões de conteúdo colapsáveis
const botoes = document.querySelectorAll(".colapsavel-expandir");
const conteudos = document.querySelectorAll(".colapsavel-conteudo");

//Constantes para serem passadas no parametro da função "criarTabuleiro()".
const MATRIZ_JOGADOR = 1; //Cria a matriz com as opções disponinveis de arrastar navios para o jogador.
const MATRIZ_INIMIGO = -1; //Desabilita a opção de arrastar, criando apenas uma matriz visual.
const TAMANHO_MATRIZ = 10;

//Constantes para definir a direção do navio.
const HORIZONTAL = 1;
const VERTICAL = -1;

//Guarda o ID do navio sendo arrastado em tempo de execução.
let navioSendoArrastado = null; 

/*Guarda o tamanho de cada um dos navios criados referente a posição:
 * carrierTam, battleshipTam, destroyerTam, submarineTam, patrolBoatTam
*/
let tamanhoNavios = [5, 4, 3, 3, 2];

/* Quantia de cada navio referente a posição:
 * carrierQuant, battleshipQuant, destroyerQuant, submarineQuant, patrolBoatQuant
*/
let quantiaNavios = [1, 1, 1, 1, 1];

//Cria o vetor da classe Navios com base no total de navios criados no jogo.
let naviosCriados;
let contNaviosCriados=0;//Contador para saber quantos navios ja foram criados em tempo de execução.

/**
 * Ao clicar inicializa a matriz pronta para iniciazar o jogo, cada div da matriz será um botão para ler aonde o ataque foi dado.
 * OBS: A matriz so deve ser inicializada quando todos os navios forem colocados na matriz.
 */
btnIniciarJogo.addEventListener("click", () => {
    //Criar um if para compara se todos os navios foram adicionados na matriz.
    criaNavios();
    criarTabuleiro(tabuleiroJogador, MATRIZ_JOGADOR);
    criarTabuleiro(tabuleiroInimigo, MATRIZ_INIMIGO);
    alternarTransparenciaTabuleiro("inimigo");
    mostraMatriz();
});

function mostraMatriz(){
    console.table(tabuleiroHTMLparaJSON(".tabuleiro-jogador"));
}

/**
 * Classe do navio, criada para guardar as informações dos navios
 * @param tamanho: Guarda quantos células da matriz o navio irá ocupar.
 * @param vetor: Irá guardar quais partes do navio foram atingidas(vetor inicializado com 0).
 * @param direcao: Guarda a informação se o navio esta na horizontal ou vertical.
 */
class Navios{
    /** 
     * @param diracaoNavio: Passe @param HORIZONTAL ou @param VERTICAL
     * @param tamanho: Tamanho que o navio ocupará(Passe um numero maior ou igual a 1).
    */
    constructor(tamanho ,diracaoNavio){
        this.tamanho = tamanho;
        this.vetor = new Array(this.tamanho); 
        this.vetor.fill(0);//Inicializa com 0.
        this.direcao = diracaoNavio;
    }

    get verificaNavioAfundou() {
        // O método .every() checa se CADA elemento é igual a 1
        if(this.vetor.every(elemento => elemento === 1)){
            return true;
        }else{
            return false;
        }
    }

}

/**
 * Função para preencher os tabuleiros da batalha naval com uma grade de 10x10 divs
 * @param tabuleiro  Adiciona as divs nos tabuleiros(Jogador e da IA/Inimigo)
 * @param tipoDoTabuleiro Passe 1 passa atribuir atribuir os elementos DragAndDrop ao tabuleiro do jogador e -1 para apenar criar o tabuleiro.
 */
function criarTabuleiro(tabuleiro, tipoDoTabuleiro) {
  tabuleiro.innerHTML = "";

  for (let linha = 0; linha < TAMANHO_MATRIZ; linha++) {
        for (let coluna = 0; coluna < TAMANHO_MATRIZ; coluna++) {

            const celula = document.createElement("div");

            celula.classList.add("celula");

            celula.dataset.linha = linha;
            celula.dataset.coluna = coluna;

            // 0: navio atingido
            // 1: navio afundado
            celula.dataset.status = "0"; // Modificado para apenas o código saber o estado do campo.
            celula.id = `${coluna}x${linha}`;

            //Cria tabuleiro pra o Jogador poder colocar os seus navios.
            if(tipoDoTabuleiro == 1){
                //Retira configuração padrão do navegador para poder arrastar os navios
                celula.addEventListener("dragover", (e) => {
                    e.preventDefault();
                });

                /**
                 * Permite que cada celula possa receber o arraste de um navio.
                 * A celula recebe o navio arrastado e se torna pai da tag do navio.
                 */
                celula.addEventListener("drop", (e) =>{
                    e.preventDefault();
                    const navio = verificaEspacoMatriz(navioSendoArrastado, celula.id);
                    if(navio !== false && navio !== null){
                        celula.appendChild(navioSendoArrastado);
                    }else{
                        campoDosNavios.appendChild(navioSendoArrastado);
                    }
                });

                // Adiciona os Gifs de Ondas aos campos do jogador.
                addGifOndas(celula);
            }
            else{
                // Adiciona os Gifs de Nuvens aos campos da IA.
                addGifNuvens(celula);
            }

            tabuleiro.appendChild(celula);
        }
    }
}

/**
 * Soma quantos navios exitem dentro do jogo.
 */
function criaNavios(){
    //Total é o acumulador e valorAtual é o número da vez
    const soma = quantiaNavios.reduce((total, valorAtual) => total + valorAtual, 0);

    naviosCriados = new Array(soma); 
    for(let index=0; index < quantiaNavios.length; index++){
        inicializaONavio(tamanhoNavios[index], quantiaNavios[index]);
    }
}
/**
 * Gera um numero aleatorio de acordo com os parametros passados. 
 * 
 * @param {*} min Valor minimo gerado pela função.
 * @param {*} max Valor máximo gerado pela função.
 * @returns 
 */
function geraNumeroAleatorio(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Cria os navios de acordo com as especificações passadas por parametro e adiciona eles no "campoDosNavios".
 * 
 * @param {*} tamanho Tamanho do navio.
 * @param {*} quantidade Quantos navios serão criados
 */
function inicializaONavio(tamanho, quantidade){
    let classeNavio;
    const navio = document.createElement("div");

    if(geraNumeroAleatorio(0, 1) == 1){

        classeNavio = "navioTamanho" + tamanho + "-horizontal";
        naviosCriados[contNaviosCriados] = new Navios(tamanho, HORIZONTAL);
    }else{

        classeNavio = "navioTamanho" + tamanho + "-vertical";
        naviosCriados[contNaviosCriados] = new Navios(tamanho, HORIZONTAL);
    }
    navio.classList.add(classeNavio);

    //Cria um ID para o navio
    navio.id = contNaviosCriados;

    //Permite o navio ser arrastavel
    navio.draggable = true;

    //Guarda o ID do navio que está sendo arrastado
    navio.addEventListener("dragstart", (e) =>{
        navioSendoArrastado = e.target;
    });

    contNaviosCriados++;
    campoDosNavios.appendChild(navio);
  
}



/**
 * Permite que os navios possam ser arrastados novamente para o campo de onde foram criado
 */
campoDosNavios.addEventListener("dragover", (e) =>{
    e.preventDefault();  
});
campoDosNavios.addEventListener("drop", (e) =>{
    e.preventDefault();
    campoDosNavios.appendChild(navioSendoArrastado);
});

//Procura o navio no vetor de Navios.
function buscaNavioPorId(id) {
    // Convertemos para Number pois o id do elemento HTML vem como string
    return naviosCriados[Number(id)] ?? null;
}

/**
 * Verifica se o navio que estão sendo arrastado possui espaço para ser inserido na posição que foi colocado na tabela.
 * @returns Retorna True se for possivel, se não retorna false.
 * 
 * @param navioSendoArrastado: Recebe o elemento sendo arrastado no momento.
 * @param idCelula: ID da celula para poder ter acesso a sua Linha e Coluna.
 */
function verificaEspacoMatriz(navioSendoArrastado, idCelula) {
    const [colunaStr, linhaStr] = idCelula.split('x');
    const coluna = Number(colunaStr);
    const linha  = Number(linhaStr);

    // Pegamos o objeto do navio real usando o ID dele
    const navio = buscaNavioPorId(navioSendoArrastado.id);
    if (navio === null) return false;

    // Descobre se o elemento visual está na vertical
    const ehVertical = navioSendoArrastado.classList.contains("vertical") || 
                       navioSendoArrastado.className.includes("vertical");

    if (ehVertical) {
        // Verifica se o navio cabe verticalmente sem sair por baixo do tabuleiro
        if ((linha + navio.tamanho) <= TAMANHO_MATRIZ) {
            return navio;
        } else {
            return false;
        }
    } else {
        // Verifica se o navio cabe horizontalmente sem sair pela direita
        if ((coluna + navio.tamanho) <= TAMANHO_MATRIZ) {
            return navio;
        } else {
            return false;
        }
    }
}