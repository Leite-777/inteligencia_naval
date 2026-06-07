import {tabuleiroHTMLparaJSON} from "./script-tabuleiro.js";
import {tabuleiroJSONparaHTML} from "./script-tabuleiro.js";
import {statusMensagem} from "./script-tabuleiro.js";
import {statusAlerta} from "./script-tabuleiro.js";
import {escolherJogadaFallback} from "./script-fallback.js"
import { inicializaOsNaviosIA } from "./script-jogador.js";
import { Navios } from "./script-jogador.js";
import { geraNumeroAleatorio } from "./script-jogador.js";

let chaveHtml = document.getElementById('api-key') as HTMLInputElement;
//para não travar a chava api

// O tabuleiro inimigo onde o usuário só vê as posições que ele atacou
let tabuleiroInimigoRevelado : number[][] = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]
];

// O tabuleiro inimigo com todas as posições com navios e posições atacadas
let tabuleiroInimigoCompleto: number[][] = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]
];

// O tabuleiro do jogador onde a IA só vê as posições que ela atacou
let tabuleiroJogadorRevelado: number[][] = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]
];

//formato do json
interface respostaApi{
    coluna : number, 
    linha: number,  
    debug : string
}

//Interface do erro passando os campos
interface Erro{
    CodigoErro: number, //Valor numerico do erro ex: 400
    status: boolean; //sempre false
    mensagemErro : string // nome do erro ex: INVALID_ARGUMENT
}

//Interface do Sucesso passando os campos
interface Sucesso{
    dados: respostaApi, //json com as informações
    status: boolean; //sempre true
}

enum Acerto{
    Errou = 40,
    Acertou = 50
}

//tipo de retorno para a função chamada api ja que esse tipo pode ser Sucesso ou Erro
type resultadoApi = Erro | Sucesso;
type acertoAPI = {acerto:Acerto | undefined;};

let totalNaviosIA = inicializaOsNaviosIA();

//                              Função principal para a Chamada de API, com o retorno dos dados

async function chamadaApi(prompt : string): Promise<resultadoApi>{
    
    const apiKey = (document.getElementById('api-key') as HTMLInputElement).value;
    let resposta = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: {
    "Content-Type": "application/json"
    },
    body: JSON.stringify({
    contents: [
        {
        parts: [
            {
            text: prompt
            }
        ]
        }
    ]
    })
    });
    if(!resposta.ok){
        return {
            CodigoErro : resposta.status,
            status : false,
            mensagemErro : resposta.statusText
        };
    }
     try {

        let dados = await resposta.json();

        let respostaApi = dados?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!respostaApi) {
            return {
                CodigoErro: resposta.status,
                mensagemErro: resposta.statusText,
                status: false
            };
        }

        let respostaFormatada = respostaApi.replace(/```json|```/g, "").trim();

        let jsonResposta = JSON.parse(respostaFormatada);

        return {
            dados: jsonResposta,
            status: true
        };

    } catch (erro: any) {

        return {
            CodigoErro: resposta.status,
            mensagemErro: resposta.statusText,
            status: false
        };
    }
}

//                              Função da passagem dos tabuleiros para, Chamada de API, junto com o prompt

