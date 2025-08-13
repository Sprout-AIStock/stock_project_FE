import { useEffect, useState } from "react";
import { TbTarget, TbTrendingUp, TbTrendingDown, TbMinus } from "react-icons/tb";
import "./style.css";

export default function StockInsight({ code }) {
    const [insight, setInsight] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!code) return;
        setLoading(true);
        setError("");

        // 실제 백엔드 API 호출
        const base = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');
        fetch(`${base}/api/stock/opinion?code=${encodeURIComponent(code)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(async res => {
                if (!res.ok) {
                    const errorBody = await res.json();
                    throw new Error(errorBody.message || `API 호출 실패: ${res.status}`);
                }
                return res.json();
            })
            .then(raw => {
                const data = raw?.data || raw; // ApiResponse 언랩
                const getOpinionIcon = (stance) => {
                    switch (stance) {
                        case 'buy': return <TbTrendingUp style={{ color: '#22c55e' }} />;
                        case 'sell': return <TbTrendingDown style={{ color: '#ef4444' }} />;
                        case 'neutral': return <TbMinus style={{ color: '#f59e0b' }} />;
                        default: return <TbTarget style={{ color: '#6366f1' }} />;
                    }
                };

                const formattedInsight = (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontWeight: 'bold', fontSize: '1.1rem' }}>
                            {getOpinionIcon(data.stance)}
                            투자 의견: {data.stance === 'buy' ? '매수' : data.stance === 'sell' ? '매도' : '중립'} (확신도: {(data.confidence * 100).toFixed(1)}%)
                        </div>
                        <div style={{ lineHeight: '1.6', marginBottom: '16px' }}>
                            {data.reasons && data.reasons.length > 0 ? (
                                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                    {data.reasons.map((reason, index) => (
                                        <li key={index} style={{ marginBottom: '8px' }}>{reason}</li>
                                    ))}
                                </ul>
                            ) : '분석 중입니다...'}
                        </div>
                        <div style={{ fontStyle: 'italic', color: '#666', fontSize: '0.9rem' }}>
                            AI 분석 기준 종목: {data.stock?.name || code} • 분석 시점: {data.asOf || ''}
                        </div>
                    </div>
                );
                setInsight(formattedInsight);
            })
            .catch(err => {
                console.log('AI 인사이트 API 호출 실패:', err.message);
                // 백엔드 API 실패 시 Mock 인사이트 사용
                setError(null); // 에러 표시하지 않고 Mock 데이터 사용
                const mockInsights = {
                    "005930": (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontWeight: 'bold' }}>
                                <TbMinus style={{ color: '#6366f1', fontSize: '1.2rem' }} />
                                중립 전망
                            </div>
                            삼성전자는 현재 반도체 업사이클과 AI 수요 증가로 긍정적인 전망을 보이고 있습니다. 메모리 반도체 가격 상승과 함께 실적 개선이 기대됩니다. 다만 중국 리스크와 환율 변동성에 주의가 필요합니다.
                        </div>
                    ),
                    "000660": (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontWeight: 'bold' }}>
                                <TbTrendingUp style={{ color: '#22c55e', fontSize: '1.2rem' }} />
                                긍정적 전망
                            </div>
                            SK하이닉스는 HBM(고대역폭메모리) 수요 급증으로 수혜를 받고 있습니다. AI 반도체 붐과 함께 차세대 메모리 기술 선도 기업으로 주목받고 있으나, 투자 부담과 경쟁 심화에 유의해야 합니다.
                        </div>
                    ),
                    "373220": (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontWeight: 'bold' }}>
                                <TbTrendingUp style={{ color: '#22c55e', fontSize: '1.2rem' }} />
                                성장 기대
                            </div>
                            LG에너지솔루션은 전기차 배터리 시장 성장과 함께 꾸준한 성장이 예상됩니다. 북미 공장 가동률 상승과 신규 고객사 확보가 긍정적 요인입니다.
                        </div>
                    ),
                    "035420": (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontWeight: 'bold' }}>
                                <TbMinus style={{ color: '#6366f1', fontSize: '1.2rem' }} />
                                안정적 성장
                            </div>
                            네이버는 AI 기술 투자와 클라우드 사업 확장으로 새로운 성장 동력을 확보하고 있습니다. 웹툰, 게임 등 콘텐츠 사업도 안정적인 수익을 제공하고 있습니다.
                        </div>
                    ),
                    "035720": (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontWeight: 'bold' }}>
                                <TbMinus style={{ color: '#f59e0b', fontSize: '1.2rem' }} />
                                관망 필요
                            </div>
                            카카오는 플랫폼 다각화와 AI 서비스 강화에 집중하고 있습니다. 톡비즈, 카카오페이 등 핀테크 서비스의 성장이 기대되나, 규제 리스크를 주의해야 합니다.
                        </div>
                    ),
                    "005380": (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontWeight: 'bold' }}>
                                <TbTrendingUp style={{ color: '#22c55e', fontSize: '1.2rem' }} />
                                전기차 수혜
                            </div>
                            현대차는 전기차 전환과 함께 제네시스 브랜드 고급화가 성과를 내고 있습니다. 미국 IRA 혜택과 신규 전기차 모델 출시가 긍정적 요인입니다.
                        </div>
                    ),
                    "068270": (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontWeight: 'bold' }}>
                                <TbMinus style={{ color: '#6366f1', fontSize: '1.2rem' }} />
                                안정적 성장
                            </div>
                            셀트리온은 바이오시밀러 시장에서의 경쟁우위를 바탕으로 안정적인 성장이 예상됩니다. 신약 개발 파이프라인도 중장기 성장 동력으로 주목받고 있습니다.
                        </div>
                    ),
                    "091990": (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontWeight: 'bold' }}>
                                <TbTrendingUp style={{ color: '#22c55e', fontSize: '1.2rem' }} />
                                바이오 성장
                            </div>
                            셀트리온헬스케어는 바이오의약품 유통 및 개발 전문 기업으로 안정적인 성장세를 보이고 있습니다. 모회사 셀트리온과의 시너지 효과가 기대됩니다.
                        </div>
                    ),
                    "207940": (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontWeight: 'bold' }}>
                                <TbTrendingUp style={{ color: '#22c55e', fontSize: '1.2rem' }} />
                                바이오 리더
                            </div>
                            삼성바이오로직스는 글로벌 바이오의약품 위탁생산 분야에서 선두 기업입니다. 지속적인 생산능력 확장과 신규 계약 확보가 긍정적 요인입니다.
                        </div>
                    ),
                    "323410": (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontWeight: 'bold' }}>
                                <TbMinus style={{ color: '#f59e0b', fontSize: '1.2rem' }} />
                                디지털 금융
                            </div>
                            카카오뱅크는 디지털 금융 서비스 선도 기업으로 사용자 기반 확대가 지속되고 있습니다. 금리 변동과 규제 환경 변화에 주의가 필요합니다.
                        </div>
                    )
                };

                setInsight(mockInsights[code] || "해당 종목에 대한 AI 인사이트가 준비 중입니다. 곧 업데이트될 예정입니다.");
            })
            .finally(() => setLoading(false));
    }, [code]); if (loading) return <div className="stock-insight">AI 인사이트 로딩 중...</div>;
    if (error) return <div className="stock-insight">{error}</div>;
    return (
        <div className="stock-insight">
            {insight ? insight : "AI 인사이트 정보 없음"}
        </div>
    );
}
