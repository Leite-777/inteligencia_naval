let tabuleiroJogador = document.querySelector(".tabuleiro-jogador");
let tabuleiroInimigo = document.querySelector(".tabuleiro-inimigo");

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