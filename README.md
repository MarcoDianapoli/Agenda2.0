README_AgendaPersonal.md


<div align="center">

# AgendaPersonal

### Personal agenda web application built with Angular and TypeScript

![Angular](https://img.shields.io/badge/Angular-21.2.0-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Frontend-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Status](https://img.shields.io/badge/Status-In_Development-orange?style=for-the-badge)

</div>

---

## Overview

**AgendaPersonal** is a web application developed with Angular to organize personal information and activities through a modern, maintainable and component-based interface.

The project is also part of my software development portfolio and serves as a practical environment for applying Angular concepts such as reusable components, application routing, services, forms, state management and automated testing.

---

## Project Goals

- Build a clear and responsive personal agenda interface.
- Organize the application using reusable Angular components.
- Keep presentation, business logic and data access responsibilities separated.
- Apply TypeScript typing to improve code reliability and maintainability.
- Add unit tests for important components and services.
- Prepare the project for future integration with an API or persistent storage.

---

## Tech Stack

### Frontend

- Angular 21.2.0
- TypeScript
- HTML5
- CSS3
- RxJS

### Development Tools

- Angular CLI
- npm
- Vitest
- Git
- GitHub
- Visual Studio Code

---

## Getting Started

### Prerequisites

Before running the project, install:

- Node.js
- npm
- Git
- Angular CLI

Install Angular CLI globally if necessary:

```bash
npm install -g @angular/cli
```

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/MarcoDianapoli/Agenda2.0.git
cd Agenda2.0
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
ng serve
```

Or use the npm script:

```bash
npm start
```

Open the application in your browser:

```text
http://localhost:4200
```

The development server automatically reloads the application when source files change.

---

## Available Commands

### Development server

```bash
ng serve
```

### Generate a component

```bash
ng generate component component-name
```

### Generate other Angular elements

```bash
ng generate service service-name
ng generate interface interface-name
ng generate guard guard-name
```

View the complete list of available schematics:

```bash
ng generate --help
```

### Production build

```bash
ng build
```

The compiled files are generated inside the `dist/` directory.

### Unit tests

```bash
ng test
```

The project uses Vitest as its unit-testing runner.

### End-to-end tests

```bash
ng e2e
```

Angular CLI does not include an end-to-end testing framework by default, so one must be configured before using this command.

---

## Project Structure

```text
Agenda2.0/
├── public/
├── src/
│   ├── app/
│   │   ├── components/
│   │   ├── services/
│   │   ├── app.config.ts
│   │   ├── app.routes.ts
│   │   └── app.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

> Update this section if the current folder structure is different.

---

## Recommended Screenshots

Add screenshots inside:

```text
docs/images/
```

Then include them in this README:

```md
## Screenshots

### Main View

![Main view](docs/images/main-view.png)

### Agenda Management

![Agenda management](docs/images/agenda-management.png)
```

Use fictional information in screenshots and avoid exposing personal data.

---

## Future Improvements

- Add persistent data storage.
- Add form validation and user feedback.
- Add search and filtering.
- Add reusable notification components.
- Improve mobile responsiveness.
- Add unit and integration tests.
- Connect the frontend to a REST API.
- Add authentication if the application requires multiple users.
- Configure continuous integration with GitHub Actions.

---

## What I Am Practicing

Through this project, I am strengthening my understanding of:

- Angular component architecture
- TypeScript typing
- Application routing
- Services and dependency injection
- Form handling and validation
- Responsive interface development
- Unit testing with Vitest
- Git-based version control

---

## Author

Developed by **Axel Marco Antonio López Plascencia**.

- GitHub: [MarcoDianapoli](https://github.com/MarcoDianapoli)
- LinkedIn: [Axel Marco Antonio López Plascencia](https://www.linkedin.com/in/axellopez-130221-p)
- Email: [plzaxel13@gmail.com](mailto:plzaxel13@gmail.com)

---

## Project Status

This project is currently under development and is included in my professional software development portfolio.
