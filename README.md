# Inteligência Naval
> Participe de um jogo de Batalha Naval contra a IA do Gemini, desenvolvida pelo Google.

Website desenvolvido para a conclusão da disciplina Linguagem de Programação Visual do curso Tecnologia em Sistemas para Internet, no Instituto Federal de Educação, Ciência e Tecnologia do Sudeste de Minas Gerais.

O projeto possui como objetivo demonstrar como a API gratuita do Gemini pode ser utilizada para permitir que uma inteligência artificial participe de um jogo complexo, do ponto de vista técnico, como a Batalha Naval.

O site faz uso de um prompt com instruções detalhadas de como o Gemini deve agir durante o jogo, fornecendo dados de como estão os tabuleiros dos jogadores a cada rodada, e ele dará uma resposta envolvendo suas jogadas e seu processo de tomadas de decisão. Todo o funcionamento do jogo acontece no front-end.

---

# Como foi feito

A Inteligência Naval possui como objetivo demonstrar como a API gratuita do Gemini pode ser utilizada para permitir que uma inteligência artificial participe de um jogo complexo, do ponto de vista técnico, como a Batalha Naval.

No entanto, Inteligências artificiais (mais especificamente LLMs) como o ChatGPT ou o Gemini não conseguem acessar e interagir com o site diretamente, pois o funcionamento deles se baseiam apenas em receber e escrever mensagens de texto.

Para a proposta do site funcionar, nós utilizamos a Chave API do Gemini pra conseguirmos enviar mensagens automatizadas sobre o jogo.

Em cada rodada do jogo, transformamos a grade dos tabuleiros em uma estrutura de texto chamada JSON que o Gemini consegue ler, e damos instruções detalhadas sobre como agir, contendo:
- As regras sobre como funciona a batalha naval
- Números representando o que pode estar em cada posição do tabuleiro (água, navio atingido, etc.)
- Instruções pra iniciar o jogo escolhendo posições aleatórias desconhecidas, até descobrir algum navio
- Regras pra ignorar posições descobertas com água, e continuar atacando posições com navios não afundados

Depois da análise, o Gemini deve responder realizando as seguintes ações:
- Enviar a posição que a IA escolheu atacar
- Escrever um raciocínio sobre porquê ela decidiu escolher esse lugar, baseado no que ela já conhece
- Formatar sua resposta numa estrutura JSON, pra conseguirmos utilizar sua resposta e mostrar sua ação visualmente no site

A Inteligência Naval também possui um modo de Piloto Automático, que consiste em um algoritmo pra realizar jogadas automáticas. Dessa forma, o jogo pode continuar quando houver erros na utilização da chave API.

Além disso, o jogo também pode ser iniciado sem uma chave API para ser jogado apenas com o Piloto Automático.

---


O site foi pensado para ser acessível à usuários leigos. Há instruções simples sobre:
- O que é uma chave API
- Como conseguir uma chave API do Gemini gratuitamente
- Como jogar uma partida de Batalha Naval

---

Tecnologias utilizadas:
- HTML
- CSS
- JavaScript
- TypeScript
- API do Google Gemini

---

Desenvolvido por:
- Matheus Leite
- Gabriel Alvaro
- Breno Emanuel
- Pamela de Andrade
- Matheus José
- Evandro Rodrigues
