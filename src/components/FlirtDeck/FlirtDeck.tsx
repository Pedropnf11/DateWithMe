import { useState, useEffect } from "react";
import { DeckData, SlideType } from "./types";
import IntroSlide from "./Slides/IntroSlide";
import WhyMeSlide from "./Slides/WhyMeSlide";
import FunFactsSlide from "./Slides/FunFactsSlide";
import RedFlagsSlide from "./Slides/RedFlagsSlide";
import RateMeSlide from "./Slides/RateMeSlide";

const DEFAULT_DATA: DeckData = {
    intro: {
        name: "coloca o teu nome",
        initials: "PT",
        tagline: "Algo interessante sobre ti",
        photo: null,
        gif: null,
    },
    whyMe: [
        { emoji: "✨", title: "Motivo 1", desc: "Desc 1" },
        { emoji: "✨", title: "Motivo 2", desc: "Desc 2" },
        { emoji: "✨", title: "Motivo 3", desc: "Desc 3" },
    ],
    funFacts: [
        "Fact 1",
        "Fact 2",
        "Fact 3",
        "Fact 4",
    ],
    redFlags: [
        { flag: "Red flag 1", severity: 1 },
        { flag: "Red flag 2", severity: 2 },
        { flag: "Red flag 3", severity: 1 },
    ],
};

const SLIDES: SlideType[] = ["intro", "why_me", "fun_facts", "red_flags", "rate_me"];

// ═══════════════════════════════════════════════════════════════
// GRADIENTES DINÂMICOS PARA CADA SLIDE
// ═══════════════════════════════════════════════════════════════
const SLIDE_GRADIENTS = {
    intro: "linear-gradient(135deg, rgba(255,80,120,0.15) 0%, rgba(255,100,150,0.1) 50%, rgba(20,20,25,0) 100%)",
    why_me: "linear-gradient(135deg, rgba(255,180,100,0.12) 0%, rgba(255,150,80,0.08) 50%, rgba(20,20,25,0) 100%)",
    fun_facts: "linear-gradient(135deg, rgba(100,200,255,0.12) 0%, rgba(80,180,255,0.08) 50%, rgba(20,20,25,0) 100%)",
    red_flags: "linear-gradient(135deg, rgba(255,120,80,0.12) 0%, rgba(255,100,80,0.08) 50%, rgba(20,20,25,0) 100%)",
    rate_me: "linear-gradient(135deg, rgba(200,100,255,0.12) 0%, rgba(180,80,255,0.08) 50%, rgba(20,20,25,0) 100%)",
};

interface FlirtDeckProps {
    data?: DeckData;
    compact?: boolean;
}

