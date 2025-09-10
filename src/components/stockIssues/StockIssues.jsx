import { useEffect, useState } from "react";

export default function StockIssues({ code }) {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!code) return;
        setLoading(true);
        setError("");
        const base = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');
        // 1) 종목명 조회 → 2) 해당 키워드로 뉴스 검색
        fetch(`${base}/api/stock/${encodeURIComponent(code)}/name`)
            .then(r => r.json())
            .then(nameObj => {
                const stockName = nameObj.stockName || code;
                return fetch(`${base}/api/news/theme/${encodeURIComponent(stockName)}?display=5`);
            })
            .then(res => {
                if (!res.ok) throw new Error(`뉴스 정보를 불러올 수 없습니다. (${res.status})`);
                return res.json();
            })
            .then(raw => {
                const payload = raw?.data || raw; // ApiResponse 언랩
                const items = Array.isArray(payload) ? payload : [];
                const formatted = items.map(it => ({
                    title: it.title,
                    date: (it.pubDate || '').split(' ').slice(0, 4).join(' '),
                    url: it.link || it.originallink || '#'
                }));
                setNews(formatted);
            })
            .catch(err => {
                console.log('테마 기사 로딩 실패, Mock 데이터 사용:', err.message);
                // 실패 시 Mock 뉴스 데이터 사용
                const mockNews = {
                    "005930": [
                        { title: "삼성전자, AI 반도체 수요 급증으로 4분기 실적 개선 전망", date: "2025-01-30" },
                        { title: "삼성전자 HBM3E 양산 본격화...AI 시장 선점 나선다", date: "2025-01-29" },
                        { title: "반도체 업사이클 본격화, 삼성전자 수혜 기대", date: "2025-01-28" },
                        { title: "삼성전자, 차세대 메모리 기술 개발 가속화", date: "2025-01-27" }
                    ],
                    "000660": [
                        { title: "SK하이닉스, HBM 공급 계약 확대...AI 붐 수혜 지속", date: "2025-01-30" },
                        { title: "SK하이닉스 HBM4 개발 순조, 2026년 양산 목표", date: "2025-01-29" },
                        { title: "엔비디아와 SK하이닉스 파트너십 강화 소식", date: "2025-01-28" }
                    ],
                    "373220": [
                        { title: "LG에너지솔루션, 북미 공장 가동률 90% 돌파", date: "2025-01-30" },
                        { title: "전기차 배터리 수요 급증...LG에너지솔루션 수주 호조", date: "2025-01-29" },
                        { title: "LG에너지솔루션, 차세대 배터리 기술 개발 성과", date: "2025-01-28" }
                    ],
                    "035420": [
                        { title: "네이버, AI 검색 서비스 고도화로 경쟁력 강화", date: "2025-01-30" },
                        { title: "네이버 클라우드, 기업 고객 확대로 매출 성장", date: "2025-01-29" },
                        { title: "네이버웹툰, 글로벌 진출 가속화", date: "2025-01-28" }
                    ],
                    "035720": [
                        { title: "카카오, AI 서비스 통합 플랫폼 출시 예정", date: "2025-01-30" },
                        { title: "카카오페이, 해외 진출 본격화", date: "2025-01-29" },
                        { title: "카카오톡 비즈니스 서비스 확장", date: "2025-01-28" }
                    ],
                    "005380": [
                        { title: "현대차, 전기차 신모델 출시로 시장 점유율 확대", date: "2025-01-30" },
                        { title: "현대차 미국 공장 전기차 생산 본격화", date: "2025-01-29" },
                        { title: "제네시스 브랜드, 럭셔리 시장에서 선전", date: "2025-01-28" }
                    ],
                    "068270": [
                        { title: "셀트리온, 바이오시밀러 신제품 FDA 승인 획득", date: "2025-01-30" },
                        { title: "셀트리온 신약 개발 파이프라인 확대", date: "2025-01-29" },
                        { title: "셀트리온, 글로벌 제약회사와 라이센스 계약 체결", date: "2025-01-28" }
                    ]
                };

                setNews(mockNews[code] || [
                    { title: "해당 종목 관련 뉴스가 준비 중입니다", date: "2025-01-30" },
                    { title: "곧 최신 뉴스를 업데이트할 예정입니다", date: "2025-01-30" }
                ]);
            })
            .finally(() => setLoading(false));
    }, [code]); if (loading) return <div className="stock-issues">뉴스 로딩 중...</div>;
    if (error) return <div className="stock-issues">{error}</div>;
    if (!news.length) return <div className="stock-issues">뉴스 정보 없음</div>;
    return (
        <div className="stock-issues">
            <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
                {news.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: 16 }}>
                        <div style={{ fontWeight: 600 }}>{item.title}</div>
                        <div style={{ fontSize: 13, color: '#888' }}>{item.date}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
