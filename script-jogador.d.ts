export class Navios{

    constructor(tamanho:number ,direcaoNavio:string);
    get verificaDirecao(): string;
    get getVerificaNavioAfundou(): boolean;
    get getTamanho() : number;
    set atribuiPosicaoAtual(colunaXLinha:any);
    disparo(colunaXLinha : any) :boolean;
}

export function inicializaOsNaviosIA() : Navios[];

export function verificarSeNaviosForamAfundados() : null;

export function geraNumeroAleatorio(min:number, max:number):number;