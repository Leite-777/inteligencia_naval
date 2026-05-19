let chaveHtml = document.getElementById('api-key') as HTMLInputElement;
let chaveApi = chaveHtml.value;

const apiKey = chaveApi; //para não travar a chava api

//matriz vazia todos os elemntos com a posição 0 para representar o estado inicial do jogo essa matriz será enviada para a ia
//e a medida que ela da a resposta compararemos com a matriz do jogador para ver se a ia acertou ou não o navio e completaremos
//a posição de acordo com a matriz do jogador de modo que essa matriz se torne uma versão espelhada da do jogador
let matrizParaOPrompt : number[][] = [
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

// Matriz com 7 navios inseridos
let matrizTeste: number[][] = [
    [2,0,0,0,0,0,0,0,0,0],
    [2,0,0,2,2,2,0,0,0,0],
    [2,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,2,0,0,0],
    [0,0,0,0,0,0,2,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,2,2,2,0,0,0,0,0,2],
    [0,0,0,0,0,0,0,0,0,2],
    [0,0,2,2,2,0,0,0,0,0],
    [0,0,0,0,0,0,0,2,2,2]
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

//tipo de retorno para a função chamada api ja que esse tipo pode ser Sucesso ou Erro
type resultadoApi = Erro | Sucesso;

//                              Função principal para a Chamada de API, com o retorno dos dados

async function chamadaApi(prompt : string): Promise<resultadoApi>{
    let resposta = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent", {
    method: "POST",
    headers: {
    "Content-Type": "application/json",
    "x-goog-api-key": apiKey
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

//                              Funções de DEBUG do tabuleiro no console do navegador

// Símbolos visuais para o debug ficar fácil de ler no console
const SIMBOLOS_TABULEIRO: { [key: number]: string } = {
    0: "▪️", // Posição desconhecida
    1: "🌊", // Água
    3: "💥", // Navio atingido
    4: "💀"  // Navio afundado completamente
};

/**
 * Função de debug para desenhar a grade inteira no console 
 * e destacar onde a IA acabou de atacar.
 */
function depurarAtaqueNoConsole(matriz: number[][], linhaAtaque: number, colunaAtaque: number, justificativa: string) {
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
            } else {
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

async function chamarApi(matrizIa: number[][], matrizJogador: number[][]) {
    // Pega o valor exato no momento que a função é ativada
    let apiKey = chaveHtml.value;

    if (!apiKey) {
        console.error("A chave da API não foi informada.");
        return;
    }

    // Formata a matriz para que ela tenha quebras de linha, mantendo o aspecto de "grade" para a IA visualizar melhor
    let matrizFormatada = matrizIa.map(linha => `[${linha.join(', ')}]`).join('\n');

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
}`;

    let respostaFunc = await chamadaApi(prompt);
    //console.log(respostaFunc);

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
        
        // Dispara o alerta tradicional do navegador
        // alert(`Gemini atacou a posição:\nLinha: ${coordenadasIa.linha}\nColuna: ${coordenadasIa.coluna}\n\nMotivo: ${coordenadasIa.debug}`);

        // Desenha o tabuleiro com os emojis no console
        depurarAtaqueNoConsole(
            matrizIa, 
            coordenadasIa.linha, 
            coordenadasIa.coluna, 
            coordenadasIa.debug
        );

        // Exibe um alerta na tela mostrando a posição que o Gemini atacou, e atualiza da matriz
        // Verifica se a IA retornou valores fora do tabuleiro (ex: 10 ou -1)
        if (linhaAtaque >= 0 && linhaAtaque < 10 && colunaAtaque >= 0 && colunaAtaque < 10) {
            
            // Verifica o que tinha na matriz do jogador naquela coordenada
            let matrizCompletaJogador = matrizJogador[linhaAtaque][colunaAtaque];

            if (matrizCompletaJogador === 2) {
                // Acertou um Navio! Atualiza a matriz do prompt com 3
                matrizIa[linhaAtaque][colunaAtaque] = 3;
                alert(`💥 TIRO CERTEIRO! O Gemini acertou um navio em (${linhaAtaque}, ${colunaAtaque})`);
            } else if (matrizIa[linhaAtaque][colunaAtaque] === 0) {
                // Água! Atualiza a matriz do prompt com 1
                matrizIa[linhaAtaque][colunaAtaque] = 1;
                alert(`🌊 Água... O Gemini errou em (${linhaAtaque}, ${colunaAtaque})`);
            } else {
                alert(`⚠️ O Gemini atacou uma posição repetida (${linhaAtaque}, ${colunaAtaque})!`);
            }

        } else {
            alert(`🚨 Erro: A IA gerou coordenadas inválidas fora do tabuleiro: (${linhaAtaque}, ${colunaAtaque})`);
        }

    } else {
        const erro = respostaFunc as Erro;
        
        console.error(`Erro na chamada da API [Código ${erro.CodigoErro}]: ${erro.mensagemErro}`);
        alert(`Erro ao chamar a API: ${erro.mensagemErro}`);
    }
}

//      Configurando o botão Iniciar Jogo temporariamente para iniciar a chamada da API

const botaoIniciarJogo = document.querySelector<HTMLButtonElement>('.botao-iniciar-jogo');

// Garante que o botão realmente existe na página antes de adicionar o evento
if (botaoIniciarJogo) {
    botaoIniciarJogo.addEventListener('click', async () => {
        // Desativa o botão temporariamente para o usuário não clicar várias vezes enquanto a API responde
        botaoIniciarJogo.disabled = true;
        botaoIniciarJogo.innerText = "Gemini pensando...";

        console.log("Botão pressionado! Iniciando turno da IA...");
        
        // Dispara a função principal que criamos
        await chamarApi(matrizParaOPrompt, matrizTeste);

        // Reativa o botão após o término da jogada
        botaoIniciarJogo.disabled = false;
        botaoIniciarJogo.innerText = "Iniciar Jogo!";
    });
} else {
    console.error("Botão '.botao-iniciar-jogo' não foi encontrado no HTML. Verifique a classe.");
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