export default function FlirtDeck({ data: initialData, compact = false }: FlirtDeckProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [direction, setDirection] = useState(1);
    const [animating, setAnimating] = useState(false);
    const [rating, setRating] = useState<number | null>(null);
    const [hoverRating, setHoverRating] = useState<number | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [showRedFlag, setShowRedFlag] = useState<number | null>(null);
    const [mounted, setMounted] = useState(false);
    const [hoverPrev, setHoverPrev] = useState(false);
    const [hoverNext, setHoverNext] = useState(false);

    const data = initialData || DEFAULT_DATA;

    useEffect(() => {
        setMounted(true);
    }, []);

    // ─────────────────────────────────────────────────────────────
    // KEYBOARD NAVIGATION
    // ─────────────────────────────────────────────────────────────
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight" && currentSlide < SLIDES.length - 1) next();
            if (e.key === "ArrowLeft" && currentSlide > 0) prev();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentSlide, animating]);

    const goTo = (idx: number) => {
        if (animating || idx === currentSlide || idx < 0 || idx >= SLIDES.length) return;
        setDirection(idx > currentSlide ? 1 : -1);
        setAnimating(true);
        setTimeout(() => {
            setCurrentSlide(idx);
            setAnimating(false);
        }, 400);
    };

    const next = () => goTo(currentSlide + 1);
    const prev = () => goTo(currentSlide - 1);

    const currentGradient = SLIDE_GRADIENTS[SLIDES[currentSlide] as keyof typeof SLIDE_GRADIENTS];
    const progress = ((currentSlide + 1) / SLIDES.length) * 100;

    return (
        <div style={{
            minHeight: compact ? "auto" : "100dvh",
            background: "#08080c",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Playfair Display', Georgia, serif",
            padding: compact ? "0" : "20px",
            position: "relative",
            overflow: "hidden",
        }}>
            {/* ═══════════════════════════════════════════════════════════
                ANIMATED BACKGROUND GRADIENT
            ═══════════════════════════════════════════════════════════ */}
            <div style={{
                position: "fixed",
                inset: 0,
                background: currentGradient,
                transition: "background 0.6s cubic-bezier(0.4,0,0.2,1)",
                pointerEvents: "none",
            }} />

            {/* Radial gradient overlay */}
            {!compact && (
                <div style={{
                    position: "fixed",
                    inset: 0,
                    background: "radial-gradient(circle at 20% 20%, rgba(255,80,120,0.08) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(120,80,255,0.06) 0%, transparent 40%)",
                    pointerEvents: "none",
                }} />
            )}

            <div style={{ width: "100%", maxWidth: compact ? "100%" : 480, position: "relative", zIndex: 1 }}>
                {/* ═══════════════════════════════════════════════════════════
                    PROGRESS BAR + COUNTER
                ═══════════════════════════════════════════════════════════ */}
                <div style={{ marginBottom: 28 }}>
                    {/* Animated progress bar */}
                    <div style={{
                        height: 3,
                        background: "rgba(255,255,255,0.1)",
                        borderRadius: 100,
                        overflow: "hidden",
                        marginBottom: 12,
                        backdropFilter: "blur(8px)",
                    }}>
                        <div style={{
                            height: "100%",
                            background: "linear-gradient(90deg, #ff5078, #ff80a0, #ffb0c0)",
                            width: `${progress}%`,
                            transition: "width 0.5s cubic-bezier(0.34,1.56,0.64,1)",
                            borderRadius: 100,
                            boxShadow: "0 0 16px rgba(255,80,120,0.5)",
                        }} />
                    </div>

                    {/* Slide counter with animation */}
                    <div style={{
                        textAlign: "center",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "rgba(255,255,255,0.5)",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        animation: "fadeInScale 0.3s ease-out",
                    }}>
                        Slide {currentSlide + 1} de {SLIDES.length}
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════
                    CARD CONTAINER COM TRANSIÇÃO 3D
                ═══════════════════════════════════════════════════════════ */}
                <div style={{
                    position: "relative",
                    minHeight: compact ? 380 : 540,
                    perspective: "1200px",
                }}>
                    <div style={{
                        minHeight: compact ? 380 : 540,
                        background: "rgba(20,20,25,0.7)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 32,
                        padding: compact ? "24px" : "36px",
                        backdropFilter: "blur(24px)",
                        boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        // 3D Perspective Transform
                        transform: animating
                            ? `translateX(${direction * 80}px) scale(0.95) rotateY(${direction * 8}deg)`
                            : "translateX(0) scale(1) rotateY(0deg)",
                        opacity: animating ? 0 : 1,
                        transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                        transformStyle: "preserve-3d",
                    }}>
                        {mounted && (
                            <>
                                {SLIDES[currentSlide] === "intro" && <IntroSlide data={data.intro} compact={compact} />}
                                {SLIDES[currentSlide] === "why_me" && <WhyMeSlide data={data.whyMe} compact={compact} />}
                                {SLIDES[currentSlide] === "fun_facts" && <FunFactsSlide data={data.funFacts} compact={compact} />}
                                {SLIDES[currentSlide] === "red_flags" && <RedFlagsSlide data={data.redFlags} showFlag={showRedFlag} setShowFlag={setShowRedFlag} compact={compact} />}
                                {SLIDES[currentSlide] === "rate_me" && <RateMeSlide rating={rating} setRating={setRating} hoverRating={hoverRating} setHoverRating={setHoverRating} submitted={submitted} setSubmitted={setSubmitted} compact={compact} />}
                            </>
                        )}
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════
                    NAVIGATION CONTROLS COM MICRO-INTERACTIONS
                ═══════════════════════════════════════════════════════════ */}
                <div style={{
                    display: "flex",
                    gap: 12,
                    marginTop: 28,
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    {/* PREV BUTTON */}
                    <button
                        onClick={prev}
                        disabled={currentSlide === 0}
                        onMouseEnter={() => setHoverPrev(true)}
                        onMouseLeave={() => setHoverPrev(false)}
                        style={{
                            width: 56,
                            height: 56,
                            borderRadius: 20,
                            background: hoverPrev && currentSlide > 0
                                ? "rgba(255,255,255,0.15)"
                                : "rgba(255,255,255,0.05)",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid rgba(255,255,255,0.1)",
                            opacity: currentSlide === 0 ? 0.3 : 1,
                            cursor: currentSlide === 0 ? "not-allowed" : "pointer",
                            transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
                            fontSize: 20,
                            fontWeight: 700,
                            transform: hoverPrev && currentSlide > 0 ? "scale(1.1)" : "scale(1)",
                        }}
                    >
                        ←
                    </button>

                    {/* NEXT BUTTON */}
                    <button
                        onClick={next}
                        disabled={currentSlide === SLIDES.length - 1}
                        onMouseEnter={() => setHoverNext(true)}
                        onMouseLeave={() => setHoverNext(false)}
                        style={{
                            flex: 1,
                            height: 56,
                            borderRadius: 20,
                            background: currentSlide === SLIDES.length - 1
                                ? "rgba(255,255,255,0.05)"
                                : "linear-gradient(135deg, #ff5078, #ff3060)",
                            color: "#fff",
                            fontWeight: 800,
                            border: "none",
                            cursor: currentSlide === SLIDES.length - 1 ? "not-allowed" : "pointer",
                            boxShadow: currentSlide === SLIDES.length - 1
                                ? "none"
                                : hoverNext
                                    ? "0 12px 40px rgba(255,80,120,0.4)"
                                    : "0 8px 32px rgba(255,80,120,0.3)",
                            transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 10,
                            fontSize: 13,
                            transform: hoverNext && currentSlide < SLIDES.length - 1 ? "translateY(-2px)" : "translateY(0)",
                        }}
                    >
                        {currentSlide === SLIDES.length - 1 ? (
                            <span style={{ fontWeight: 900, fontSize: 14 }}>🎉 Fim</span>
                        ) : (
                            <>
                                <span>Ver próximo</span>
                                <span style={{ opacity: 0.6, fontSize: 11 }}>
                                    {currentSlide + 1}/{SLIDES.length}
                                </span>
                                <span>→</span>
                            </>
                        )}
                    </button>
                </div>

                {/* KEYBOARD HINT */}
                {!compact && (
                    <div style={{
                        marginTop: 16,
                        textAlign: "center",
                        fontSize: 9,
                        color: "rgba(255,255,255,0.3)",
                        letterSpacing: "0.08em",
                        fontWeight: 600,
                    }}>
                        ⌨️ Usa as setas do teclado para navegar
                    </div>
                )}
            </div>

            {/* ═══════════════════════════════════════════════════════════
                ANIMATIONS CSS
            ═══════════════════════════════════════════════════════════ */}
            <style>{`
                @keyframes fadeInScale {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            `}</style>
        </div>
    );
}