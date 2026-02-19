import { DeckData } from "../types";

interface IntroSlideProps {
    data: DeckData["intro"];
    compact?: boolean;
}

export default function IntroSlide({ data, compact }: IntroSlideProps) {
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
