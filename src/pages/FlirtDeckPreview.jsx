import { useState } from "react";

const DECK_DATA = {
  intro: { name: "Miguel", tagline: "Not your average date. 😏", photo: null },
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

const SLIDES = ["intro", "why_me", "fun_facts", "red_flags", "rate_me"];
const SLIDE_LABELS = { intro: "Intro", why_me: "Why Me?", fun_facts: "Fun Facts", red_flags: "Red Flags", rate_me: "Rate Me" };

export default function FlirtDeck({ data: initialData }) {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);
  const [anim, setAnim] = useState(false);
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const goTo = (i) => {
    if (anim || i === current || i < 0 || i >= SLIDES.length) return;
    setDir(i > current ? 1 : -1);
    setAnim(true);
    setTimeout(() => { setCurrent(i); setAnim(false); }, 280);
  };

  const data = initialData || DECK_DATA;

  const slideAnim = {
    transform: anim ? `translateX(${dir * 48}px)` : "translateX(0)",
    opacity: anim ? 0 : 1,
    transition: "all 0.28s cubic-bezier(0.4,0,0.2,1)",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080810", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", padding: "24px 16px", position: "relative", overflow: "hidden" }}>
      
      {/* BG blobs */}
      <div style={{ position: "fixed", top: "-15%", right: "-5%", width: 450, height: 450, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,60,100,0.10) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "-15%", left: "-5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(100,60,255,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Counter */}
      <div style={{ position: "fixed", top: 20, right: 20, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 100, padding: "5px 14px", color: "rgba(255,255,255,0.35)", fontSize: 11, letterSpacing: "0.12em", backdropFilter: "blur(10px)" }}>
        {current + 1} / {SLIDES.length}
      </div>

      {/* Progress dots */}
      <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
        {SLIDES.map((s, i) => (
          <button key={s} onClick={() => goTo(i)} style={{ width: i === current ? 32 : 8, height: 8, borderRadius: 100, background: i === current ? "linear-gradient(90deg,#ff4068,#ff80a0)" : i < current ? "rgba(255,64,104,0.35)" : "rgba(255,255,255,0.12)", border: "none", cursor: "pointer", transition: "all 0.4s", padding: 0 }} />
        ))}
      </div>

      {/* Slide type label */}
      <div style={{ fontSize: 10, letterSpacing: "0.28em", color: "rgba(255,64,104,0.65)", textTransform: "uppercase", marginBottom: 14 }}>
        {SLIDE_LABELS[SLIDES[current]]}
      </div>

      {/* Card */}
      <div style={{ width: "100%", maxWidth: 400, minHeight: 500, background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 26, padding: "36px 32px", backdropFilter: "blur(24px)", boxShadow: "0 40px 80px rgba(0,0,0,0.65), inset 0 0 0 1px rgba(255,255,255,0.04)", display: "flex", flexDirection: "column", ...slideAnim }}>
        {SLIDES[current] === "intro"      && <Intro data={data.intro} />}
        {SLIDES[current] === "why_me"     && <WhyMe data={data.whyMe} />}
        {SLIDES[current] === "fun_facts"  && <FunFacts data={data.funFacts} />}
        {SLIDES[current] === "red_flags"  && <RedFlags data={data.redFlags} />}
        {SLIDES[current] === "rate_me"    && <RateMe rating={rating} setRating={setRating} hover={hover} setHover={setHover} submitted={submitted} setSubmitted={setSubmitted} />}
      </div>

      {/* Nav */}
      <div style={{ display: "flex", gap: 14, marginTop: 28, alignItems: "center" }}>
        <NavBtn onClick={() => goTo(current - 1)} disabled={current === 0} label="←" />
        {current < SLIDES.length - 1 && (
          <button onClick={() => goTo(current + 1)} style={{ padding: "13px 32px", borderRadius: 100, background: "linear-gradient(135deg,#ff4068,#ff2050)", border: "none", color: "#fff", fontFamily: "Georgia,serif", fontSize: 14, fontWeight: "bold", cursor: "pointer", letterSpacing: "0.06em", boxShadow: "0 8px 28px rgba(255,64,104,0.38)", transition: "transform 0.15s", }}>
            Next slide →
          </button>
        )}
        <NavBtn onClick={() => goTo(current + 1)} disabled={current === SLIDES.length - 1} label="→" />
      </div>

      <p style={{ marginTop: 14, fontSize: 11, color: "rgba(255,255,255,0.18)", letterSpacing: "0.1em" }}>use ← → to navigate</p>
    </div>
  );
}

