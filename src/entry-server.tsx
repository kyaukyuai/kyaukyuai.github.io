import { renderToStaticMarkup } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { App } from './App'

// Build-time prerender entry. Renders a given route to static HTML.
export function render(url: string): string {
  return renderToStaticMarkup(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  )
}
