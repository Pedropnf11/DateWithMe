import { useState } from "react";

export interface DeckData {
  intro: {
    name: string;
    tagline: string;
    photo?: string | null;
    gif?: string | null;
  };
  whyMe: Array<{ emoji: string; title: string; desc: string }>;
  funFacts: string[];
  redFlags: Array<{ flag: string; severity: number }>;
}

const DEFAULT_DATA: DeckData = {
  intro: {
    name: "Miguel",
    tagline: "Not your average date. 😏",
    photo: null,
    gif: null,
  },
  whyMe: [
    { emoji: "🎯", title: "I actually plan things", desc: "Reservations made. Playlist ready. No 'idk where do you wanna go'." },
    { emoji: "🌙", title: "Better in person", desc: "This deck is already good. Imagine the real thing." },
    { emoji: "🤝", title: "Zero games", desc: "What you see is what you get. Mostly good stuff." },
  ],
  funFacts: [
    "I can make pancakes at 2am and they're genuinely incredible 🥞",
    "I know every lyric to songs I pretend I don't know 🎵",
    "I never check my phone during movies 📵",
    "I can parallel park on the first try. Every time 🚗",
  ],
  redFlags: [
    { flag: "I over-explain things", severity: 1 },
    { flag: "Terrible at replying to voice notes", severity: 2 },
    { flag: "I'll rate every restaurant internally", severity: 1 },
  ],
};

const SLIDES = ["intro", "why_me", "fun_facts", "red_flags", "rate_me"] as const;
const SLIDE_LABELS = {
  intro: "Intro",
  why_me: "Why Me",
  fun_facts: "Fun Facts",
  red_flags: "Red Flags",
  rate_me: "Rate Me",
};

interface FlirtDeckProps {
  data?: DeckData;
  compact?: boolean;
}

export default function FlirtDeck({ data: initialData, compact = false }: FlirtDeckProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [animating, setAnimating] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showRedFlag, setShowRedFlag] = useState<number | null>(null);

  const data = initialData || DEFAULT_DATA;

  const goTo = (idx: number) => {
    if (animating || idx === currentSlide || idx < 0 || idx >= SLIDES.length) return;
    setDirection(idx > currentSlide ? 1 : -1);
    setAnimating(true);
    setTimeout(() => {
      setCurrentSlide(idx);
      setAnimating(false);
    }, 300);
  };

  const next = () => goTo(currentSlide + 1);
  const prev = () => goTo(currentSlide - 1);

  const slideStyle: React.CSSProperties = {
    transform: animating ? `translateX(${direction * 56}px)` : "translateX(0)",
    opacity: animating ? 0 : 1,
    transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
  };

  const p = compact ? { pad: "28px 24px", maxW: 380, minH: 420, card: 24, fontSize: { h: 22, body: 12 } }
    : { pad: "40px 36px", maxW: 440, minH: 520, card: 28, fontSize: { h: 30, body: 14 } };

  return (
    <div style={{
      minHeight: "100dvh",
      background: "#08080c",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Playfair Display', Georgia, serif",
      padding: "20px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Ambient background */}
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(circle at 20% 20%, rgba(255,80,120,0.08) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(120,80,255,0.06) 0%, transparent 40%)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: compact ? "100%" : 480, position: "relative", zIndex: 1 }}>
        {/* Progress dots */}
        <div style={{ display: "flex", gap: 6, marginBottom: 24, justifyContent: "center" }}>
          {SLIDES.map((s, i) => (
            <div key={s} style={{
              flex: 1, height: 4, borderRadius: 10,
              background: i === currentSlide ? "linear-gradient(90deg, #ff5078, #ff80a0)" : i < currentSlide ? "rgba(255,80,120,0.4)" : "rgba(255,255,255,0.1)",
              transition: "all 0.4s",
            }} />
          ))}
        </div>

        {/* Card */}
        <div style={{
          minHeight: compact ? 380 : 540,
          background: "rgba(20,20,25,0.7)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 32,
          padding: compact ? "24px" : "36px",
          backdropFilter: "blur(24px)",
          boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
          display: "flex", flexDirection: "column",
          ...slideStyle,
        }}>
          {SLIDES[currentSlide] === "intro" && <SlideIntro data={data.intro} compact={compact} />}
          {SLIDES[currentSlide] === "why_me" && <SlideWhyMe data={data.whyMe} compact={compact} />}
          {SLIDES[currentSlide] === "fun_facts" && <SlideFunFacts data={data.funFacts} compact={compact} />}
          {SLIDES[currentSlide] === "red_flags" && <SlideRedFlags data={data.redFlags} showFlag={showRedFlag} setShowFlag={setShowRedFlag} compact={compact} />}
          {SLIDES[currentSlide] === "rate_me" && <SlideRateMe rating={rating} setRating={setRating} hoverRating={hoverRating} setHoverRating={setHoverRating} submitted={submitted} setSubmitted={setSubmitted} compact={compact} />}
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: 12, marginTop: 24, alignItems: "center" }}>
          <button
            onClick={prev}
            disabled={currentSlide === 0}
            style={{ width: 56, height: 56, borderRadius: 20, background: "rgba(255,255,255,0.05)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.1)", opacity: currentSlide === 0 ? 0.3 : 1, cursor: "pointer" }}
          >
            ←
          </button>

          <button
            onClick={next}
            disabled={currentSlide === SLIDES.length - 1}
            style={{
              flex: 1, height: 56, borderRadius: 20,
              background: currentSlide === SLIDES.length - 1 ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #ff5078, #ff3060)",
              color: "#fff", fontWeight: 800, border: "none", cursor: "pointer",
              boxShadow: currentSlide === SLIDES.length - 1 ? "none" : "0 8px 32px rgba(255,80,120,0.3)",
              transition: "all 0.2s"
            }}
          >
            {currentSlide === SLIDES.length - 1 ? "The End" : "Next Slide →"}
          </button>
        </div>
      </div>
    </div>
  );
}

