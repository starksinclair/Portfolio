import { Navigate, Route, Routes } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { Layout } from "./components/Layout";
import { Overview } from "./pages/Overview";
import { About } from "./pages/About";
import { Experience } from "./pages/Experience";
import { Projects } from "./pages/Projects";
import { ProjectDetail } from "./pages/ProjectDetail";
import { Research } from "./pages/Research";
import { Writing } from "./pages/Writing";
import { PostDetail } from "./pages/PostDetail";
import { Press } from "./pages/Press";
import { Cv } from "./pages/Cv";
import { Contact } from "./pages/Contact";
import { Colophon } from "./pages/Colophon";
import { NotFound } from "./pages/NotFound";

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Overview />} />
          <Route path="/about" element={<About />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/research" element={<Research />} />
          <Route path="/writing" element={<Writing />} />
          <Route path="/writing/:slug" element={<PostDetail />} />
          <Route path="/press" element={<Press />} />
          <Route path="/cv" element={<Cv />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/colophon" element={<Colophon />} />

          {/* Legacy URLs from the previous site, kept so existing links resolve. */}
          <Route path="/resume" element={<Navigate to="/cv" replace />} />
          <Route path="/portfolio" element={<Projects />} />
          <Route path="/works" element={<Projects />} />
          <Route path="/works/:slug" element={<ProjectDetail />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Analytics />
    </>
  );
}
