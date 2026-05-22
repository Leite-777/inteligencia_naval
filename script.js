// Para preenchimento dos tabuleiros com divs
let tabuleiroJogador = document.querySelector(".tabuleiro-jogador");
let tabuleiroInimigo = document.querySelector(".tabuleiro-inimigo");
let campoDosNavios = document.querySelector(".navios-arrastaveis");
let btnIniciarJogo = document.querySelector("#iniciarJogo");

// Para os botões de conteúdo colapsáveis
const botoes = document.querySelectorAll(".colapsavel-expandir");
const conteudo = document.querySelectorAll(".colapsavel-conteudo");

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

criarTabuleiro(tabuleiroJogador, MATRIZ_JOGADOR);
criarTabuleiro(tabuleiroInimigo, MATRIZ_INIMIGO);
criaNavios();

/**
 * Ao clicar inicializa a matriz pronta para iniciazar o jogo, cada div da matriz será um botão para ler aonde o ataque foi dado.
 * OBS: A matriz so deve ser inicializada quando todos os navios forem colocados na matriz.
 */
btnIniciarJogo.addEventListener("click", () => {
    //Criar um if para compara se todos os navios foram adicionados na matriz.
    criarTabuleiroParaJogar(tabuleiroJogador, 2);
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

conteudo.forEach(cont => {
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
alternarTransparenciaTabuleiro("jogador");
//alternarTransparenciaTabuleiro("inimigo");

botaoIniciar.addEventListener("click", () =>{
    alternarTransparenciaTabuleiro("jogador");
    alternarTransparenciaTabuleiro("inimigo");
});