function NavBtn({ onClick, disabled, label, compact }: { onClick: () => void; disabled: boolean; label: string; compact?: boolean }) {
  const size = compact ? 38 : 48;
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: size, height: size, borderRadius: "50%",
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.1)",
      color: disabled ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.7)",
      fontSize: compact ? 16 : 20, cursor: disabled ? "default" : "pointer",
      transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center",
    }}>{label}</button>
  );
}

// ── SLIDE: INTRO ──────────────────────────────────────────────
function SlideIntro({ data, compact }: { data: DeckData["intro"]; compact?: boolean }) {
  return (
    <div style={{ textAlign: "center", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: compact ? 16 : 24 }}>
      <div style={{
        width: compact ? 80 : 120, height: compact ? 80 : 120,
        borderRadius: "50%",
        background: data.photo || data.gif ? `url(${data.photo || data.gif}) center/cover` : "linear-gradient(135deg, #ff5078 0%, #7850ff 100%)",
        border: "3px solid rgba(255,80,120,0.4)",
        boxShadow: "0 0 40px rgba(255,80,120,0.3)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: compact ? 32 : 48, flexShrink: 0,
      }}>
        {!data.photo && !data.gif && "👤"}
      </div>
      <div>
        <div style={{ fontSize: 10, letterSpacing: "0.32em", color: "rgba(255,80,120,0.7)", textTransform: "uppercase", marginBottom: 8 }}>presenting</div>
        <h1 style={{ fontSize: compact ? 36 : 50, fontWeight: "bold", color: "#fff", margin: 0, lineHeight: 1, letterSpacing: "-0.02em" }}>{data.name}</h1>
      </div>
      <p style={{ fontSize: compact ? 13 : 17, color: "rgba(255,255,255,0.5)", fontStyle: "italic", margin: 0, lineHeight: 1.5 }}>"{data.tagline}"</p>
      <div style={{ width: 60, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,80,120,0.5), transparent)" }} />
      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em", margin: 0 }}>FLIRTDECK™ · 5 SLIDES</p>
    </div>
  );
}

