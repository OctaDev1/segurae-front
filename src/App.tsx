import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/home/Home';
import Contato from './pages/contato/Contato';
import ScrollExpandIntro from './components/scrollexpand/ScrollExpandIntro';
import Coberturas from './pages/cobertura/Cobertura';
import Servicos from './pages/servicos/Servicos';
import Login from './pages/login/Login';
import Dashboard from './pages/dashboard/Dashboard';

function App() {
  return (
    <AuthProvider>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          {/* Rota inicial com a animação de intro */}
          <Route
            path="/"
            element={
              <ScrollExpandIntro>
                <Home />
              </ScrollExpandIntro>
            }
          />
          
          {/* Rota /home também utilizando a intro */}
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
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Futuras rotas entram normalmente sem a intro */}
          {/*
          
          <Route path="/avaliacoes" element={<Avaliacoes />} />
          <Route path="/contato" element={<Contato />} />
          */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;