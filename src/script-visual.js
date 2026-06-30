// Para os botões de conteúdo colapsáveis
const botoes = document.querySelectorAll(".colapsavel-expandir");
const conteudos = document.querySelectorAll(".colapsavel-conteudo");

// Função para ocultar/exibir conteúdos colapsáveis
botoes.forEach(botao => {
    botao.addEventListener("click", () => {
        const conteudo = botao.nextElementSibling;

        const displayAtual = getComputedStyle(conteudo).display;

        if (displayAtual === "none") {
            conteudo.style.display = "block";
        } else {
            conteudo.style.display = "none";
        }
    });
});

// Inicialmente deixa os conteúdos colapsáveis ocultos
conteudos.forEach(cont => {
    cont.style.display = "none";
})

// Para os botões de Modal
const modais = document.querySelectorAll(".modal");

modais.forEach(modal => {
    // Busca os elementos APENAS dentro DESTE bloco modal específico
    const botaoAbrir = modal.querySelector(".modal-expandir");
    const container = modal.querySelector(".modal-container");
    const botaoFechar = modal.querySelector(".modal-fechar");

    // Abre o modal ao clicar no botão correspondente
    botaoAbrir.addEventListener("click", () => {
        container.classList.add("ativo");
    });

    // Fecha o modal ao clicar no botão de fechar (X) correspondente (se existir)
    if (botaoFechar) {
        botaoFechar.addEventListener("click", () => {
            container.classList.remove("ativo");
        });
    }

    // Fecha o modal se o usuário clicar no fundo escuro deste container
    container.addEventListener("click", (event) => {
        if (event.target === container) {
            container.classList.remove("ativo");
        }
    });
});

// Funções para utilização de gifs

/**
 *  Função responsável por adicionar o gif de ondas em uma celula. (gifs default)
 * 
 * @param celula referente ao campo a receber o gif de ondas.
 */
function addGifOndas(celula){
    const gifOnda = document.createElement('img');
    
    gifOnda.classList.add('gif-animado');

    gifOnda.dataset.gif ='assets/gifs/ondas.gif';
    gifOnda.dataset.img ='assets/img/ondas.png';

    gifOnda.style.width = '40px';
    gifOnda.style.height = '40px';
    gifOnda.style.borderRadius = '5px';
    gifOnda.src = gifOnda.dataset.gif;
    gifOnda.alt = 'Água';
    celula.appendChild(gifOnda);
}

/**
 *  Função responsável por adicionar o gif de nuvens em uma celula. (gifs default)
 * 
 * @param celula referente ao campo a receber o gif de nuvens.
 */
function addGifNuvens(celula){
    const gifNuvens = document.createElement('img');

    gifNuvens.classList.add('gif-animado');

    gifNuvens.dataset.gif ='assets/gifs/nuvens.gif';
    gifNuvens.dataset.img ='assets/img/nuvens.png';

    gifNuvens.style.width = '40px';
    gifNuvens.style.height = '40px';
    gifNuvens.style.borderRadius = '5px';
    gifNuvens.src = gifNuvens.dataset.gif;
    gifNuvens.alt = 'Desconhecido';
    celula.appendChild(gifNuvens);
}

/**
 *  Função responsável por adicionar o gif de água atingida em uma celula.
 * 
 * @param celula referente ao campo a receber o gif de água atingida.
 */
function addGifAguaAtingida(celula){
    const gifAguaAtingida = document.createElement('img');
    gifAguaAtingida.style.width = '40px';
    gifAguaAtingida.style.height = '40px';
    gifAguaAtingida.style.borderRadius = '5px';
    gifAguaAtingida.src = 'assets/gifs/aguaAtingida.gif';
    gifAguaAtingida.alt = 'Água';
    celula.appendChild(gifAguaAtingida);
}

/**
 *  Função responsável por adicionar o gif de fogo em uma célula de navio parcialmente atingido.
 * 
 * @param celula referente ao campo a receber o gif de fogo.
 */