async function chamarApi(matrizJogadorRevelado: number[][], matrizJogadorCompleto: number[][]): Promise<acertoAPI>{
    // Pega o valor exato no momento que a função é ativada
    let apiKey = chaveHtml.value;

    if (!apiKey) {
        console.error("A chave da API não foi informada.");
        return {acerto : undefined};
    }

    // Formata a matriz para que ela tenha quebras de linha, mantendo o aspecto de "grade" para a IA visualizar melhor
    let matrizFormatada = matrizJogadorRevelado.map(linha => `[${linha.join(', ')}]`).join('\n');

    let prompt: string = `
Você está jogando batalha naval contra um oponente humano, as regras são as seguintes:
Você receberá uma matriz 10x10 onde:
    - Posicões demarcadas com 0 significa local desconhecido.
    - Posições com o numero 1 significa agua (não jogue nelas).
    - Posições com o numero 3 significa navio atingido (Ataque em uma posição adjacente a essa).
    - Posições com o numero 4 significa navio completamente afundado (não jogue nelas).

Inicie o jogo escolhendo posições aleatórias, distante de posições já escolhidas anteriormente, para encontrar navios. Sempre que encontrar navios atingidos (3), continue atacando em posições adjacentes até afundá-lo por completo.
Seu objetivo é afundar todos os navios do oponente.
As posições do tabuleiro do oponente estão nesta matriz:
${matrizFormatada}

Sua resposta deverá ser escrita estritamente como um JSON no formato exato abaixo. A propriedade "debug" deve conter sua linha de raciocínio justificando a coordenada escolhida. Note que as linhas e colunas devem ser de 0 a 9.
{
    "debug": "string",
    "linha": número,
    "coluna": número
}
Responda APENAS em JSON válido.
Não use markdown.    
`;

    let respostaFunc = await chamadaApi(prompt);

    // Debug temporário da resposta da chamada API, contendo:
    // A matriz completa do oponente exibida no console, a posição atacada, e o raciocínio da IA
    // Um alerta na tela mostrando a posição que o Gemini acertou
    // Atualização da matriz com a posição que o Gemini acertou (matrizIa[linhaAtaque][colunaAtaque] = 1;)
    // Se der erro na chamada, mostra no console o código do erro que foi retornado

    if (respostaFunc.status) {
        const sucesso = respostaFunc as Sucesso;
        const coordenadasIa = sucesso.dados;
        const linhaAtaque = sucesso.dados.linha;
        const colunaAtaque = sucesso.dados.coluna;

        // Exibe um alerta na tela mostrando a posição que o Gemini atacou, e atualiza da matriz
        // Verifica se a IA retornou valores fora do tabuleiro (ex: 10 ou -1)
        if (linhaAtaque >= 0 && linhaAtaque < 10 && colunaAtaque >= 0 && colunaAtaque < 10) {
            
            // Verifica o que tinha na matriz do jogador naquela coordenada
            let posicaoAtacada = matrizJogadorCompleto[linhaAtaque][colunaAtaque];

            if (posicaoAtacada === 2) {
                // Altera a posição nas duas matrizes pra marcar que um navio foi parcialmente atingido
                matrizJogadorRevelado[linhaAtaque][colunaAtaque] = 3;
                matrizJogadorCompleto[linhaAtaque][colunaAtaque] = 3;
                // Mostra a alteração do tabuleiro na página para o usuário ver
                tabuleiroJSONparaHTML(matrizJogadorCompleto, ".tabuleiro-jogador");

                alert(`💥 TIRO CERTEIRO! O Gemini acertou um navio em (${linhaAtaque}, ${colunaAtaque})`);
                return {acerto: Acerto.Acertou};
            } else if (posicaoAtacada === 0) {
                // Altera a posição nas duas matrizes pra marcar que um navio foi parcialmente atingido
                matrizJogadorRevelado[linhaAtaque][colunaAtaque] = 1;
                matrizJogadorCompleto[linhaAtaque][colunaAtaque] = 1;
                // Mostra a alteração do tabuleiro na página para o usuário ver
                tabuleiroJSONparaHTML(matrizJogadorCompleto, ".tabuleiro-jogador");

                alert(`🌊 Água... O Gemini errou em (${linhaAtaque}, ${colunaAtaque})`);
                return {acerto: Acerto.Errou};
            } else {
                alert(`⚠️ O Gemini atacou uma posição repetida (${linhaAtaque}, ${colunaAtaque})!`);
                return {acerto: Acerto.Errou};
            }

        } else {
            alert(`🚨 Erro: A IA gerou coordenadas inválidas fora do tabuleiro: (${linhaAtaque}, ${colunaAtaque})`);
        }

    } else {
        const erro = respostaFunc as Erro;
        
        console.error(`Erro na chamada da API [Código ${erro.CodigoErro}]: ${erro.mensagemErro}`);
        alert(`Erro ao chamar a API: ${erro.mensagemErro}`);
        return jogadaFallback(matrizJogadorRevelado,matrizJogadorCompleto);
    }
    return {acerto :undefined};
}

//      Configurando o botão Iniciar Jogo temporariamente para iniciar a chamada da API

const botaoPosicionarNavios = document.querySelector<HTMLButtonElement>('.botao-posicionar-navios');

// Garante que o botão realmente existe na página antes de adicionar o evento
if (botaoPosicionarNavios) {
    botaoPosicionarNavios.addEventListener('click', async () => {
        // Desativa o botão temporariamente para o usuário não clicar várias vezes enquanto a API responde
        botaoPosicionarNavios.disabled = true;

        console.log("Adicionando eventos de clique no tabuleiro inimigo");

        // Adiciona os navios no tabuleiro da IA
        
        tabuleiroInimigoCompleto = tabuleiroHTMLparaJSON(".tabuleiro-inimigo");
        tabuleiroInimigoCompleto = posicionaCampoIA(tabuleiroInimigoCompleto,totalNaviosIA);

        const campoIa = document.querySelector('.tabuleiro-inimigo') as HTMLDivElement;

        if(campoIa){
            Array.from(campoIa.children).forEach((filho) => {
                filho.addEventListener("click", async () => {
                    // Se a posição que o usuário clicou possui um navio, a IA não irá jogar e o jogador pode só clicar em outra posição
                    if(verificarNavioAcertadoIa(filho as HTMLElement)){
                        alert("Você acertou um navio!");
                    }
                    // Se a posição que o usuário clicou é água, a IA irá jogar logo em seguida
                    else{
                        alert("Você errou o tiro...");
                        // Permite que a IA faça a sua jogada, e caso ela acerte um navio, ela pode continuar jogando até errar
                        let parada : number = 0;
                        do{
                            let status = await JogadaApi();
                            if(status.acerto != Acerto.Acertou){
                                parada = 0;
                            }else{
                                parada = 1;
                            }
                        }while(parada != 0);
                    }
                });
            });
            
        }
    });
} else {
    console.error("Botão '.botao-iniciar-jogo' não foi encontrado no HTML. Verifique a classe.");
}

