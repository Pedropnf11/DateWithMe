import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { DeckData } from "./FlirtDeck";
import Navbar from "../components/Landing/Navbar";
import Hero from "../components/Landing/Hero";
import HowItWorks from "../components/Landing/HowItWorks";
import Footer from "../components/Landing/Footer";
import FlirtDeckEditor from "../components/Editor/FlirtDeckEditor";

const DEFAULT_DECK: DeckData = {
  intro: { name: "Miguel", tagline: "Not your average date. 😏", photo: null, gif: null },
  whyMe: [
    { emoji: "🎯", title: "I actually plan things", desc: "Reservations made. Playlist ready." },
    { emoji: "🌙", title: "Better in person", desc: "This deck is already good. Imagine the real thing." },
    { emoji: "🤝", title: "Zero games", desc: "What you see is what you get." },
  ],
  funFacts: ["I can make pancakes at 2am 🥞", "I know every lyric to songs I pretend I don't know 🎵", "I never check my phone during movies 吞"],
  redFlags: [
    { flag: "I over-explain things", severity: 1 },
    { flag: "Terrible at replying to voice notes", severity: 2 },
    { flag: "I'll rate every restaurant internally", severity: 1 },
  ],
};

export default function Index() {
  const [showFlirtModal, setShowFlirtModal] = useState(false);
  const [deckData, setDeckData] = useState<DeckData>(DEFAULT_DECK);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "hsl(340 30% 97%)" }}>
      {/* Top Banner */}
      <div style={{ background: "linear-gradient(90deg, #ff4068, #ff6090)", color: "#fff", textAlign: "center", padding: "8px 16px", fontSize: 13, fontWeight: 700, letterSpacing: "0.05em" }}>
        ❤️ Free to use — No signup needed
      </div>

      <Navbar onGetStarted={() => setShowFlirtModal(true)} />

      <Hero onStartEditor={() => setShowFlirtModal(true)} />

      <HowItWorks />

      <Footer />

      {/* FLIRTDECK MODAL */}
      <AnimatePresence>
        {showFlirtModal && (
          <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            {/* Backdrop */}
            <div
              onClick={() => setShowFlirtModal(false)}
              style={{ position: "absolute", inset: 0, background: "rgba(10,5,8,0.75)", backdropFilter: "blur(8px)" }}
            />

            <FlirtDeckEditor
              deckData={deckData}
              setDeckData={setDeckData}
              onClose={() => setShowFlirtModal(false)}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
