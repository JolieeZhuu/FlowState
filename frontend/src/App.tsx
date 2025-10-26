import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TabbedApp from './components/Tabs'
import Login from './login'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
        {/*<TabbedApp/>*/}
        <Login/>
    </div>
  )
}

export default App
