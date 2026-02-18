import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Presentation, X, ChevronRight, Star, Calendar, Sparkles, Plus, Trash2 } from "lucide-react";
import FlirtDeck, { DeckData } from "./FlirtDeck";

const DEFAULT_DECK: DeckData = {
  intro: { name: "Miguel", tagline: "Not your average date. 😏", photo: null, gif: null },
  whyMe: [
    { emoji: "🎯", title: "I actually plan things", desc: "Reservations made. Playlist ready." },
    { emoji: "🌙", title: "Better in person", desc: "This deck is already good. Imagine the real thing." },
    { emoji: "🤝", title: "Zero games", desc: "What you see is what you get." },
  ],
  funFacts: ["I can make pancakes at 2am 🥞", "I know every lyric to songs I pretend I don't know 🎵", "I never check my phone during movies 📵"],
  redFlags: [
    { flag: "I over-explain things", severity: 1 },
    { flag: "Terrible at replying to voice notes", severity: 2 },
    { flag: "I'll rate every restaurant internally", severity: 1 },
  ],
};

export default function Index() {
  const [showFlirtModal, setShowFlirtModal] = useState(false);
  const [deckData, setDeckData] = useState<DeckData>(DEFAULT_DECK);

  const updateIntro = (field: keyof DeckData["intro"], value: string) =>
    setDeckData(d => ({ ...d, intro: { ...d.intro, [field]: value } }));

  const updateWhyMe = (idx: number, field: keyof DeckData["whyMe"][0], value: string) => {
    const copy = [...deckData.whyMe];
    copy[idx] = { ...copy[idx], [field]: value };
    setDeckData(d => ({ ...d, whyMe: copy }));
  };

  const updateFunFact = (idx: number, value: string) => {
    const copy = [...deckData.funFacts];
    copy[idx] = value;
    setDeckData(d => ({ ...d, funFacts: copy }));
  };

  const updateRedFlag = (idx: number, field: "flag" | "severity", value: string | number) => {
    const copy = [...deckData.redFlags];
    copy[idx] = { ...copy[idx], [field]: value };
    setDeckData(d => ({ ...d, redFlags: copy }));
  };

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "hsl(340 30% 97%)" }}>

      {/* Top Banner */}
      <div style={{ background: "linear-gradient(90deg, #ff4068, #ff6090)", color: "#fff", textAlign: "center", padding: "8px 16px", fontSize: 13, fontWeight: 700, letterSpacing: "0.05em" }}>
        ❤️ Free to use — No signup needed
      </div>

      {/* Navbar */}
      <nav style={{ display: "flex", justifyContent: "center", padding: "20px 16px 0", position: "sticky", top: 0, zIndex: 40 }}>
        <div style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)", borderRadius: 100, padding: "12px 28px", boxShadow: "0 4px 24px rgba(255,64,104,0.12)", border: "1px solid rgba(255,100,130,0.15)", display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", maxWidth: 900 }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 22, color: "#ff4068", letterSpacing: "-0.02em" }}>
            DateWithMe
          </span>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <button
              onClick={() => setShowFlirtModal(true)}
              style={{ background: "linear-gradient(135deg, #ff4068, #ff6090)", color: "#fff", padding: "10px 24px", borderRadius: 100, fontWeight: 800, fontSize: 13, border: "none", cursor: "pointer", boxShadow: "0 4px 16px rgba(255,64,104,0.35)", letterSpacing: "0.04em" }}>
              GET STARTED
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px 120px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 32 }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div style={{ display: "inline-block", background: "rgba(255,64,104,0.1)", border: "1px solid rgba(255,64,104,0.2)", borderRadius: 100, padding: "6px 18px", marginBottom: 20 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#ff4068", letterSpacing: "0.1em", textTransform: "uppercase" }}>The romantic toolkit</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(44px, 8vw, 80px)", fontWeight: 900, color: "#1a0a10", lineHeight: 1.1, margin: "0 0 20px", letterSpacing: "-0.02em" }}>
            Ask them out.<br /><span style={{ color: "#ff4068" }}>The right way.</span>
          </h1>
          <p style={{ fontSize: 18, color: "#7a5060", maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.6, fontWeight: 500 }}>
            Create a beautiful date invitation or a personal presentation to impress your special someone.
          </p>
        </motion.div>

        {/* Mode Cards */}
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center", width: "100%" }}>
          {/* Invite for a Date */}
          <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            style={{ flex: "1 1 300px", maxWidth: 360, background: "#fff", borderRadius: 28, padding: "36px 32px", boxShadow: "0 12px 48px rgba(255,64,104,0.12)", border: "2px solid rgba(255,64,104,0.08)", cursor: "pointer", textAlign: "left" }}
          >
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, #ff4068, #ff8096)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, boxShadow: "0 8px 24px rgba(255,64,104,0.35)" }}>
              <Heart size={26} fill="white" color="white" />
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 900, color: "#1a0a10", margin: "0 0 10px" }}>Invite for a Date</h2>
            <p style={{ fontSize: 14, color: "#7a5060", lineHeight: 1.6, margin: "0 0 24px" }}>
              Create a step-by-step interactive date invitation — ask the question, pick food, activity & time.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
              {["Ask your question", "Pick food", "Choose activity", "Set date & time"].map(tag => (
                <span key={tag} style={{ background: "rgba(255,64,104,0.08)", color: "#ff4068", borderRadius: 100, padding: "4px 12px", fontSize: 11, fontWeight: 700 }}>{tag}</span>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#ff4068", fontWeight: 800, fontSize: 14 }}>
              <span>Create Invitation</span>
              <ChevronRight size={16} />
            </div>
          </motion.div>

          {/* Presentation Mode */}
          <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            onClick={() => setShowFlirtModal(true)}
            style={{ flex: "1 1 300px", maxWidth: 360, background: "#0a0a0f", borderRadius: 28, padding: "36px 32px", boxShadow: "0 12px 48px rgba(0,0,0,0.35)", border: "1px solid rgba(255,80,120,0.15)", cursor: "pointer", textAlign: "left", position: "relative", overflow: "hidden" }}
          >
            <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,80,120,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, #ff5078, #7850ff)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, boxShadow: "0 8px 24px rgba(255,80,120,0.4)" }}>
              <Presentation size={26} color="white" />
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 900, color: "#fff", margin: "0 0 10px" }}>Presentation Mode</h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, margin: "0 0 24px" }}>
              Create a personal FlirtDeck™ — a beautiful dark slide presentation about yourself to send to your crush.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
              {["Intro", "Why Me", "Fun Facts", "Red Flags", "Rate Me"].map(tag => (
                <span key={tag} style={{ background: "rgba(255,80,120,0.12)", color: "rgba(255,80,120,0.9)", borderRadius: 100, padding: "4px 12px", fontSize: 11, fontWeight: 700, border: "1px solid rgba(255,80,120,0.2)" }}>{tag}</span>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#ff5078", fontWeight: 800, fontSize: 14 }}>
              <span>Create your Deck</span>
              <ChevronRight size={16} />
            </div>
          </motion.div>
        </div>

        {/* How it works */}
        <div style={{ width: "100%", marginTop: 80 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 900, color: "#1a0a10", marginBottom: 48, textAlign: "center" }}>
            How it <span style={{ color: "#ff4068" }}>works</span>
          </h2>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { icon: Star, step: "01", title: "Choose your mode", desc: "Pick an invite or create your personal FlirtDeck™ presentation." },
              { icon: Sparkles, step: "02", title: "Customize", desc: "Personalize every detail — questions, photos, fun facts and more." },
              { icon: Heart, step: "03", title: "Share & get a Yes!", desc: "Send the link and watch them fall for you. Results guaranteed*" },
            ].map((item) => (
              <div key={item.step} style={{ flex: "1 1 220px", maxWidth: 300, background: "#fff", borderRadius: 24, padding: "28px 24px", boxShadow: "0 4px 24px rgba(255,64,104,0.07)", border: "1px solid rgba(255,100,130,0.08)", textAlign: "left" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,64,104,0.5)", letterSpacing: "0.1em" }}>{item.step}</div>
                  <div style={{ flex: 1, height: 1, background: "rgba(255,64,104,0.1)" }} />
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 800, color: "#1a0a10", marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: "#7a5060", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: "#aaa", marginTop: 16, textAlign: "center" }}>*Not guaranteed. But worth a shot.</p>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ textAlign: "center", padding: "32px 16px", color: "#aaa", fontSize: 13, borderTop: "1px solid rgba(255,64,104,0.08)" }}>
        <span style={{ fontFamily: "'Playfair Display', serif", color: "#ff4068", fontWeight: 700 }}>DateWithMe</span> · © 2026 · Made with 💕
      </footer>

      {/* FLIRTDECK MODAL */}
      <AnimatePresence>
        {showFlirtModal && (
          <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowFlirtModal(false)}
              style={{ position: "absolute", inset: 0, background: "rgba(10,5,8,0.75)", backdropFilter: "blur(8px)" }}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              style={{ background: "#fff", borderRadius: 28, width: "100%", maxWidth: 1100, maxHeight: "92vh", overflow: "hidden", position: "relative", zIndex: 1, display: "flex", flexDirection: "column" }}
            >
              {/* Modal header */}
              <div style={{ padding: "20px 28px", borderBottom: "1px solid rgba(255,64,104,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 900, color: "#1a0a10", margin: 0 }}>
                    FlirtDeck™ Editor
                  </h2>
                  <p style={{ fontSize: 13, color: "#9a7080", margin: "4px 0 0" }}>Customize your presentation, then share the link with your crush</p>
                </div>
                <button onClick={() => setShowFlirtModal(false)} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,0.06)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <X size={18} color="#666" />
                </button>
              </div>

              {/* Modal body: editor + preview */}
              <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

                {/* LEFT: Editor */}
                <div style={{ width: "42%", overflow: "auto", padding: "24px", borderRight: "1px solid rgba(255,64,104,0.08)", flexShrink: 0 }}>
                  <EditorSection label="Intro">
                    <Field label="Your Name">
                      <Input value={deckData.intro.name} onChange={e => updateIntro("name", e.target.value)} />
                    </Field>
                    <Field label="Your Tagline">
                      <Input value={deckData.intro.tagline} onChange={e => updateIntro("tagline", e.target.value)} placeholder="Not your average date. 😏" />
                    </Field>
                  </EditorSection>

                  <EditorSection label="Why Me">
                    {deckData.whyMe.map((w, i) => (
                      <div key={i} style={{ background: "rgba(255,64,104,0.04)", borderRadius: 12, padding: "12px", marginBottom: 8, border: "1px solid rgba(255,64,104,0.08)" }}>
                        <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                          <Input value={w.emoji} onChange={e => updateWhyMe(i, "emoji", e.target.value)} style={{ width: 52 }} placeholder="🎯" />
                          <Input value={w.title} onChange={e => updateWhyMe(i, "title", e.target.value)} placeholder="Title" style={{ flex: 1 }} />
                        </div>
                        <Input value={w.desc} onChange={e => updateWhyMe(i, "desc", e.target.value)} placeholder="Description" />
                        {deckData.whyMe.length > 1 && (
                          <button onClick={() => setDeckData(d => ({ ...d, whyMe: d.whyMe.filter((_, j) => j !== i) }))} style={trashStyle}>
                            <Trash2 size={12} /> Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <AddButton onClick={() => setDeckData(d => ({ ...d, whyMe: [...d.whyMe, { emoji: "✨", title: "New reason", desc: "Describe it here" }] }))}>
                      + Add reason
                    </AddButton>
                  </EditorSection>

                  <EditorSection label="Fun Facts">
                    {deckData.funFacts.map((f, i) => (
                      <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                        <Input value={f} onChange={e => updateFunFact(i, e.target.value)} placeholder="Fun fact..." style={{ flex: 1 }} />
                        {deckData.funFacts.length > 1 && (
                          <button onClick={() => setDeckData(d => ({ ...d, funFacts: d.funFacts.filter((_, j) => j !== i) }))} style={{ ...trashStyle, margin: 0, padding: "0 10px" }}>
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                    <AddButton onClick={() => setDeckData(d => ({ ...d, funFacts: [...d.funFacts, "New fun fact 🎉"] }))}>
                      + Add fun fact
                    </AddButton>
                  </EditorSection>

                  <EditorSection label="Red Flags">
                    {deckData.redFlags.map((r, i) => (
                      <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "center" }}>
                        <Input value={r.flag} onChange={e => updateRedFlag(i, "flag", e.target.value)} placeholder="Red flag..." style={{ flex: 1 }} />
                        <select value={r.severity} onChange={e => updateRedFlag(i, "severity", Number(e.target.value))} style={{ ...inputStyle, width: 52 }}>
                          <option value={1}>🟡</option>
                          <option value={2}>🟠</option>
                          <option value={3}>🔴</option>
                        </select>
                        {deckData.redFlags.length > 1 && (
                          <button onClick={() => setDeckData(d => ({ ...d, redFlags: d.redFlags.filter((_, j) => j !== i) }))} style={{ ...trashStyle, margin: 0, padding: "0 10px" }}>
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                    <AddButton onClick={() => setDeckData(d => ({ ...d, redFlags: [...d.redFlags, { flag: "New red flag", severity: 1 }] }))}>
                      + Add red flag
                    </AddButton>
                  </EditorSection>

                  {/* Share & Preview buttons */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
                    <button
                      onClick={() => {
                        try {
                          const str = JSON.stringify(deckData);
                          const b64 = btoa(unescape(encodeURIComponent(str)));
                          const url = `${window.location.origin}/flirt-deck?d=${b64}`;
                          navigator.clipboard?.writeText(url);
                          window.open(url, "_blank");
                        } catch (e) {
                          console.error(e);
                        }
                      }}
                      style={{ width: "100%", padding: "14px", borderRadius: 14, background: "linear-gradient(135deg, #ff5078, #ff3060)", border: "none", color: "#fff", fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 800, cursor: "pointer", letterSpacing: "0.04em", boxShadow: "0 8px 24px rgba(255,80,120,0.35)" }}>
                      🔗 Copy & Open Link
                    </button>

                    {/* Mobile Preview Button - Visible primarily on smaller screens via logic or just always available as an option */}
                    <button
                      onClick={() => {
                        const str = JSON.stringify(deckData);
                        const b64 = btoa(unescape(encodeURIComponent(str)));
                        window.open(`/flirt-deck?d=${b64}`, '_blank');
                      }}
                      style={{ width: "100%", padding: "12px", borderRadius: 14, background: "rgba(255,64,104,0.06)", border: "1px solid rgba(255,64,104,0.15)", color: "#ff4068", fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>
                      📱 Mobile Preview
                    </button>
                  </div>
                </div>

                {/* RIGHT: Live preview (Hidden on small mobile screens in the real app, but here we can keep it responsive) */}
                <div className="hidden md:block" style={{ flex: 1, overflow: "auto", background: "#08080c" }}>
                  <FlirtDeck data={deckData} compact />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Small UI helpers ────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "8px 12px", borderRadius: 10,
  border: "1px solid rgba(255,64,104,0.15)", fontSize: 13,
  fontFamily: "'Inter', sans-serif", outline: "none", background: "#fff",
  color: "#1a0a10", boxSizing: "border-box",
};

function Input({ value, onChange, placeholder, style }: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; style?: React.CSSProperties }) {
  return <input value={value} onChange={onChange} placeholder={placeholder} style={{ ...inputStyle, ...style }} />;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#9a7080", marginBottom: 5, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</label>
      {children}
    </div>
  );
}

function EditorSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: "#ff4068", marginBottom: 12, paddingBottom: 6, borderBottom: "1px solid rgba(255,64,104,0.1)", letterSpacing: "0.04em" }}>
        {label}
      </div>
      {children}
    </div>
  );
}

const trashStyle: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 4,
  background: "none", border: "none", cursor: "pointer",
  color: "#cca0a8", fontSize: 11, padding: "4px 0", marginTop: 4,
};

function AddButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,64,104,0.06)", border: "1px dashed rgba(255,64,104,0.2)", borderRadius: 10, padding: "8px 14px", color: "#ff4068", fontSize: 12, fontWeight: 700, cursor: "pointer", width: "100%" }}>
      {children}
    </button>
  );
}
