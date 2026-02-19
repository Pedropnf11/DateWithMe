import { DeckData } from "../types";

interface WhyMeSlideProps {
    data: DeckData["whyMe"];
    compact?: boolean;
}

export default function WhyMeSlide({ data, compact }: WhyMeSlideProps) {
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
