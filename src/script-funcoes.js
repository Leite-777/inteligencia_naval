/**
 * Adiciona a funcionalidade de colar uma chave API ao pressionar o botão "Colar Chave API"
 * 
 * Faz a validação das chaves presentes no campo, e avisa ao usuário se são válidas ou inválidas.
 */
const botaoColar = document.querySelector(".botao-colar");
const textarea = document.getElementById("api-key");
const infoInput = document.querySelector(".info-input");

botaoColar.addEventListener("click", colarChaveApi);
textarea.addEventListener("input", validarCampoApi);

async function colarChaveApi() {
    try {
        const texto = await navigator.clipboard.readText();

        // Divide o conteúdo em linhas, caso o usuário tenha copiado várias chaves
        const chaves = texto
            .split(/\r?\n/)
            .map(chave => chave.trim())
            .filter(chave => chave.length > 0);

        if (chaves.length === 0)
            return;

        // Adiciona cada chave em uma nova linha
        if (textarea.value.trim() !== "") {
            textarea.value += "\n";
        }

        textarea.value += chaves.join("\n");

        // Valida todas as chaves presentes no textarea, e avisa se são válidas ou inválidas
        validarCampoApi();

        textarea.focus();

    } catch (erro) {
        infoInput.textContent =
            "Não foi possível acessar a área de transferência.";
        infoInput.style.color = "#ff4040";

        console.error(erro);
    }
}

function chaveApiPadraoValida(chave) {
    // Chaves antigas (AIza)
    return /^AIza[a-zA-Z0-9_-]{35}$/.test(chave.trim());
}

function chaveApiAuthValida(chave) {
    // Novas chaves de autorização (AQ.)
    return /^AQ\.[A-Za-z0-9._-]{20,}$/.test(chave.trim());
}

function chaveApiValida(chave) {
    return (
        chaveApiPadraoValida(chave) ||
        chaveApiAuthValida(chave)
    );
}

function validarCampoApi() {
    const todasAsChaves = textarea.value
        .split(/\r?\n/)
        .map(chave => chave.trim())
        .filter(chave => chave.length > 0);

    const quantidadeValidas = todasAsChaves.filter(chaveApiValida).length;
    const quantidadeInvalidas = todasAsChaves.length - quantidadeValidas;

    if (todasAsChaves.length === 0) {
        infoInput.textContent =
            "Siga os passos da Guia do Usuário acima, para criar e copiar sua Chave API.";
        infoInput.style.color = "";
        return;
    }

    if (quantidadeInvalidas === 0 && quantidadeValidas === 1) {
        infoInput.textContent =
            "Sua chave API possui um formato válido.";
        infoInput.style.color = "#40ff40";
    }
    else if (quantidadeInvalidas === 0 && quantidadeValidas > 1) {
        infoInput.textContent =
            "Todas as chaves API possuem um formato válido.";
        infoInput.style.color = "#40ff40";
    }
    else if (quantidadeValidas === 0) {
        infoInput.textContent =
            "Sua chave API não possui o formato da API do Gemini. O Piloto Automático poderá jogar no lugar do Gemini.";
        infoInput.style.color = "#ff4040";
    }
    else {
        infoInput.textContent =
            `${quantidadeValidas} chave(s) válida(s) e ${quantidadeInvalidas} chave(s) inválida(s).`;
        infoInput.style.color = "#ffd040";
    }

    // Salva o conteúdo do input para continuar na pagina após ser recarregado.
    sessionStorage.setItem("apiKey", textarea.value);
}