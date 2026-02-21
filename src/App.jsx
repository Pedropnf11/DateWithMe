import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Create from './pages/Create';
import Invite from './pages/Invite';
import Result from './pages/Result';
import FlirtPreviewPage from './pages/Flirtdeckpage';
import SurpriseCreate from './pages/SurpriseCreate';
import SurpriseInvite from './pages/SurpriseInvite';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/criar" element={<Create />} />
        <Route path="/convite/:id" element={<Invite />} />
        <Route path="/resultado/:id" element={<Result />} />
        <Route path="/flirt-deck" element={<FlirtPreviewPage />} />
        <Route path="/flirt-deck/:id" element={<FlirtPreviewPage />} />
        <Route path="/criar-surpresa" element={<SurpriseCreate />} />
        <Route path="/surpresa/:id" element={<SurpriseInvite />} />
        <Route path="/privacidade" element={<Privacy />} />
        <Route path="/termos" element={<Terms />} />
      </Routes>
    </Router>
  );
}

export default App;
