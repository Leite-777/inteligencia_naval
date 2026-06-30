import { AudioManager } from "./script-audioManager.js";

const audio = new AudioManager();

//Constantes para serem passadas no parametro da função "criarTabuleiro()".


/**
 * Classe do navio, criada para guardar as informações dos navios
 * 
 * @param tamanho: Guarda quantos células da matriz o navio irá ocupar.
 * @param vetor: Irá guardar quais partes do navio foram atingidas(vetor inicializado com false).
 * @param direcao: Passe a constante HORIZONTAL ou VERTICAL, caso passe algo diferente sera atribuido a constante HORIZONTAL.
 */
export class Navios {
    /** 
     * @param direcaoNavio: Passe @param HORIZONTAL ou @param VERTICAL
     * @param tamanho: Tamanho que o navio ocupará(Passe um numero maior ou igual a 1).
    */
    constructor(tamanho, direcaoNavio) {
        this.codigo = gerarCodigoUnico();
        this.posicionado = false;//Se ja ésta na matriz
        this.tamanho = tamanho;
        this.posicoesAtingidas = new Array(this.tamanho);
        this.posicoesOcupadas = new Array(this.tamanho);//Ex: posicoesOcupadas[0]="1x1", posicoesOcupadas[1]="1x2", posicoesOcupadas[2]="1x3"... 

        this.posicoesAtingidas.fill(false);
        this.posicoesOcupadas.fill("-1");//Posição padrão

        if (direcaoNavio !== HORIZONTAL && direcaoNavio !== VERTICAL) {
            this.direcao = HORIZONTAL;
        } else {
            this.direcao = direcaoNavio;
        }

        this.linhaInicial = -1;
        this.colunaInicial = -1;

        this.linhaFinal = -1;
        this.colunaFinal  = -1;

        this.afundou = false;
    }

    get verificaDirecao() { return this.direcao; }

    get getTamanho() { return this.tamanho }

