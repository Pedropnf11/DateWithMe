import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FlirtDeck from "../components/FlirtDeck/FlirtDeck";
import { DeckData } from "../components/FlirtDeck/types";
import { supabase } from "../lib/supabase";

export default function FlirtDeckPage() {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<DeckData | undefined>(undefined);
  const [error, setError] = useState(false);
  const [inviteId, setInviteId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const d = searchParams.get("d");
    const id = window.location.pathname.split("/").pop();
    const isId = id && id !== "flirt-deck" && id !== "flirt-preview";
    if (isId) setInviteId(id);

    async function fetchData() {
      if (isId) {
        const { data: invite, error: dbError } = await supabase
          .from('invites')
          .select('content')
          .eq('id', id)
          .single();

        if (dbError || !invite) {
          setError(true);
          return;
        }
        if (invite.content?.type === 'flirt-deck') {
          setData(invite.content.deckData);
        } else {
          setError(true);
        }
        return;
      }

      if (!d) return;

      try {
        const binary = atob(d);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const json = new TextDecoder("utf-8").decode(bytes);
        setData(JSON.parse(json));
      } catch (e) {
        try {
          const json = decodeURIComponent(escape(atob(d)));
          setData(JSON.parse(json));
        } catch {
          console.error("Failed to parse deck data", e);
          setError(true);
        }
      }
    }

    fetchData();
  }, [searchParams]);

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0a0a0f",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          fontFamily: "'Playfair Display', Georgia, serif",
          color: "rgba(255,255,255,0.4)",
        }}
      >
        <div style={{ fontSize: 48 }}>💔</div>
        <p style={{ fontSize: 16 }}>This FlirtDeck link is invalid or expired.</p>
        <a
          href="/"
          style={{
            marginTop: 8,
            padding: "10px 24px",
            borderRadius: 100,
            background: "linear-gradient(135deg, #f43f5e, #e11d48)",
            color: "#fff",
            fontWeight: 800,
            fontSize: 13,
            textDecoration: "none",
          }}
        >
          Create your own ↗
        </a>
      </div>
    );
  }

  return <FlirtDeck data={data} inviteId={inviteId} />;
}