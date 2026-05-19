// Para preenchimento dos tabuleiros com divs
let tabuleiroJogador = document.querySelector(".tabuleiro-jogador");
let tabuleiroInimigo = document.querySelector(".tabuleiro-inimigo");

// Para os botões de conteúdo colapsáveis
const botoes = document.querySelectorAll(".colapsavel-expandir");
const conteudo = document.querySelectorAll(".colapsavel-conteudo");

// Para a ocultação/exibição dos tabuleiros
const botaoIniciar = document.querySelector(".botao-iniciar-jogo");
let transparenciaJogador = false;
let transparenciaInimigo = false;


// Função para preencher os tabuleiros da batalha naval com uma grade de 10x10 divs

function criarTabuleiro(tabuleiro) {
  tabuleiro.innerHTML = "";

  for (let linha = 0; linha < 10; linha++) {
        for (let coluna = 0; coluna < 10; coluna++) {

            const celula = document.createElement("div");

            celula.classList.add("celula");

            celula.dataset.linha = linha;
            celula.dataset.coluna = coluna;

            // 0: não revelado
            // 1: água
            // 2: contém navio
            // 3: navio atingido
            // 4: navio afundado
            celula.textContent = "0";
            
            tabuleiro.appendChild(celula);
        }
    }
}

criarTabuleiro(tabuleiroJogador);
criarTabuleiro(tabuleiroInimigo);

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