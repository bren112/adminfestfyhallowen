import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/navbar';
import Footer from './components/footer';
import Home from "./pages/dashboard/Dashboard";
import Aprovar from "./pages/aprovar/Aprovar";
import Aprovados from "./pages/aprovados/Aprovados";



function App() {
  return (
    <BrowserRouter>
      <div id="root">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Home />} />
            <Route path="/aprovar" element={<Aprovar />} />
            <Route path="/aprovados" element={<Aprovados />} />
           
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
