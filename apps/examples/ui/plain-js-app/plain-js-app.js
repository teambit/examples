export function plainJsApp() {
  const divElement = document.createElement('div');
  const textNode = document.createTextNode('Hello world!');
  divElement.appendChild(textNode);
  return divElement;
}
