import { useState } from "react";
import { useRef } from "react";
import { gsap } from "gsap";
import Home from "./components/Home";
import { Analytics } from "@vercel/analytics/react";

import "./App.css";

function App() {
  const [name, setName] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);
  const animatedContentRef = useRef<HTMLDivElement>(null);

  const handler = (event: any) => {
    event.preventDefault();

    document.body.classList.toggle("customBodyStyle");

    // Hide the card and display the animated content
    if (cardRef.current && animatedContentRef.current) {
      cardRef.current.style.display = "none";
      animatedContentRef.current.style.display = "block";
    }

    // Animation using gsap

    let ctx = gsap.context(() => {
      const t1 = gsap.timeline();
      t1.from("#intro-slider", {
        xPercent: "-100",
        duration: 1.9,
        delay: 0.9,
      })
        .from(["#title-1", "#title-2", "#title-3"], {
          opacity: 0,
          y: "+=30",
          stagger: 0.5,
        })
        .to(["#title-1", "#title-2", "#title-3"], {
          opacity: 0,
          y: "-=30",
          delay: 0.3,
          stagger: 0.5,
        })
        .to("#intro-slider", {
          xPercent: "-100",
          duration: 1.3,
        })
        .from("#welcome", {
          opacity: 0,
          duration: 0.1,
        });
    }, animatedContentRef);

    return () => ctx.revert();
  };

  return (
    <>
      <Analytics />
      <main>
        <div className="card" ref={cardRef}>
          <h1>Welcome</h1>
          {/* <p>Please enter your name to continue</p> */}

          <form action="#" onSubmit={handler}>
            <div className="input-group">
              <label htmlFor="name" className="sr-only">
                Please enter your name to continue
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your Name"
                required
                autoFocus
                autoComplete="on"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <button type="submit" className="btn">
              Login
            </button>
          </form>
        </div>

        <div className="relative" ref={animatedContentRef}>
          <div id="intro-slider" className="slider">
            <h1 className="text" id="title-1">
              Software Engineer
            </h1>
            <h1 className="text" id="title-2">
              Web Developer
            </h1>
            <h1 className="text" id="title-3">
              Freelancer
            </h1>
          </div>
          <div className="welcome-message">
            <Home name={name} />
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