function addGifFogo(celula){
    const gifFogo = document.createElement('img');
    
    gifFogo.classList.add('gif-animado');

    gifFogo.dataset.gif ='assets/gifs/fogo.gif';
    gifFogo.dataset.img ='assets/img/fogo.png';

    gifFogo.style.width = '40px';
    gifFogo.style.height = '40px';
    gifFogo.style.borderRadius = '5px';
    gifFogo.src = gifFogo.dataset.gif;
    gifFogo.alt = 'Atingido';
    // Faz o gif aparecer sobre o navio
    gifFogo.style.zIndex = 100;
    celula.style.boxShadow = '0 0 10px 5px rgba(255, 69, 0, 0.7)'; // Adiciona um brilho vermelho ao redor do gif de fogo
    celula.appendChild(gifFogo);
}

/**
 *  Função responsável por adicionar o gif de caveiras em uma célula de navio completamente afundado.
 * 
 * @param celula referente ao campo a receber o gif de fogo.
 */
function addGifCaveira(celula){
    const gifCaveira = document.createElement('img');
    
    gifCaveira.classList.add('gif-animado');

    gifCaveira.dataset.gif ='assets/gifs/caveira.gif';
    gifCaveira.dataset.img ='assets/img/caveira.png';

    gifCaveira.style.width = '40px';
    gifCaveira.style.height = '40px';
    gifCaveira.style.borderRadius = '5px';
    gifCaveira.src = gifCaveira.dataset.gif;
    gifCaveira.alt = 'Afundado';
    // Faz o gif aparecer sobre o navio
    gifCaveira.style.zIndex = 100;
    celula.style.boxShadow = ""; // Remove qualquer brilho anterior
    gifCaveira.style.boxShadow = '0 0 10px 5px rgba(0, 0, 0, 0.7)'; // Adiciona um brilho escuro ao redor do gif de caveira
    celula.appendChild(gifCaveira);
}

/**
 *  Função responsável por adicionar o gif de aviso em um lugar onde havia um navio não afundado, para ser exibido no fim do jogo
 * 
 * @param celula referente ao campo a receber o gif de aviso.
 */
function addGifAviso(celula){
    const gifAviso = document.createElement('img');
    
    gifAviso.classList.add('gif-animado');

    gifAviso.dataset.gif ='assets/gifs/aviso-navio.gif';
    gifAviso.dataset.img ='assets/img/aviso-navio.png';

    gifAviso.style.width = '40px';
    gifAviso.style.height = '40px';
    gifAviso.style.borderRadius = '5px';
    gifAviso.src = gifAviso.dataset.gif;
    gifAviso.alt = 'Navio';
    // Faz o gif aparecer sobre o navio
    gifAviso.style.zIndex = 100;
    celula.style.boxShadow = ""; // Remove qualquer brilho anterior
    celula.appendChild(gifAviso);
}

// /**
//  *  Função responsável por adicionar um gif específico ao campo de acordo com o status da celula.
//  *  Status disponíveis: 
//  *      0: Desconhecido - Nuvens
//  *      1: Água - Ondas
//  *      2: Navio - (sem alteração)
//  *      3: Navio atingido - Fogo
//  *      4: Navio afundado - Caveira
//  * 
//  * @param celula referente ao campo a receber o gif específico.
//  */
function estadoCampo(celula){
    switch(celula.dataset.status){
        case "0": // Desconhecido
            addGifNuvens(celula);
            break;
        case "1": // Água
            celula.style.backgroundColor = "#001320"
            addGifOndas(celula);
            break;
        case "2":
            celula.style.backgroundColor = "#003560";
            addGifOndas(celula);
            break;
        case "3": // Navio parcialmente atingido
            celula.style.backgroundColor = "#4d2727"
            addGifFogo(celula);
            break;
        case "4": // Navio completamente afundado
            celula.style.backgroundColor = "rgb(46, 19, 19)"
            addGifCaveira(celula);
            break;
        case "5": // Navio inimigo revelado ao fim da partida
            celula.style.backgroundColor = "#001320"
            addGifAviso(celula);
            break;
    }
}

/**
 * Percorre todas as posições do tabuleiro e atualiza visualmente os gifs de acordo com o dataset.status.
 * Essa função deve ser chamada sempre que o estado do tabuleiro for alterado durante as rodadas.
 * 
 * @param tabuleiro Elemento HTML do tabuleiro
 */
