import { useState } from 'react';
import './style.css';

export default function ReportChat() {
  const [question, setQuestion] = useState('오늘 시장 핵심 요약 알려줘');
  const [k, setK] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [answer, setAnswer] = useState('');
  const [citations, setCitations] = useState([]);
  const [usedDate, setUsedDate] = useState('');
  // 우측 고정 채팅박스 상태
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([{ role: 'assistant', content: '보고서 기반 챗봇입니다. 질문을 입력해 주세요.' }]);

  const base = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');

  const handleAsk = async (e) => {
    e?.preventDefault?.();
    setLoading(true);
    setError('');
    setAnswer('');
    setCitations([]);
    try {
      const res = await fetch(`${base}/api/chat/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, k: Number(k) || 5 })
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `질의 실패 (${res.status})`);
      }
      const body = await res.json();
      const data = body?.data || body;
      setAnswer(data.answer || '');
      setCitations(Array.isArray(data.citations) ? data.citations : []);
      setUsedDate(data.usedReportDate || '');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${base}/api/report/daily`, { method: 'POST' });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `리포트 생성 실패 (${res.status})`);
      }
      await handleAsk();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 우측 채팅 전송
  const sendChat = async () => {
    const content = chatInput.trim();
    if (!content) return;
    const next = [...messages, { role: 'user', content }];
    setMessages(next);
    setChatInput('');
    try {
      const res = await fetch(`${base}/api/chat/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: content, k: 5 })
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.message || `질의 실패 (${res.status})`);
      const data = body?.data || body;
      setMessages([...next, { role: 'assistant', content: data.answer || '(빈 응답)' }]);
    } catch (err) {
      setMessages([...next, { role: 'assistant', content: `오류: ${err.message}` }]);
    }
  };

  return (
    <div className="report-chat-container">
      <div className="report-chat-main">
        <h2 style={{ margin: '8px 0 16px' }}>보고서 기반 챗봇</h2>
      <form onSubmit={handleAsk} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="질문을 입력하세요"
          style={{ flex: 1, padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8 }}
        />
        <input
          type="number"
          min={1}
          max={10}
          value={k}
          onChange={(e) => setK(e.target.value)}
          title="검색 스니펫 개수"
          style={{ width: 72, padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8 }}
        />
        <button type="submit" disabled={loading} style={{ padding: '10px 14px', borderRadius: 8, background: '#2d72d9', color: '#fff', border: 'none' }}>
          {loading ? '질의 중...' : '질의'}
        </button>
        <button type="button" disabled={loading} onClick={handleGenerateReport} style={{ padding: '10px 14px', borderRadius: 8, background: '#111827', color: '#fff', border: 'none' }}>
          리포트 생성+질의
        </button>
      </form>

      {error && (
        <div style={{ background: '#FEF2F2', color: '#991B1B', padding: 12, borderRadius: 8, marginBottom: 12 }}>
          {error}
        </div>
      )}

      {usedDate && (
        <div style={{ color: '#6b7280', fontSize: 12, marginBottom: 8 }}>사용된 리포트 날짜: {usedDate}</div>
      )}

      <div style={{ background: '#f8f9fa', padding: 16, borderRadius: 12, minHeight: 120 }}>
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{answer || '답변이 여기에 표시됩니다.'}</div>
      </div>

      {citations && citations.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>참고 스니펫</div>
          <ul style={{ listStyle: 'disc', paddingLeft: 18, margin: 0 }}>
            {citations.map((c, idx) => (
              <li key={idx} style={{ marginBottom: 8 }}>
                <div style={{ fontWeight: 600 }}>{c.title}</div>
                <div style={{ color: '#6b7280', fontSize: 12 }}>lines {c.startLine}–{c.endLine} • score {typeof c.score === 'number' ? c.score.toFixed(3) : c.score}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
      </div>

      {/* 우측 채팅 패널 */}
      <div className="report-chat-sidebar">
        <div className="chat-header">AI 대화</div>
        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`message ${m.role === 'user' ? 'message-user' : 'message-assistant'}`}>
              <div className={`message-bubble ${m.role === 'user' ? 'message-bubble-user' : 'message-bubble-assistant'}`}>
                {m.content}
              </div>
            </div>
          ))}
        </div>
        <div className="chat-input-area">
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); } }}
            placeholder="메시지를 입력하세요"
            className="chat-input"
          />
          <button onClick={sendChat} className="chat-send-btn">보내기</button>
        </div>
      </div>
    </div>
  );
}


