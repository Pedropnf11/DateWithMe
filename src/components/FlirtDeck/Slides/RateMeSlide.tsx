interface RateMeSlideProps {
    rating: number | null;
    setRating: (v: number) => void;
    hoverRating: number | null;
    setHoverRating: (v: number | null) => void;
    submitted: boolean;
    setSubmitted: (v: boolean) => void;
    compact?: boolean;
}

export default function RateMeSlide({
    rating, setRating, hoverRating, setHoverRating,
    submitted, setSubmitted, compact
}: RateMeSlideProps) {
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
