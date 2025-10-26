import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TabbedApp from './components/Tabs'
import Login from './Login'

import {
  HashRouter as Router,
  Routes,
  Route,
} from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
        <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/app" element={<TabbedApp/>}/>
            <Route path="*" element={<Login/>}/>
        </Routes>
    </Router>
  )
}

export default App
