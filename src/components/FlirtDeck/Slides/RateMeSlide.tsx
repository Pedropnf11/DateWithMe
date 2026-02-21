import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import iconPromess from "../../../assets/emote/icon_promess.webp";
import { supabase } from "../../../lib/supabase";

interface RateMeSlidProps {
    rating: number | null;
    setRating: (rating: number) => void;
    hoverRating: number | null;
    setHoverRating: (rating: number | null) => void;
    submitted: boolean;
    setSubmitted: (submitted: boolean) => void;
    compact?: boolean;
    inviteId?: string;
}

const CUTE_MESSAGES = {
    1: [
        "Então sou assim tão mau?",
        "Merecia mais pelo esforço aahaha"

    ],
    2: [
        "2? Assim até parece que sou um animal ahaha",
        "Criatividade não dá pontos?"

    ],
    3: [
        "Pensa na criatividade isso nao dá pontos?",
        "Só +1 para não chorar aahaha."
    ]
};

export default function RateMeSlide({
    rating,
    setRating,
    hoverRating,
    setHoverRating,
    submitted,
    setSubmitted,
    compact = false,
    inviteId,
}: RateMeSlidProps) {
    const [attempts, setAttempts] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const sliderRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    // ═════════════════════════════════════════════════════════════
    // HANDLE SLIDER DRAG
    // ═════════════════════════════════════════════════════════════
    const handleSliderInteraction = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
        if (!sliderRef.current) return;

        const rect = sliderRef.current.getBoundingClientRect();
        const clientX = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
        const x = clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
        const newRating = Math.max(0, Math.min(10, Math.round((percentage / 100) * 10)));
        setRating(newRating);
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging.current) {
                handleSliderInteraction(e);
            }
        };

        const handleMouseUp = () => {
            isDragging.current = false;
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    // ═════════════════════════════════════════════════════════════
    // HANDLE SUBMIT — 2 tentativas para ratings baixos
    // ═════════════════════════════════════════════════════════════
    const handleSubmit = async () => {
        if (rating === null || rating === 0) return;

        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        // Se rating é baixo (1, 2, 3) E ainda não usou 2 tentativas...
        if (rating <= 3 && newAttempts < 3) {
            const messages = CUTE_MESSAGES[rating as 1 | 2 | 3];
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];

            setPopupMessage(randomMessage);
            setShowPopup(true);

            setTimeout(() => {
                setShowPopup(false);
            }, 2500);

            return; // NÃO SUBMETE ainda
        }

        // 3ª tentativa ou rating > 3 — submete
        try {
            if (inviteId) {
                await supabase.rpc('submit_response', {
                    invite_uuid: inviteId,
                    p_decisao: 'rating',
                    p_answers: { rating },
                    p_mensagem: `Avaliação: ${rating}/10 ✨`,
                });
            }
        } catch (error) {
            console.error("Error submitting rating:", error);
        }

        setSubmitted(true);

        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FF69B4', '#ff8c42', '#FFD700', '#FF1493', '#fff'],
        });
    };

    const sliderPercentage = rating ? (rating / 10) * 100 : 0;

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 28,
                height: "100%",
                justifyContent: "center",
            }}
        >
            {/* HEADER */}
            <div style={{ textAlign: "center" }}>
                <p
                    style={{
                        fontSize: 10,
                        color: "rgba(255,182,193,0.7)",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        fontWeight: 700,
                        marginBottom: 8,
                    }}
                >
                    BOSS FINAL
                </p>

                <h2
                    style={{
                        fontSize: 32,
                        fontWeight: 900,
                        color: "#fff",
                        margin: 0,
                        marginBottom: 4,
                    }}
                >
                    O que achaste?
                </h2>

                <p
                    style={{
                        fontSize: 13,
                        color: "rgba(255,255,255,0.6)",
                        margin: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8
                    }}
                >
                    Não mintas, pinky promise não se quebra.
                    <img src={iconPromess} alt="pinky promise" style={{ width: 20, height: 20, objectFit: "contain" }} />
                </p>
            </div>

            {/* QUESTION MARK */}
            <div style={{ fontSize: 80, opacity: 0.2 }}>?</div>

            {/* SLIDER + NÚMEROS */}
            <div
                style={{
                    width: "100%",
                    maxWidth: 360,
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                }}
            >
                {/* SLIDER */}
                <div
                    ref={sliderRef}
                    style={{
                        position: "relative",
                        height: 8,
                        background: "rgba(255,255,255,0.1)",
                        borderRadius: 10,
                        cursor: "grab",
                        overflow: "visible",
                        border: "1px solid rgba(255,255,255,0.2)",
                    }}
                    onMouseDown={() => { isDragging.current = true; }}
                    onClick={handleSliderInteraction}
                    onTouchStart={() => { isDragging.current = true; }}
                    onTouchMove={handleSliderInteraction}
                    onTouchEnd={() => { isDragging.current = false; }}
                >
                    <div
                        style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            height: "100%",
                            background: "linear-gradient(90deg, #ff8c42, #ff6b9d)",
                            width: `${sliderPercentage}%`,
                            borderRadius: 10,
                            boxShadow: "0 0 12px rgba(255,139,66,0.4)",
                        }}
                    />
                    {rating !== null && rating !== 0 && (
                        <div
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: `${sliderPercentage}%`,
                                transform: "translate(-50%, -50%)",
                                width: 28,
                                height: 28,
                                background: "linear-gradient(135deg, #ff8c42, #ff6b9d)",
                                borderRadius: "50%",
                                boxShadow: "0 4px 16px rgba(255,107,157,0.5)",
                                border: "3px solid rgba(255,255,255,0.3)",
                                zIndex: 10,
                            }}
                        />
                    )}
                </div>

                {/* NÚMEROS 0-10 */}
                <div style={{ display: "flex", gap: 4 }}>
                    {Array.from({ length: 11 }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setRating(i)}
                            style={{
                                flex: 1,
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                                background: rating === i
                                    ? "linear-gradient(135deg, #ff8c42, #ff6b9d)"
                                    : "rgba(255,255,255,0.1)",
                                border: "1px solid rgba(255,255,255,0.2)",
                                color: "#fff",
                                fontWeight: 700,
                                fontSize: 12,
                                cursor: "pointer",
                                transition: "all 0.2s ease-out",
                                padding: 0,
                                boxShadow: rating === i ? "0 4px 12px rgba(255,107,157,0.4)" : "none",
                            }}
                            onMouseEnter={(e) => {
                                if (rating !== i) {
                                    (e.target as HTMLButtonElement).style.transform = "scale(1.1)";
                                    (e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.15)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                (e.target as HTMLButtonElement).style.transform = "scale(1)";
                                (e.target as HTMLButtonElement).style.background = rating === i
                                    ? "linear-gradient(135deg, #ff8c42, #ff6b9d)"
                                    : "rgba(255,255,255,0.1)";
                            }}
                        >
                            {i}
                        </button>
                    ))}
                </div>
            </div>

            {/* MESSAGE */}
            {rating !== null && rating > 0 && (
                <p
                    style={{
                        fontSize: 13,
                        color: "rgba(255,255,255,0.7)",
                        textAlign: "center",
                        fontWeight: 600,
                    }}
                >
                    {rating <= 3 && `Então vá lá ${rating} ?`}
                    {rating >= 4 && rating <= 6 && `Podia ser pior, parece que tenho de trabalhar mais`}
                    {rating >= 7 && rating <= 8 && `Elahhhhh  hoje até vai haver presunto para celebrar`}
                    {rating >= 9 && `ELAHHHHH calma calma, isto é real?`}
                </p>
            )}

            {/* BUTTON */}
            <button
                onClick={handleSubmit}
                disabled={rating === null || rating === 0 || submitted}
                style={{
                    width: "100%",
                    maxWidth: 360,
                    padding: "14px 24px",
                    background: rating === null || rating === 0
                        ? "rgba(255,255,255,0.05)"
                        : submitted
                            ? "linear-gradient(135deg, #22c55e, #10b981)"
                            : "linear-gradient(135deg, #ff8c42, #ff6b9d)",
                    border: "none",
                    borderRadius: 20,
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: 13,
                    cursor: (rating === null || rating === 0 || submitted) ? "not-allowed" : "pointer",
                    transition: "all 0.3s ease-out",
                    boxShadow: (rating === null || rating === 0)
                        ? "none"
                        : "0 8px 32px rgba(255,107,157,0.3)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                }}
                onMouseEnter={(e) => {
                    if (!submitted && rating && rating > 0) {
                        (e.target as HTMLButtonElement).style.transform = "translateY(-2px)";
                        (e.target as HTMLButtonElement).style.boxShadow = "0 12px 40px rgba(255,107,157,0.4)";
                    }
                }}
                onMouseLeave={(e) => {
                    if (!submitted && rating && rating > 0) {
                        (e.target as HTMLButtonElement).style.transform = "scale(1)";
                    }
                }}
            >
                {submitted ? "Obrigado" : "Enviar"}
            </button>

            {/* POPUPS */}
            <AnimatePresence>
                {showPopup && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: "fixed",
                            inset: 0,
                            zIndex: 9998,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 24,
                            background: "rgba(0,0,0,0.5)",
                            backdropFilter: "blur(6px)",
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.94, opacity: 0, y: 8 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.94, opacity: 0, y: 8 }}
                            transition={{ type: "spring", stiffness: 300, damping: 28 }}
                            style={{
                                background: "rgba(18,18,22,0.9)",
                                backdropFilter: "blur(32px)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                borderRadius: 24,
                                padding: "36px 40px",
                                maxWidth: 320,
                                width: "100%",
                                textAlign: "center",
                                boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
                                position: "relative",
                                overflow: "hidden",
                            }}
                        >
                            {/* Subtle top accent line */}
                            <div style={{
                                position: "absolute",
                                top: 0,
                                left: "20%",
                                right: "20%",
                                height: 1,
                                background: "linear-gradient(90deg, transparent, rgba(255,107,157,0.6), transparent)",
                            }} />

                            <p style={{
                                fontSize: 17,
                                fontWeight: 600,
                                color: "rgba(255,255,255,0.9)",
                                lineHeight: 1.5,
                                margin: 0,
                                fontFamily: "'Playfair Display', serif",
                                letterSpacing: "-0.01em",
                            }}>
                                {popupMessage}
                            </p>
                        </motion.div>
                    </motion.div>
                )}

                {submitted && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                            position: "fixed",
                            inset: 0,
                            zIndex: 9998,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 24,
                            background: "rgba(0,0,0,0.7)",
                            backdropFilter: "blur(12px)",
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.88, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 220, damping: 22 }}
                            style={{
                                background: "rgba(14,14,18,0.95)",
                                backdropFilter: "blur(40px)",
                                border: "1px solid rgba(255,255,255,0.07)",
                                borderRadius: 32,
                                padding: "52px 48px",
                                maxWidth: 360,
                                width: "100%",
                                textAlign: "center",
                                boxShadow: "0 60px 120px rgba(0,0,0,0.7)",
                                position: "relative",
                                overflow: "hidden",
                            }}
                        >
                            {/* Ambient glow */}
                            <div style={{
                                position: "absolute",
                                top: -60,
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: 200,
                                height: 200,
                                background: "radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)",
                                pointerEvents: "none",
                            }} />

                            {/* Monogram check */}
                            <div style={{
                                width: 56,
                                height: 56,
                                borderRadius: "50%",
                                border: "1px solid rgba(34,197,94,0.3)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 28px",
                                background: "rgba(34,197,94,0.08)",
                            }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(34,197,94,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>

                            <h3 style={{
                                fontSize: 22,
                                fontWeight: 800,
                                color: "#fff",
                                margin: "0 0 10px",
                                letterSpacing: "-0.02em",
                                fontFamily: "'Playfair Display', serif",
                            }}>
                                Obrigado
                            </h3>
                            <p style={{
                                fontSize: 13,
                                color: "rgba(255,255,255,0.35)",
                                margin: 0,
                                letterSpacing: "0.04em",
                                fontWeight: 500,
                            }}>
                                A tua avaliação foi guardada.
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
