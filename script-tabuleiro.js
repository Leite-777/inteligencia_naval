/**
 * Converte o tabuleiro HTML para um array JSON, com o formato [0,0,0,0,0...]
 * @param {*} seletorTabuleiro A classe do tabuleiro, como ".tabuleiro-jogador"
 * @returns A matriz JSON com o tabuleiro, onde cada posição é o celula.dataset.status
 */
export function tabuleiroHTMLparaJSON(seletorTabuleiro) {
    const tabuleiro = document.querySelector(seletorTabuleiro);
    const matriz = [];

    tabuleiro.querySelectorAll(".celula").forEach(celula => {
        const linha = Number(celula.dataset.linha);
        const coluna = Number(celula.dataset.coluna);
        const status = Number(celula.dataset.status);

        if (!matriz[linha]) {
            matriz[linha] = [];
        }

        matriz[linha][coluna] = status;
    });

    return matriz;
}

/**
 * Converte uma matriz JSON para o tabuleiro HTML
 * @param {*} matriz A matriz JSON usada para substituir
 * @param {*} seletorTabuleiro A classe do tabuleiro que será substituído, como ".tabuleiro-jogador"
 * @returns Não há retorno, apenas substitui o tabuleiro no HTML
 */
function tabuleiroJSONparaHTML(matriz, seletorTabuleiro = ".tabuleiro-jogador") {
    const tabuleiro = document.querySelector(seletorTabuleiro);

    if (!tabuleiro) {
        console.error("Tabuleiro não encontrado.");
        return;
    }

    // Limpa o conteúdo atual do tabuleiro
    tabuleiro.innerHTML = "";

    for (let linha = 0; linha < matriz.length; linha++) {
        for (let coluna = 0; coluna < matriz[linha].length; coluna++) {

            const celula = document.createElement("div");

            celula.classList.add("celula");

            celula.dataset.linha = linha;
            celula.dataset.coluna = coluna;
            celula.dataset.status = matriz[linha][coluna];

            // celula.id = `${coluna}x${linha}`;        // Erro de id duplicado
            celula.id = `${seletorTabuleiro}_${coluna}x${linha}`;    // Possível resolução

            tabuleiro.appendChild(celula);
        }
    }

    // Atualmente o tabuleiro criado não possui:
    // Os gifs de água, nuvens, etc.
    // Funcionalidade drag and drop

    // A fazer:
    // Criar função separada pra iterar por todas as células de um tabuleiro HTML,
    // E chamar as funções apropriadas de gifs dependendo do celula.dataset.status,
    // Como por exemplo: 0 -> addGifNuvens(), 1-> addGifOndas(), etc.
    // E chamar essa função aqui no final, pra atualizar os gifs do tabuleiro depois de criar as células.
}

// Exemplo de uso, insira no final do btnIniciarJogo.addEventListener("click") do script.js:
/*
const matrizTeste2 = [
    [0,0,0,1,0,0,0,0,0,0],
    [0,1,0,0,0,0,1,0,0,0],
    [0,0,0,0,1,0,0,0,0,0],
    [1,0,0,0,0,0,0,1,0,0],
    [0,0,1,0,0,1,0,0,0,0],
    [0,0,0,0,0,0,0,0,1,0],
    [0,1,0,0,0,0,0,0,0,0],
    [0,0,0,1,0,0,1,0,0,0],
    [0,0,0,0,0,1,0,0,0,1],
    [0,0,1,0,0,0,0,0,0,0]
];

console.log("Exibindo tabuleiro inicial:");
console.log(tabuleiroHTMLparaJSON(".tabuleiro-jogador"));

console.log("Substituindo tabuleiro por matrizTeste2:");
tabuleiroJSONparaHTML(matrizTeste2, ".tabuleiro-jogador");

console.log("Exibindo tabuleiro após atualização:");
console.log(tabuleiroHTMLparaJSON(".tabuleiro-jogador"));
*/