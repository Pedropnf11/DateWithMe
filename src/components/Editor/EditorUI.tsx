import React from "react";
import { Trash2 } from "lucide-react";

export const inputStyle: React.CSSProperties = {
    width: "100%", padding: "8px 12px", borderRadius: 10,
    border: "1px solid rgba(255,64,104,0.15)", fontSize: 13,
    fontFamily: "'Inter', sans-serif", outline: "none", background: "#fff",
    color: "#1a0a10", boxSizing: "border-box",
};

export function Input({ value, onChange, placeholder, style }: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; style?: React.CSSProperties }) {
    return <input value={value} onChange={onChange} placeholder={placeholder} style={{ ...inputStyle, ...style }} />;
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#9a7080", marginBottom: 5, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</label>
            {children}
        </div>
    );
}

export function EditorSection({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#ff4068", marginBottom: 12, paddingBottom: 6, borderBottom: "1px solid rgba(255,64,104,0.1)", letterSpacing: "0.04em" }}>
                {label}
            </div>
            {children}
        </div>
    );
}

const trashButtonStyle: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: 4,
    background: "none", border: "none", cursor: "pointer",
    color: "#cca0a8", fontSize: 11, padding: "4px 0", marginTop: 4,
};

export function TrashButton({ onClick, children, style }: { onClick: () => void; children: React.ReactNode; style?: React.CSSProperties }) {
    return (
        <button onClick={onClick} style={{ ...trashButtonStyle, ...style }}>
            <Trash2 size={12} /> {children}
        </button>
    );
}

export function AddButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
    return (
        <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,64,104,0.06)", border: "1px dashed rgba(255,64,104,0.2)", borderRadius: 10, padding: "8px 14px", color: "#ff4068", fontSize: 12, fontWeight: 700, cursor: "pointer", width: "100%" }}>
            {children}
        </button>
    );
}
