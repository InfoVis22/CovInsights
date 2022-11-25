//  Import Components and Services
import Home from './pages/Home/Home'
import TopBar from './components/TopBar/TopBar'

//Import global style
import './App.scss'

function App() {

  return (
    <div className="App">
      <TopBar />
      <Home />
    </div>
  )
}

export default App
