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
            "Sua chave API possui um formato válido. Tentaremos nos conectar ao Gemini.";
        infoInput.style.color = "#40ff40";
    }
    else if (quantidadeInvalidas === 0 && quantidadeValidas > 1) {
        infoInput.textContent =
            "Todas as chaves API possuem um formato válido. Tentaremos nos conectar ao Gemini.";
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

/**
 * Funções para exibir a tela de Vitória, Derrota ou Empate no fim do jogo
 */

//efeito de vitória na tela
function declararVitoria() {
  const victoryScreen = document.getElementById('victory-screen');
  victoryScreen.classList.remove('hidden');

  confetti({
    particleCount: 150,
    spread: 80,
    origin: { y: 0.6 }
  });

  let duration = 3 * 1000;
  let end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 } 
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 } 
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());

  setTimeout(() => {
    victoryScreen.classList.add('hidden');
  }, 3500);
}

//efeito de derrota na tela
function declararDerrota() {
  const defeatScreen = document.getElementById('defeat-screen');
  defeatScreen.classList.remove('hidden');

  
  let duration = 3 * 1000;
  let end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 90, 
      spread: 30,
      colors: ['#ffffff',  '#e0e0e0',  '#aaaaaa',  '#ffffff'],
      scalar: 1.2, 
      gravity: 1.5, 
      drift: 0,
      origin: { x: Math.random(), y: 0 } 
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());

  setTimeout(() => {
    defeatScreen.classList.add('hidden');
  }, 3000);
}

function declararEmpate() {
  const drawScreen = document.getElementById('draw-screen');
  drawScreen.classList.remove('hidden');

  setTimeout(() => {
    drawScreen.classList.add('hidden');
  }, 3000);
}

/**
 * Funções para desativar animações usando os botões da tela de jogo
 */

function pausaReproduzGifs(){
    if(gifAtivado === true){
        btnGifStop.innerHTML = `<span class="material-symbols-outlined" style="color: #e74c3c;">gif_box</span>`;
        gifAtivado = false;
        jogo.classList.toggle("gradiente",false);
        pausarGifs();
    }else{
        btnGifStop.innerHTML = `<span class="material-symbols-outlined" style="color: #2ecc71;">gif_box</span>`;
        gifAtivado = true;
        jogo.classList.toggle("gradiente",true);
        reproduzirGifs();
    }
}
