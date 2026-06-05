// Para preenchimento dos tabuleiros com divs
let tabuleiroJogador = document.querySelector(".tabuleiro-jogador");
let tabuleiroInimigo = document.querySelector(".tabuleiro-inimigo");
let campoDosNavios = document.querySelector(".navios-arrastaveis");
let btnIniciarJogo = document.querySelector(".botao-iniciar-jogo");
let btnPosicionarNavios = document.querySelector(".botao-posicionar-navios");

//Constantes para serem passadas no parametro da função "criarTabuleiro()".
const MATRIZ_JOGADOR = 1; //Cria a matriz com as opções disponinveis de arrastar navios para o jogador.
const MATRIZ_INIMIGO = -1; //Desabilita a opção de arrastar, criando apenas uma matriz visual.
const TAMANHO_MATRIZ = 10;

//Constantes para definir a direção do navio.
const HORIZONTAL = 1;
const VERTICAL = -1;

//Guarda o Elemento do navio sendo arrastado em tempo de execução.
let navioSendoArrastado = null;
//Objeto do navio sendo arrastado naquele momento.
let objNavioSendoArrastado = null;

/*Guarda o tamanho de cada um dos navios criados referente a posição:
 * carrierTam, battleshipTam, destroyerTam, submarineTam, patrolBoatTam
*/
let tamanhoNavios = [5, 4, 3, 3, 2];

/* Quantia de cada navio referente a posição:
 * carrierQuant, battleshipQuant, destroyerQuant, submarineQuant, patrolBoatQuant
*/
let quantiaNavios = [1, 1, 1, 1, 1];

//Cria o vetor da classe Navios com base no total de navios criados no jogo.
let naviosCriados;
let contNaviosCriados=0;//Index para saber quantos navios ja foram criados em tempo de execução.

/**
 * Classe do navio, criada para guardar as informações dos navios
 * 
 * @param tamanho: Guarda quantos células da matriz o navio irá ocupar.
 * @param vetor: Irá guardar quais partes do navio foram atingidas(vetor inicializado com false).
 * @param direcao: Passe a constante HORIZONTAL ou VERTICAL, caso passe algo diferente sera atribuido a constante HORIZONTAL.
 */
class Navios{
    /** 
     * @param direcaoNavio: Passe @param HORIZONTAL ou @param VERTICAL
     * @param tamanho: Tamanho que o navio ocupará(Passe um numero maior ou igual a 1).
    */
    constructor(tamanho ,direcaoNavio){
        this.codigo = gerarCodigoUnico();
        this.posicionado = false;//Se ja ésta na matriz
        this.tamanho = tamanho;
        this.posicoesAtingidas = new Array(this.tamanho);
        this.posicoesOcupadas = new Array(this.tamanho);//Ex: posicoesOcupadas[0]="1x1", posicoesOcupadas[1]="1x2", posicoesOcupadas[2]="1x3"... 

        this.posicoesAtingidas.fill(false);
        this.posicoesOcupadas.fill("-1");//Posição padrão
        
        if(direcaoNavio !== HORIZONTAL && direcaoNavio !== VERTICAL){
            this.direcao = HORIZONTAL;
        }else{
            this.direcao = direcaoNavio;
        }

        this.linhaInicial = -1;
        this.colunaInicial  = -1;

        this.linhaFinal = -1;
        this.colunaFinal  = -1;
    }

    get verificaDirecao(){ return this.direcao; }

