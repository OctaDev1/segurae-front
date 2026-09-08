<div align="center">

# 🛡️ Seguraê

**Tecnologia que protege o que move você.**

Plataforma web para gestão de seguros automotivos — centraliza apólices, clientes segurados e veículos em um único lugar, com autenticação, controle de acesso por perfil e um painel completo para corretores.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

[🌐 Site em produção](https://segurae-front.vercel.app/) • [📚 Swagger da API](https://segurae-1.onrender.com/swagger-ui/swagger-ui/index.html) • [🎨 Apresentação](https://www.canva.com/design/DAHUI_sJDDI/Ixe5wl9wwWfY6g8r742Ttg/edit)

</div>

---

## 📌 Sobre o projeto

Grande parte da frota de veículos no Brasil circula sem nenhuma proteção securitária, e quando um sinistro acontece, o processo costuma ser lento, burocrático e pouco transparente. O **Seguraê** nasceu para resolver esse cenário, oferecendo uma plataforma digital que reduz:

- O alto custo em casos de acidentes;
- O risco de perda financeira em roubos ou furtos;
- A falta de assistência rápida em situações emergenciais;
- A dificuldade de gestão de apólices por parte de clientes e corretores.

Este repositório contém o **front-end** da aplicação, construído em React + TypeScript, que consome a API REST do back-end (Java + Spring Boot).

### Objetivos do sistema

1. Centralizar o gerenciamento de seguros automotivos;
2. Facilitar o acompanhamento de apólices por clientes e corretores;
3. Garantir segurança e controle de acesso às informações (RBAC + JWT);
4. Digitalizar e otimizar processos que hoje são manuais;
5. Proporcionar uma experiência mais confiável e transparente ao cliente.

---

## ✨ Funcionalidades

**Área pública**
- Landing page com apresentação da empresa, planos, equipe e depoimentos;
- Página de **coberturas** com os 3 planos disponíveis (Essencial, Completo e Premium VIP) e seus benefícios;
- Página de **serviços adicionais** (guincho 24h, carro reserva, reparo de vidros, entre outros);
- Página de contato;
- **Chatbot flutuante** com respostas automáticas sobre planos, coberturas e contato, e atalhos de navegação.

**Autenticação e controle de acesso**
- Login e cadastro de usuários, com autenticação via **JWT**;
- Dois perfis de acesso — **Cliente** e **Corretor** — cada um com rotas e painéis próprios;
- Rotas protegidas (`ProtectedRoute`) com redirecionamento automático conforme o perfil do usuário logado.

**Área do Cliente**
- Dashboard com resumo das apólices;
- Listagem das próprias apólices, com busca e filtro por status (ativas / vencidas).

**Área do Corretor**
- Dashboard com indicadores (total de clientes, apólices vigentes etc.);
- **CRUD completo de apólices e de clientes**, com formulários em modal;
- Alternância entre visualização em tabela e em cards;
- Busca e filtros por status (ativas, vencidas, pendentes).

---

## 🚀 Tecnologias utilizadas

**Front-end (este repositório)**

| Tecnologia | Uso |
|---|---|
| React 19 + TypeScript | Base da aplicação |
| Vite | Build tool e servidor de desenvolvimento |
| React Router DOM 7 | Roteamento e rotas protegidas |
| Tailwind CSS 4 | Estilização |
| Axios | Consumo da API REST (com interceptor de JWT) |
| Framer Motion | Animações (ex.: introdução com scroll na Home) |
| React Toastify | Notificações e feedback ao usuário |
| Phosphor Icons | Ícones da interface |

**Back-end (repositório separado)**

- Java + Spring Boot
- Spring Security + JWT (autenticação)
- Arquitetura em camadas (Controller → Service → Repository)
- MySQL

---

## 🧩 Modelo de dados (visão geral)

| Entidade | Principais atributos | Relação |
|---|---|---|
| **Usuário** | nome, e-mail, senha, perfil (`ROLE_CLIENTE` \| `ROLE_CORRETOR`) | Autentica no sistema; um Corretor gerencia apólices |
| **Cliente** | nome completo, e-mail, CPF/CNPJ, data de nascimento | Possui várias apólices (1:N) |
| **Apólice** | número, marca/modelo, bem segurado, ano/modelo, placa, RENAVAM, valor, tipo de cobertura, vigência (início/término), status | Pertence a um cliente e é gerenciada por um usuário (N:1) |

---

## 🏗️ Arquitetura do front-end

- **Context API** (`AuthContext`) para gerenciar sessão, token JWT e perfil do usuário;
- **Camada de serviços** (`src/services/Service.ts`) centralizando as chamadas HTTP via Axios, com interceptor que injeta o token JWT em toda requisição autenticada;
- **Rotas protegidas** (`ProtectedRoute`) que verificam autenticação e perfil (`allowedRoles`) antes de liberar o acesso;
- **Organização por domínio**: `pages/` (telas), `components/` (elementos reutilizáveis), `models/` (tipos das entidades), `contexts/` e `services/`.

---

## 🎨 Design

A interface segue uma paleta baseada em vermelho (ações principais e destaque) e tons neutros (zinc), com uso extensivo do Tailwind CSS.

> ℹ️ A identidade visual completa (incluindo paleta oficial de marca) está detalhada na [apresentação do projeto no Canva](https://www.canva.com/design/DAHUI_sJDDI/Ixe5wl9wwWfY6g8r742Ttg/edit).

---

## ⚙️ Como rodar o projeto

**Pré-requisitos:** Node.js instalado.

```bash
# Clonar o repositório
git clone https://github.com/OctaDev1/segurae-front.git

# Entrar na pasta do projeto
cd segurae-front

# Instalar as dependências
npm install

# Rodar em modo de desenvolvimento
npm run dev
```

A aplicação ficará disponível em `http://localhost:5173` (porta padrão do Vite).

### Configurando a API

Por padrão, a aplicação consome a API em produção (`https://segurae-1.onrender.com`). Para apontar para uma API local ou de outro ambiente, crie um arquivo `.env` na raiz do projeto:

```bash
VITE_API_URL=http://localhost:8080
```

### Outros scripts

```bash
npm run build     # gera a versão de produção
npm run lint      # roda o ESLint
npm run preview   # pré-visualiza o build de produção
```

---

## 🗺️ Próximas evoluções

- Cotação inteligente
- Gestão de sinistros
- Melhorias na experiência do cliente

---

## 👥 Equipe OctaDev

| Nome | Função |
|---|---|
| Felipe Oliveira Lopes | Desenvolvedor Full Stack Júnior |
| Gabriel José Alegre | Product Designer |
| Guilherme Oliveira | Desenvolvedor Full Stack Júnior |
| João Vitor Diniz Alves | Desenvolvedor Full Stack Júnior |
| Juliana Macedo | Desenvolvedora Full Stack Júnior |
| Maryane Praxedes | Desenvolvedora Full Stack Júnior |
| Thiago José Versiani | Desenvolvedor Full Stack Júnior |

**Inovar • Desenvolver • Transformar**

---

## 📄 Licença

Projeto acadêmico desenvolvido pela equipe OctaDev para fins de portfólio e aprendizado. Ajuste esta seção conforme a licença que desejar aplicar ao repositório.
