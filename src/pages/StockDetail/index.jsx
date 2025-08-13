
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaArrowLeft, FaChartLine, FaBrain, FaNewspaper } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import StockChart from '../../components/StockChart';
import StockInsight from '../../components/StockInsight';
import StockIssues from '../../components/StockIssues';
import './style.css';

export default function StockDetail() {
    const { code } = useParams();
    const navigate = useNavigate();
    const [stockName, setStockName] = useState("");

	// AI 대화창 상태
	const base = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');
	const [chatInput, setChatInput] = useState("");
	const [chatLoading, setChatLoading] = useState(false);
	const [messages, setMessages] = useState([{ role: 'assistant', content: '종목/시장 관련 궁금한 점을 물어보세요.' }]);

    useEffect(() => {
        // Mock 종목명 매핑 (BannerWithSearch와 동일하게 유지)
        const mockCodeToName = {
            "005930": "삼성전자",
            "207940": "삼성바이오로직스",
            "005935": "삼성전자우",
            "006400": "삼성SDI",
            "028260": "삼성물산",
            "032830": "삼성생명",
            "009150": "삼성전기",
            "018260": "삼성에스디에스",
            "000810": "삼성화재",
            "016360": "삼성증권",
            "000660": "SK하이닉스",
            "017670": "SK텔레콤",
            "096770": "SK이노베이션",
            "373220": "LG에너지솔루션",
            "051910": "LG화학",
            "066570": "LG전자",
            "035420": "네이버",
            "035720": "카카오",
            "323410": "카카오뱅크",
            "005380": "현대차",
            "012330": "현대모비스",
            "068270": "셀트리온",
            "091990": "셀트리온헬스케어",
            "005490": "POSCO홀딩스",
            "105560": "KB금융",
            "055550": "신한지주"
        };
        setStockName(mockCodeToName[code] || code);
    }, [code]);

	// 종목 변경 시 첫 메시지 갱신
	useEffect(() => {
		if (!code) return;
		setMessages([{ role: 'assistant', content: `안녕하세요! ${stockName || code}에 대해 궁금한 점을 물어보세요.` }]);
	}, [code, stockName]);

	const sendChat = async () => {
		const content = chatInput.trim();
		if (!content || chatLoading) return;
		const next = [...messages, { role: 'user', content }];
		setMessages(next);
		setChatInput("");
		setChatLoading(true);
		try {
			const res = await fetch(`${base}/api/chat/stock`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ question: content, stockCode: code })
			});
			const body = await res.json().catch(() => ({}));
			if (!res.ok) {
				throw new Error(body.message || `질의 실패 (${res.status})`);
			}
			const data = body?.data || body;
			setMessages([...next, { role: 'assistant', content: data.answer || '(빈 응답)' }]);
		} catch (err) {
			setMessages([...next, { role: 'assistant', content: `오류: ${err.message}` }]);
		} finally {
			setChatLoading(false);
		}
	};

    if (!code) {
        return (
            <div className="stock-detail-container">
                <div className="single-column-layout">
                    <div className="error-section">
                        <div className="panel-header">
                            <FaNewspaper className="panel-icon" />
                            <h2 className="panel-title">오류</h2>
                        </div>
                        <div className="error-message">종목 코드가 없습니다.</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="stock-detail-container">
            <div className="stock-detail-main">
                {/* 뒤로가기 버튼 */}
                <div className="back-navigation">
                    <button className="back-button" onClick={() => navigate('/')}>
                        <FaArrowLeft className="back-icon" />
                        메인으로 돌아가기
                    </button>
                </div>

                {/* 종목 정보 */}
                <div className="stock-info-section">
                    <h1 className="stock-name">{stockName}</h1>
                    <p className="stock-code">종목코드: {code}</p>
                </div>

                {/* 주가 차트 */}
                <div className="chart-section">
                    <div className="panel-header">
                        <FaChartLine className="panel-icon" />
                        <h2 className="panel-title">주가 차트</h2>
                    </div>
                    <div className="panel-content">
                        <StockChart code={code} />
                    </div>
                </div>

                {/* AI 인사이트 */}
                <div className="insight-section">
                    <div className="panel-header">
                        <FaBrain className="panel-icon" />
                        <h2 className="panel-title">AI 인사이트</h2>
                    </div>
                    <div className="panel-content">
                        <StockInsight code={code} />
                    </div>
                </div>

                {/* 관련 뉴스 */}
                <div className="news-section">
                    <div className="panel-header">
                        <FaNewspaper className="panel-icon" />
                        <h2 className="panel-title">관련 뉴스</h2>
                    </div>
                    <div className="panel-content">
                        <StockIssues code={code} />
                    </div>
                </div>
            </div>

			{/* 우측 대화창 */}
			<div className="stock-detail-sidebar">
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
					<button onClick={sendChat} disabled={chatLoading} className="chat-send-btn">
						{chatLoading ? '전송중' : '보내기'}
					</button>
				</div>
			</div>
        </div>
    );
}
