import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from './components/navbar/NavBar';
import Home from './pages/home/Home';

function App() {
  return (

      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          {/*
          próximas rotas aqui
          <Route path="/coberturas" element={<Coberturas />} />
          <Route path="/vantagens" element={<Vantagens />} />
          <Route path="/como-funciona" element={<ComoFunciona />} />
          <Route path="/avaliacoes" element={<Avaliacoes />} />
          <Route path="/faq" element={<Faq />} />
          */}
        </Routes>
      </BrowserRouter>

  );
}

export default App;