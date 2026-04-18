import { useState } from 'react'
import LoginPage from './components/LoginPage'
import Dashboard from './components/Dashboard'
import './index.css'

function App() {
  // Simple state to toggle between the Fake Login (honeypot) and the Dashboard
  const [view, setView] = useState('login') // 'login' or 'dashboard'

  return (
    <div>
      {view === 'login' ? (
        <LoginPage onGoToDashboard={() => setView('dashboard')} />
      ) : (
        <Dashboard onGoToLogin={() => setView('login')} />
      )}
    </div>
  )
}

export default App
