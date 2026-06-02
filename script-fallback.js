
const TAM = 10;

// funcao principal que retorna a posicao escolhida para ser atingida
function escolherJogadaFallback(tabuleiro) {

    // modo para afundar navios ja acertados
    const jogadaAtaque = afundarNavios(tabuleiro);

    if (jogadaAtaque) {
        return jogadaAtaque;
    }

    // modo aleatorio em x
    return tiroAleatorioEmX(tabuleiro);
}

// afunda navios ja encontrados
function afundarNavios(tabuleiro) {

    const acertos = procurarAcertos(tabuleiro);

    for (const acerto of acertos) {

        const direcao = obterDirecao(
            tabuleiro,
            acerto.linha,
            acerto.coluna
        );

        // caso retornar direcao 
        if (direcao === "horizontal") {

            let alvo = encontrarPonta(tabuleiro, acerto.linha, acerto.coluna, "horizontal", -1);
            if (alvo) return alvo;

            alvo = encontrarPonta(tabuleiro, acerto.linha, acerto.coluna, "horizontal", +1);
            if (alvo) return alvo;

        } else if (direcao === "vertical") {

            let alvo = encontrarPonta(tabuleiro, acerto.linha, acerto.coluna, "vertical", -1);
            if (alvo) return alvo;

            alvo = encontrarPonta(tabuleiro, acerto.linha, acerto.coluna, "vertical", +1);
            if (alvo) return alvo;

        } 
        
        // caso nao retornar tenta pelos adjacentes
        else {
            const adjacentes = obterAdjacentes(acerto.linha, acerto.coluna);

            for (const pos of adjacentes) {

                if (dentroDoTabuleiro(pos) && tabuleiro[pos.linha][pos.coluna] === 0) {
                    return pos;
                }
            }
        }
    }

    return null;
}

// procura uma posicao adjacente nao revelada no sentido que o navio estiver
function encontrarPonta(tabuleiro, linha, coluna, direcao, sentido) {

    let l = linha;
    let c = coluna;

    while (true) {

        if (direcao === "horizontal") {
            c += sentido;
        } else {
            l += sentido;
        }

        if (!dentroDoTabuleiro({ linha: l, coluna: c })) {
            return null;
        }

        const valor = tabuleiro[l][c];

        if (valor === 3) {
            continue; // continua procurando a ponta do no navio
        }

        if (valor === 0) {
            return { linha: l, coluna: c }; // talvez tenha achado a ponta e retorna 
        }

        return null;
    }
}

//descobre a direcao de um navio ja acertado 
function obterDirecao(tabuleiro, linha, coluna) {

    // horizontal
    if (
        (coluna > 0 && tabuleiro[linha][coluna - 1] === 3) ||
        (coluna < TAM - 1 && tabuleiro[linha][coluna + 1] === 3)
    ) {
        return "horizontal";
    }

    // vertical
    if (
        (linha > 0 && tabuleiro[linha - 1][coluna] === 3) ||
        (linha < TAM - 1 && tabuleiro[linha + 1][coluna] === 3)
    ) {
        return "vertical";
    }

    return null;
}

// procura navios ja acertados
function procurarAcertos(tabuleiro) {

    const acertos = [];

    for (let linha = 0; linha < TAM; linha++) {
        for (let coluna = 0; coluna < TAM; coluna++) {

            if (tabuleiro[linha][coluna] === 3) {
                acertos.push({ linha, coluna });
            }
        }
    }

    return acertos;
}

function obterAdjacentes(linha, coluna) {

    return [
        { linha: linha - 1, coluna },   // cima
        { linha: linha + 1, coluna },   // baixo
        { linha, coluna: coluna - 1 },  // esquerda
        { linha, coluna: coluna + 1 }   // direita
    ];
}

// valida
function dentroDoTabuleiro(pos) {

    return (
        pos.linha >= 0 &&
        pos.linha < TAM &&
        pos.coluna >= 0 &&
        pos.coluna < TAM
    );
}


// dispara aletaroi em x 
function tiroAleatorioEmX(tabuleiro) {

    const possibilidades = [];

    for (let linha = 0; linha < TAM; linha++) {
        for (let coluna = 0; coluna < TAM; coluna++) {

            const valor = tabuleiro[linha][coluna];
            const padrao = (linha + coluna) % 2 === 0;

            if (valor === 0 && padrao) {
                possibilidades.push({ linha, coluna });
            }
        }
    }

    // fallback do fallback se tudo der errado
    if (possibilidades.length === 0) {

        for (let linha = 0; linha < TAM; linha++) {
            for (let coluna = 0; coluna < TAM; coluna++) {

                if (tabuleiro[linha][coluna] === 0) {
                    return { linha, coluna };
                }
            }
        }
    }

    const indice = Math.floor(Math.random() * possibilidades.length);
    return possibilidades[indice];
}