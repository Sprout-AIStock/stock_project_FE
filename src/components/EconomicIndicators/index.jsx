import { useState, useEffect } from "react";
import { TbTrendingUp, TbTrendingDown, TbMinus, TbChartLine } from "react-icons/tb";
import "./style.css";

export default function EconomicIndicators() {
    const [indicators, setIndicators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError("");
                // BE: 최신 거시 입력(캐시) - /api/market/quad/input/latest (204 가능)
                const res = await fetch(`/api/market/quad/input/latest`);
                if (res.status === 204) {
                    setIndicators([]);
                    setLoading(false);
                    return;
                }
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const raw = await res.json();
                const data = raw?.data || raw; // ApiResponse 언랩

                const ffr = data.ffr_upper_pct; // %
                const core = data.core_pce_yoy_pct ?? data.core_cpi_yoy_pct; // %
                const unemp = data.unemp_rate_pct; // %
                const unempCh3m = data.unemp_rate_change_3m_pp; // pp
                const payrolls3m = data.payrolls_3mma_k; // k
                const claims4w = data.claims_4wma_k; // k
                const claimsTrend = data.claims_trend; // up/down/flat
                const policyCh3m = data.policyRateChange3m_bps; // bps
                const pmiM = data.pmi_mfg?.value;
                const pmiMCh = data.pmi_mfg?.deltaMoM;
                const pmiS = data.pmi_svcs?.value;
                const pmiSCh = data.pmi_svcs?.deltaMoM;

                const realRate = (ffr != null && core != null) ? (ffr - core) : null;

                // 3개 제외(PMI 제조, PMI 서비스, 정책금리 3M)하고 9개 항목 3x3로 구성
                const itemsAll = [
                    { name: "FFR 상단", value: fmtPct(ffr), change: fmtBp(policyCh3m), trend: policyCh3m == null ? 'stable' : (policyCh3m > 0 ? 'up' : policyCh3m < 0 ? 'down' : 'stable'), date: "미국 정책금리" },
                    { name: "코어 물가", value: fmtPct(core), change: "", trend: 'stable', date: data.core_pce_yoy_pct ? "Core PCE YoY" : "Core CPI YoY" },
                    { name: "실질금리", value: realRate==null?"n/a":`${realRate.toFixed(1)}%`, change: "", trend: realRate!=null && realRate>0? 'up':'stable', date: "FFR-코어" },
                    { name: "실업률", value: fmtPct(unemp), change: fmtPp(unempCh3m), trend: unempCh3m==null?'stable':(unempCh3m>0?'up':'down'), date: "3개월 변화" },
                    { name: "고용 3개월 평균", value: payrolls3m==null?"n/a":`+${Math.round(payrolls3m)}k`, change: "", trend: 'stable', date: "비농업" },
                    { name: "실업수당 4주", value: claims4w==null?"n/a":`${Math.round(claims4w)}k`, change: claimsTrend||"", trend: trendFromStr(claimsTrend), date: "주간" },
                    { name: "코어PCE", value: data.core_pce_yoy_pct==null?"n/a":`${data.core_pce_yoy_pct.toFixed(1)}%`, change: "", trend: 'stable', date: "YoY" },
                    { name: "코어CPI", value: data.core_cpi_yoy_pct==null?"n/a":`${data.core_cpi_yoy_pct.toFixed(1)}%`, change: "", trend: 'stable', date: "YoY" },
                    { name: "스냅샷 시점", value: data.asOf ? data.asOf.split('T')[0] : "n/a", change: "", trend: 'stable', date: "asOf" }
                ];
                const items = itemsAll.slice(0, 9);

                setIndicators(items);
            } catch (e) {
                setError("지표 로딩 실패");
                setIndicators([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const numTrend = (v) => v==null? 'stable' : (v>0? 'up' : v<0? 'down':'stable');
    const trendFromStr = (s) => s==='up'? 'up' : s==='down'? 'down' : 'stable';
    const fmtPct = (v) => v==null? 'n/a' : `${Number(v).toFixed(2)}%`;
    const fmtPp = (v) => v==null? '' : `${v>0?'+':''}${Number(v).toFixed(1)}pp`;
    const fmtBp = (v) => v==null? '' : `${v>0?'+':''}${v}bp`;
    const fmtDelta = (v) => `${v>0?'+':''}${Number(v).toFixed(1)}`;

    const getTrendIcon = (trend) => {
        switch (trend) {
            case 'up': return <TbTrendingUp className="trend-icon trend-up" />;
            case 'down': return <TbTrendingDown className="trend-icon trend-down" />;
            default: return <TbMinus className="trend-icon trend-stable" />;
        }
    };

    if (loading) {
        return (
            <div className="economic-indicators">
                <div className="panel-header">
                    <TbChartLine className="panel-icon" />
                    <h2 className="panel-title">경제 지표</h2>
                </div>
                <div className="loading-message">경제 지표 로딩 중...</div>
            </div>
        );
    }
    if (error) {
        return (
            <div className="economic-indicators">
                <div className="panel-header">
                    <TbChartLine className="panel-icon" />
                    <h2 className="panel-title">경제 지표</h2>
                </div>
                <div className="loading-message">{error}</div>
            </div>
        );
    }

    return (
        <div className="economic-indicators">
            <div className="panel-header">
                <TbChartLine className="panel-icon" />
                <h2 className="panel-title">경제 지표</h2>
            </div>
            <div className="indicators-list" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {indicators.map((indicator, index) => (
                    <div key={index} className="indicator-item">
                        <div className="indicator-info">
                            <div className="indicator-name">{indicator.name}</div>
                            <div className="indicator-date">{indicator.date}</div>
                        </div>
                        <div className="indicator-value">
                            <span className="value">{indicator.value}</span>
                            <div className="change-info">
                                {getTrendIcon(indicator.trend)}
                                <span className={`change change-${indicator.trend}`}>
                                    {indicator.change}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