async function JogadaApi(): Promise<acertoAPI>{
    let tabuleiroJogadorCompleto = tabuleiroHTMLparaJSON(".tabuleiro-jogador");
    let alvo = await chamarApi(tabuleiroJogadorRevelado, tabuleiroJogadorCompleto);
    if(alvo.acerto == undefined){
        return {acerto : undefined};
    }
    if(alvo.acerto == Acerto.Errou){
        return {acerto :Acerto.Errou};    
    }
    if(alvo.acerto == Acerto.Acertou){
        return {acerto :Acerto.Acertou};
    }else{
        return {acerto :Acerto.Errou};
    }
}

async function jogadaFallback(matrizJogadorRevelado : number[][],matrizJogadorCompleta:number[][]): Promise<acertoAPI>{
    let posFall = escolherJogadaFallback(matrizJogadorRevelado);
    if(posFall != undefined){
        let posicaoAtacada = matrizJogadorCompleta[posFall.linha][posFall.coluna];
        
        if (posicaoAtacada === 2) {
                // Altera a posição nas duas matrizes pra marcar que um navio foi parcialmente atingido
                matrizJogadorRevelado[posFall.linha][posFall.coluna] = 3;
                matrizJogadorCompleta[posFall.linha][posFall.coluna] = 3;
                // Mostra a alteração do tabuleiro na página para o usuário ver
                tabuleiroJSONparaHTML(matrizJogadorCompleta, ".tabuleiro-jogador");

                statusMensagem(`TIRO CERTEIRO! O Fallback acertou um navio em (${posFall.linha}, ${posFall.coluna})`);
                //alert(`💥 TIRO CERTEIRO! O Fallback acertou um navio em (${posFall.linha}, ${posFall.coluna})`);
                return {acerto: Acerto.Acertou};
            } else if (posicaoAtacada === 0) {
                // Altera a posição nas duas matrizes pra marcar que a água foi atingida
                matrizJogadorRevelado[posFall.linha][posFall.coluna] = 1;
                matrizJogadorCompleta[posFall.linha][posFall.coluna] = 1;
                // Mostra a alteração do tabuleiro na página para o usuário ver
                tabuleiroJSONparaHTML(matrizJogadorCompleta, ".tabuleiro-jogador");
                
                statusMensagem(`Água... O Fallback errou em (${posFall.linha}, ${posFall.coluna})`)
                //alert(`🌊 Água... O Fallback errou em (${posFall.linha}, ${posFall.coluna})`);
                return {acerto: Acerto.Errou};
            }
    }else{
        return {acerto : undefined};
    }   
    return {acerto : undefined};
}

function verificarNavioAcertadoIa(filho : HTMLElement) :boolean{
    let linhaFilho = filho.dataset.linha;
    let colunaFilho = filho.dataset.coluna;
    if(linhaFilho != undefined && colunaFilho != undefined){
        let posLinha = Number.parseInt(linhaFilho);
        let posColuna = Number.parseInt(colunaFilho);
        // Se o usuário acertou um navio do tabuleiro inimigo
        if(tabuleiroInimigoCompleto[posLinha][posColuna] == 2){
            tabuleiroInimigoCompleto[posLinha][posColuna] = 3;
            tabuleiroInimigoRevelado[posLinha][posColuna] = 3;
            tabuleiroJSONparaHTML(tabuleiroInimigoRevelado,".tabuleiro-inimigo");
            return true;
        }
        // Se o usuário errou o navio, ele não joga na próxima vez
        else if(tabuleiroInimigoCompleto[posLinha][posColuna] == 0){
            tabuleiroInimigoCompleto[posLinha][posColuna] = 1;
            tabuleiroInimigoRevelado[posLinha][posColuna] = 1;
            tabuleiroJSONparaHTML(tabuleiroInimigoRevelado,".tabuleiro-inimigo");
            return false;
        }
        // Se o usuário clicou numa posição repetida, apenas deixa ele jogar novamente
        else{
            return true;
        }
    }
    return false;
}

