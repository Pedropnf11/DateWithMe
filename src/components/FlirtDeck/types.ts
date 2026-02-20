export interface DeckData {
    intro: {
        name: string;
        initials?: string;
        tagline: string;
        photo?: string | null;
        gif?: string | null;
    };
    whyMe: Array<{ emoji: string; title: string; desc: string }>;
    funFacts: string[];
    redFlags: Array<{ flag: string; severity: number }>;
}

export type SlideType = "intro" | "why_me" | "fun_facts" | "red_flags" | "rate_me";
