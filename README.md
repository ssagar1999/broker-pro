#  Open Source Interested Club — Contribution Guide

---

##  Getting Started

# 🧰 Project Setup Guide – Frontend (Next.js)

Welcome! Follow the steps below to set up this project on your local system.  
This guide ensures you have the same environment as used during development.

---

## 🚀 1. Prerequisites

Before starting, make sure the following tools are installed on your machine:

| Tool | Required Version | Download Link |
|------|------------------|----------------|
| **Node.js** | v22.15.1 | [Download Node.js](https://nodejs.org/en/download) |
| **npm** | (comes with Node.js) | — |
| **Git** | Latest | [Download Git](https://git-scm.com/downloads) |
| **VS Code** | Recommended | [Download VS Code](https://code.visualstudio.com/) |

---

## 🧩 2. Verify Installation

Open your terminal and check versions:

```bash
node -v
# Expected output: v22.15.1

npm -v
# Should show a version number (≥10)

git --version
# Should show a version number
```



Follow these steps carefully to contribute to this project.  
Don’t worry — if you’re new to open source, this will be your perfect first PR!

---

###  1. Fork this repository

- Click the **Fork** button (top-right corner of this repo).  
- This creates a copy of the repository in **your own GitHub account**.

Your forked repo URL will look like this:  
`https://github.com/<your-username>/<repo-name>`

---

###  2. Clone your fork

Now bring your forked repo to your local machine:

```bash
git clone https://github.com/<your-username>/<repo-name>.git


Move into the project folder:

```bash
cd <repo-name>
```

---

###  3. Add the original repo as upstream (important)

This keeps your fork updated with the latest changes from the main project.

```bash
git remote add upstream https://github.com/<original-owner>/<repo-name>.git
```

To verify:

```bash
git remote -v
```

You should see two remotes — `origin` (your fork) and `upstream` (main repo).

---

###  4. Create a new branch

Before making any changes, create a new branch:

```bash
git checkout -b add-my-profile
```

Use meaningful branch names such as:

* `fix-typo-readme`
* `update-contributors`
* `add-new-feature`

---

###  5. Run The Project


```bash
npm install
npm run dev
```



---

###  6. Make your changes

Now open the project in your code editor (like VS Code):

```bash
code .
```

Make your desired changes — for example:

* Add your name to the `contributors` folder
* Improve documentation
* Fix a bug or add a new feature

After editing, check the file status:

```bash
git status
```

---

###  7. Stage and commit your changes

Add your changes:

```bash
git add .
```

Commit with a clear message:

```bash
git commit -m "Added my profile card (Your Name)"
```

---

###  8. Push your branch to your fork

Now push the branch to your forked repository:

```bash
git push origin add-my-profile
```

---

###  9. Create a Pull Request (PR)

1. Go to your fork on GitHub.
2. Click **“Compare & pull request”**.
3. Add a **title** and **description** for your PR.
4. Click **“Create Pull Request”**.

 **Congratulations!** You’ve made your first open-source contribution!

🧭 Need help? Follow these official GitHub guides:

* [How to Create a Pull Request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request)
* [GitHub Forking and Pull Request Workflow](https://docs.github.com/en/get-started/quickstart/fork-a-repo)

---

##  Tips for Contributors

* Always pull the latest changes before starting new work:

  ```bash
  git checkout main
  git pull upstream main
  ```

* Keep each branch focused on a single task.

* Don’t commit unnecessary files or dependencies.

* Be kind, respectful, and help others — open source is a team effort.

---

##  Common Issues

** My branch is outdated**

```bash
git fetch upstream
git merge upstream/main
```

** My PR shows unrelated commits**

> Make sure you’re branching from the latest `main`.

** I messed up my branch**

```bash
git checkout main
git branch -D add-my-profile
git checkout -b add-my-profile
```

---

##  Useful Resources

* [How to Fork and Clone a Repository](https://docs.github.com/en/get-started/quickstart/fork-a-repo)
* [Creating a Pull Request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests)
* [Git Cheat Sheet (PDF)](https://education.github.com/git-cheat-sheet-education.pdf)


```
```
