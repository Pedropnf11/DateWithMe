import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Create from './pages/Create';

import Invite from './pages/Invite';
import Result from './pages/Result';
import FlirtPreviewPage from './pages/FlirtPreviewPage';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/criar" element={<Create />} />
        <Route path="/convite/:id" element={<Invite />} />
        <Route path="/resultado/:id" element={<Result />} />
        <Route path="/flirt-preview" element={<FlirtPreviewPage />} />
      </Routes>
    </Router>
  );
}

export default App;
