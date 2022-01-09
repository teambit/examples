import { plainJsApp } from './plain-js-app';

function mountApp() {
  const root = document.getElementById('root');
  const app = plainJsApp();
  root.appendChild(app);
}

document.addEventListener('DOMContentLoaded', mountApp);
