# Contributing to Pluma

Thanks for your interest in contributing. This document describes how to propose changes to the project.

## Ways to contribute

- Report bugs and request features via [GitHub Issues](https://github.com/Daryan97/pluma/issues)
- Improve documentation
- Submit bug fixes or small, focused features via pull requests

If you plan a large change, open an issue first so we can discuss scope before you invest time.

## Development setup

1. Fork the repository and clone your fork:

   ```bash
   git clone https://github.com/<your-username>/pluma.git
   cd pluma
   ```

2. Add the upstream remote (optional but recommended):

   ```bash
   git remote add upstream https://github.com/Daryan97/pluma.git
   ```

3. Install dependencies and configure env:

   ```bash
   npm install
   cp .env.example .env
   ```

4. Point `.env` at a Supabase project (see [README](README.md) and [docs/DEPLOY.md](docs/DEPLOY.md)). For a fresh database, use `/install` or `src/install/pluma_initial.sql`.

5. Start the app:

   ```bash
   npm run dev
   ```

Node.js 20+ is required.

## Branching and commits

1. Sync with `main` (or the default branch) before starting work.
2. Create a topic branch:

   ```bash
   git checkout -b fix/short-description
   ```

3. Keep commits focused. Prefer clear messages that explain **why** the change exists.

Examples:

```text
fix: show avatar from profile cache in navbar
docs: document feed cache TTL in DEPLOY.md
```

## Pull requests

1. Push your branch to your fork.
2. Open a pull request against `Daryan97/pluma`’s default branch.
3. In the PR description, include:
   - What changed and why
   - How you tested it
   - Screenshots for UI changes (when useful)
   - Linked issue number, if any (`Fixes #123`)

4. Keep the diff limited to the problem you are solving. Do not mix unrelated refactors, dependency bumps, or formatting-only churn with feature work.

5. Expect review feedback. Please respond to comments or push follow-up commits on the same branch.

## Coding guidelines

- Match the style and patterns already used in nearby files.
- Prefer small, readable changes over large rewrites.
- Do not commit secrets, `.env` files, or local credentials.
- Do not add dependencies unless they are necessary for the change.
- For UI work, check light and dark themes and at least one RTL locale (`ar` or `ku`) when the change touches layout or chrome.
- Avoid importing the full `@iconify-json/mdi` pack; use the existing offline subset / Iconify usage in the repo.

## Issues

When filing a bug, include:

- Pluma version or commit, and how you run it (Docker, local, Vercel, etc.)
- Steps to reproduce
- Expected vs actual behavior
- Browser or environment details when relevant
- Logs or screenshots if they help

For feature requests, describe the problem you are trying to solve and any constraints.

## Code of conduct

Be respectful in issues, discussions, and reviews. Harassment and personal attacks are not acceptable.

## License

By contributing, you agree that your contributions will be licensed under the same [MIT License](LICENSE) that covers this project.
