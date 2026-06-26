import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { Articles } from './pages/Articles'
import { Article } from './pages/Article'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/articles" element={<Articles />} />
      <Route path="/articles/:slug" element={<Article />} />
    </Routes>
  )
}
