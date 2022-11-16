<table>
  <tr>
    <td><img src="https://github.com/guischimidt/GET_A_PET/blob/master/frontend/src/assets/img/logo.png" style="width: 48px;" /></td>
    <td><h1>GET A PET</h1></td>
  </tr>
</table>

## Conteúdo
* [Sobre o Projeto](#sobre-o-projeto)
* [Tecnologias](#hammer_and_wrench-tecnologias)
* [Iniciando a Aplicação](#car-Iniciando-a-aplicação)
* [Licença](#balance_scale-licença)
* [Contato](#email-contato)

## Sobre o projeto

É uma aplicação para adoção de animais, composta por um backend em __Node.js__ e frontend em __React__, desenvolvida durante o curso [Node.js do Zero a Maestria com diversos Projetos](https://www.udemy.com/course/nodejs-do-zero-a-maestria-com-diversos-projetos/), do prof. Matheus Battisti.<br />
A API trabalha com banco de dados __MongoDB__, autenticação JWT, upload de imagens, cadastro de usuários e de pets.<br />
<br />

### Rotas da aplicação

| Método | Caminho da Rota | Descrição da Rota |
|---|---|---|
| PATCH | http://localhost:5000/users/edit/:id | Altera os dados do usuário |
| GET | http://localhost:5000/users/:id | Busca os dados do usuário pelo Id |
| GET | http://localhost:5000/users/checkuser | Busca os dados do usuário ref. Token |
| POST | http://localhost:5000/users/login | Login do usuário |
| POST | http://localhost:5000/users/register | Cadastra novo usuário |
| POST | http://localhost:5000/pets/conclude/:id | Conclui a adoção do animal |
| PATCH | http://localhost:5000/pets/schedule/:id | Agenda uma visita para conhecer o animal |
| PATCH | http://localhost:5000/pets/:id | Altera os dados do animal |
| DELETE | http://localhost:5000/pets/:id | Exclui um animal |
| GET | http://localhost:5000/pets/:id | Busca os dados do animal pelo Id |
| GET | http://localhost:5000/pets/myadoptions | Retorna os animais que eu adotei |
| GET | http://localhost:5000/pets/mypets | Retorna os animais que eu coloquei para adoção |
| GET | http://localhost:5000/pets | Retorna todos os animais |
| POST | http://localhost:5000/pets/create | Cria um novo animal para adoção  |

## :hammer_and_wrench: Tecnologias
* Back-end
  * __Node.js__
  * __Mongoose ORM__ para acessar o banco
  * __Yup__ para fazer a validação das requisições
  * __Cors__ para liberar acesso à API
  * __jsonwebtoken__ para criar uma sessão
  * __Multer__ para fazer upload de imagens
* Front-end
  * __React__
  * __React-Router-DOM__ para rotas
  * __Axios__ para acessar API


## :car: Iniciando a aplicação
Baixe o repositório com git clone e entre na pasta do projeto.
```bash
$ git clone https://github.com/guischimidt/GET_A_PET
```


### __Back-end__
  Na pasta backend, instale as dependências
```bash
$ cd backend
$ npm install
$ npm start
```
### __Front-end__
  Na pasta frontend, instale as dependências.
```bash
$ cd ..
$ cd frontend
$ npm install
$ npm start
```


## :balance_scale: Licença
Este projeto está licenciado sob a [licença MIT](LICENSE).

## :email: Contato

E-mail: [**guigoschimidt@gmail.com**](mailto:guigoschimidt@gmail.com)
