# Inteligência Naval

<p align="center">
  <strong>Participe de um jogo de Batalha Naval contra a IA do Gemini, desenvolvida pelo Google.</strong>
  <br><br>
  Projeto desenvolvido para demonstrar como um modelo de linguagem pode participar de um jogo estratégico utilizando apenas troca de mensagens em formato JSON.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
  <img src="https://img.shields.io/badge/HTML-E34F26?style=for-the-badge&logo=html5&logoColor=white">
  <img src="https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white">
  <img src="https://img.shields.io/badge/Google-Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white">
</p>

---

## Sobre o projeto

A **Inteligência Naval** é um jogo de **Batalha Naval** onde o adversário é a **IA Gemini**, desenvolvida pelo Google.

O projeto foi desenvolvido como trabalho de conclusão da disciplina **Linguagem de Programação Visual**, do curso **Tecnologia em Sistemas para Internet**, no **Instituto Federal de Educação, Ciência e Tecnologia do Sudeste de Minas Gerais (IF Sudeste MG)**.

O principal objetivo é demonstrar, na prática, como a API gratuita do Gemini pode ser utilizada para permitir que uma inteligência artificial participe de um jogo relativamente complexo, mesmo sem possuir acesso direto à interface da aplicação.

Todo o funcionamento do jogo acontece **inteiramente no front-end**.

---

## Funcionalidades

- Jogue Batalha Naval contra a IA do Gemini.
- IA baseada em prompts cuidadosamente elaborados.
- Explicação do raciocínio da IA a cada jogada.
- Comunicação estruturada utilizando JSON.
- Modo **Jogar contra o Piloto Automático** para iniciar partidas sem depender da API do Gemini.
- Possibilidade de jogar utilizando sua própria chave gratuita do Gemini.
- Interface com instruções para usuários iniciantes.

---

# Como a IA funciona

Modelos de linguagem como o **Gemini** ou o **ChatGPT** não conseguem interagir diretamente com páginas web.

Eles apenas recebem texto como entrada e produzem texto como saída.

Para contornar essa limitação, o jogo utiliza a **API do Gemini**, enviando automaticamente uma descrição completa do estado atual da partida.

Em cada rodada, o jogo converte os tabuleiros para uma estrutura **JSON**, contendo todas as informações necessárias para que o modelo tome uma decisão.

O prompt enviado inclui:

- regras completas da Batalha Naval,
- significado de cada valor presente no tabuleiro,
- estado atual dos dois jogadores,
- instruções sobre estratégia,
- formato obrigatório da resposta.

Após analisar os dados, o Gemini responde com:

- a posição escolhida para atacar,
- uma explicação do seu raciocínio,
- uma resposta em formato JSON para que o site processe automaticamente sua jogada.

---

# Piloto Automático

Além da integração com o Gemini, o projeto possui um modo de **Piloto Automático**.

Esse modo utiliza um algoritmo tradicional para realizar jogadas automaticamente, permitindo que:

- o jogo continue caso a API retorne algum erro;
- partidas sejam iniciadas sem uma chave da API;
- o usuário experimente o jogo mesmo sem utilizar o Gemini.

---

# Acessibilidade

O projeto foi pensado para usuários que nunca utilizaram APIs antes.

A aplicação explica de maneira simples:

- como funciona uma chave de API,
- como criar gratuitamente uma chave do Google Gemini,
- como jogar Batalha Naval,
- como utilizar todos os recursos disponíveis.

---

# Tecnologias utilizadas

- HTML
- CSS
- JavaScript
- TypeScript
- Google Gemini API

---

# Estrutura da comunicação com a IA

```text
Jogador
    │
    ▼
Clique no Tabuleiro
    │
    ▼
Conversão para JSON
    │
    ▼
Prompt detalhado
    │
    ▼
API do Gemini
    │
    ▼
Resposta em JSON
    │
    ▼
Atualização visual do jogo
```

---

# Objetivos do projeto

Este projeto busca demonstrar que é possível utilizar um LLM como agente de decisão em um jogo estratégico apenas através de engenharia de prompts e troca estruturada de dados.

Além disso, procura apresentar de forma didática conceitos como:

- Prompt Engineering;
- consumo de APIs REST;
- manipulação de JSON;
- integração entre aplicações web e modelos de IA;
- desenvolvimento Front-end.

---

# Equipe

| Integrante |
|------------|
| Matheus Leite |
| Gabriel Alvaro |
| Breno Emanuel |
| Pamela de Andrade |
| Matheus José |
| Evandro Rodrigues |

---

<p align="center">
Desenvolvido como projeto acadêmico para o curso de <strong>Tecnologia em Sistemas para Internet</strong><br>
Instituto Federal de Educação, Ciência e Tecnologia do Sudeste de Minas Gerais
</p>
