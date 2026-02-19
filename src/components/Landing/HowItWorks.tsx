import { Star, Sparkles, Heart } from "lucide-react";

export default function HowItWorks() {
    return (
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
    );
}
