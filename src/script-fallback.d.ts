interface posFallback{
    linha :number,
    coluna :number
}
export function escolherJogadaFallback(tabuleiro: number[][]) : posFallback | null;