import { useState } from "react";
import { DeckData, SlideType } from "./types";
import IntroSlide from "./Slides/IntroSlide";
import WhyMeSlide from "./Slides/WhyMeSlide";
import FunFactsSlide from "./Slides/FunFactsSlide";
import RedFlagsSlide from "./Slides/RedFlagsSlide";
import RateMeSlide from "./Slides/RateMeSlide";

const DEFAULT_DATA: DeckData = {
    intro: {
        name: "coloca o teu nome",
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

    const data = initialData || DEFAULT_DATA;

    const goTo = (idx: number) => {
        if (animating || idx === currentSlide || idx < 0 || idx >= SLIDES.length) return;
        setDirection(idx > currentSlide ? 1 : -1);
        setAnimating(true);
        setTimeout(() => {
            setCurrentSlide(idx);
            setAnimating(false);
        }, 300);
    };

    const next = () => goTo(currentSlide + 1);
    const prev = () => goTo(currentSlide - 1);

    const slideStyle: React.CSSProperties = {
        transform: animating ? `translateX(${direction * 56}px)` : "translateX(0)",
        opacity: animating ? 0 : 1,
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
    };

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
            {!compact && (
                <div style={{ position: "fixed", inset: 0, background: "radial-gradient(circle at 20% 20%, rgba(255,80,120,0.08) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(120,80,255,0.06) 0%, transparent 40%)", pointerEvents: "none" }} />
            )}

            <div style={{ width: "100%", maxWidth: compact ? "100%" : 480, position: "relative", zIndex: 1 }}>
                {/* Progress dots */}
                <div style={{ display: "flex", gap: 6, marginBottom: 24, justifyContent: "center" }}>
                    {SLIDES.map((s, i) => (
                        <div key={s} style={{
                            flex: 1, height: 4, borderRadius: 10,
                            background: i === currentSlide ? "linear-gradient(90deg, #ff5078, #ff80a0)" : i < currentSlide ? "rgba(255,80,120,0.4)" : "rgba(255,255,255,0.1)",
                            transition: "all 0.4s",
                        }} />
                    ))}
                </div>

                {/* Card */}
                <div style={{
                    minHeight: compact ? 380 : 540,
                    background: "rgba(20,20,25,0.7)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 32,
                    padding: compact ? "24px" : "36px",
                    backdropFilter: "blur(24px)",
                    boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
                    display: "flex", flexDirection: "column",
                    ...slideStyle,
                }}>
                    {SLIDES[currentSlide] === "intro" && <IntroSlide data={data.intro} compact={compact} />}
                    {SLIDES[currentSlide] === "why_me" && <WhyMeSlide data={data.whyMe} compact={compact} />}
                    {SLIDES[currentSlide] === "fun_facts" && <FunFactsSlide data={data.funFacts} compact={compact} />}
                    {SLIDES[currentSlide] === "red_flags" && <RedFlagsSlide data={data.redFlags} showFlag={showRedFlag} setShowFlag={setShowRedFlag} compact={compact} />}
                    {SLIDES[currentSlide] === "rate_me" && <RateMeSlide rating={rating} setRating={setRating} hoverRating={hoverRating} setHoverRating={setHoverRating} submitted={submitted} setSubmitted={setSubmitted} compact={compact} />}
                </div>

                {/* Controls */}
                <div style={{ display: "flex", gap: 12, marginTop: 24, alignItems: "center" }}>
                    <button
                        onClick={prev}
                        disabled={currentSlide === 0}
                        style={{ width: 56, height: 56, borderRadius: 20, background: "rgba(255,255,255,0.05)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.1)", opacity: currentSlide === 0 ? 0.3 : 1, cursor: "pointer" }}
                    >
                        ←
                    </button>

                    <button
                        onClick={next}
                        disabled={currentSlide === SLIDES.length - 1}
                        style={{
                            flex: 1, height: 56, borderRadius: 20,
                            background: currentSlide === SLIDES.length - 1 ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #ff5078, #ff3060)",
                            color: "#fff", fontWeight: 800, border: "none", cursor: "pointer",
                            boxShadow: currentSlide === SLIDES.length - 1 ? "none" : "0 8px 32px rgba(255,80,120,0.3)",
                            transition: "all 0.2s"
                        }}
                    >
                        {currentSlide === SLIDES.length - 1 ? "The End" : "Next Slide →"}
                    </button>
                </div>
            </div>
        </div>
    );
}
