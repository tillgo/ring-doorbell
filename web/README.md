# React + TypeScript + Vite

## Environment-Variables
In the [**.env.example**](src/.env.example) file under the **/src** folder are all variables defined,
which can be defined for the application  
If you add a new Environment-Variable please also add it to the [**.env.example**](src/.env.example) file as well
as to the [**vite-env.d.ts**](src/vite-env.d.ts) file
  
To expose a variable to the source code, it has to be prefixed with: **VITE_**

### Production
**not relevant for developers**  
Copy the [**.env.example**](src/.env.example) file, rename it to **.env.production** and insert correct variables for your 
production environment

### Development
Copy the [**.env.example**](src/.env.example) file, rename it to **.env.development** file and insert the correct variables
for your development environment

## Template

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

