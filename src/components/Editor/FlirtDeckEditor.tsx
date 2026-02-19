import { DeckData } from "../FlirtDeck/types";
import FlirtDeck from "../FlirtDeck/FlirtDeck";
import { EditorSection, Field, Input, TrashButton, AddButton, inputStyle } from "./EditorUI";
import { X } from "lucide-react";
import { motion } from "framer-motion";

interface FlirtDeckEditorProps {
    deckData: DeckData;
    setDeckData: React.Dispatch<React.SetStateAction<DeckData>>;
    onClose: () => void;
}

export default function FlirtDeckEditor({ deckData, setDeckData, onClose }: FlirtDeckEditorProps) {
    const updateIntro = (field: keyof DeckData["intro"], value: string) =>
        setDeckData(d => ({ ...d, intro: { ...d.intro, [field]: value } }));

    const updateWhyMe = (idx: number, field: keyof DeckData["whyMe"][0], value: string) => {
        const copy = [...deckData.whyMe];
        copy[idx] = { ...copy[idx], [field]: value };
        setDeckData(d => ({ ...d, whyMe: copy }));
    };

    const updateFunFact = (idx: number, value: string) => {
        const copy = [...deckData.funFacts];
        copy[idx] = value;
        setDeckData(d => ({ ...d, funFacts: copy }));
    };

    const updateRedFlag = (idx: number, field: "flag" | "severity", value: string | number) => {
        const copy = [...deckData.redFlags];
        copy[idx] = { ...copy[idx], [field]: value };
        setDeckData(d => ({ ...d, redFlags: copy }));
    };

    const copyLink = (open: boolean = false) => {
        try {
            const str = JSON.stringify(deckData);
            const b64 = btoa(unescape(encodeURIComponent(str)));
            const url = `${window.location.origin}/flirt-deck?d=${b64}`;
            navigator.clipboard?.writeText(url);
            if (open) window.open(url, "_blank");
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            style={{ background: "#fff", borderRadius: 28, width: "100%", maxWidth: 1100, maxHeight: "92vh", overflow: "hidden", position: "relative", zIndex: 1, display: "flex", flexDirection: "column" }}
        >
            {/* Modal header */}
            <div style={{ padding: "20px 28px", borderBottom: "1px solid rgba(255,64,104,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                <div>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 900, color: "#1a0a10", margin: 0 }}>
                        FlirtDeck™ Editor
                    </h2>
                    <p style={{ fontSize: 13, color: "#9a7080", margin: "4px 0 0" }}>Customize your presentation, then share the link with your crush</p>
                </div>
                <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,0.06)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <X size={18} color="#666" />
                </button>
            </div>

            {/* Modal body: editor + preview */}
            <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

                {/* LEFT: Editor */}
                <div style={{ width: "42%", overflow: "auto", padding: "24px", borderRight: "1px solid rgba(255,64,104,0.08)", flexShrink: 0 }}>
                    <EditorSection label="Intro">
                        <Field label="Your Name">
                            <Input value={deckData.intro.name} onChange={e => updateIntro("name", e.target.value)} />
                        </Field>
                        <Field label="Your Tagline">
                            <Input value={deckData.intro.tagline} onChange={e => updateIntro("tagline", e.target.value)} placeholder="Not your average date. 😏" />
                        </Field>
                    </EditorSection>

                    <EditorSection label="Why Me">
                        {deckData.whyMe.map((w, i) => (
                            <div key={i} style={{ background: "rgba(255,64,104,0.04)", borderRadius: 12, padding: "12px", marginBottom: 8, border: "1px solid rgba(255,64,104,0.08)" }}>
                                <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                                    <Input value={w.emoji} onChange={e => updateWhyMe(i, "emoji", e.target.value)} style={{ width: 52 }} placeholder="🎯" />
                                    <Input value={w.title} onChange={e => updateWhyMe(i, "title", e.target.value)} placeholder="Title" style={{ flex: 1 }} />
                                </div>
                                <Input value={w.desc} onChange={e => updateWhyMe(i, "desc", e.target.value)} placeholder="Description" />
                                {deckData.whyMe.length > 1 && (
                                    <TrashButton onClick={() => setDeckData(d => ({ ...d, whyMe: d.whyMe.filter((_, j) => j !== i) }))}>
                                        Remove
                                    </TrashButton>
                                )}
                            </div>
                        ))}
                        <AddButton onClick={() => setDeckData(d => ({ ...d, whyMe: [...d.whyMe, { emoji: "✨", title: "New reason", desc: "Describe it here" }] }))}>
                            + Add reason
                        </AddButton>
                    </EditorSection>

                    <EditorSection label="Fun Facts">
                        {deckData.funFacts.map((f, i) => (
                            <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                                <Input value={f} onChange={e => updateFunFact(i, e.target.value)} placeholder="Fun fact..." style={{ flex: 1 }} />
                                {deckData.funFacts.length > 1 && (
                                    <TrashButton onClick={() => setDeckData(d => ({ ...d, funFacts: d.funFacts.filter((_, j) => j !== i) }))} style={{ margin: 0, padding: "0 10px" }}>
                                        {""}
                                    </TrashButton>
                                )}
                            </div>
                        ))}
                        <AddButton onClick={() => setDeckData(d => ({ ...d, funFacts: [...d.funFacts, "New fun fact 🎉"] }))}>
                            + Add fun fact
                        </AddButton>
                    </EditorSection>

                    <EditorSection label="Red Flags">
                        {deckData.redFlags.map((r, i) => (
                            <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "center" }}>
                                <Input value={r.flag} onChange={e => updateRedFlag(i, "flag", e.target.value)} placeholder="Red flag..." style={{ flex: 1 }} />
                                <select value={r.severity} onChange={e => updateRedFlag(i, "severity", Number(e.target.value))} style={{ ...inputStyle, width: 52 }}>
                                    <option value={1}>🟡</option>
                                    <option value={2}>🟠</option>
                                    <option value={3}>🔴</option>
                                </select>
                                {deckData.redFlags.length > 1 && (
                                    <TrashButton onClick={() => setDeckData(d => ({ ...d, redFlags: d.redFlags.filter((_, j) => j !== i) }))} style={{ margin: 0, padding: "0 10px" }}>
                                        {""}
                                    </TrashButton>
                                )}
                            </div>
                        ))}
                        <AddButton onClick={() => setDeckData(d => ({ ...d, redFlags: [...d.redFlags, { flag: "New red flag", severity: 1 }] }))}>
                            + Add red flag
                        </AddButton>
                    </EditorSection>

                    {/* Share & Preview buttons */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
                        <button
                            onClick={() => copyLink(true)}
                            style={{ width: "100%", padding: "14px", borderRadius: 14, background: "linear-gradient(135deg, #ff5078, #ff3060)", border: "none", color: "#fff", fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 800, cursor: "pointer", letterSpacing: "0.04em", boxShadow: "0 8px 24px rgba(255,80,120,0.35)" }}>
                            🔗 Copy & Open Link
                        </button>

                        <button
                            onClick={() => {
                                const str = JSON.stringify(deckData);
                                const b64 = btoa(unescape(encodeURIComponent(str)));
                                window.open(`/flirt-deck?d=${b64}`, '_blank');
                            }}
                            style={{ width: "100%", padding: "12px", borderRadius: 14, background: "rgba(255,64,104,0.06)", border: "1px solid rgba(255,64,104,0.15)", color: "#ff4068", fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>
                            📱 Mobile Preview
                        </button>
                    </div>
                </div>

                {/* RIGHT: Live preview */}
                <div className="hidden md:block" style={{ flex: 1, overflow: "auto", background: "#08080c" }}>
                    <FlirtDeck data={deckData} compact />
                </div>
            </div>
        </motion.div>
    );
}
