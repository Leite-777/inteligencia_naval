import { tabuleiroHTMLparaJSON } from "./script-tabuleiro.js";
import { tabuleiroJSONparaHTML } from "./script-tabuleiro.js";
import { statusMensagem } from "./script-tabuleiro.js";
import { statusAlerta } from "./script-tabuleiro.js";
import { escolherJogadaFallback } from "./script-fallback.js";
import { inicializaOsNaviosIA } from "./script-jogador.js";
import { verificaIniciarJogo } from "./script-jogador.js";
import { alternarTransparenciaTabuleiro } from "./script-tabuleiro.js";
import { validaEstruturaChaveAPI } from "./script-tabuleiro.js";
import { AudioManager } from "./script-audioManager.js";
//Instancia do AudioManager pra controlar o audio
const audio = new AudioManager();
let chaveHtml = document.getElementById('api-key');
//para não travar a chava api
// O tabuleiro inimigo onde o usuário só vê as posições que ele atacou
let tabuleiroInimigoRevelado = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];
// O tabuleiro inimigo com todas as posições com navios e posições atacadas
let tabuleiroInimigoCompleto = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];
// O tabuleiro do jogador onde a IA só vê as posições que ela atacou
let tabuleiroJogadorRevelado = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];
var Acerto;
(function (Acerto) {
    Acerto[Acerto["Errou"] = 40] = "Errou";
    Acerto[Acerto["Acertou"] = 50] = "Acertou";
})(Acerto || (Acerto = {}));
let totalNaviosIA = inicializaOsNaviosIA();
//                              Função principal para a Chamada de API, com o retorno dos dados
async function chamadaApi(prompt) {
    if (!validaEstruturaChaveAPI()) {
        return undefined;
    }
    const apiKey = document.getElementById('api-key').value;
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
    if (!resposta.ok) {
        return {
            CodigoErro: resposta.status,
            status: false,
            mensagemErro: resposta.statusText
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
    }
    catch (erro) {
        return {
            CodigoErro: resposta.status,
            mensagemErro: resposta.statusText,
            status: false
        };
    }
}
//                              Função da passagem dos tabuleiros para, Chamada de API, junto com o prompt
async function chamarApi(matrizJogadorRevelado, matrizJogadorCompleto) {
    // Pega o valor exato no momento que a função é ativada
    let apiKey = chaveHtml.value;
    if (!apiKey) {
        console.error("A chave da API não foi informada.");
        return { acerto: undefined };
    }
    // Formata a matriz para que ela tenha quebras de linha, mantendo o aspecto de "grade" para a IA visualizar melhor
    let matrizFormatada = matrizJogadorRevelado.map(linha => `[${linha.join(', ')}]`).join('\n');
    let prompt = `
Você está jogando batalha naval contra um oponente humano, as regras são as seguintes:
Você receberá uma matriz 10x10 onde:
    - Posicões demarcadas com 0 significa local desconhecido.
    - Posições com o numero 1 significa agua (não jogue nelas).
    - Posições com o numero 3 significa navio atingido (Ataque em uma posição adjacente a essa).
    - Posições com o numero 4 significa navio completamente afundado (não jogue nelas).

Faça suas jogadas escolhendo posições aleatórias, distante de posições já escolhidas anteriormente, para encontrar navios. Sempre que encontrar navios atingidos (3), continue atacando em posições adjacentes até afundá-lo por completo.
Seu objetivo é afundar todos os navios do oponente.
As posições do tabuleiro do oponente estão nesta matriz:
${matrizFormatada}

Sua resposta deverá ser escrita estritamente como um JSON no formato exato abaixo. A propriedade "debug" deve conter sua linha de raciocínio escrita em português, justificando a coordenada escolhida. Note que as linhas e colunas devem ser de 0 a 9.
{
    "debug": "string",
    "linha": número,
    "coluna": número
}
Responda APENAS em JSON válido.
Não use markdown.    
`;
    let raciocinioIA = document.querySelector(".raciocinio-ia");
    let respostaFunc = await chamadaApi(prompt);
    if (respostaFunc == undefined) {
        raciocinioIA.textContent = "O Piloto automático está jogando...";
        return jogadaFallback(matrizJogadorRevelado, matrizJogadorCompleto);
    }
    if (respostaFunc.status) {
        const sucesso = respostaFunc;
        const coordenadasIa = sucesso.dados;
        const linhaAtaque = sucesso.dados.linha;
        const colunaAtaque = sucesso.dados.coluna;
        // Exibe um alerta na tela mostrando a posição que o Gemini atacou, e atualiza da matriz
        // Verifica se a IA retornou valores fora do tabuleiro (ex: 10 ou -1)
        if (linhaAtaque >= 0 && linhaAtaque < 10 && colunaAtaque >= 0 && colunaAtaque < 10) {
            raciocinioIA.textContent = `${sucesso.dados.debug}`;
            // Verifica o que tinha na matriz do jogador naquela coordenada
            let posicaoAtacada = matrizJogadorCompleto[linhaAtaque][colunaAtaque];
            if (posicaoAtacada === 2) {
                // Altera a posição nas duas matrizes pra marcar que um navio foi parcialmente atingido
                matrizJogadorRevelado[linhaAtaque][colunaAtaque] = 3;
                matrizJogadorCompleto[linhaAtaque][colunaAtaque] = 3;
                //Som de tiro Acertado
                audio.playHitShot();
                // Mostra a alteração do tabuleiro na página para o usuário ver
                tabuleiroJSONparaHTML(matrizJogadorCompleto, ".tabuleiro-jogador");
                statusAlerta(`[ ! ] IMPACTO RECEBIDO! O Gemini acertou um navio em (${linhaAtaque}, ${colunaAtaque}) [ ! ]`);
                return { acerto: Acerto.Acertou };
            }
            else if (posicaoAtacada === 0) {
                // Altera a posição nas duas matrizes pra marcar que um navio foi parcialmente atingido
                matrizJogadorRevelado[linhaAtaque][colunaAtaque] = 1;
                matrizJogadorCompleto[linhaAtaque][colunaAtaque] = 1;
                //Som de tiro errado
                audio.playMissShot();
                // Mostra a alteração do tabuleiro na página para o usuário ver
                tabuleiroJSONparaHTML(matrizJogadorCompleto, ".tabuleiro-jogador");
                statusAlerta(`[~] O Gemini errou o alvo em (${linhaAtaque}, ${colunaAtaque})!... Nenhum dano registrado. [~]`);
                return { acerto: Acerto.Errou };
            }
            else {
                statusAlerta(`[?] O Gemini marcou uma posição repetida em (${linhaAtaque}, ${colunaAtaque})! Recalculando... [?]`);
                // Permite à IA tentar novamente
                return { acerto: Acerto.Acertou };
            }
        }
        else {
            statusAlerta(`[?] O Gemini atacou coordenadas inválidas fora do tabuleiro! (${linhaAtaque}, ${colunaAtaque})! Recalculando... [?]`);
            return { acerto: Acerto.Errou };
        }
    }
    else {
        const erro = respostaFunc;
        if (erro.CodigoErro === 403 || erro.CodigoErro === 429) {
            statusAlerta("[X] Não é possível fazer contato com o Gemini! O Piloto Automático assumirá o controle. [X]");
        }
        else if (erro.CodigoErro === 503 || erro.CodigoErro === 500 || erro.CodigoErro === 503) {
            statusAlerta("[X] O Gemini está temporariamente indisponível! O Piloto Automático assumirá o controle. [X]");
        }
        raciocinioIA.textContent = "O Piloto automático está jogando...";
        return jogadaFallback(matrizJogadorRevelado, matrizJogadorCompleto);
    }
    return { acerto: undefined };
}
/**
 * O botão Posicionar Navios adiciona os eventos de clique para o tabuleiro inimigo,
 * permitindo tanto ao jogador quanto à IA fazer suas jogadas.
 */
const botaoPosicionarNavios = document.querySelector('.botao-posicionar-navios');
// Garante que o botão realmente existe na página antes de adicionar o evento
if (botaoPosicionarNavios) {
    botaoPosicionarNavios.addEventListener('click', async () => {
        if (verificaIniciarJogo() === false) {
            return;
        }
        // Desativa o botão para o usuário não gerar vários eventos de clique
        botaoPosicionarNavios.disabled = true;
        let podeJogar = true;
        // Adiciona os navios no tabuleiro da IA
        tabuleiroInimigoCompleto = tabuleiroHTMLparaJSON(".tabuleiro-inimigo");
        tabuleiroInimigoCompleto = posicionaCampoIA(tabuleiroInimigoCompleto, totalNaviosIA);
        const campoIa = document.querySelector('.tabuleiro-inimigo');
        if (campoIa) {
            Array.from(campoIa.children).forEach((filho) => {
                filho.addEventListener("click", async () => {
                    if (!podeJogar) {
                        return;
                    }
                    podeJogar = false;
                    // Se a posição que o usuário clicou possui um navio, a IA não irá jogar e o jogador pode só clicar em outra posição
                    if (verificarNavioAcertadoIa(filho)) {
                        podeJogar = true;
                        // verificarTerminoDeJogo()
                    }
                    // Se a posição que o usuário clicou é água, a IA irá jogar logo em seguida
                    else {
                        // Permite que a IA faça a sua jogada, e caso ela acerte um navio, ela pode continuar jogando até errar
                        await wait(1500);
                        alternarTransparenciaTabuleiro("jogador");
                        alternarTransparenciaTabuleiro("inimigo");
                        let parada = 0;
                        do {
                            if (verificarTerminoDeJogo() == true) {
                                break;
                            }
                            let status = await JogadaApi();
                            if (status.acerto != Acerto.Acertou) {
                                parada = 0;
                            }
                            else {
                                parada = 1;
                            }
                        } while (parada != 0);
                        await wait(1500);
                        alternarTransparenciaTabuleiro("jogador");
                        alternarTransparenciaTabuleiro("inimigo");
                        podeJogar = true;
                        // verificarTerminoDeJogo()
                    }
                });
            });
        }
    });
}
async function JogadaApi() {
    let tabuleiroJogadorCompleto = tabuleiroHTMLparaJSON(".tabuleiro-jogador");
    let alvo = await chamarApi(tabuleiroJogadorRevelado, tabuleiroJogadorCompleto);
    if (alvo.acerto == undefined) {
        return { acerto: undefined };
    }
    if (alvo.acerto == Acerto.Errou) {
        return { acerto: Acerto.Errou };
    }
    if (alvo.acerto == Acerto.Acertou) {
        return { acerto: Acerto.Acertou };
    }
    else {
        return { acerto: Acerto.Errou };
    }
}
/**
 * Função utilitária para ser utilizada no algoritmo de fallback, que executa de forma instantânea.
 */
export function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function jogadaFallback(matrizJogadorRevelado, matrizJogadorCompleta) {
    await wait(2000);
    if (verificarTerminoDeJogo() == true) {
        return { acerto: Acerto.Errou };
    }
    let posFall = escolherJogadaFallback(matrizJogadorRevelado);
    if (posFall != undefined) {
        let posicaoAtacada = matrizJogadorCompleta[posFall.linha][posFall.coluna];
        if (posicaoAtacada === 2) {
            // Altera a posição nas duas matrizes pra marcar que um navio foi parcialmente atingido
            matrizJogadorRevelado[posFall.linha][posFall.coluna] = 3;
            matrizJogadorCompleta[posFall.linha][posFall.coluna] = 3;
            //Som de tiro Acertado
            audio.playHitShot();
            statusAlerta(`[ ! ] IMPACTO RECEBIDO! O Piloto Automático acertou um navio em (${posFall.linha}, ${posFall.coluna}) [ ! ]`);
            // Mostra a alteração do tabuleiro na página para o usuário ver
            tabuleiroJSONparaHTML(matrizJogadorCompleta, ".tabuleiro-jogador");
            return { acerto: Acerto.Acertou };
        }
        else if (posicaoAtacada === 0) {
            // Altera a posição nas duas matrizes pra marcar que a água foi atingida
            matrizJogadorRevelado[posFall.linha][posFall.coluna] = 1;
            matrizJogadorCompleta[posFall.linha][posFall.coluna] = 1;
            //Som de tiro Acertado
            audio.playMissShot();
            statusAlerta(`[~] O Piloto Automático errou o alvo em (${posFall.linha}, ${posFall.coluna})!... Nenhum dano registrado. [~]`);
            // Mostra a alteração do tabuleiro na página para o usuário ver
            tabuleiroJSONparaHTML(matrizJogadorCompleta, ".tabuleiro-jogador");
            return { acerto: Acerto.Errou };
        }
    }
    else {
        return { acerto: undefined };
    }
    return { acerto: undefined };
}
function verificarNavioAcertadoIa(filho) {
    let linhaFilho = filho.dataset.linha;
    let colunaFilho = filho.dataset.coluna;
    if (linhaFilho != undefined && colunaFilho != undefined) {
        let posLinha = Number.parseInt(linhaFilho);
        let posColuna = Number.parseInt(colunaFilho);
        // Se o usuário acertou um navio do tabuleiro inimigo
        if (tabuleiroInimigoCompleto[posLinha][posColuna] == 2) {
            tabuleiroInimigoCompleto[posLinha][posColuna] = 3;
            tabuleiroInimigoRevelado[posLinha][posColuna] = 3;
            //Som de tiro Acertado
            audio.playHitShot();
            statusMensagem(`[+] IMPACTO CONFIRMADO! Uma embarcação inimiga foi atingida em(${posLinha}, ${posColuna}). [+]`);
            tabuleiroJSONparaHTML(tabuleiroInimigoRevelado, ".tabuleiro-inimigo");
            return true;
        }
        // Se o usuário errou o navio, ele não joga na próxima vez
        else if (tabuleiroInimigoCompleto[posLinha][posColuna] == 0) {
            tabuleiroInimigoCompleto[posLinha][posColuna] = 1;
            tabuleiroInimigoRevelado[posLinha][posColuna] = 1;
            //Som de tiro Errado
            audio.playMissShot();
            statusMensagem(`[~] ÁGUA! O projétil caiu no mar. Nada atingido em (${posLinha}, ${posColuna}). [~]`);
            tabuleiroJSONparaHTML(tabuleiroInimigoRevelado, ".tabuleiro-inimigo");
            return false;
        }
        // Se o usuário clicou numa posição repetida, apenas deixa ele jogar novamente
        else {
            return true;
        }
    }
    return false;
}
export function posicionaCampoIA(campoIA, totalNaviosIA) {
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
                if (!cabe)
                    continue;
                // Posiciona na matriz
                for (let i = 0; i < navio.getTamanho; i++) {
                    campoIA[linha][coluna + i] = 2;
                }
            }
            else { // VERTICAL
                if (linha + navio.getTamanho > TAMANHO_MATRIZ) {
                    continue;
                }
                for (let i = 0; i < navio.getTamanho; i++) {
                    if (campoIA[linha + i][coluna] === 2) {
                        cabe = false;
                        break;
                    }
                }
                if (!cabe)
                    continue;
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
function verificarTerminoDeJogo() {
    let tabuleiroJogador = document.querySelector('.tabuleiro-inimigo');
    if (tabuleiroJogador?.classList.contains("encerrado")) {
        return true;
    }
    else {
        return false;
    }
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