function NavBtn({ onClick, disabled, label }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: disabled ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.65)", fontSize: 18, cursor: disabled ? "default" : "pointer", transition: "all 0.18s", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {label}
    </button>
  );
}

function Intro({ data }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 22, textAlign: "center" }}>
      <div style={{ width: 110, height: 110, borderRadius: "50%", background: data.photo ? `url(${data.photo}) center/cover` : "linear-gradient(135deg,#ff4068 0%,#7040ff 100%)", border: "3px solid rgba(255,64,104,0.35)", boxShadow: "0 0 48px rgba(255,64,104,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, flexShrink: 0 }}>
        {!data.photo && "👤"}
      </div>
      <div>
        <div style={{ fontSize: 10, letterSpacing: "0.32em", color: "rgba(255,64,104,0.65)", textTransform: "uppercase", marginBottom: 10 }}>presenting</div>
        <h1 style={{ fontSize: 46, fontWeight: "bold", color: "#fff", margin: 0, lineHeight: 1, letterSpacing: "-0.03em" }}>{data.name}</h1>
      </div>
      <p style={{ fontSize: 16, color: "rgba(255,255,255,0.45)", fontStyle: "italic", margin: 0, lineHeight: 1.5 }}>"{data.tagline}"</p>
      <div style={{ width: 50, height: 1, background: "linear-gradient(90deg,transparent,rgba(255,64,104,0.45),transparent)" }} />
      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", letterSpacing: "0.12em", margin: 0 }}>FLIRTDECK™ · 5 SLIDES</p>
    </div>
  );
}

function WhyMe({ data }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <div style={{ fontSize: 10, letterSpacing: "0.28em", color: "rgba(255,64,104,0.65)", textTransform: "uppercase", marginBottom: 6 }}>exhibit a</div>
        <h2 style={{ fontSize: 28, color: "#fff", margin: 0, fontWeight: "bold", letterSpacing: "-0.02em" }}>Why Me? 🎯</h2>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
        {data.map((r, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "16px 18px", display: "flex", gap: 14, alignItems: "flex-start" }}>
            <span style={{ fontSize: 26, flexShrink: 0 }}>{r.emoji}</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: "bold", color: "#fff", marginBottom: 4 }}>{r.title}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>{r.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FunFacts({ data }) {
  const [revealed, setReveal] = useState([]);
  const toggle = (i) => setReveal(r => r.includes(i) ? r : [...r, i]);
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <div style={{ fontSize: 10, letterSpacing: "0.28em", color: "rgba(255,64,104,0.65)", textTransform: "uppercase", marginBottom: 6 }}>things to know</div>
        <h2 style={{ fontSize: 28, color: "#fff", margin: 0, fontWeight: "bold" }}>Fun Facts 🤓</h2>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", margin: "6px 0 0", letterSpacing: "0.06em" }}>tap each one to reveal</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {data.map((fact, i) => {
          const on = revealed.includes(i);
          return (
            <button key={i} onClick={() => toggle(i)} style={{ background: on ? "rgba(255,64,104,0.07)" : "rgba(255,255,255,0.04)", border: `1px solid ${on ? "rgba(255,64,104,0.22)" : "rgba(255,255,255,0.06)"}`, borderRadius: 13, padding: "15px 18px", textAlign: "left", cursor: on ? "default" : "pointer", transition: "all 0.32s", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 14, color: on ? "rgba(255,64,104,0.8)" : "rgba(255,255,255,0.2)", flexShrink: 0, fontWeight: "bold", minWidth: 22, transition: "all 0.2s" }}>{on ? "✓" : `0${i+1}`}</span>
              <span style={{ fontSize: 13, color: on ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.15)", filter: on ? "none" : "blur(5px)", transition: "all 0.32s", lineHeight: 1.5 }}>{fact}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RedFlags({ data }) {
  const sev = (s) => ({ label: s <= 1 ? "Tiny 🟡" : "Mild 🟠", color: s <= 1 ? "#ffc500" : "#ff8800", bg: s <= 1 ? "rgba(255,197,0,0.12)" : "rgba(255,136,0,0.12)" });
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <div style={{ fontSize: 10, letterSpacing: "0.28em", color: "rgba(255,64,104,0.65)", textTransform: "uppercase", marginBottom: 6 }}>full transparency</div>
        <h2 style={{ fontSize: 28, color: "#fff", margin: 0, fontWeight: "bold" }}>Red Flags 🚩</h2>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", margin: "6px 0 0" }}>Honesty is hot. Here are mine.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {data.map((item, i) => {
          const s = sev(item.severity);
          return (
            <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,64,50,0.12)", borderRadius: 13, padding: "15px 18px", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>🚩</span>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: "bold", flex: 1 }}>{item.flag}</span>
              <span style={{ fontSize: 11, background: s.bg, color: s.color, borderRadius: 100, padding: "3px 10px", flexShrink: 0 }}>{s.label}</span>
            </div>
          );
        })}
      </div>
      <div style={{ background: "rgba(255,64,104,0.05)", border: "1px solid rgba(255,64,104,0.12)", borderRadius: 13, padding: "13px 16px", fontSize: 12, color: "rgba(255,255,255,0.35)", textAlign: "center", fontStyle: "italic" }}>
        Everyone has them. At least I told you upfront. 😇
      </div>
    </div>
  );
}

