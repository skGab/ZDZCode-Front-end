<!-- TITLE -->
<h1 align="center" color="black">Bills Management App</h1>

<!-- THUMB -->
<p align="center">
        <img src="./doc_thumb.png" width="250px" style="box-shadow: 1px 2px 4px gray;" alt="Logo do Projeto" object-fit="cover">
</p>

<!-- STATUS -->
<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/skGab/ZDZCode-Front-end.svg)](https://github.com/skGab/ZDZCode-Front-end/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/skGab/ZDZCode-Front-end.svg)](https://github.com/skGab/ZDZCode-Front-end/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---
<!-- INTRO -->

## Índice

- [Tecnologias](#tecnologies)
- [Funcionalidades](#features)
- [Instruções de Uso](#glossary)
- [Autor](#authors)

## Tecnologias <a name="tecnologies"></a>

- Vue.js
- Nuxt 3
- Vuetify 3
- Sass
- Pinia

## Funcionalidades <a name="features"></a>

- Criação de contas
- Calculo de despesas
- Listagem de contas
- Atualização de contas
- Exclusão de contas

## Instruções de Uso <a name="glossary"></a>
Lista de rotas:
- https://localhost:7218/user/auth
- https://localhost:7218/user/create

- https://localhost:7218/bills/{userEmail}
- https://localhost:7218/bills/create
- https://localhost:7218/bills/delete/{id}
- https://localhost:7218/bills/update/{id}

- Faço o cadastro na aplicação para utilizar a funcionalidade de listagem de contas. Entrando como "guest", é possivel realizar somente o calculo.
- É necessario que o servidor da API esteja rodando na porta localhost:7218, então abra o repositorio em modo solução e depois pressione F5.
- Certifique-se de ter o Node.js instalado em seu sistema. Em seguida, execute o seguinte comando para instalar as dependências do projeto:

`npm install`

<br>

- Para iniciar o servidor de desenvolvimento local, utilize o seguinte comando:

`npm run dev`

O sistema estará disponível em http://localhost:3000/. As alterações no código serão recarregadas automaticamente no navegador durante o desenvolvimento.

<br>

## Autor <a name="authors"></a>

- [@Gabriel Assunção](https://github.com/skGab) - Construção.
