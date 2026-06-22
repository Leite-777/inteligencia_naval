export function tabuleiroHTMLparaJSON(seletorTabuleiro : string): number[][];

export function tabuleiroJSONparaHTML(matriz: number[][], seletorTabuleiro : string): number[][];

export function atualizarTabuleiroReveladoJogador(matrizRevelado: number[][]): void;

export function verificarSeNaviosForamAfundados(tipoTabuleiro:number) : boolean;

export function alternarTransparenciaTabuleiro(tipo: "jogador" | "inimigo"): void;

export function alternarTransparencia(seletorElemento: string): void;

export function ocultarElemento(seletorElemento: string, estado: boolean): void;

export function desativarTabuleiros(): void;

export function verificarChaveAPI(): boolean;

export function preencherChaveAPI(valor: string): void;

export function statusMensagem(mensagem : string): null;

export function statusAlerta(mensagem : string): null;

export function statusAnuncio(mensagem : string): null;