let chaveHtml = document.getElementById('api-key') as HTMLInputElement;
let chaveApi = chaveHtml.value;

const apiKey = chaveApi;//para não travar a chava api


//formato do json
interface respostaApi{
    coluna :number, 
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

//função responsavel pela chamada da api
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

//função responsavel pelo prompt e tratar/avisar os erros da chamadaApi
async function chamarApi(){
    let matriz : number[][] = [
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
    let prompt : string = `
        Você está jogando batalha naval contra um oponente humano as regras são as seguintes:
        Você receberá uma matriz[10][10] onde:
            - Posicões demarcadas com 0 significa local desconhecido.
            - Posições com o numero 1 significa agua (não jogue nelas).
            - Posições com o numero 3 significa navio atingido (pode atacar em uma posição adjacente a essa).
            - Posições com o numero 4 signiifca navio afundado (não jogue nelas).
        
        Seu objetivo é afundar todos os navios do oponente.
        Matriz ${matriz}
        A saida deverá ser enviada em um json contendo :
        {
            linha : number,
            coluna : number,
            debug : string
        }
    `;

    //let prompt2 : string = "Quanto é 1 + 1 a saida deve ser em um json com os campos: {linha: number,coluna:number,debug : string} coloque o valor no campo linha e o pensamento no debug"
    let respostaFunc = await chamadaApi(prompt);
    console.log(respostaFunc);
}

chamarApi();


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