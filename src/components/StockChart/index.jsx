import { useEffect, useState } from "react";

export default function StockChart({ code }) {
    const [chartUrl, setChartUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!code) return;
        setLoading(true);
        setError("");

        // 실제 API로 주식 정보 조회
        fetch(`/api/stock/search/${encodeURIComponent(code)}`)
            .then(res => {
                if (!res.ok) throw new Error("종목 정보를 불러올 수 없습니다.");
                return res.json();
            })
            .then(data => {
                // API 명세에 chart_url이 없으므로 Mock 차트 사용
                const mockCharts = {
                    "005930": "https://via.placeholder.com/600x400/4CAF50/white?text=삼성전자+차트",
                    "000660": "https://via.placeholder.com/600x400/2196F3/white?text=SK하이닉스+차트",
                    "373220": "https://via.placeholder.com/600x400/FF9800/white?text=LG에너지솔루션+차트",
                    "035420": "https://via.placeholder.com/600x400/9C27B0/white?text=네이버+차트",
                    "035720": "https://via.placeholder.com/600x400/FFEB3B/black?text=카카오+차트",
                    "005380": "https://via.placeholder.com/600x400/795548/white?text=현대차+차트",
                    "068270": "https://via.placeholder.com/600x400/E91E63/white?text=셀트리온+차트"
                };

                setChartUrl(mockCharts[code] || `https://via.placeholder.com/600x400/607D8B/white?text=${data.name}+차트`);
            })
            .catch(err => {
                setError(err.message);
                // 실패 시 Mock 차트 표시
                const mockCharts = {
                    "005930": "https://via.placeholder.com/600x400/4CAF50/white?text=삼성전자+차트",
                    "000660": "https://via.placeholder.com/600x400/2196F3/white?text=SK하이닉스+차트",
                    "373220": "https://via.placeholder.com/600x400/FF9800/white?text=LG에너지솔루션+차트",
                    "035420": "https://via.placeholder.com/600x400/9C27B0/white?text=네이버+차트",
                    "035720": "https://via.placeholder.com/600x400/FFEB3B/black?text=카카오+차트",
                    "005380": "https://via.placeholder.com/600x400/795548/white?text=현대차+차트",
                    "068270": "https://via.placeholder.com/600x400/E91E63/white?text=셀트리온+차트"
                };
                setChartUrl(mockCharts[code] || "https://via.placeholder.com/600x400/607D8B/white?text=차트+준비중");
            })
            .finally(() => setLoading(false));
    }, [code]); if (loading) return <div className="stock-chart">차트 로딩 중...</div>;
    if (error) return <div className="stock-chart">{error}</div>;
    if (chartUrl) {
        return (
            <div className="stock-chart">
                <img src={chartUrl} alt={`${code} 차트`} style={{ width: "100%", borderRadius: 8 }} />
            </div>
        );
    }
    return <div className="stock-chart">차트 정보 없음</div>;
}
