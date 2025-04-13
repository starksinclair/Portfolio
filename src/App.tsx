import Home from "./components/home/Home";
import { Analytics } from "@vercel/analytics/react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProjectDetail } from "./components/project-details/ProjectDetail";
import { Works } from "./components/works/Works";
import { Footer } from "./components/footer/Footer";
import { useEffect } from "react";

function App() {
  const location = window.location.pathname;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return (
    <>
      <Analytics />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Works id="" />} />
          <Route path="/works/:workId" element={<ProjectDetail />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
