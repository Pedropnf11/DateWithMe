import { DeckData } from "../types";

interface RedFlagsSlideProps {
    data: DeckData["redFlags"];
    showFlag: number | null;
    setShowFlag: (v: number | null) => void;
    compact?: boolean;
}

export default function RedFlagsSlide({ data, showFlag, setShowFlag, compact }: RedFlagsSlideProps) {
    const severityLabel = (s: number) => s <= 1 ? "Pequeno 🟡" : s <= 2 ? "Médio 🟠" : "Grave 🔴";

    return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: compact ? 16 : 28 }}>
            <div>
                <div style={{ fontSize: 10, letterSpacing: "0.3em", color: "rgba(255,80,120,0.7)", textTransform: "uppercase", marginBottom: 6 }}>Honestidade acima de tudo</div>
                <h2 style={{ fontSize: compact ? 22 : 30, color: "#fff", margin: 0, fontWeight: "bold" }}>Aqui tens Red Flags 🚩</h2>
                <p style={{ fontSize: compact ? 11 : 13, color: "rgba(255,255,255,0.35)", margin: "6px 0 0" }}>Porque nem tudo é perfeito, mas com esforço conseguimos melhorar </p>
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
                Todos tem umas, mas o importante é transparência 😇
            </div>
        </div>
    );
}