export function posicionaCampoIA( campoIA: number[][], totalNaviosIA: Navios[]): number[][] {
    const HORIZONTAL = 1;
    const TAMANHO_MATRIZ = 10;
    for (const navio of totalNaviosIA) {

        let posicionado = false;

        while (!posicionado) {

            const linha = Math.floor(Math.random() * TAMANHO_MATRIZ);
            const coluna = Math.floor(Math.random() * TAMANHO_MATRIZ);

            let cabe = true;

            // Verifica se o navio cabe e não colide
            if (navio.verificaDirecao === HORIZONTAL) {
                if (coluna + navio.getTamanho > TAMANHO_MATRIZ) {
                    continue;
                }

                for (let i = 0; i < navio.getTamanho; i++) {
                    if (campoIA[linha][coluna + i] === 2) {
                        cabe = false;
                        break;
                    }
                }
                if (!cabe) continue;

                // Posiciona na matriz
                for (let i = 0; i < navio.getTamanho; i++) {
                    campoIA[linha][coluna + i] = 2;
                }

            } else { // VERTICAL
                if (linha + navio.getTamanho > TAMANHO_MATRIZ) {
                    continue;
                }

                for (let i = 0; i < navio.getTamanho; i++) {
                    if (campoIA[linha + i][coluna] === 2) {
                        cabe = false;
                        break;
                    }
                }
                if (!cabe) continue;

                // Posiciona na matriz
                for (let i = 0; i < navio.getTamanho; i++) {
                    campoIA[linha + i][coluna] = 2;
                }
            }

            // Atualiza o objeto Navio
            navio.atribuiPosicaoAtual = `-1_${coluna}x${linha}`;
            navio.marcarComoPosicionado = true;

            posicionado = true;
        }
    }
    return campoIA;
}



//Tipos de erro
/*
400 	INVALID_ARGUMENT 	O corpo da solicitação está incorreto. 	Há um erro de digitação ou um campo obrigatório ausente na sua solicitação. 	Consulte a referência da API para ver o formato da solicitação, exemplos e versões compatíveis. Usar recursos de uma versão mais recente da API com um endpoint mais antigo pode causar erros.
400 	FAILED_PRECONDITION 	O nível sem custo financeiro da API Gemini não está disponível no seu país. Ative o faturamento no seu projeto no Google AI Studio. 	Você está fazendo uma solicitação em uma região onde o nível sem custo financeiro é indisponível e não ativou o faturamento no seu projeto no Google AI Studio. 	Para usar a API Gemini, você precisa configurar um plano pago usando o Google AI Studio.
403 	PERMISSION_DENIED 	Sua chave de API não tem as permissões necessárias. 	Você está usando a chave de API errada ou tentando usar um modelo ajustado sem passar pela autenticação adequada. 	Verifique se a chave de API está definida e tem o acesso correto. E faça a autenticação adequada para usar modelos ajustados.
404 	NOT_FOUND 	O recurso solicitado não foi encontrado. 	Não foi possível encontrar um arquivo de imagem, áudio ou vídeo referenciado na sua solicitação. 	Verifique se todos os parâmetros da sua solicitação são válidos para a versão da API.
429 	RESOURCE_EXHAUSTED 	Você excedeu o limite de taxa. 	Você está enviando muitas solicitações por minuto com a API Gemini no nível sem custo financeiro. 	Verifique se você está dentro do limite de taxa do modelo. Solicite um aumento de cota se necessário.
500 	INTERNAL 	Ocorreu um erro inesperado no Google. 	O contexto da sua entrada é muito longo. 	Confira a página de status da API Gemini para saber se há incidentes em andamento. Reduza o contexto de entrada ou mude temporariamente para outro modelo (por exemplo, do Gemini 2.5 Pro para o Gemini 2.5 Flash) e veja se funciona. Ou aguarde um pouco e tente de novo. Se o problema persistir depois de tentar novamente, informe usando o botão Enviar feedback no Google AI Studio.
503 	INDISPONÍVEL 	O serviço pode estar temporariamente sobrecarregado ou indisponível. 	O serviço está temporariamente sem capacidade. 	Confira a página de status da API Gemini para saber se há incidentes em andamento. Mude temporariamente para outro modelo (por exemplo, do Gemini 2.5 Pro para o Gemini 2.5 Flash) e veja se funciona. Ou aguarde um pouco e tente de novo. Se o problema persistir depois de tentar novamente, informe usando o botão Enviar feedback no Google AI Studio.
504 	DEADLINE_EXCEEDED 	
*/
