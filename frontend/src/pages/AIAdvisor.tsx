import React, { useState, useRef, useEffect } from "react";
import { aiChat, aiRecommend, getProjects } from "../utils/api";

interface Message { role: "user" | "assistant"; content: string; }
interface Rec { name: string; reason: string; score: number; allocation: string; tag: string; }

const GOALS = [
  "Offset my company's annual emissions (~500 tCO₂)",
  "Build a diversified credit portfolio ($10,000 budget)",
  "Highest quality credits — price no object",
  "Maximum tonnes for minimum cost",
  "Focus on biodiversity co-benefits",
];

const CERTS = ["Any standard", "Gold Standard only", "Verra VCS only", "Gold Standard or Verra VCS"];
const REGIONS = ["Global (no preference)", "Asia Pacific", "Latin America", "Africa", "North America"];

const AIAdvisor: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm your carbon credit advisor powered by Claude. I can help you choose the right credits, explain certification standards, model your offset needs, or analyse market trends. What would you like to know?" },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const [goal, setGoal] = useState(GOALS[0]);
  const [cert, setCert] = useState(CERTS[0]);
  const [region, setRegion] = useState(REGIONS[0]);
  const [recommending, setRecommending] = useState(false);
  const [recs, setRecs] = useState<Rec[]>([]);
  const [selectedRec, setSelectedRec] = useState(0);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const sendChat = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setSending(true);
    try {
      const { reply } = await aiChat(newMessages.map((m) => ({ role: m.role, content: m.content })));
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Sorry, the AI advisor is temporarily unavailable. Please check your API key." }]);
    }
    setSending(false);
  };

  const getRecommendations = async () => {
    setRecommending(true);
    setRecs([]);
    try {
      const projects = await getProjects();
      const { recommendations } = await aiRecommend({ goal, cert, region, projects });
      setRecs(recommendations ?? []);
    } catch {
      setRecs([]);
    }
    setRecommending(false);
  };

  return (
    <div className="grid-2" style={{ alignItems: "start" }}>
      {/* ── RECOMMENDER ── */}
      <div>
        <div className="card mb-14">
          <div className="card-header">
            <span className="card-title">AI credit recommender</span>
            <span className="badge badge-live">Claude API</span>
          </div>
          <p style={{ fontSize: 12, color: "var(--slate-400)", marginBottom: 14 }}>
            Share your offsetting goals and get personalised project picks from Claude.
          </p>

          <div className="form-group">
            <label className="form-label">Your goal</label>
            <select className="form-control" value={goal} onChange={(e) => setGoal(e.target.value)}>
              {GOALS.map((g) => <option key={g}>{g}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Certification preference</label>
            <select className="form-control" value={cert} onChange={(e) => setCert(e.target.value)}>
              {CERTS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Region preference</label>
            <select className="form-control" value={region} onChange={(e) => setRegion(e.target.value)}>
              {REGIONS.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>

          <button className="btn btn-green btn-block btn-lg" onClick={getRecommendations} disabled={recommending}>
            {recommending ? "Analysing projects…" : "Get AI recommendations"}
          </button>
        </div>

        {recs.length > 0 && (
          <div className="card">
            <div className="card-header">
              <span className="card-title">Recommended for you</span>
              <span className="badge badge-green">{recs.length} picks</span>
            </div>
            {recs.map((r, i) => (
              <div
                key={i}
                className={`rec-card${selectedRec === i ? " selected" : ""}`}
                onClick={() => setSelectedRec(i)}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ fontWeight: 500, fontSize: 13 }}>{r.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 11, color: "var(--slate-400)" }}>{r.allocation}</span>
                    <span className="rec-score">{r.score}</span>
                    <span className="badge badge-green">{r.tag}</span>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "var(--slate-500)" }}>{r.reason}</div>
                <div className="progress-mini">
                  <div style={{ height: "100%", width: `${r.score}%`, background: "var(--green-500)", borderRadius: 2, transition: "width 0.5s" }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── CHAT ── */}
      <div className="card" style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>
        <div className="card-header">
          <span className="card-title">Ask Claude</span>
          <span className="badge badge-blue">AI chat</span>
        </div>

        <div ref={chatRef} style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, paddingBottom: 8 }}>
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                borderRadius: 10,
                padding: "11px 14px",
                fontSize: 13,
                lineHeight: 1.65,
                maxWidth: "90%",
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                background: m.role === "user" ? "var(--slate-100)" : "var(--green-50)",
                border: m.role === "assistant" ? "1px solid var(--green-100)" : "none",
                borderBottomRightRadius: m.role === "user" ? 3 : 10,
                borderBottomLeftRadius: m.role === "assistant" ? 3 : 10,
              }}
            >
              {m.content}
            </div>
          ))}
          {sending && (
            <div style={{ alignSelf: "flex-start", background: "var(--green-50)", border: "1px solid var(--green-100)", borderRadius: 10, borderBottomLeftRadius: 3, padding: "11px 14px" }}>
              <div style={{ display: "flex", gap: 4 }}>
                {[0, 1, 2].map((i) => (
                  <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green-500)", display: "inline-block", animation: `bounce 1.1s ${i * 0.18}s infinite` }} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 12, borderTop: "1px solid var(--slate-200)", paddingTop: 12 }}>
          <input
            className="form-control"
            style={{ flex: 1 }}
            placeholder="Ask about credits, standards, pricing…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendChat()}
          />
          <button className="btn btn-green" onClick={sendChat} disabled={sending || !input.trim()}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default AIAdvisor;
