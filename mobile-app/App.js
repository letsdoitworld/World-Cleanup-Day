import App from './src';
console.disableYellowBox = true;

// this routes all requests to the debugger network tab, if it's present
window.XMLHttpRequest = window.originalXMLHttpRequest
  ? window.originalXMLHttpRequest
  : window.XMLHttpRequest;

// export default from './storybook';
export default App;