// ── SLIDE: WHY ME ─────────────────────────────────────────────
function SlideWhyMe({ data, compact }: { data: DeckData["whyMe"]; compact?: boolean }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: compact ? 16 : 28 }}>
      <div>
        <div style={{ fontSize: 10, letterSpacing: "0.3em", color: "rgba(255,80,120,0.7)", textTransform: "uppercase", marginBottom: 6 }}>exhibit a</div>
        <h2 style={{ fontSize: compact ? 22 : 30, color: "#fff", margin: 0, fontWeight: "bold", letterSpacing: "-0.02em" }}>Why Me? 🎯</h2>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: compact ? 10 : 16, flex: 1 }}>
        {data.map((reason, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: compact ? "12px 14px" : "18px 20px", display: "flex", gap: 14, alignItems: "flex-start" }}>
            <span style={{ fontSize: compact ? 20 : 28, flexShrink: 0 }}>{reason.emoji}</span>
            <div>
              <div style={{ fontSize: compact ? 12 : 15, fontWeight: "bold", color: "#fff", marginBottom: 3 }}>{reason.title}</div>
              <div style={{ fontSize: compact ? 11 : 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>{reason.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── SLIDE: FUN FACTS ──────────────────────────────────────────
function SlideFunFacts({ data, compact }: { data: DeckData["funFacts"]; compact?: boolean }) {
  const [revealed, setRevealed] = useState<number[]>([]);
  const reveal = (i: number) => { if (!revealed.includes(i)) setRevealed([...revealed, i]); };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: compact ? 16 : 28 }}>
      <div>
        <div style={{ fontSize: 10, letterSpacing: "0.3em", color: "rgba(255,80,120,0.7)", textTransform: "uppercase", marginBottom: 6 }}>things to know</div>
        <h2 style={{ fontSize: compact ? 22 : 30, color: "#fff", margin: 0, fontWeight: "bold" }}>Fun Facts 🤓</h2>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", margin: "6px 0 0", letterSpacing: "0.05em" }}>tap each one to reveal</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {data.map((fact, i) => {
          const isRevealed = revealed.includes(i);
          return (
            <button key={i} onClick={() => reveal(i)} style={{
              background: isRevealed ? "rgba(255,80,120,0.08)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${isRevealed ? "rgba(255,80,120,0.25)" : "rgba(255,255,255,0.07)"}`,
              borderRadius: 14, padding: compact ? "12px 14px" : "16px 20px",
              textAlign: "left", cursor: isRevealed ? "default" : "pointer",
              transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <span style={{ fontSize: compact ? 11 : 14, color: isRevealed ? "rgba(255,80,120,0.8)" : "rgba(255,255,255,0.25)", flexShrink: 0, fontWeight: "bold", minWidth: 22, transition: "all 0.2s" }}>
                {isRevealed ? "✓" : `0${i + 1}`}
              </span>
              <span style={{ fontSize: compact ? 11 : 13, color: isRevealed ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.2)", transition: "all 0.35s", filter: isRevealed ? "none" : "blur(6px)", lineHeight: 1.5 }}>
                {fact}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── SLIDE: RED FLAGS ──────────────────────────────────────────
function SlideRedFlags({ data, showFlag, setShowFlag, compact }: { data: DeckData["redFlags"]; showFlag: number | null; setShowFlag: (v: number | null) => void; compact?: boolean }) {
  const severityLabel = (s: number) => s <= 1 ? "Tiny 🟡" : s <= 2 ? "Mild 🟠" : "Uh oh 🔴";

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: compact ? 16 : 28 }}>
      <div>
        <div style={{ fontSize: 10, letterSpacing: "0.3em", color: "rgba(255,80,120,0.7)", textTransform: "uppercase", marginBottom: 6 }}>full transparency</div>
        <h2 style={{ fontSize: compact ? 22 : 30, color: "#fff", margin: 0, fontWeight: "bold" }}>Red Flags 🚩</h2>
        <p style={{ fontSize: compact ? 11 : 13, color: "rgba(255,255,255,0.35)", margin: "6px 0 0" }}>Honesty is hot. Here are mine.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {data.map((item, i) => (
          <div key={i} onClick={() => setShowFlag(showFlag === i ? null : i)} style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,80,60,0.15)",
            borderRadius: 14, padding: compact ? "12px 14px" : "16px 20px",
            cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 12,
          }}>
            <span style={{ fontSize: compact ? 16 : 22, flexShrink: 0 }}>🚩</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: compact ? 12 : 14, color: "rgba(255,255,255,0.75)", fontWeight: "bold" }}>{item.flag}</div>
            </div>
            <div style={{ fontSize: 11, background: item.severity <= 1 ? "rgba(255,200,0,0.15)" : "rgba(255,120,0,0.15)", color: item.severity <= 1 ? "#ffc800" : "#ff7800", borderRadius: 100, padding: "3px 10px", letterSpacing: "0.05em", flexShrink: 0 }}>
              {severityLabel(item.severity)}
            </div>
          </div>
        ))}
      </div>
      <div style={{ background: "rgba(255,80,120,0.06)", border: "1px solid rgba(255,80,120,0.15)", borderRadius: 14, padding: compact ? "10px 14px" : "14px 18px", fontSize: compact ? 11 : 13, color: "rgba(255,255,255,0.4)", textAlign: "center", fontStyle: "italic" }}>
        Everyone has them. At least I told you upfront. 😇
      </div>
    </div>
  );
}

