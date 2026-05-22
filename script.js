// Para preenchimento dos tabuleiros com divs
let tabuleiroJogador = document.querySelector(".tabuleiro-jogador");
let tabuleiroInimigo = document.querySelector(".tabuleiro-inimigo");
let campoDosNavios = document.querySelector(".navios-arrastaveis");
let btnIniciarJogo = document.querySelector(".botao-iniciar-jogo");

// Para os botões de conteúdo colapsáveis
const botoes = document.querySelectorAll(".colapsavel-expandir");
const conteudos = document.querySelectorAll(".colapsavel-conteudo");

//Constantes para serem passadas no parametro da função "criarTabuleiro()".
const MATRIZ_JOGADOR = 1;
const MATRIZ_INIMIGO = -1;

//Guarda o ID do navio sendo arrastado em tempo de execução.
let navioSendoArrastado = null; 

//Numero de navios que serão criados.
const numeroDeNavios = 3;

// Para a ocultação/exibição dos tabuleiros
const botaoIniciar = document.querySelector(".botao-iniciar-jogo");
let transparenciaJogador = false;
let transparenciaInimigo = false;

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

                // Adiciona os Gifs de Ondas aos campos do jogador.
                addGifOndas(celula);
            }
            else{
                // Adiciona os Gifs de Nuvens aos campos da IA.
                addGifNuvens(celula);
            }

            // 0: navio atingido
            // 1: navio afundado
            celula.dataset.status = "0"; // Modificado para apenas o código saber o estado do campo.
            celula.id = `${coluna}x${linha}`;
            tabuleiro.appendChild(celula);
        }
    }
}

/**
 * Cria os navios e adiciona cada um deles a variavel "campoDosNavios".
 */
function criaNavios(){
    for(let index=0; index < numeroDeNavios; index++){
        const navio = document.createElement("div");

        navio.classList.add("navioTamanho1");
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

// Funções para utilização de gifs

/**
 *  Função responsável por adicionar o gif de ondas em uma celula.
 * 
 * @param celula referente ao campo a receber o gif de ondas.
 */
function addGifOndas(celula){
    const gifOnda = document.createElement('img');
    gifOnda.style.width = '40px';
    gifOnda.style.height = '40px';
    gifOnda.style.borderRadius = '5px';
    gifOnda.src = 'assets/gifs/ondas.gif';
    gifOnda.alt = 'Gif de Ondas';
    celula.appendChild(gifOnda);
}

/**
 *  Função responsável por adicionar o gif de nuvens em uma celula.
 * 
 * @param celula referente ao campo a receber o gif de nuvens.
 */
function addGifNuvens(celula){
    const gifNuvens = document.createElement('img');
    gifNuvens.style.width = '40px';
    gifNuvens.style.height = '40px';
    gifNuvens.style.borderRadius = '5px';
    gifNuvens.src = 'assets/gifs/nuvens.gif';
    gifNuvens.alt = 'Gif de Nuvens';
    celula.appendChild(gifNuvens);
}

/**
 *  Função responsável por adicionar um gif específico ao campo de acordo com o status da celula.
 *  Status disponíveis: 
 *      0: navio atingido;  (Gif de Explosão)
 *      1: navio afundado.  (Gif de Navio Afundado);
 * 
 * @param celula referente ao campo a receber o gif específico.
 */
function estadoCampo(celula){
    const gifEstado = document.createElement('img');
    gifEstado.style.width = '40px';
    gifEstado.style.height = '40px';
    gifEstado.style.borderRadius = '5px';

    // 0: navio atingido
    if(celula.dataset.status === "0"){
        // gifNuvens.src = 'assets/gifs/nuvens.gif';
        celula.style.backgroundColor = 'red';
        gifNuvens.alt = 'Gif de Explosão';
    }
    // 1: navio afundado
    else{
        // gifNuvens.src = 'assets/gifs/nuvens.gif';
        celula.style.backgroundColor = 'gray';
        gifNuvens.alt = 'Gif de Navio Afundado';
    }
    celula.appendChild(gifEstado);
}