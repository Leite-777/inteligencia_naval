
// funcao que valida chave
function validaEstruturaChaveAPI(apiKey) {
    // Regex para o padrao da chave do Google API: Começa com 'AIza' e
    //  tem mais 35 caracteres letras, numeros, hifens ou underscores
    const regexChave = /^AIza[0-9A-Za-z\-_]{35}$/;
    
    // verifica se a chave existe dentro das especificacoes e retorna true or flase
    return regexChave.test(apiKey);
}
