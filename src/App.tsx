import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { HistoryPage, HomePage, LoginPage, RegisterPage, WaitingListPage } from './pages'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/waiting-list" element={<WaitingListPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </Router>
  )
}

export default App
