<div align='center'>
    <img src='./images/medieteknik-logo.png' height='100px' />
</div>

# Medieteknik

<p title='Website'>🌐 <span> <a title='Go to website' href='https://medieteknik.com'>Website</a> </span> </p>

## Table of Contents

- [Översikt](#översikt)
- [Tech Stack](#tech-stack)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Databas](#databas)
  - [Annat](#annat)
- [Förutsättningar](#förutsättningar)
  - [Programvarukrav](#programvarukrav)
  - [Miljövariabler](#miljövariabler)
    - [./backend/.env](#backendenv)
- [Installation](#installation)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [Användning](#användning)
  - [Docker](#docker)
    - [Uppdatera databastabeller](#uppdatera-databastabeller)
    - [Återskapa databastabeller](#återskapa-databastabeller)
  - [Databas](#databas-1)
- [Lisens](#lisens)
- [Kontakt](#kontakt)

## Översikt

Denna repository är för hemsidan som finns på [https://medieteknik.com](https://medieteknik.com) och är anpassad för studenter som studerar vid KTH och specifikt [Medieteknik programmet](https://www.kth.se/utbildning/civilingenjor/medieteknik/medieteknik-civilingenjor-300-hp-1.4150)

Denna gren är främst till för utvecklingen av den nya redesignen på hemsidan.

## Tech Stack

### Frontend

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=fff)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000?style=for-the-badge&logo=shadcnui&logoColor=fff)](https://ui.shadcn.com/)

### Backend

[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=fff)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-000?style=for-the-badge&logo=flask&logoColor=fff)](https://flask.palletsprojects.com/en/3.0.x/)

### Databas

[![Postgres](https://img.shields.io/badge/Postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

### Annat

[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=fff)](https://www.docker.com/)
[![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)](https://firebase.google.com/)
[![Google Cloud](https://img.shields.io/badge/Google%20Cloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white)](https://cloud.google.com/?hl=en)

## Förutsättningar

### Programvarukrav

[![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=fff)](https://www.npmjs.com/)

[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=fff)](https://www.python.org/)
[![PyPI](https://img.shields.io/badge/PyPI-3775A9?style=for-the-badge&logo=pypi&logoColor=fff)](https://pypi.org/project/pip/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=fff)](https://www.docker.com/)

### Miljövariabler

- [./backend.env](./backend.env) (Engelska Kommentarer)

## Installation

```sh
git clone -b hemsidan-redesign https://github.com/medieteknik-kth/medieteknik.com.git
cd medieteknik.com
```

### Frontend Setup

```sh
cd frontend
npm install
npm run dev
```

### Backend Setup

```sh
cd backend
pip install -r .\requirements.txt
docker-compose up -d --build
```

## Användning

### Docker

#### Uppdatera databastabeller

Inuti `medieteknik_web`

```sh
python init_db.py
```

#### Återskapa databastabeller

Detta droppar alla tabeller och återskapar dem

Inuti `medieteknik_web`

```sh
python init_db.py --recreate
```

### Databas

Se till att infoga SQL i tabellerna så att hemsidan fungerar

```sql
INSERT INTO language (language_code, language_name)
VALUES ('sv-SE', 'Swedish'), ('en-GB', 'English');
```

## Licens

Medieteknik är licensierad enligt [MIT License](./LICENSE)

## Kontakt

Om du har några frågor eller feedback, tveka inte att maila oss på: <a href='mailto:webmaster@medieteknik.com'>webmaster@medieteknik.com</a>

För problem använd gärna [issues fliken](https://github.com/medieteknik-kth/medieteknik.com/issues) som finns på GitHub