function RateMe({ rating, setRating, hover, setHover, submitted, setSubmitted }) {
  const score = hover ?? rating;
  const msg = (r) => !r && r !== 0 ? "Tap to rate..." : r <= 2 ? "Ouch. Fair. 😅" : r <= 4 ? "Room to grow 🙃" : r <= 6 ? "Decent start 😌" : r <= 8 ? "Not bad at all! 😏" : r <= 9 ? "I see you 🔥" : "10/10?! Marry me. Maybe. 💍";

  if (submitted) return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 22, textAlign: "center" }}>
      <div style={{ fontSize: 72 }}>{rating >= 8 ? "🥹" : rating >= 5 ? "😊" : "😅"}</div>
      <div>
        <div style={{ fontSize: 56, fontWeight: "bold", color: "#fff", letterSpacing: "-0.04em", lineHeight: 1 }}>{rating}<span style={{ fontSize: 22, color: "rgba(255,255,255,0.25)" }}>/10</span></div>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", fontStyle: "italic", marginTop: 8 }}>{msg(rating)}</p>
      </div>
      <div style={{ background: "rgba(255,64,104,0.07)", border: "1px solid rgba(255,64,104,0.18)", borderRadius: 14, padding: "16px 18px", fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
        Your verdict has been submitted. 📝<br/>
        <span style={{ color: "rgba(255,64,104,0.8)" }}>He's waiting for your answer... 💌</span>
      </div>
    </div>
  );

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <div style={{ fontSize: 10, letterSpacing: "0.28em", color: "rgba(255,64,104,0.65)", textTransform: "uppercase", marginBottom: 6 }}>the verdict</div>
        <h2 style={{ fontSize: 28, color: "#fff", margin: 0, fontWeight: "bold" }}>Rate Me 0–10 🎯</h2>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", margin: "6px 0 0" }}>Be honest. He can take it. Probably.</p>
      </div>
      <div style={{ textAlign: "center", padding: "8px 0" }}>
        <div style={{ fontSize: 72, fontWeight: "bold", color: score !== null ? "#fff" : "rgba(255,255,255,0.08)", lineHeight: 1, letterSpacing: "-0.04em", transition: "all 0.15s" }}>{score !== null ? score : "?"}</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.32)", fontStyle: "italic", marginTop: 8, minHeight: 20 }}>{msg(score)}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(11,1fr)", gap: 5 }}>
        {Array.from({ length: 11 }, (_, i) => (
          <button key={i}
            onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
            onClick={() => setRating(i)}
            style={{ aspectRatio: "1", borderRadius: 9, border: `1px solid ${rating === i ? "rgba(255,64,104,0.7)" : "rgba(255,255,255,0.07)"}`, background: rating === i ? "linear-gradient(135deg,#ff4068,#ff2050)" : hover !== null && i <= hover ? "rgba(255,64,104,0.14)" : "rgba(255,255,255,0.04)", color: rating === i ? "#fff" : "rgba(255,255,255,0.45)", fontSize: 12, fontWeight: "bold", cursor: "pointer", transition: "all 0.12s", padding: 0 }}
          >{i}</button>
        ))}
      </div>
      <button onClick={() => rating !== null && setSubmitted(true)} style={{ width: "100%", padding: "15px", borderRadius: 100, background: rating !== null ? "linear-gradient(135deg,#ff4068,#ff2050)" : "rgba(255,255,255,0.04)", border: "none", color: rating !== null ? "#fff" : "rgba(255,255,255,0.18)", fontFamily: "Georgia,serif", fontSize: 14, fontWeight: "bold", cursor: rating !== null ? "pointer" : "default", letterSpacing: "0.06em", boxShadow: rating !== null ? "0 8px 28px rgba(255,64,104,0.32)" : "none", transition: "all 0.28s", marginTop: "auto" }}>
        Submit my verdict ✓
      </button>
    </div>
  );
}
