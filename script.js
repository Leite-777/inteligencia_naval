let tabuleiroJogador = document.querySelector(".tabuleiro-jogador");
let tabuleiroInimigo = document.querySelector(".tabuleiro-inimigo");

function criarTabuleiro(tabuleiro) {
  // Limpa o tabuleiro antes de criar novamente
  tabuleiro.innerHTML = "";

  for (let linha = 0; linha < 10; linha++) {
    for (let coluna = 0; coluna < 10; coluna++) {

      const celula = document.createElement("div");

      celula.classList.add("celula");

      // Guarda posição da célula
      celula.dataset.linha = linha;
      celula.dataset.coluna = coluna;

      celula.textContent = "X";

      tabuleiro.appendChild(celula);
    }
  }
}

criarTabuleiro(tabuleiroJogador);
criarTabuleiro(tabuleiroInimigo);