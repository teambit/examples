import './plain-js-app.css';

export function plainJsApp() {
  const divElement = document.createElement('div');
  divElement.className = 'greeting';
  const textNode = document.createTextNode('Hello World!');
  divElement.appendChild(textNode);
  return divElement;
}
