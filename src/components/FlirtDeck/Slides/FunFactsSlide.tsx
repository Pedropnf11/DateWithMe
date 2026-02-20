import { useState } from "react";
import { DeckData } from "../types";

interface FunFactsSlideProps {
    data: DeckData["funFacts"];
    compact?: boolean;
}

export default function FunFactsSlide({ data, compact }: FunFactsSlideProps) {
    const [revealed, setRevealed] = useState<number[]>([]);
    const reveal = (i: number) => { if (!revealed.includes(i)) setRevealed([...revealed, i]); };

    return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: compact ? 16 : 28 }}>
            <div>
                <div style={{ fontSize: 10, letterSpacing: "0.3em", color: "rgba(255,80,120,0.7)", textTransform: "uppercase", marginBottom: 6 }}>Curiosidades</div>
                <h2 style={{ fontSize: compact ? 22 : 30, color: "#fff", margin: 0, fontWeight: "bold" }}>Sobre mim</h2>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", margin: "6px 0 0", letterSpacing: "0.05em" }}>Clica em cada um para revelar</p>
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
