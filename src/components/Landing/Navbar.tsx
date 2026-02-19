export default function Navbar({ onGetStarted }: { onGetStarted: () => void }) {
    return (
        <nav style={{ display: "flex", justifyContent: "center", padding: "20px 16px 0", position: "sticky", top: 0, zIndex: 40 }}>
            <div style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)", borderRadius: 100, padding: "12px 28px", boxShadow: "0 4px 24px rgba(255,64,104,0.12)", border: "1px solid rgba(255,100,130,0.15)", display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", maxWidth: 900 }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 22, color: "#ff4068", letterSpacing: "-0.02em" }}>
                    DateWithMe
                </span>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <button
                        onClick={onGetStarted}
                        style={{ background: "linear-gradient(135deg, #ff4068, #ff6090)", color: "#fff", padding: "10px 24px", borderRadius: 100, fontWeight: 800, fontSize: 13, border: "none", cursor: "pointer", boxShadow: "0 4px 16px rgba(255,64,104,0.35)", letterSpacing: "0.04em" }}>
                        GET STARTED
                    </button>
                </div>
            </div>
        </nav>
    );
}
