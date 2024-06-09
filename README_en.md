<div align='center'>
    <img src='./docs/images/medieteknik-logo.png' height='100px' />
</div>

# Medieteknik
<p title='Website'>🌐 <span> <a title='Go to website' href='https://medieteknik.com'>Website</a> </span> </p>

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
   * [Front-End](#front-end)
   * [Back-End](#back-end)
   * [Database](#database)
   * [Other](#other)
- [Prerequisites](#prerequisites)
   * [Software Requirements](#software-requirements)
   * [Environment Variables](#environment-variables)
      + [./backend/.env](#backendenv)
- [Installation](#installation)
   * [Front-End Setup](#front-end-setup)
   * [Back-End Setup](#back-end-setup)
- [Usage](#usage)
   * [Docker](#docker)
      + [Update tables](#update-tables)
      + [Recreate tables](#recreate-tables)
   * [Database](#database-1)
- [License](#license)
- [Contact](#contact)

## Overview
This repository is for the website found at [https://medieteknik.com](https://medieteknik.com) and is tailored for students studying at KTH and specifically the [Media Technology Programme (Site in Swedish)](https://www.kth.se/utbildning/civilingenjor/medieteknik/medieteknik-civilingenjor-300-hp-1.4150)

This branch is mainly for the development of the new redesign of the website

## Tech Stack

### Front-End
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=fff)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000?style=for-the-badge&logo=shadcnui&logoColor=fff)](https://ui.shadcn.com/)

### Back-End
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=fff)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-000?style=for-the-badge&logo=flask&logoColor=fff)](https://flask.palletsprojects.com/en/3.0.x/)

### Database
[![Postgres](https://img.shields.io/badge/Postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

### Other
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=fff)](https://www.docker.com/)
[![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)](https://firebase.google.com/) 
[![Google Cloud](https://img.shields.io/badge/Google%20Cloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white)](https://cloud.google.com/?hl=en)

## Prerequisites

### Software Requirements
[![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=fff)](https://www.npmjs.com/)

[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=fff)](https://www.python.org/)
[![PyPI](https://img.shields.io/badge/PyPI-3775A9?style=for-the-badge&logo=pypi&logoColor=fff)](https://pypi.org/project/pip/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=fff)](https://www.docker.com/)


### Environment Variables

#### ./backend/.env
```properties
DATABASE_URL=postgresql://<USERNAME>:<PASSWORD>@medieteknik_db:5432/<DB_NAME>
POSTGRES_DB=<DB_NAME>
POSTGRES_USER=<USERNAME>
POSTGRES_PASSWORD=<PASSWORD>
```

## Installation

```sh
git clone -b hemsidan-redesign https://github.com/medieteknik-kth/medieteknik.com.git
cd medieteknik.com
```

### Front-End Setup
```sh
cd frontend
npm install
npm run dev
```

### Back-End Setup
```sh
cd backend
pip install -r .\requirements.txt
docker-compose up -d --build
```

## Usage

### Docker

#### Update tables
In `medieteknik_web`
```sh
python init_db.py
```

#### Recreate tables
This drops all tables and recreates.

In `medieteknik_web`
```sh
python init_db.py --recreate
```

### Database
Ensure to insert some SQL into the database endpoints in the website works e.g.
```sql
INSERT INTO language (language_code, language_name)
VALUES ('sv-SE', 'Swedish'), ('en-GB', 'English');
```

## License
Medieteknik is licensed under [MIT License](./LICENSE)

## Contact
If you have any questions or feedback please don't hesitate to email us at: <a href='mailto:webmaster@medieteknik.com'>webmaster@medieteknik.com</a>

For issues use the [issues tab](https://github.com/medieteknik-kth/medieteknik.com/issues) found on GitHub