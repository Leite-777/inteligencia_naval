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

// Inicialmente deixa os conteúdos colapsáveis ocultos
conteudos.forEach(cont => {
    cont.style.display = "none";
})

// Função para ativar/desativar transparência de um tabuleiro
let transparenciaJogador = false;
let transparenciaInimigo = false;

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