class ColapsavelAPI extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        const titulo = this.getAttribute("titulo") || "Abrir";

        shadow.innerHTML = `
            <style>
                /* --- Estilo de Base (Equivalente ao seu seletor *) --- */
                :host {
                    display: block;
                    width: 100%; /* Vindo de .colapsavel */
                    font-family: "Montserrat", sans-serif;
                    font-optical-sizing: auto;
                    font-weight: 400;
                    font-style: normal;
                }

                /* --- Botão Expansível (.colapsavel-expandir) --- */
                .colapsavel-expandir {
                    /* Junção de fontes e propriedades do bloco 1 */
                    font-family: "Montserrat", sans-serif;
                    font-size: 16px;
                    font-weight: bold;
                    color: white;
                    border: none;
                    cursor: pointer;

                    /* Efeitos de formato de balão do bloco 2 (que sobrescrevem o bloco 1) */
                    --b: 1em; 
                    --h: .7em; 
                    --c: #014177;

                    padding: 1em;
                    border-radius: 1.2em;
                    border-bottom-left-radius: 0;
                    clip-path: polygon(0 0,100% 0,100% 100%,
                        var(--b) 100%,
                        calc(-1*var(--h)) calc(100% + var(--h)),
                        0 calc(100% - var(--b)));
                    background: var(--c);
                    border-image: conic-gradient(var(--c) 0 0) 0 0 999 999/
                        0 0 calc(var(--h) + var(--b)) calc(var(--h) + var(--b))/0 0 var(--h) var(--h);

                    /* Cascateamento das margens (bloco 1: 20px 10px + bloco 3: margin-left: 30px) */
                    margin: 20px 10px 20px 30px;

                    /* Animações do bloco 4 */
                    transition: transform 0.3s ease;
                }

                /* Estados de Hover e Active do botão */
                .colapsavel-expandir:hover {
                    transform: translateX(10px);
                }

                .colapsavel-expandir:active {
                    transform: scale(0.9);
                }

                /* --- Container de Conteúdo (.colapsavel-conteudo) --- */
                .colapsavel-conteudo {
                    /* Propriedades estruturais do bloco 1 */
                    width: 30%;
                    border: none;

                    /* Efeitos de formato de balão do bloco 2 (que sobrescrevem o bloco 1) */
                    --b: 1em; 
                    --h: .7em; 
                    --c: #3EE5DF;

                    padding: 1em;
                    border-radius: 1.2em;
                    border-bottom-right-radius: 0;
                    clip-path: polygon(100% 0,0 0,0 100%,
                        calc(100% - var(--b)) 100%,
                        calc(100% + var(--h)) calc(100% + var(--h)),
                        100% calc(100% - var(--b)));
                    background: var(--c);
                    border-image: conic-gradient(var(--c) 0 0) 0 999 999 0/
                        0 calc(var(--h) + var(--b)) calc(var(--h) + var(--b)) 0/0 var(--h) var(--h) 0;

                    /* Cascateamento das margens (bloco 1: 10px + bloco 3: margin-left: 30px) */
                    margin: 10px 10px 10px 30px;

                    /* Estado inicial padrão do seu script original */
                    display: none;
                }

                /* --- Estilização dos elementos internos passados via Slot --- */
                /* O Shadow DOM usa ::slotted para estilizar as tags <p> e <li> que moram no HTML externo */
                ::slotted(p), ::slotted(li) {
                    font-family: "Montserrat", sans-serif !important;
                    font-weight: 400 !important;
                    color: #002c50 !important;
                    margin: 10px 0 !important; /* Forçado pela regra .colapsavel-conteudo p/li do seu CSS */
                }

                ::slotted(p) {
                    padding-left: 10px !important;
                    line-height: 1.8 !important;
                }
            </style>

            <button class="colapsavel-expandir">${titulo}</button>
            <div class="colapsavel-conteudo">
                <slot></slot>
            </div>
        `;
    }

    connectedCallback() {
        const botao = this.shadowRoot.querySelector(".colapsavel-expandir");
        const conteudo = this.shadowRoot.querySelector(".colapsavel-conteudo");

        // Lógica de clique idêntica ao seu script original (chaveando display block/none)
        botao.addEventListener("click", () => {
            if (conteudo.style.display === "block") {
                conteudo.style.display = "none";
            } else {
                conteudo.style.display = "block";
            }
        });
    }
}

customElements.define("colapsavel-api", ColapsavelAPI);