function atualizarGifTabuleiro(tabuleiro){

    // Percorre todas as células do tabuleiro
    const celulas = tabuleiro.querySelectorAll(".celula");

    celulas.forEach(celula => {

        // Remove gifs antigos antes de atualizar
        const temImagem = celula.querySelector("img");
        if(temImagem){ celula.removeChild(temImagem)}

        // Remove estilos antigos
        celula.style.backgroundColor = "#014177";

        // Status atual da célula
        const status = celula.dataset.status;

        switch(status){
            case "0":
                // No tabuleiro do jogador, todas as posições sem navios são reveladas com água
                if(tabuleiro.classList.contains("tabuleiro-jogador")){
                    addGifOndas(celula);
                }
                else{
                    addGifNuvens(celula);
                }
                break;
            default:
                estadoCampo(celula);
                break;
        }
    });
}


// Funções para pausa e reproduzir os gifs

function pausarGifs(){
    const gifs = document.querySelectorAll('.gif-animado');
    gifs.forEach(gif =>{
        gif.src = gif.dataset.img;
    });
}

function reproduzirGifs(){
    const gifs = document.querySelectorAll('.gif-animado');
    gifs.forEach(gif =>{
        gif.src = gif.dataset.gif;
    });
}

document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById("battle-canvas");
    const ctx = canvas.getContext("2d");

    const W = canvas.width;
    const H = canvas.height;

    const boats = [
        {
            x: 90,
            dir: 1,
            color: "#4a90e2",
            cooldown: 0
        },
        {
            x: W - 90,
            dir: -1,
            color: "#e24a4a",
            cooldown: 0
        }
    ];

    function desenhaBarco(boat) {
        const x = boat.x;
        const y = H / 2;

        ctx.save();

        ctx.translate(x, y);

        ctx.scale(boat.dir, 1);

        // casco
        ctx.fillStyle = "#444";

        ctx.beginPath();

        ctx.moveTo(-30, 5);
        ctx.lineTo(30, 5);
        ctx.lineTo(20, 18);
        ctx.lineTo(-20, 18);

        ctx.closePath();

        ctx.fill();

        // mastro
        ctx.strokeStyle = "#222";
        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.moveTo(0, 5);
        ctx.lineTo(0, -18);

        ctx.stroke();

        const flagWave = Math.sin(Date.now() / 200 + boat.x) * 2;

        ctx.fillStyle = boat.color;

        ctx.beginPath();

        ctx.moveTo(0, -18);
        ctx.lineTo(22, -12 + flagWave);
        ctx.lineTo(0, -6 + flagWave);

        ctx.closePath();

        ctx.fill();

        ctx.restore();
    }

    function desenhaOnda(boat) {

        ctx.strokeStyle = "#4aa3ff88";
        ctx.lineWidth = 2;

        ctx.beginPath();

        const baseY = H / 2 + 20;

        for (let i = 0; i < 60; i++) {

            const x =
                boat.x - 30 + i;

            const y =
                baseY +
                Math.sin(i / 5 + Date.now() / 200) * 2;

            if (i === 0) {

                ctx.moveTo(x, y);

            } else {

                ctx.lineTo(x, y);
            }
        }

        ctx.stroke();
    }

    function desenhaBolaCanhao(from) {

        const y = H / 2 + 5;

        ctx.fillStyle = "#ffeb3b";

        ctx.beginPath();

        ctx.arc(from.x, y, 3, 0, Math.PI * 2);

        ctx.fill();

        return {
            x: from.x + from.dir * 14,
            y,
            dir: from.dir
        };
    }

    let bullets = [];

    function animar() {

        ctx.clearRect(0, 0, W, H);

        bullets =
            bullets.filter(
                b => b.x > -20 && b.x < W + 20
            );

        boats.forEach((b, i) => {

            desenhaBarco(b);

            desenhaOnda(b);

            if (b.cooldown <= 0) {

                bullets.push(
                    desenhaBolaCanhao(b)
                );

                b.cooldown =
                    90 + Math.random() * 60;
            }

            b.cooldown--;
        });

        bullets.forEach(b => {

            b.x += b.dir * 4;

            ctx.fillStyle = "#ffeb3b";

            ctx.beginPath();

            ctx.arc(
                b.x,
                b.y,
                3,
                0,
                Math.PI * 2
            );

            ctx.fill();
        });

        requestAnimationFrame(animar);
    }

    animar();
});