    //Retorna true se o navio afundou, false se não.
    get getVerificaNavioAfundou() {
        // O método .every() checa se CADA elemento é igual a true
        if (this.posicoesAtingidas.every(elemento => elemento === true)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Atribui o navio na posição atual.
     * 
     * @param {*} colunaXLinha "Coluna" + "x" + "Linha": posição que o navio deseja ocupar.
     */
    set atribuiPosicaoAtual(colunaXLinha) {
        // Da seguinte forma é possível utilizar o novo formato de id EX: "-1_0x3"
        const [tipoTabuleiro, posicao] = colunaXLinha.split('_');
        const [colunaStr, linhaStr] = posicao.split('x');

        // const [colunaStr, linhaStr] = colunaXLinha.split('x');          // Desta forma o "possível id" não é utilizável

        this.colunaInicial = Number(colunaStr);
        this.linhaInicial = Number(linhaStr);

        if (this.direcao === HORIZONTAL) {
            this.colunaFinal = this.colunaInicial + this.tamanho - 1;

            for (let i = 0; i < this.tamanho; i++) {
                this.posicoesOcupadas[i] = tipoTabuleiro + "_" + (this.colunaInicial + i) + "x" + this.linhaInicial;
            }

        } else { // VERTICAL
            this.linhaFinal = this.linhaInicial + this.tamanho - 1;

            for (let i = 0; i < this.tamanho; i++) {
                this.posicoesOcupadas[i] = tipoTabuleiro + "_" + this.colunaInicial + "x" + (this.linhaInicial + i);
            }
        }
    }

    set marcarComoPosicionado(valor) {
        this.posicionado = valor;
    }

    set marcarComoAfundado(valor){
        this.afundou = valor;
    }

    /**Durante o jogo**/

    /**
     * Verifica se o Navio está ocupando a posição em que foi disparada.
     * 
     * @param {*} colunaXLinha Posição que deseja atingir.
     * @returns Retorna True e atualiza o vetor de posicoesAtingidas. Retorna false caso tenha errado.
     */
    disparo(colunaXLinha) {

        for (let index = 0; index < this.posicoesOcupadas.length; index++) {
            if (this.posicoesOcupadas[index] === colunaXLinha) {
                this.posicoesAtingidas[index] = true;
                return true;
            }
        }
        return false;
    }
}


/**
 * Busca o Objeto Navio com base em seu id no vetor de Navios.
 * 
 * @param {*} ID : ID do navio a ser pesquisado.
 * @return : Retorna o Objeto do Navio ou null caso não ache.
 */
function buscaNavio(ID) {
    for (let busca of naviosCriados) {
        if (busca.codigo === ID) { return busca; }
    }
    return null;
}

/**
 * Gera um codigo único e aleatorio de 0 ao número de navios existentes no jogo.
 * 
 * @returns Retorna o codigo gerado de 0 ao número de navios criados.
 */
function gerarCodigoUnico() {
    let codigoProposto;
    let codigoJaExiste;

    do {
        codigoProposto = geraNumeroAleatorio(0, quantiaNavios.length);
        //.filter(Boolean) remove slots undefined/null antes de comparar
        codigoJaExiste = naviosCriados
            .filter(Boolean)
            .some(navio => navio.codigo === codigoProposto);

    } while (codigoJaExiste);

    return codigoProposto;
}

/**
 * Gera um numero aleatorio de acordo com os parametros passados. 
 * 
 * @param {*} min Valor minimo gerado pela função.
 * @param {*} max Valor máximo gerado pela função.
 * @returns Um número aleatorio de min a max.
 */
export function geraNumeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Verifica se todos os navios que existem no jogo estão posicionados e prontos para iniciar o jogo.
 * 
 * @returns Retorna true se estiverem prontos e false caso não estejam.
 */
export function verificaIniciarJogo() {
    for (let contador = 0; contador < quantiaNavios.length; contador++) {
        if (naviosCriados[contador].posicionado === false) { return false; }
    }
    return true;
}

/**
 * Verifica se o Objeto do Navio que está sendo arrastado neste momento não está sobrepondo nenhum outro navio.
 * 
 * @param {*} celulaId ID da celula aonde o navio deseja ser inserio.
 * @return : Retorna true se é possivel inserir ou false se a posição ja esta ocupada.
 */
function verificaOcupacaoCelula(celulaId) {
    // Da seguinte forma é possível utilizar o novo formato de id EX: "-1_0x3"
    const [tipoTabuleiro, posicao] = celulaId.split('_');
    const [colunaStr, linhaStr] = posicao.split('x');

    // Calcula temporariamente as posições SEM alterar o objeto ainda
    // const [colunaStr, linhaStr] = celulaId.split('x');          // Desta forma o "possível id" não é utilizável

    const colunaInicial = Number(colunaStr);
    const linhaInicial = Number(linhaStr);

    // Monta o vetor de posições que o navio OCUPARIA
    let posicoesNovas = [];
    if (objNavioSendoArrastado.direcao === HORIZONTAL) {
        for (let i = 0; i < objNavioSendoArrastado.tamanho; i++) {
            posicoesNovas.push(`${tipoTabuleiro}_${colunaInicial + i}x${linhaInicial}`);
        }
    } else {
        for (let i = 0; i < objNavioSendoArrastado.tamanho; i++) {
            posicoesNovas.push(`${tipoTabuleiro}_${colunaInicial}x${linhaInicial + i}`);
        }
    }

    for (let navio of naviosCriados.filter(Boolean)) {
        //Ignora o próprio navio sendo arrastado
        if (navio.codigo === objNavioSendoArrastado.codigo) continue;

        //Ignora navios que ainda não foram posicionados
        if (!navio.posicionado) continue;

        const posicoesDeste = new Set(navio.posicoesOcupadas);
        const temColisao = posicoesNovas.some(pos => posicoesDeste.has(pos));
        if (temColisao) return false;
    }
    return true;
}

/**
 * Função para preencher os tabuleiros da batalha naval com uma grade de 10x10 divs
 * @param tabuleiro  Adiciona as divs nos tabuleiros(Jogador e da IA/Inimigo)
 * @param tipoDoTabuleiro Passe 1 passa atribuir atribuir os elementos DragAndDrop ao tabuleiro do jogador e -1 para apenar criar o tabuleiro.
 */
export function criarTabuleiro(tabuleiro, tipoDoTabuleiro) {
    tabuleiro.innerHTML = "";

    const TAMANHO_VISUAL = TAMANHO_MATRIZ + 1; // 11

    for (let linha = 0; linha < TAMANHO_VISUAL; linha++) {
        for (let coluna = 0; coluna < TAMANHO_VISUAL; coluna++) {

            // Célula vazia do canto superior esquerdo
            if (linha === 0 && coluna === 0) {
                const canto = document.createElement("div");
                canto.classList.add("celula-coordenada");
                tabuleiro.appendChild(canto);
                continue;
            }

            // Cabeçalho das colunas
            if (linha === 0) {
                const coordenada = document.createElement("div");
                coordenada.classList.add("celula-coordenada");
                coordenada.textContent = coluna - 1;
                tabuleiro.appendChild(coordenada);
                continue;
            }

            // Cabeçalho das linhas
            if (coluna === 0) {
                const coordenada = document.createElement("div");
                coordenada.classList.add("celula-coordenada");
                coordenada.textContent = linha - 1;
                tabuleiro.appendChild(coordenada);
                continue;
            }

            // Coordenadas reais do tabuleiro (0-9)
            const linhaReal = linha - 1;
            const colunaReal = coluna - 1;

            const celula = document.createElement("div");

            celula.classList.add("celula");

            celula.dataset.linha = linhaReal;
            celula.dataset.coluna = colunaReal;
            celula.dataset.status = "0";

            celula.id = `${tipoDoTabuleiro}_${colunaReal}x${linhaReal}`;

            if (tipoDoTabuleiro == 1) {

                celula.addEventListener("dragover", (e) => {
                    e.preventDefault();
                });

                celula.addEventListener("drop", (e) => {
                    e.preventDefault();

                    const id = e.dataTransfer.getData("id");
                    if (!id) {
                        return;
                    }

                    const cabeNaMatriz = verificaEspacoMatriz(
                        navioSendoArrastado,
                        celula.id
                    );

                    const semColisao = verificaOcupacaoCelula(celula.id);

                    if (cabeNaMatriz && semColisao) {
                        objNavioSendoArrastado.atribuiPosicaoAtual = celula.id;
                        objNavioSendoArrastado.posicionado = true;

                        celula.appendChild(navioSendoArrastado);
                        audio.playDrop();

                    } else {
                        objNavioSendoArrastado.posicionado = false;
                        campoDosNavios.appendChild(navioSendoArrastado);
                        audio.playError();
                    }
                });

                addGifOndas(celula);

            } else {
                addGifNuvens(celula);
            }

            tabuleiro.appendChild(celula);
        }
    }
}

/**
 * Soma quantos navios exitem dentro do jogo.
 */
export function criaNavios() {
    //Total é o acumulador e valorAtual é o número da vez
    const soma = quantiaNavios.reduce((total, valorAtual) => total + valorAtual, 0);


    naviosCriados = new Array(soma);
    for (let index = 0; index < quantiaNavios.length; index++) {
        inicializaONavio(tamanhoNavios[index]);
    }
}

/**
 * Cria os navios de acordo com as especificações passadas por parametro e adiciona eles no "campoDosNavios".
 * 
 * @param {*} tamanho Tamanho do navio.
 * @param {*} quantidade Quantos navios serão criados
 */
function inicializaONavio(tamanho) {
    let classeNavio;
    const navio = document.createElement("div");

    if (geraNumeroAleatorio(0, 1) == 1) {

        classeNavio = "navioTamanho" + tamanho + "-horizontal";
        naviosCriados[contNaviosCriados] = new Navios(tamanho, HORIZONTAL);
    } else {

        classeNavio = "navioTamanho" + tamanho + "-vertical";
        naviosCriados[contNaviosCriados] = new Navios(tamanho, VERTICAL);
    }
    navio.classList.add(classeNavio);
    // Para aplicação de CSS a todos os navios
    navio.classList.add("navio");

    //Passa o ID do navio para o ID do Elemento que representa aquele Navio.
    navio.id = naviosCriados[contNaviosCriados].codigo;

    //Permite o navio ser arrastavel
    navio.draggable = true;

    //Guarda o ID do navio que está sendo arrastado
    navio.addEventListener("dragstart", (e) => {
        // Padroniza para que dessa forma o usuario sempre pegue o item pela parte inicial da div.
        event.dataTransfer.setDragImage(event.target, 0, 0);
        // Passa o id do navio para o elemento arrastado, para diferenciá-lo de outros elementos arrastáveis
        e.dataTransfer.setData("id", e.target.id);

        //Efeito sonoro de navio começando a ser arrastado
        audio.playTake();

        navioSendoArrastado = e.target;
        objNavioSendoArrastado = buscaNavio(Number(e.target.id));
    });

    contNaviosCriados++;
    campoDosNavios.appendChild(navio);

}

/**
 * Inicializa os navios para uso da IA.
 * 
 * @param {*} navios Vetor da classe Navios que irá guardar os navios criados para a IA.
 * 
 * @returns retorna o vetor de Navios, com os devidos navios criados.
 */
export function inicializaOsNaviosIA() {
    for (let i = 0; i < tamanhoNavios.length; i++) {

        for (let j = 0; j < quantiaNavios[i]; j++) {

            const direcao =
                geraNumeroAleatorio(0, 1) === 1
                    ? HORIZONTAL
                    : VERTICAL;

            naviosIA[i] = new Navios(tamanhoNavios[i], direcao);
        }
    }

    return naviosIA;
}

/** 
 * @param {*} input : Elemento do navio desejado.
 * @returns {string|null} : Uma String da sua direção ('horizontal' ou 'vertical') ou null se não encontrar.
 */
function obterDirecaoDoNavio(input) {
    // Se receber um elemento HTML, pega a string da classe dele
    const classeTexto = input instanceof HTMLElement ? input.className : input;

    // Regex atualizada: procura por "navioTamanho", ignora o número (\d+), 
    // acha o hífen (-) e captura em um grupo ( ) a palavra 'horizontal' ou 'vertical'
    const resultado = classeTexto.match(/navioTamanho\d+-(horizontal|vertical)/i);

    // Se encontrar o padrão, retorna o grupo capturado (índice 1) em letras minúsculas. 
    // Se não encontrar, retorna null.
    return resultado ? resultado[1].toLowerCase() : null;
}

/** 
 * @param {*} input : Elemento do navio desejado 
 * @returns : Retorna o seu tamanho
 */
function obterTamanhoDoNavio(input) {
    // Se receber um elemento HTML, pega a string da classe dele
    const classeTexto = input instanceof HTMLElement ? input.className : input;

    // Expressão regular que procura por "navioTamanho" seguido de um ou mais números
    const resultado = classeTexto.match(/navioTamanho(\d+)/);

    // Se encontrar o padrão, retorna o número convertido para inteiro. Se não, retorna null.
    return resultado ? parseInt(resultado[1], 10) : null;
}

/**
 * Verifica se um navio cabe na matriz.
 * * @param {number} tamanho - O tamanho do navio (ex: 3 para um contratorpedeiro).
 * @param {number} linha - A linha inicial (indexada em 0).
 * @param {number} coluna - A coluna inicial (indexada em 0).
 * @param {string} orientacao - 'horizontal' ou 'vertical'.
 * @returns {boolean} True se o navio couber, False caso contrário.
 */
function navioCabeNaMatriz(tamanho, orientacao, linha, coluna) {
    // 1. Verificação básica: a posição inicial está dentro da matriz?
    if (linha < 0 || linha >= TAMANHO_MATRIZ || coluna < 0 || coluna >= TAMANHO_MATRIZ) {
        return false;
    }

    // 2. Verifica o encaixe dependendo da orientação
    if (orientacao.toLowerCase() === 'horizontal') {
        // Na horizontal, o navio se estende para a direita (muda a coluna)
        return (coluna + tamanho) <= TAMANHO_MATRIZ;
    } else if (orientacao.toLowerCase() === 'vertical') {
        // Na vertical, o navio se estende para baixo (muda a linha)
        return (linha + tamanho) <= TAMANHO_MATRIZ;
    }

    // Caso passem uma orientação inválida
    return false;
}

/**
 * Verifica se o navio que estão sendo arrastado possui espaço para ser inserido na posição que foi colocado na tabela.
 * @returns Retorna True se for possivel, se não retorna false.
 * 
 * @param navioAtual: Recebe o elemento sendo arrastado no momento.
 * @param idCelula: ID da celula para poder ter acesso a sua Linha e Coluna.
 */
function verificaEspacoMatriz(navioAtual, idCelula) {
    // Da seguinte forma é possível utilizar o novo formato de id EX: "-1_0x3"
    const [tipoTabuleiro, posicao] = idCelula.split('_');
    const [colunaStr, linhaStr] = posicao.split('x');

    // const [colunaStr, linhaStr] = idCelula.split('x');          // Desta forma o "possível id" não é utilizável

    const coluna = Number(colunaStr);
    const linha = Number(linhaStr);

    // Pegamos o objeto do navio real usando o ID dele
    const navio = buscaNavio(Number(navioAtual.id));
    if (navio === null) return false;

    // Descobre se o elemento visual está na vertical
    const ehVertical = navioAtual.classList.contains("vertical") ||
        navioAtual.className.includes("vertical");

    if (navioCabeNaMatriz(obterTamanhoDoNavio(navioAtual), obterDirecaoDoNavio(navioAtual), linha, coluna) === true) {
        return true;
    } else {
        return false;
    }

}

// Faz os navios modificarem o campo "status" da div das células para 2, nas posições em que ocupam.
// Para ser chamado quando os navios forem posicionados.
export function marcarPosicoesDosNavios() {
    for (const navio of naviosCriados.filter(Boolean)) {

        if (!navio.posicionado) continue;

        for (const posicao of navio.posicoesOcupadas) {
            const celula = document.getElementById(posicao);

            if (celula) {
                celula.dataset.status = "2";
            }
        }
    }
}

// Faz os navios não poderem mais ser arrastáveis
// Para ser chamado quando os navios forem posicionados.
// Faz os navios não poderem mais ser arrastáveis
// Para ser chamado quando os navios forem posicionados.
export function bloquearArrasteDosNavios() {
    document.querySelectorAll(".navio").forEach(navio => {
        // 1. Desativa a propriedade nativa de arrastar do HTML
        navio.draggable = false;

        // 2. Remove o cursor de "mãozinha" para o usuário ver que está travado
        navio.style.cursor = "default";

        // 3. Clona o elemento para destruir todos os EventListeners de 'dragstart'
        // Isso garante que nenhum código de arraste seja executado
        const navioBloqueado = navio.cloneNode(true);
        navio.parentNode.replaceChild(navioBloqueado, navio);
    });
}