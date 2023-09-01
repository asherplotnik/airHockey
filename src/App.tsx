import classes from './App.module.css'
import { Route, Routes } from 'react-router-dom'
import CreateGame from './components/layout/createGame/CreateGame'
import JoinGame from './components/layout/joinGame/JoinGame'
import Game from './components/layout/Game/Game'
import Home from './components/layout/header/Home'

const App = () => {
  
  return (
    <div className={classes.App}>
      <Routes>
        <Route path='/game' Component={Game}/>
        <Route path="/create" Component={CreateGame} />
        <Route path="/join" Component={JoinGame} />
        <Route path="/" Component={Home} /> 
      </Routes>
    </div>
  )
}

export default App
