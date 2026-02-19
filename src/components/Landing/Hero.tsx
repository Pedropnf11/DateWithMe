import { motion } from "framer-motion";
import { Heart, Presentation, ChevronRight } from "lucide-react";

export default function Hero({ onStartEditor }: { onStartEditor: () => void }) {
    return (
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
                    onClick={onStartEditor}
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
        </main>
    );
}
