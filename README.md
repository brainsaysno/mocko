<div id="top"></div>

<div align="center">

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

</div>

<br />
<div align="center">
  <a href="https://github.com/brainsaysno/mocko">
    <img width="75%" alt="Mocko banner" src="https://github.com/user-attachments/assets/64f3d36d-ef2e-46a8-9efd-38072c25a6cf"/>
 </a>
  <br/>
  <br/>

  <p align="center">
    <a href="https://github.com/brainsaysno/mocko"><strong>Explore docs »</strong></a>
    <br />
    <br />
    <a href="https://mocko.nrusso.dev/">Go to the website</a>
    ·
    <a href="https://github.com/brainsaysno/mocko/issues/new?labels=enhancement">Suggest a feature</a>
    ·
    <a href="https://github.com/brainsaysno/mocko/issues/new?labels=bug">Report a bug</a>
    
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About the Project</a>
      <ul>
         <li><a href="#features">Features</a></li>
         <li><a href="#why-mocko">Why Mocko</a></li>
         <li><a href="#technologies">Technologies</a></li>
      </ul>
    </li>
    <li>
      <a href="#building-locally">Building Locally</a>
      <ul>
        <li><a href="#requirements">Requirements</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#walkthrough">Walkthrough</a></li>
    <li><a href="#contributing">Contributing</a>
      <ul>
      <li><a href="#suggesting-improvements-or-reporting-bugs">Suggesting Improvements or Reporting Bugs</a></li>
      <li><a href="#resolving-issues">Resolving Issues</a></li>
      </ul>
    </li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## About the Project

**Mocko** is a powerful tool designed to simplify the development process by generating and exporting consistent, user-friendly mock data for projects. Whether you're building apps, testing APIs, or simulating intricate environments, Mocko saves you time by automating the creation of sample data.

### Features

- Flexible Data Generation: Create mock data in various formats such as JSON, text, or customized outputs.
- User-Friendly Export Options: Easily export mock data for use in your projects, with options to preview, copy, or send via email.
- AI-Powered Mock Data: Generate realistic data for emails, customer profiles, support tickets, and more using a wide variety of LLMs.
- Fixed Data Sets: Use pre-defined, example-driven static data for consistent testing scenarios.
- Customizable Structures: Define custom data structures and fill them with mock values tailored to your project needs.

### Why Mocko?

**Mocko** takes the manual work out of testing workflows by providing an easy and fast way to generate the mock data you need. With options for AI-generated prose, structured JSON data, and fixed datasets, it's the perfect sidekick for any developer aiming for efficiency.

### Technologies

#### Frontend

