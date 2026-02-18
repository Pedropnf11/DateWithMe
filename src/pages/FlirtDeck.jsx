import { useState, useRef } from "react";

// ── Mock data (em produção vem do Supabase) ───────────────────
const DECK_DATA = {
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
    "I never check my phone during movies. It's a value system 📵",
    "I can parallel park on the first try. Every time 🚗",
  ],
  redFlags: [
    { flag: "I over-explain things", severity: 1 },
    { flag: "Terrible at replying to voice notes", severity: 2 },
    { flag: "I'll rate every restaurant we go to internally", severity: 1 },
  ],
};

// ── Slide config ──────────────────────────────────────────────
const SLIDES = ["intro", "why_me", "fun_facts", "red_flags", "rate_me"];

const SLIDE_LABELS = {
  intro: "Intro",
  why_me: "Why Me",
  fun_facts: "Fun Facts",
  red_flags: "Red Flags",
  rate_me: "Rate Me",
};

export default function FlirtDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [animating, setAnimating] = useState(false);
  const [rating, setRating] = useState(null);
  const [hoverRating, setHoverRating] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [showRedFlag, setShowRedFlag] = useState(null);

  const goTo = (idx) => {
    if (animating || idx === currentSlide) return;
    setDirection(idx > currentSlide ? 1 : -1);
    setAnimating(true);
    setTimeout(() => {
      setCurrentSlide(idx);
      setAnimating(false);
    }, 320);
  };

  const next = () => currentSlide < SLIDES.length - 1 && goTo(currentSlide + 1);
  const prev = () => currentSlide > 0 && goTo(currentSlide - 1);

  const slideStyle = {
    transform: animating ? `translateX(${direction * 60}px)` : "translateX(0)",
    opacity: animating ? 0 : 1,
    transition: "all 0.32s cubic-bezier(0.4,0,0.2,1)",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Georgia', serif",
      padding: "20px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Ambient blobs */}
      <div style={{
        position: "fixed", top: "-20%", right: "-10%",
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,80,120,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "fixed", bottom: "-20%", left: "-10%",
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(120,80,255,0.10) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Slide counter badge */}
      <div style={{
        position: "fixed", top: 24, right: 24,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 100,
        padding: "6px 16px",
        color: "rgba(255,255,255,0.5)",
        fontSize: 12,
        letterSpacing: "0.1em",
        fontFamily: "'Georgia', serif",
        backdropFilter: "blur(10px)",
      }}>
        {currentSlide + 1} / {SLIDES.length}
      </div>

      {/* Progress dots */}
      <div style={{
        display: "flex", gap: 8, marginBottom: 32,
      }}>
        {SLIDES.map((s, i) => (
          <button
            key={s}
            onClick={() => goTo(i)}
            style={{
              width: i === currentSlide ? 28 : 8,
              height: 8,
              borderRadius: 100,
              background: i === currentSlide
                ? "linear-gradient(90deg, #ff5078, #ff80a0)"
                : i < currentSlide
                  ? "rgba(255,80,120,0.4)"
                  : "rgba(255,255,255,0.15)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* Slide label */}
      <div style={{
        fontSize: 10,
        letterSpacing: "0.25em",
        color: "rgba(255,80,120,0.7)",
        textTransform: "uppercase",
        marginBottom: 16,
        fontFamily: "'Georgia', serif",
      }}>
        {SLIDE_LABELS[SLIDES[currentSlide]]}
      </div>

      {/* Main card */}
      <div style={{
        width: "100%",
        maxWidth: 420,
        minHeight: 520,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 28,
        padding: "40px 36px",
        backdropFilter: "blur(20px)",
        boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05) inset",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        ...slideStyle,
      }}>
        {SLIDES[currentSlide] === "intro"      && <SlideIntro data={DECK_DATA.intro} />}
        {SLIDES[currentSlide] === "why_me"     && <SlideWhyMe data={DECK_DATA.whyMe} />}
        {SLIDES[currentSlide] === "fun_facts"  && <SlideFunFacts data={DECK_DATA.funFacts} />}
        {SLIDES[currentSlide] === "red_flags"  && <SlideRedFlags data={DECK_DATA.redFlags} showFlag={showRedFlag} setShowFlag={setShowRedFlag} />}
        {SLIDES[currentSlide] === "rate_me"    && <SlideRateMe rating={rating} setRating={setRating} hoverRating={hoverRating} setHoverRating={setHoverRating} submitted={submitted} setSubmitted={setSubmitted} />}
      </div>

      {/* Nav buttons */}
      <div style={{
        display: "flex",
        gap: 16,
        marginTop: 32,
        alignItems: "center",
      }}>
        <button
          onClick={prev}
          disabled={currentSlide === 0}
          style={{
            width: 48, height: 48,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: currentSlide === 0 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.7)",
            fontSize: 20,
            cursor: currentSlide === 0 ? "default" : "pointer",
            transition: "all 0.2s",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >←</button>

        {currentSlide < SLIDES.length - 1 && (
          <button
            onClick={next}
            style={{
              padding: "14px 36px",
              borderRadius: 100,
              background: "linear-gradient(135deg, #ff5078, #ff3060)",
              border: "none",
              color: "#fff",
              fontFamily: "'Georgia', serif",
              fontSize: 15,
              fontWeight: "bold",
              cursor: "pointer",
              letterSpacing: "0.05em",
              boxShadow: "0 8px 32px rgba(255,80,120,0.4)",
              transition: "all 0.2s",
            }}
          >
            Next slide →
          </button>
        )}

        <button
          onClick={next}
          disabled={currentSlide === SLIDES.length - 1}
          style={{
            width: 48, height: 48,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: currentSlide === SLIDES.length - 1 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.7)",
            fontSize: 20,
            cursor: currentSlide === SLIDES.length - 1 ? "default" : "pointer",
            transition: "all 0.2s",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >→</button>
      </div>

      {/* Keyboard hint */}
      <p style={{
        marginTop: 16,
        fontSize: 11,
        color: "rgba(255,255,255,0.2)",
        letterSpacing: "0.1em",
      }}>
        use ← → to navigate
      </p>
    </div>
  );
}

// ── SLIDE: INTRO ──────────────────────────────────────────────
function SlideIntro({ data }) {
  return (
    <div style={{ textAlign: "center", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
      {/* Photo / GIF / Placeholder */}
      <div style={{
        width: 120, height: 120,
        borderRadius: "50%",
        background: data.photo || data.gif
          ? `url(${data.photo || data.gif}) center/cover`
          : "linear-gradient(135deg, #ff5078 0%, #7850ff 100%)",
        border: "3px solid rgba(255,80,120,0.4)",
        boxShadow: "0 0 40px rgba(255,80,120,0.3)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 48,
        flexShrink: 0,
      }}>
        {!data.photo && !data.gif && "👤"}
      </div>

      {/* Name */}
      <div>
        <div style={{
          fontSize: 11, letterSpacing: "0.3em",
          color: "rgba(255,80,120,0.7)",
          textTransform: "uppercase",
          marginBottom: 10,
        }}>
          presenting
        </div>
        <h1 style={{
          fontSize: 48,
          fontWeight: "bold",
          color: "#fff",
          margin: 0,
          lineHeight: 1,
          letterSpacing: "-0.02em",
        }}>
          {data.name}
        </h1>
      </div>

      {/* Tagline */}
      <p style={{
        fontSize: 17,
        color: "rgba(255,255,255,0.55)",
        fontStyle: "italic",
        margin: 0,
        lineHeight: 1.5,
      }}>
        "{data.tagline}"
      </p>

      {/* Divider */}
      <div style={{
        width: 60, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(255,80,120,0.5), transparent)",
      }} />

      <p style={{
        fontSize: 12,
        color: "rgba(255,255,255,0.25)",
        letterSpacing: "0.1em",
        margin: 0,
      }}>
        SLIDE 1 OF 5 · FLIRTDECK™
      </p>
    </div>
  );
}

// ── SLIDE: WHY ME ─────────────────────────────────────────────
function SlideWhyMe({ data }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 28 }}>
      <div>
        <div style={{ fontSize: 10, letterSpacing: "0.3em", color: "rgba(255,80,120,0.7)", textTransform: "uppercase", marginBottom: 8 }}>
          exhibit a
        </div>
        <h2 style={{ fontSize: 30, color: "#fff", margin: 0, fontWeight: "bold", letterSpacing: "-0.02em" }}>
          Why Me? 🎯
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
        {data.map((reason, i) => (
          <div
            key={i}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 16,
              padding: "18px 20px",
              display: "flex",
              gap: 16,
              alignItems: "flex-start",
              transition: "all 0.2s",
            }}
          >
            <span style={{ fontSize: 28, flexShrink: 0 }}>{reason.emoji}</span>
            <div>
              <div style={{ fontSize: 15, fontWeight: "bold", color: "#fff", marginBottom: 4 }}>
                {reason.title}
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>
                {reason.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── SLIDE: FUN FACTS ──────────────────────────────────────────
function SlideFunFacts({ data }) {
  const [revealed, setRevealed] = useState([]);

  const reveal = (i) => {
    if (!revealed.includes(i)) setRevealed([...revealed, i]);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 28 }}>
      <div>
        <div style={{ fontSize: 10, letterSpacing: "0.3em", color: "rgba(255,80,120,0.7)", textTransform: "uppercase", marginBottom: 8 }}>
          things to know
        </div>
        <h2 style={{ fontSize: 30, color: "#fff", margin: 0, fontWeight: "bold", letterSpacing: "-0.02em" }}>
          Fun Facts 🤓
        </h2>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", margin: "8px 0 0", letterSpacing: "0.05em" }}>
          tap each one to reveal
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        {data.map((fact, i) => {
          const isRevealed = revealed.includes(i);
          return (
            <button
              key={i}
              onClick={() => reveal(i)}
              style={{
                background: isRevealed
                  ? "rgba(255,80,120,0.08)"
                  : "rgba(255,255,255,0.04)",
                border: `1px solid ${isRevealed ? "rgba(255,80,120,0.25)" : "rgba(255,255,255,0.07)"}`,
                borderRadius: 14,
                padding: "16px 20px",
                textAlign: "left",
                cursor: isRevealed ? "default" : "pointer",
                transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <span style={{
                fontSize: 20,
                opacity: isRevealed ? 1 : 0.3,
                transition: "opacity 0.3s",
              }}>
                {isRevealed ? "✓" : `0${i + 1}`}
              </span>
              <span style={{
                fontSize: 14,
                color: isRevealed ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.2)",
                transition: "all 0.35s",
                filter: isRevealed ? "none" : "blur(6px)",
                lineHeight: 1.5,
              }}>
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
function SlideRedFlags({ data, showFlag, setShowFlag }) {
  const severityLabel = (s) => s <= 1 ? "Tiny 🟡" : s <= 2 ? "Mild 🟠" : "Uh oh 🔴";

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 28 }}>
      <div>
        <div style={{ fontSize: 10, letterSpacing: "0.3em", color: "rgba(255,80,120,0.7)", textTransform: "uppercase", marginBottom: 8 }}>
          full transparency
        </div>
        <h2 style={{ fontSize: 30, color: "#fff", margin: 0, fontWeight: "bold", letterSpacing: "-0.02em" }}>
          Red Flags 🚩
        </h2>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", margin: "8px 0 0" }}>
          Honesty is hot. Here are mine.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        {data.map((item, i) => (
          <div
            key={i}
            onClick={() => setShowFlag(showFlag === i ? null : i)}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,80,60,0.15)",
              borderRadius: 14,
              padding: "16px 20px",
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <span style={{ fontSize: 22, flexShrink: 0 }}>🚩</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", fontWeight: "bold" }}>
                {item.flag}
              </div>
            </div>
            <div style={{
              fontSize: 11,
              background: item.severity <= 1 ? "rgba(255,200,0,0.15)" : "rgba(255,120,0,0.15)",
              color: item.severity <= 1 ? "#ffc800" : "#ff7800",
              borderRadius: 100,
              padding: "3px 10px",
              letterSpacing: "0.05em",
              flexShrink: 0,
            }}>
              {severityLabel(item.severity)}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        background: "rgba(255,80,120,0.06)",
        border: "1px solid rgba(255,80,120,0.15)",
        borderRadius: 14,
        padding: "14px 18px",
        fontSize: 13,
        color: "rgba(255,255,255,0.4)",
        textAlign: "center",
        fontStyle: "italic",
      }}>
        Everyone has them. At least I told you upfront. 😇
      </div>
    </div>
  );
}

// ── SLIDE: RATE ME ────────────────────────────────────────────
function SlideRateMe({ rating, setRating, hoverRating, setHoverRating, submitted, setSubmitted }) {
  const score = hoverRating ?? rating;

  const getMessage = (r) => {
    if (!r) return "Tap to rate...";
    if (r <= 2) return "Ouch. Fair enough. 😅";
    if (r <= 4) return "I'll take it. Room to grow. 🙃";
    if (r <= 6) return "Decent start. I'll take it. 😌";
    if (r <= 8) return "Not bad at all! 😏";
    if (r <= 9) return "Okay okay, I see you. 🔥";
    return "10/10?! Marry me. Just kidding... maybe. 💍";
  };

  const handleSubmit = () => {
    if (rating) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, textAlign: "center" }}>
        <div style={{ fontSize: 80 }}>
          {rating >= 8 ? "🥹" : rating >= 5 ? "😊" : "😅"}
        </div>
        <div>
          <div style={{ fontSize: 40, fontWeight: "bold", color: "#fff", marginBottom: 8 }}>
            {rating}<span style={{ fontSize: 20, color: "rgba(255,255,255,0.3)" }}>/10</span>
          </div>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", fontStyle: "italic", margin: 0 }}>
            {getMessage(rating)}
          </p>
        </div>
        <div style={{
          width: "100%",
          background: "rgba(255,80,120,0.08)",
          border: "1px solid rgba(255,80,120,0.2)",
          borderRadius: 16,
          padding: "18px 20px",
          fontSize: 14,
          color: "rgba(255,255,255,0.5)",
          lineHeight: 1.6,
          textAlign: "center",
        }}>
          Your rating has been noted. 📝<br />
          <span style={{ color: "rgba(255,80,120,0.8)" }}>He's waiting for your answer... 💌</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 28 }}>
      <div>
        <div style={{ fontSize: 10, letterSpacing: "0.3em", color: "rgba(255,80,120,0.7)", textTransform: "uppercase", marginBottom: 8 }}>
          the verdict
        </div>
        <h2 style={{ fontSize: 30, color: "#fff", margin: 0, fontWeight: "bold", letterSpacing: "-0.02em" }}>
          Rate Me 0–10 🎯
        </h2>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", margin: "8px 0 0" }}>
          Be honest. He can take it. Probably.
        </p>
      </div>

      {/* Score display */}
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontSize: 80,
          fontWeight: "bold",
          color: score ? "#fff" : "rgba(255,255,255,0.1)",
          lineHeight: 1,
          transition: "all 0.15s",
          letterSpacing: "-0.04em",
        }}>
          {score ?? "?"}
        </div>
        <div style={{
          fontSize: 14,
          color: "rgba(255,255,255,0.35)",
          fontStyle: "italic",
          marginTop: 8,
          minHeight: 22,
          transition: "all 0.2s",
        }}>
          {getMessage(score)}
        </div>
      </div>

      {/* Rating buttons 0-10 */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(11, 1fr)",
        gap: 6,
      }}>
        {Array.from({ length: 11 }, (_, i) => (
          <button
            key={i}
            onMouseEnter={() => setHoverRating(i)}
            onMouseLeave={() => setHoverRating(null)}
            onTouchStart={() => setHoverRating(i)}
            onTouchEnd={() => setHoverRating(null)}
            onClick={() => setRating(i)}
            style={{
              aspectRatio: "1",
              borderRadius: 10,
              border: `1px solid ${rating === i ? "rgba(255,80,120,0.8)" : "rgba(255,255,255,0.08)"}`,
              background: rating === i
                ? "linear-gradient(135deg, #ff5078, #ff3060)"
                : (hoverRating !== null && i <= hoverRating)
                  ? "rgba(255,80,120,0.15)"
                  : "rgba(255,255,255,0.04)",
              color: rating === i ? "#fff" : "rgba(255,255,255,0.5)",
              fontSize: 13,
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.15s",
              padding: 0,
            }}
          >
            {i}
          </button>
        ))}
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!rating && rating !== 0}
        style={{
          width: "100%",
          padding: "16px",
          borderRadius: 100,
          background: rating !== null
            ? "linear-gradient(135deg, #ff5078, #ff3060)"
            : "rgba(255,255,255,0.05)",
          border: "none",
          color: rating !== null ? "#fff" : "rgba(255,255,255,0.2)",
          fontFamily: "'Georgia', serif",
          fontSize: 15,
          fontWeight: "bold",
          cursor: rating !== null ? "pointer" : "default",
          letterSpacing: "0.05em",
          boxShadow: rating !== null ? "0 8px 32px rgba(255,80,120,0.35)" : "none",
          transition: "all 0.3s",
          marginTop: "auto",
        }}
      >
        Submit my verdict ✓
      </button>
    </div>
  );
}
