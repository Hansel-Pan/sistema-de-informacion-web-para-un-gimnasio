import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Inicio from './pages/Inicio';
import Clientes from './pages/Clientes';
import ClienteForm from './pages/ClienteForm';
import Pagos from './pages/Pagos';
import Acceso from './pages/Acceso';
import Reportes from './pages/Reportes';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/clientes/nuevo" element={<ClienteForm />} />
            <Route path="/clientes/editar/:id" element={<ClienteForm />} />
            <Route path="/pagos" element={<Pagos />} />
            <Route path="/acceso" element={<Acceso />} />
            <Route path="/reportes" element={<Reportes />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
