export function tabuleiroHTMLparaJSON(seletorTabuleiro : string): number[][];

export function tabuleiroJSONparaHTML(matriz: number[][], seletorTabuleiro : string): number[][];

export function verificarSeNaviosForamAfundados(tipoTabuleiro:number) : boolean;

export function alternarTransparenciaTabuleiro(tipo: "jogador" | "inimigo"): void;

export function alternarTransparencia(seletorElemento: string): void;

export function desativarTabuleiros(): void;

export function statusMensagem(mensagem : string): null;

export function statusAlerta(mensagem : string): null;

export function statusAnuncio(mensagem : string): null;