// ── SLIDE: RATE ME ────────────────────────────────────────────
function SlideRateMe({ rating, setRating, hoverRating, setHoverRating, submitted, setSubmitted, compact }: {
  rating: number | null; setRating: (v: number) => void;
  hoverRating: number | null; setHoverRating: (v: number | null) => void;
  submitted: boolean; setSubmitted: (v: boolean) => void;
  compact?: boolean;
}) {
  const score = hoverRating ?? rating;
  const getMessage = (r: number | null) => {
    if (r === null) return "Tap to rate...";
    if (r <= 2) return "Ouch. Fair enough. 😅";
    if (r <= 4) return "Room to grow. 🙃";
    if (r <= 6) return "Decent start. 😌";
    if (r <= 8) return "Not bad at all! 😏";
    if (r <= 9) return "Okay okay, I see you. 🔥";
    return "10/10?! Marry me. Maybe. 💍";
  };

  if (submitted) return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, textAlign: "center" }}>
      <div style={{ fontSize: compact ? 56 : 72 }}>{(rating ?? 0) >= 8 ? "🥹" : (rating ?? 0) >= 5 ? "😊" : "😅"}</div>
      <div>
        <div style={{ fontSize: compact ? 40 : 52, fontWeight: "bold", color: "#fff", letterSpacing: "-0.04em", lineHeight: 1 }}>
          {rating}<span style={{ fontSize: compact ? 16 : 22, color: "rgba(255,255,255,0.3)" }}>/10</span>
        </div>
        <p style={{ fontSize: compact ? 12 : 15, color: "rgba(255,255,255,0.5)", fontStyle: "italic", marginTop: 8 }}>{getMessage(rating)}</p>
      </div>
      <div style={{ background: "rgba(255,80,120,0.08)", border: "1px solid rgba(255,80,120,0.2)", borderRadius: 16, padding: compact ? "14px 16px" : "18px 20px", fontSize: compact ? 12 : 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, textAlign: "center" }}>
        Your rating has been noted. 📝<br />
        <span style={{ color: "rgba(255,80,120,0.8)" }}>He's waiting for your answer... 💌</span>
      </div>
    </div>
  );

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: compact ? 16 : 28 }}>
      <div>
        <div style={{ fontSize: 10, letterSpacing: "0.3em", color: "rgba(255,80,120,0.7)", textTransform: "uppercase", marginBottom: 6 }}>the verdict</div>
        <h2 style={{ fontSize: compact ? 22 : 30, color: "#fff", margin: 0, fontWeight: "bold" }}>Rate Me 0–10 🎯</h2>
        <p style={{ fontSize: compact ? 11 : 13, color: "rgba(255,255,255,0.35)", margin: "6px 0 0" }}>Be honest. He can take it. Probably.</p>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: compact ? 56 : 76, fontWeight: "bold", color: score !== null ? "#fff" : "rgba(255,255,255,0.1)", lineHeight: 1, transition: "all 0.15s", letterSpacing: "-0.04em" }}>
          {score ?? "?"}
        </div>
        <div style={{ fontSize: compact ? 11 : 14, color: "rgba(255,255,255,0.35)", fontStyle: "italic", marginTop: 6, minHeight: 20, transition: "all 0.2s" }}>
          {getMessage(score)}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(11, 1fr)", gap: compact ? 4 : 6 }}>
        {Array.from({ length: 11 }, (_, i) => (
          <button key={i}
            onMouseEnter={() => setHoverRating(i)}
            onMouseLeave={() => setHoverRating(null)}
            onClick={() => setRating(i)}
            style={{
              aspectRatio: "1", borderRadius: compact ? 7 : 10,
              border: `1px solid ${rating === i ? "rgba(255,80,120,0.8)" : "rgba(255,255,255,0.08)"}`,
              background: rating === i ? "linear-gradient(135deg, #ff5078, #ff3060)" : (hoverRating !== null && i <= hoverRating) ? "rgba(255,80,120,0.15)" : "rgba(255,255,255,0.04)",
              color: rating === i ? "#fff" : "rgba(255,255,255,0.5)",
              fontSize: compact ? 11 : 13, fontWeight: "bold",
              cursor: "pointer", transition: "all 0.15s", padding: 0,
            }}
          >{i}</button>
        ))}
      </div>
      <button onClick={() => rating !== null && setSubmitted(true)} style={{
        width: "100%", padding: compact ? "12px" : "16px",
        borderRadius: 100,
        background: rating !== null ? "linear-gradient(135deg, #ff5078, #ff3060)" : "rgba(255,255,255,0.05)",
        border: "none", color: rating !== null ? "#fff" : "rgba(255,255,255,0.2)",
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: compact ? 13 : 15, fontWeight: "bold",
        cursor: rating !== null ? "pointer" : "default",
        letterSpacing: "0.05em",
        boxShadow: rating !== null ? "0 8px 32px rgba(255,80,120,0.35)" : "none",
        transition: "all 0.3s", marginTop: "auto",
      }}>
        Submit my verdict ✓
      </button>
    </div>
  );
}
