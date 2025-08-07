import { useState, useEffect } from "react";
import { TbTrendingUp, TbTrendingDown, TbMinus, TbChartLine } from "react-icons/tb";
import "./style.css";

export default function EconomicIndicators() {
    const [indicators, setIndicators] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock 경제 지표 데이터 (3x4 그리드용)
        const mockIndicators = [
            {
                name: "금리",
                value: "5.25%",
                change: "+0.25%",
                trend: "up",
                date: "미국"
            },
            {
                name: "금",
                value: "$2,045",
                change: "+$12",
                trend: "up",
                date: "온스당"
            },
            {
                name: "환율",
                value: "1,350원",
                change: "+15원",
                trend: "up",
                date: "달러/원"
            },
            {
                name: "고용지표",
                value: "3.7%",
                change: "-0.1%",
                trend: "down",
                date: "실업률"
            },
            {
                name: "유가",
                value: "$78.50",
                change: "-$1.20",
                trend: "down",
                date: "WTI"
            },
            {
                name: "비트코인",
                value: "$45,230",
                change: "+$1,150",
                trend: "up",
                date: "BTC/USD"
            },
            {
                name: "인플레이션",
                value: "3.2%",
                change: "+0.1%",
                trend: "up",
                date: "CPI"
            },
            {
                name: "나스닥",
                value: "14,567",
                change: "+125",
                trend: "up",
                date: "지수"
            },
            {
                name: "S&P500",
                value: "4,891",
                change: "+32",
                trend: "up",
                date: "지수"
            },
            {
                name: "코스피",
                value: "2,654",
                change: "-12",
                trend: "down",
                date: "지수"
            },
            {
                name: "국채수익률",
                value: "4.15%",
                change: "+0.05%",
                trend: "up",
                date: "10년물"
            },
            {
                name: "달러지수",
                value: "103.45",
                change: "+0.25",
                trend: "up",
                date: "DXY"
            }
        ];

        setIndicators(mockIndicators);
        setLoading(false);
    }, []);

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

    return (
        <div className="economic-indicators">
            <div className="panel-header">
                <TbChartLine className="panel-icon" />
                <h2 className="panel-title">경제 지표</h2>
            </div>
            <div className="indicators-list">
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
