// Para preenchimento dos tabuleiros com divs
let tabuleiroJogador = document.querySelector(".tabuleiro-jogador");
let tabuleiroInimigo = document.querySelector(".tabuleiro-inimigo");
let campoDosNavios = document.querySelector(".navios-arrastaveis");

// Para os botões de conteúdo colapsáveis
const botoes = document.querySelectorAll(".colapsavel-expandir");
const conteudos = document.querySelectorAll(".colapsavel-conteudo");

//Constantes para serem passadas no parametro da função "criarTabuleiro()".
const MATRIZ_JOGADOR = 1;
const MATRIZ_INIMIGO = -1;

//Constantes para definir a direção do navio.
const HORIZONTAL = 1;
const VERTICAL = -1;

//Guarda o ID do navio sendo arrastado em tempo de execução.
let navioSendoArrastado = null; 

//Numero de navios que serão criados.
let numeroDeNavios = 0;

// Para a ocultação/exibição dos tabuleiros
const botaoIniciar = document.querySelector(".botao-iniciar-jogo");
let transparenciaJogador = false;
let transparenciaInimigo = false;

/**
 * Classe do navio, criada para guardar as informações dos navios
 * @param tamanho: Guarda quantos células da matriz o navio irá ocupar.
 * @param vetor: Irá guardar quais partes do navio foram atingidas(vetor inicializado com 0).
 * @param direcao: Guarda a informação se o navio esta na horizontal ou vertical.
 */
class navio{
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
 * Ao clicar inicializa a matriz pronta para iniciazar o jogo, cada div da matriz será um botão para ler aonde o ataque foi dado.
 * OBS: A matriz so deve ser inicializada quando todos os navios forem colocados na matriz.
 */
botaoIniciar.addEventListener("click", () => {
    //Criar um if para compara se todos os navios foram adicionados na matriz.
    criaNavios();
    criarTabuleiro(tabuleiroJogador, MATRIZ_JOGADOR);
    criarTabuleiro(tabuleiroInimigo, MATRIZ_INIMIGO);
    alternarTransparenciaTabuleiro("inimigo");
});

/**
 * Função para preencher os tabuleiros da batalha naval com uma grade de 10x10 divs
 * @param tabuleiro  Adiciona as divs nos tabuleiros(Jogador e da IA/Inimigo)
 * @param tipoDoTabuleiro Passe 1 passa atribuir atribuir os elementos DragAndDrop ao tabuleiro do jogador e -1 para apenar criar o tabuleiro.
 */
function criarTabuleiro(tabuleiro, tipoDoTabuleiro) {
  tabuleiro.innerHTML = "";

  for (let linha = 0; linha < 10; linha++) {
        for (let coluna = 0; coluna < 10; coluna++) {

            const celula = document.createElement("div");

            celula.classList.add("celula");

            celula.dataset.linha = linha;
            celula.dataset.coluna = coluna;

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
                    
                    celula.appendChild(navioSendoArrastado);
                });
            }

            // 0: não revelado
            // 1: água
            // 2: contém navio
            // 3: navio atingido
            // 4: navio afundado
            celula.textContent = "0";
            celula.id = `${coluna}x${linha}`;
            tabuleiro.appendChild(celula);
        }
    }
}

/**
 * @returns Retorna um número aleatorio de navios, variando de 1 a max(parametro passado).
 */
function criaNumeroDeNavios(max){
    return Math.floor(Math.random() * (max - 1 + 1)) + 1;
}

/**
 * Cria os navios e adiciona cada um deles a variavel "campoDosNavios".
 */
function criaNavios(){
    numeroDeNavios = criaNumeroDeNavios(3);

    //Navios de tamanho 1
    for(let index=0; index < numeroDeNavios; index++){
        const navio = document.createElement("div");
        if(index == 0){
            navio.classList.add("navioTamanho1");  
        }else{
            if(index == 1){
                navio.classList.add("navioTamanho2")
            }else{
                if(index == 2){
                    navio.classList.add("navioTamanho3")
                }
            }
        }
        
        //Cria um ID para o navio
        navio.id = index+1;

        //Permite o navio ser arrastavel
        navio.draggable = true;

        //Guarda o ID do navio que está sendo arrastado
        navio.addEventListener("dragstart", (e) =>{
            navioSendoArrastado = e.target;
        });
        campoDosNavios.appendChild(navio);
    }

    //Navios de tamanho 2.
    /*
    numeroDeNavios = criaNumeroDeNavios(2);
    for(let index=0; index < numeroDeNavios; index++){}

    //Navios de tamanho 3.
    numeroDeNavios = criaNumeroDeNavios(3);
    for(let index=0; index < numeroDeNavios; index++){}

    //Navios de tamanho 4.
    numeroDeNavios = criaNumeroDeNavios(4);
    for(let index=0; index < numeroDeNavios; index++){}
    */
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

// Função para ocultar/exibir conteúdos colapsáveis
botoes.forEach(botao => {
    botao.addEventListener("click", () => {
        const conteudo = botao.nextElementSibling;

        const displayAtual = getComputedStyle(conteudo).display;

        if (displayAtual === "none") {
            conteudo.style.display = "block";
        } else {
            conteudo.style.display = "none";
        }
    });
});

conteudos.forEach(cont => {
    cont.style.display = "none";
})

// Função para ativar/desativar transparência de um tabuleiro

function alternarTransparenciaTabuleiro(tipo) {

    if (tipo === "jogador") {
        transparenciaJogador = !transparenciaJogador;

        tabuleiroJogador.classList.toggle(
            "tabuleiro-transparente",
            transparenciaJogador
        );
    }

    if (tipo === "inimigo") {
        transparenciaInimigo = !transparenciaInimigo;

        tabuleiroInimigo.classList.toggle(
            "tabuleiro-transparente",
            transparenciaInimigo
        );
    }
}

// Executa uma vez ao abrir o site
//alternarTransparenciaTabuleiro("jogador");
//alternarTransparenciaTabuleiro("inimigo");

botaoIniciar.addEventListener("click", () =>{
    //alternarTransparenciaTabuleiro("jogador");
    //alternarTransparenciaTabuleiro("inimigo");
});