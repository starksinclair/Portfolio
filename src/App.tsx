import Home from "./components/Home";
import { Analytics } from "@vercel/analytics/react";


import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WorkDetail } from "./components/work-details/WorkDetail";
import { Works } from "./components/Works";
import { Footer } from "./components/Footer";
import { useEffect } from "react";

function App() {
  const location = window.location.pathname
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);
  return (
    <>
      <Analytics />
      {/* <main> */}
      {/* <div className="welcome-message">
            <Home />
          </div> */}
      <BrowserRouter>
        {/* <div className="app-container">
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/portfolio">Portfolio</Link></li>
          </ul>
        </nav> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Works id="" />} />
          <Route path="/works/:workId" element={<WorkDetail />} />
        </Routes>
        <Footer />
        {/* </div> */}
      </BrowserRouter>
      {/* </main> */}
    </>
  );
}

export default App;