    //Retorna true se o navio afundou, false se não.
    get getVerificaNavioAfundou() {
        // O método .every() checa se CADA elemento é igual a true
        if(this.posicoesAtingidas.every(elemento => elemento === true)){
            return true;
        }else{
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
        this.linhaInicial  = Number(linhaStr);

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

    /**Durante o jogo**/

    /**
     * Verifica se o Navio está ocupando a posição em que foi disparada.
     * 
     * @param {*} colunaXLinha Posição que deseja atingir.
     * @returns Retorna True e atualiza o vetor de posicoesAtingidas. Retorna false caso tenha errado.
     */
    disparo(colunaXLinha){

        for(let index=0; index < this.posicoesOcupadas.length; index++){
            if(this.posicoesOcupadas[index] === colunaXLinha){
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
function buscaNavio(ID){
    for(let busca of naviosCriados){
        if(busca.codigo === ID){ return busca; }
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
function geraNumeroAleatorio(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Verifica se todos os navios que existem no jogo estão posicionados e prontos para iniciar o jogo.
 * 
 * @returns Retorna true se estiverem prontos e false caso não estejam.
 */
function verificaIniciarJogo(){
    for(let contador=0; contador < quantiaNavios.length; contador++){
        if(naviosCriados[contador].posicionado === false){ return false; }
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
    const linhaInicial  = Number(linhaStr);

    // Monta o vetor de posições que o navio OCUPARIA
    let posicoesNovas = [];
    if (objNavioSendoArrastado.direcao === HORIZONTAL) {
        for (let i = 0; i < objNavioSendoArrastado.tamanho; i++) {
            posicoesNovas.push((colunaInicial + i) + "x" + linhaInicial);
        }
    } else {
        for (let i = 0; i < objNavioSendoArrastado.tamanho; i++) {
            posicoesNovas.push(colunaInicial + "x" + (linhaInicial + i));
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
function criarTabuleiro(tabuleiro, tipoDoTabuleiro) {
  tabuleiro.innerHTML = "";

  for (let linha = 0; linha < TAMANHO_MATRIZ; linha++) {
        for (let coluna = 0; coluna < TAMANHO_MATRIZ; coluna++) {
            const celula = document.createElement("div");

            celula.classList.add("celula");

            celula.dataset.linha = linha;
            celula.dataset.coluna = coluna;

            // celula.id = `${coluna}x${linha}`;    // ERRO: Desta forma os ids das celulas ficam duplicados pois tanto o campo inimigo quanto do jogador possuem o mesmo número de linhas e colunas
            celula.id = `${tipoDoTabuleiro}_${coluna}x${linha}`; // Melhor opção, deste jeito cada celula possui um id único

            //Cria tabuleiro pra o Jogador poder colocar os seus navios.
            if(tipoDoTabuleiro == 1){

                //Retira configuração padrão do navegador para poder arrastar os navios
                celula.addEventListener("dragover", (e) => {
                    e.preventDefault();
                });

                /**
                 * Permite que cada celula possa receber o arraste de um navio.
                 * A celula recebe o navio arrastado e se torna pai da tag do navio.
                 * 
                 * Atribui a posição e marca como posicionado APÓS as validações
                 */
                celula.addEventListener("drop", (e) => {
                    e.preventDefault();
                    const cabeNaMatriz = verificaEspacoMatriz(navioSendoArrastado, celula.id);
                    const semColisao   = verificaOcupacaoCelula(celula.id);

                    if (cabeNaMatriz === true && semColisao === true) {
                        // ✅ Só agora grava a posição real no objeto
                        objNavioSendoArrastado.atribuiPosicaoAtual = celula.id;
                        objNavioSendoArrastado.posicionado = true;
                        celula.appendChild(navioSendoArrastado);
                    } else {
                        campoDosNavios.appendChild(navioSendoArrastado);
                    }
                });

                // Adiciona os Gifs de Ondas aos campos do jogador.
                celula.dataset.status = "1";
                addGifOndas(celula);
            }
            else{
                // Adiciona os Gifs de Nuvens aos campos da IA.
                celula.dataset.status = "0";
                addGifNuvens(celula);
            }

            tabuleiro.appendChild(celula);
        }
    }
}

/**
 * Soma quantos navios exitem dentro do jogo.
 */
function criaNavios(){
    //Total é o acumulador e valorAtual é o número da vez
    const soma = quantiaNavios.reduce((total, valorAtual) => total + valorAtual, 0);

    naviosCriados = new Array(soma); 
    for(let index=0; index < quantiaNavios.length; index++){
        inicializaONavio(tamanhoNavios[index]);
    }
}

/**
 * Cria os navios de acordo com as especificações passadas por parametro e adiciona eles no "campoDosNavios".
 * 
 * @param {*} tamanho Tamanho do navio.
 * @param {*} quantidade Quantos navios serão criados
 */
function inicializaONavio(tamanho){
    let classeNavio;
    const navio = document.createElement("div");

    if(geraNumeroAleatorio(0, 1) == 1){

        classeNavio = "navioTamanho" + tamanho + "-horizontal";
        naviosCriados[contNaviosCriados] = new Navios(tamanho, HORIZONTAL);
    }else{

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
    navio.addEventListener("dragstart", (e) =>{
        //Padroniza para que dessa forma o usuario sempre pegue o item pela parte inicial da div.
        event.dataTransfer.setDragImage(event.target, 0, 0);
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
function inicializaOsNaviosIA(navios){
    
    for(let contador=0; contador < quantiaNavios.length; contador++){
        if(geraNumeroAleatorio(0, 1) == 1){
            navios[contNaviosCriados] = new Navios(tamanho, HORIZONTAL);
        }else{
            navios[contNaviosCriados] = new Navios(tamanho, VERTICAL);
        }
    }

    return navios;
}

/**
 * Permite que os navios possam ser arrastados novamente para o campo de onde foram criado
 */
campoDosNavios.addEventListener("dragover", (e) =>{
    e.preventDefault();  
});

campoDosNavios.addEventListener("drop", (e) => {
    e.preventDefault();
    //Reseta o navio quando devolvido ao campo
    if (objNavioSendoArrastado) {
        objNavioSendoArrastado.posicoesOcupadas.fill("-1");
        objNavioSendoArrastado.posicionado = false;
    }
    campoDosNavios.appendChild(navioSendoArrastado);
});

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
    const linha  = Number(linhaStr);

    // Pegamos o objeto do navio real usando o ID dele
    const navio = buscaNavio(Number(navioAtual.id));
    if (navio === null) return false;

    // Descobre se o elemento visual está na vertical
    const ehVertical = navioAtual.classList.contains("vertical") || 
                       navioAtual.className.includes("vertical");
    
    if(navioCabeNaMatriz(obterTamanhoDoNavio(navioAtual), obterDirecaoDoNavio(navioAtual), linha, coluna) === true){
        return true;
    }else{
        return false;
    }

}

// Faz os navios modificarem o campo "status" da div das células para 2, nas posições em que ocupam.
// Para ser chamado quando os navios forem posicionados.
function marcarPosicoesDosNavios() {
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
function bloquearArrasteDosNavios() {
    document.querySelectorAll(".navio").forEach(navio => {
        navio.draggable = false;
    });
}