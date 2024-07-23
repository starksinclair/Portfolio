import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Helmet } from "react-helmet";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Helmet>
      <title>Sinclair Nzenwata | Software Engineer & Web Developer</title>
      <meta
        name="description"
        content="Explore Sinclair Nzenwata's portfolio showcasing software engineering, web development projects, and freelance work."
      />
      <meta
        name="keywords"
        content="Sinclair Nzenwata, Software Engineer, Web Developer, Freelancer, Portfolio"
      />
      <meta name="author" content="Sinclair Nzenwata" />
      <link rel="canonical" href="https://sinclairnzenwata.site" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://sinclairnzenwata.site/" />
      <meta
        property="og:title"
        content="Sinclair Nzenwata | Software Engineer & Web Developer"
      />
      <meta
        property="og:description"
        content="Explore Sinclair Nzenwata's portfolio showcasing software engineering, web development projects, and freelance work."
      />
      <meta
        property="og:image"
        content="https://sinclairnzenwata.site/path-to-your-og-image.jpg"
      />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://sinclairnzenwata.site/" />
      <meta
        property="twitter:title"
        content="Sinclair Nzenwata | Software Engineer & Web Developer"
      />
      <meta
        property="twitter:description"
        content="Explore Sinclair Nzenwata's portfolio showcasing software engineering, web development projects, and freelance work."
      />
      <meta
        property="twitter:image"
        content="https://sinclairnzenwata.site/path-to-your-twitter-image.jpg"
      />

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Sinclair Nzenwata",
          url: "https://sinclairnzenwata.site",
          sameAs: [
            "https://www.linkedin.com/in/sinclair-nzenwata-8a7108236",
            "https://github.com/starksinclair",
          ],
          jobTitle: "Software Engineer",
          worksFor: {
            "@type": "Digital Corps",
            name: "Ball State University",
          },
          description:
            "Explore Sinclair Nzenwata's portfolio and learn more about his skills and projects in software engineering, web development, and freelancing.",
        })}
      </script>
    </Helmet>
    <App />
  </React.StrictMode>
);
