import './plain-js-app.css';

export function plainJsApp() {
  const text = document.createTextNode('Hello World!');
  const div = document.createElement('div');
  div.className = 'greeting';
  div.appendChild(text);
  return div;
}
