const React = require("react");
const ReactDOMServer = require("react-dom/server");

function renderComponent(
  reactComponent,
  props = {},
  options = { doctype: true }
) {
  const reactElement = React.createElement(reactComponent, {
    ...this.app.locals,
    ...this.locals,
    ...props,
  });
  const html = ReactDOMServer.renderToStaticMarkup(reactElement);
  return options.htmlOnly ? html : `<!DOCTYPE html>${html}`;
}

function ssr(req, res, next) {
  res.renderComponent = renderComponent;
  next();
}

module.exports = ssr;
