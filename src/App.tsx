import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { HomePage, LoginPage, RegisterPage } from './pages'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  )
}

export default App
