import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import Contato from './pages/contato/Contato';
import ScrollExpandIntro from './components/scrollexpand/ScrollExpandIntro';
import Coberturas from './pages/cobertura/Cobertura';
import Servicos from './pages/servicos/Servicos';
import Login from './pages/login/Login';
import Cadastro from './pages/cadastro/Cadastro';
import ListagemApolices from './pages/apolices/ListagemApolices';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ScrollExpandIntro>
              <Home />
            </ScrollExpandIntro>
          }
        />
        
        <Route
          path="/home"
          element={
            <ScrollExpandIntro>
              <Home />
            </ScrollExpandIntro>
          }
        />

        <Route path="/contato" element={<Contato />} />
        <Route path="/coberturas" element={<Coberturas />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/apolices" element={<ListagemApolices />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;