- [Typescript](https://www.typescriptlang.org/)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Dexie (IndexedDB)](https://dexie.org/)
- [Framer Motion](https://www.framer.com/motion/)

#### Backend

- [Go](https://go.dev/)
- [Gin](https://github.com/gin-gonic/gin)

#### DevOps & Analytics

- [Nx](https://nx.dev/)
- [Fly.io](https://fly.io/)
- [Docker](https://www.docker.com/)
- [Caddy](https://caddyserver.com/)
- [Posthog](https://posthog.com/)
- [Github Actions](https://github.com/features/actions)

#### Testing

- [Playwright](https://playwright.dev/)
- [Vitest](https://vitest.dev/)

#### Design and Prototyping

- [Figma](https://www.figma.com)

## Walkthrough

| Home Page                                                                                                            | Onboarding                                                                                                           |
| -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| <img width="1470" alt="image" src="https://github.com/user-attachments/assets/7b7d2a76-3d72-4c3e-b2e1-6d2d1c185c05"> | <img width="1470" alt="image" src="https://github.com/user-attachments/assets/e4efdef3-dbc0-41ae-9ecb-6804b74316fb"> |

| Mocko List                                                                                                           | Add New Mocko                                                                                                        |
| -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| <img width="1470" alt="image" src="https://github.com/user-attachments/assets/8d338238-8ba4-4f86-9857-e9b321821224"> | <img width="1470" alt="image" src="https://github.com/user-attachments/assets/e2c2a249-f3e5-4d5c-a588-7dcccf22a7cf"> |

| Generate/Copy/Email Export                                                                                           | Runtime Variables                                                                                                    |
| -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| <img width="1470" alt="image" src="https://github.com/user-attachments/assets/9dd4cd76-c0ce-44ad-9ff2-9c92a45535b0"> | <img width="1470" alt="image" src="https://github.com/user-attachments/assets/221ce62f-e055-49a8-b873-f94f85fd0283"> |

| Drag and Drop Reorder                                                                                     | Custom Devtools                                                                                                      |
| --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| <img width="1470" src="https://github.com/user-attachments/assets/174878ed-2723-49e6-b9df-025365497681"/> | <img width="1470" alt="image" src="https://github.com/user-attachments/assets/ddedddf4-2582-494e-98d8-ade2e7f51b90"> |

## Building Locally

### Requirements

- [pnpm](https://pnpm.io/)
  ```sh
  npm install -g pnpm
  ```
- [Nx](https://nx.dev/)
  ```sh
  pnpm i -g nx
  ```

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/brainsaysno/mocko.git
   ```

2. Install the dependencies:

   ```sh
   pnpm i
   ```

3. If you use tmux, there is a tmuxp configuration to start the server; otherwise, start both the front and back end:

   ```sh
   nx serve frontend
   ```

   ```sh
   nx serve backend
   ```

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

Besides giving the project a star, **there are 2 main ways to contribute**:

### Suggesting Improvements or Reporting Bugs

- To **suggest an improvement**, create an [_issue_](https://github.com/brainsaysno/mocko/issues/new?labels=enhancement) that includes the "enhancement" label, with the name of the proposal as the title and a brief description of it or why we should implement it.

- To **report a bug**, create an [_issue_](https://github.com/brainsaysno/mocko/issues/new?labels=bug) that includes the "bug" label, with a description of the bug as the title and a brief comment on how you discovered it.

### Resolving Issues

If you find an [issue](https://github.com/brainsaysno/mocko/issues) you want to resolve, you can submit a PR with your code. To do this:

1. Create a [_fork_](https://github.com/brainsaysno/mocko/fork) of the project
2. Clone the project to your computer (`git clone https://www.github.com/YOUR-USERNAME/mocko.git`)
3. Create a branch for your proposal (`git checkout -b feature/PROPOSAL-NAME`)
4. Make changes to the code
5. Commit your changes (`git commit -m 'Add PROPOSAL-NAME'`)
6. Push to your branch (`git push origin feature/PROPOSAL-NAME`)
7. Open a new [_pull request_](https://github.com/brainsaysno/mocko/compare) explaining your proposal and mentioning the relevant issue.

## License

Distributed under the GPL-3.0 License. See [license](LICENSE) for more information.

## Contact

Nicolás Russo - [nrusso@nrusso.dev](nrusso@nrusso.dev)

Project Link: [https://github.com/brainsaysno/mocko](https://github.com/brainsaysno/mocko)

[contributors-shield]: https://img.shields.io/github/contributors/brainsaysno/mocko.svg?style=for-the-badge
[contributors-url]: https://github.com/brainsaysno/mocko/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/brainsaysno/mocko.svg?style=for-the-badge
[forks-url]: https://github.com/brainsaysno/mocko/network/members
[stars-shield]: https://img.shields.io/github/stars/brainsaysno/mocko.svg?style=for-the-badge
[stars-url]: https://github.com/brainsaysno/mocko/stargazers
[issues-shield]: https://img.shields.io/github/issues/brainsaysno/mocko.svg?style=for-the-badge
[issues-url]: https://github.com/brainsaysno/mocko/issues
[license-shield]: https://img.shields.io/github/license/brainsaysno/mocko.svg?style=for-the-badge
[license-url]: https://github.com/brainsaysno/mocko/blob/main/LICENSE
