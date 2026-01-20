import { Home } from './components/home/Home';
import { Header } from './components/header/Header';
import { Learn } from './components/learn/Learn';
import { Login } from './components/login/Login';
import { Quiz } from './components/quiz/Quiz';
import Pdf from './components/pdf';
import Flashcards from './components/Flashcards';
import Roadmap from './components/Roadmap';
import Dashboard from './components/dashboard/Dashboard';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./index.css"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/home' element={<Home />} />
          <Route path='/learn' element={<Learn />} />
          <Route path="/pdf" element={<Pdf />} />
          <Route path='/login' element={<Login />} />
          <Route path='/quiz' element={<Quiz />} />
          <Route path='/flashcards' element={<Flashcards />} />
          <Route path='/roadmap' element={<Roadmap />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;