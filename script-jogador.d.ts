export class Navios{

    constructor(tamanho:number ,direcaoNavio:string);
    get verificaDirecao(): number;
    get getVerificaNavioAfundou(): boolean;
    get getTamanho() : number;
    set atribuiPosicaoAtual(colunaXLinha:any);
    set marcarComoPosicionado(valor: boolean);
    disparo(colunaXLinha : any) :boolean;
}

export function inicializaOsNaviosIA() : Navios[];

export function verificarSeNaviosForamAfundados(tipoTabuleiro:number) : null;

export function geraNumeroAleatorio(min:number, max:number):number;