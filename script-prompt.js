import { tabuleiroHTMLparaJSON } from "./script-tabuleiro.js";
import { escolherJogadaFallback } from "./script-fallback.js";
import { inicializaOsNaviosIA } from "./script-jogador.js";
let chaveHtml = document.getElementById('api-key');
//para não travar a chava api
//matriz vazia todos os elemntos com a posição 0 para representar o estado inicial do jogo essa matriz será enviada para a ia
//e a medida que ela da a resposta compararemos com a matriz do jogador para ver se a ia acertou ou não o navio e completaremos
//a posição de acordo com a matriz do jogador de modo que essa matriz se torne uma versão espelhada da do jogador
let matrizParaOPrompt = [
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
// Matriz com 7 navios inseridos
let campoIA = [
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 0, 0, 2, 2, 2, 0, 0, 0, 0],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 2, 2, 0, 0, 0, 0, 0, 2],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [0, 0, 2, 2, 2, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 2, 2, 2]
];
var Acerto;
(function (Acerto) {
    Acerto[Acerto["Errou"] = 40] = "Errou";
    Acerto[Acerto["Acertou"] = 50] = "Acertou";
})(Acerto || (Acerto = {}));
let totalNaviosIA = inicializaOsNaviosIA();
//                              Função principal para a Chamada de API, com o retorno dos dados
async function chamadaApi(prompt) {
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
//                              Funções de DEBUG do tabuleiro no console do navegador
// Símbolos visuais para o debug ficar fácil de ler no console
const SIMBOLOS_TABULEIRO = {
    0: "▪️", // Posição desconhecida
    1: "🌊", // Água
    3: "💥", // Navio atingido
    4: "💀" // Navio afundado completamente
};
/**
 * Função de debug para desenhar a grade inteira no console
 * e destacar onde a IA acabou de atacar.
 */
function depurarAtaqueNoConsole(matriz, linhaAtaque, colunaAtaque, justificativa) {
    console.log("%c\n=== TURNO DO GEMINI ===", "color: #1a73e8; font-weight: bold; font-size: 14px;");
    console.log(`🧠 Raciocínio da IA: "${justificativa}"`);
    console.log(`🎯 Coordenada do Ataque: Linha [${linhaAtaque}] | Coluna [${colunaAtaque}]\n`);
    // Cabeçalho das colunas (0 1 2 3...)
    let cabecalho = "    ";
    for (let c = 0; c < matriz[0].length; c++) {
        cabecalho += ` ${c} `;
    }
    console.log(cabecalho);
    // Desenha o tabuleiro linha por linha
    for (let l = 0; l < matriz.length; l++) {
        let indicadorLinha = l < 10 ? ` ${l} |` : `${l} |`;
        let linhaTexto = indicadorLinha;
        for (let c = 0; c < matriz[l].length; c++) {
            // Se esta posição for exatamente onde o Gemini atacou, destaca com uma mira
            if (l === linhaAtaque && c === colunaAtaque) {
                linhaTexto += " 🎯 ";
            }
            else {
                // Caso contrário, pega o símbolo correspondente ao número
                let statusAtual = matriz[l][c];
                let simbolo = SIMBOLOS_TABULEIRO[statusAtual] || "❓";
                linhaTexto += ` ${simbolo} `;
            }
        }
        console.log(linhaTexto);
    }
    console.log("\n========================\n");
}
//                              Função da passagem dos tabuleiros para, Chamada de API, junto com o prompt
async function chamarApi(matrizIa, matrizJogador) {
    // Pega o valor exato no momento que a função é ativada
    let apiKey = chaveHtml.value;
    if (!apiKey) {
        console.error("A chave da API não foi informada.");
        return { acerto: undefined };
    }
    // Formata a matriz para que ela tenha quebras de linha, mantendo o aspecto de "grade" para a IA visualizar melhor
    let matrizFormatada = matrizIa.map(linha => `[${linha.join(', ')}]`).join('\n');
    let prompt = `
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
    //console.log(respostaFunc);
    // Debug temporário da resposta da chamada API, contendo:
    // A matriz completa do oponente exibida no console, a posição atacada, e o raciocínio da IA
    // Um alerta na tela mostrando a posição que o Gemini acertou
    // Atualização da matriz com a posição que o Gemini acertou (matrizIa[linhaAtaque][colunaAtaque] = 1;)
    // Se der erro na chamada, mostra no console o código do erro que foi retornado
    if (respostaFunc.status) {
        const sucesso = respostaFunc;
        const coordenadasIa = sucesso.dados;
        const linhaAtaque = sucesso.dados.linha;
        const colunaAtaque = sucesso.dados.coluna;
        // Dispara o alerta tradicional do navegador
        // alert(`Gemini atacou a posição:\nLinha: ${coordenadasIa.linha}\nColuna: ${coordenadasIa.coluna}\n\nMotivo: ${coordenadasIa.debug}`);
        // Desenha o tabuleiro com os emojis no console
        depurarAtaqueNoConsole(matrizIa, coordenadasIa.linha, coordenadasIa.coluna, coordenadasIa.debug);
        // Exibe um alerta na tela mostrando a posição que o Gemini atacou, e atualiza da matriz
        // Verifica se a IA retornou valores fora do tabuleiro (ex: 10 ou -1)
        if (linhaAtaque >= 0 && linhaAtaque < 10 && colunaAtaque >= 0 && colunaAtaque < 10) {
            // Verifica o que tinha na matriz do jogador naquela coordenada
            let matrizCompletaJogador = matrizJogador[linhaAtaque][colunaAtaque];
            if (matrizCompletaJogador === 2) {
                // Acertou um Navio! Atualiza a matriz do prompt com 3
                matrizIa[linhaAtaque][colunaAtaque] = 3;
                alert(`💥 TIRO CERTEIRO! O Gemini acertou um navio em (${linhaAtaque}, ${colunaAtaque})`);
                return { acerto: Acerto.Acertou };
            }
            else if (matrizIa[linhaAtaque][colunaAtaque] === 0) {
                // Água! Atualiza a matriz do prompt com 1
                matrizIa[linhaAtaque][colunaAtaque] = 1;
                alert(`🌊 Água... O Gemini errou em (${linhaAtaque}, ${colunaAtaque})`);
                return { acerto: Acerto.Errou };
            }
            else {
                alert(`⚠️ O Gemini atacou uma posição repetida (${linhaAtaque}, ${colunaAtaque})!`);
                return { acerto: Acerto.Errou };
            }
        }
        else {
            alert(`🚨 Erro: A IA gerou coordenadas inválidas fora do tabuleiro: (${linhaAtaque}, ${colunaAtaque})`);
        }
    }
    else {
        const erro = respostaFunc;
        console.error(`Erro na chamada da API [Código ${erro.CodigoErro}]: ${erro.mensagemErro}`);
        alert(`Erro ao chamar a API: ${erro.mensagemErro}`);
        return jogadaFallback(matrizIa, matrizJogador);
        //return {acerto :undefined};
    }
    return { acerto: undefined };
}
//      Configurando o botão Iniciar Jogo temporariamente para iniciar a chamada da API
const botaoPosicionarNavios = document.querySelector('.botao-posicionar-navios');
// Garante que o botão realmente existe na página antes de adicionar o evento
if (botaoPosicionarNavios) {
    botaoPosicionarNavios.addEventListener('click', async () => {
        // Desativa o botão temporariamente para o usuário não clicar várias vezes enquanto a API responde
        botaoPosicionarNavios.disabled = true;
        console.log("Botão pressionado! Iniciando turno da IA...");
        // Dispara a função principal que criamos
        //let respostaChamadaApi = await chamarApi(matrizParaOPrompt, matrizTeste);
        // Reativa o botão após o término da jogada
        botaoPosicionarNavios.disabled = false;
        campoIA = posicionaCampoIA(campoIA, totalNaviosIA);
        const campoIa = document.querySelector('.tabuleiro-inimigo');
        if (campoIa) {
            Array.from(campoIa.children).forEach((filho) => {
                filho.addEventListener("click", async () => {
                    //console.log((filho as HTMLElement).dataset.linha);
                    // console.log(totalNaviosIA.length);
                    // console.log(totalNaviosIA[0]?.verificaDirecao);
                    // console.log(totalNaviosIA[0]?.getTamanho);
                    console.log(campoIA);
                    if (verficarNavioAcertadoIa(filho)) {
                        alert("Navio da Ia acertado");
                    }
                    else {
                        alert("Agua");
                        let parada = 0;
                        do {
                            let status = await JogadaApi();
                            if (status.acerto != Acerto.Acertou) {
                                parada = 0;
                            }
                            else {
                                parada = 1;
                            }
                        } while (parada != 0);
                    }
                });
            });
            console.log(campoIa.childNodes);
        }
    });
}
else {
    console.error("Botão '.botao-iniciar-jogo' não foi encontrado no HTML. Verifique a classe.");
}
async function JogadaApi() {
    let tabuleiroJogador = tabuleiroHTMLparaJSON(".tabuleiro-jogador");
    let alvo = await chamarApi(matrizParaOPrompt, tabuleiroJogador);
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
async function jogadaFallback(matrizIa, matrizJogador) {
    let posFall = escolherJogadaFallback(matrizIa);
    if (posFall != undefined) {
        let posmatrizJogador = matrizJogador[posFall.linha][posFall.coluna];
        depurarAtaqueNoConsole(matrizIa, posFall.linha, posFall.coluna, "Fallback");
        console.log(matrizJogador[posFall.linha][posFall.coluna]);
        if (posmatrizJogador === 2) {
            // Acertou um Navio! Atualiza a matriz do prompt com 3
            matrizIa[posFall.linha][posFall.coluna] = 3;
            alert(`💥 TIRO CERTEIRO! O Fallback acertou um navio em (${posFall.linha}, ${posFall.coluna})`);
            return { acerto: Acerto.Acertou };
        }
        else if (matrizIa[posFall.linha][posFall.coluna] === 0) {
            // Água! Atualiza a matriz do prompt com 1
            matrizIa[posFall.linha][posFall.coluna] = 1;
            alert(`🌊 Água... O Fallback errou em (${posFall.linha}, ${posFall.coluna})`);
            return { acerto: Acerto.Errou };
        }
    }
    else {
        return { acerto: undefined };
    }
    return { acerto: undefined };
}
function verficarNavioAcertadoIa(filho) {
    let linhaFilho = filho.dataset.linha;
    let colunaFilho = filho.dataset.coluna;
    if (linhaFilho != undefined && colunaFilho != undefined) {
        let posLinha = Number.parseInt(linhaFilho);
        let posColuna = Number.parseInt(colunaFilho);
        if (campoIA[posLinha][posColuna] == 2) {
            return true;
        }
        else {
            return false;
        }
    }
    return false;
}
export function posicionaCampoIA(campoIA, totalNaviosIA) {
    const horizontal = "1";
    for (let iterador = 0; iterador < totalNaviosIA.length; iterador++) {
        let posAleatoria = Math.floor(Math.random() * 10);
        if (totalNaviosIA[iterador].verificaDirecao == horizontal) {
            for (let i = 0; i < totalNaviosIA[iterador].getTamanho; i++) {
                if (campoIA[posAleatoria][i] == 2) {
                }
                else {
                    campoIA[posAleatoria][i] = 2;
                }
            }
        }
        else {
            for (let i = 0; i < totalNaviosIA[iterador].getTamanho; i++) {
                if (campoIA[i][posAleatoria] == 2) {
                }
                else {
                    campoIA[i][posAleatoria] = 2;
                }
            }
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
