# EODHP Resource Catalogue

This template provides a minimal setup to get React Typescript working in Vite with HMR and some ESLint rules inside of the EODHP Project.

## Development

First install the dependencies:

```bash
npm install
```

Collect the .eslintrc.cjs linting config file:

```commandline
make setup
```

It's safe and fast to run `make setup` repeatedly as it will only update these things if
they have changed.


To start the development server:

```bash
npm run dev
```

To lint your code:
  
```bash
npm run lint:fix
```
