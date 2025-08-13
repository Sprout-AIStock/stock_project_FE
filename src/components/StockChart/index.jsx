import { useEffect, useState } from "react";
import {
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    ReferenceLine
} from 'recharts';

const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');

export default function StockChart({ code }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [stockName, setStockName] = useState("");
    // 종목명 별도 fetch 상태
    const [resolvedName, setResolvedName] = useState("");
    const [chartType, setChartType] = useState("daily");
    const [rawData, setRawData] = useState(null);
    const [chartData, setChartData] = useState([]);

    // 차트 API 호출 (chartType에 따라 분기)
    useEffect(() => {
        if (!code) return;

        // 종목명 별도 API 호출
        const fetchStockName = async () => {
            try {
                const url = `${API_BASE}/api/stock/${code}/name`;
                const response = await fetch(url);
                if (response.ok) {
                    const result = await response.json();
                    // 래퍼 구조: { code, message, data: { stockName } }
                    const name = result?.data?.stockName || result?.stockName || "";
                    setResolvedName(name);
                } else {
                    setResolvedName("");
                }
            } catch {
                setResolvedName("");
            }
        };

        fetchStockName();

        const fetchStockData = async () => {
            try {
                setLoading(true);
                setError("");

                let apiUrl = '';
                if (chartType === 'daily') {
                    apiUrl = `${API_BASE}/api/stock/${code}/chart/daily?count=30`;
                } else if (chartType === 'weekly') {
                    apiUrl = `${API_BASE}/api/stock/${code}/chart/weekly?count=20`;
                } else if (chartType === 'monthly') {
                    apiUrl = `${API_BASE}/api/stock/${code}/chart/monthly?count=12`;
                }

                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`API 호출 실패: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                let dealTrendInfos = [];
                const payload = data.data || data;
                if (Array.isArray(payload)) {
                    dealTrendInfos = payload;
                } else if (Array.isArray(payload.dealTrendInfos)) {
                    dealTrendInfos = payload.dealTrendInfos;
                } else if (Array.isArray(payload.data)) {
                    dealTrendInfos = payload.data;
                }
                setRawData({ dealTrendInfos });
                processChartData({ dealTrendInfos }, chartType);

                if (!dealTrendInfos || dealTrendInfos.length === 0) {
                    setError("차트 데이터가 없습니다.");
                }

            } catch (err) {
                setError(`차트 데이터를 불러올 수 없습니다: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchStockData();
    }, [code, chartType]);

    // 차트 타입 변경시 데이터 재처리
    useEffect(() => {
        if (rawData) {
            processChartData(rawData, chartType);
        }
    }, [chartType, rawData]);

    // 차트 데이터 처리 함수
    const processChartData = (data, type) => {
        if (!data.dealTrendInfos || data.dealTrendInfos.length === 0) {
            setChartData([]);
            return;
        }

        console.log(`🔄 ${type} 차트 데이터 처리 시작`);
        console.log('📊 dealTrendInfos 샘플:', data.dealTrendInfos.slice(0, 3));
        const dealData = data.dealTrendInfos;
        // API 순서대로(최신→과거) 사용
        let processedData = dealData.map(item => {
            const dateString = item.date;
            if (!dateString) return null;
            const date = formatDateForChart(dateString);
            const open = parseFloat(item.open);
            const high = parseFloat(item.high);
            const low = parseFloat(item.low);
            const close = parseFloat(item.close);
            const volume = parseFloat(item.volume) / 1000000;
            if (isNaN(close)) return null;
            return {
                date,
                open: isNaN(open) ? close : open,
                high: isNaN(high) ? close : high,
                low: isNaN(low) ? close : low,
                close,
                volume: isNaN(volume) ? 0 : volume,
                isUp: open <= close
            };
        }).filter(item => item !== null);
        setChartData(processedData);
    };

    // 날짜 포맷 함수
    const formatDateForChart = (dateString) => {
        if (!dateString) return new Date().toISOString().split('T')[0];

        if (dateString.includes('-')) {
            return dateString;
        } else if (dateString.length === 8) {
            return dateString.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
        } else {
            console.warn('⚠️ 예상하지 못한 날짜 형식:', dateString);
            return new Date().toISOString().split('T')[0];
        }
    };

    // 커스텀 캔들스틱 모양 컴포넌트 (recharts의 Bar 커스텀 shape로 사용)
    const CustomCandlestick = (props) => {
        const { x, y, width, height, payload } = props;
        if (!payload || !chartData || chartData.length === 0) return null;
        // chartData에서 high/low가 NaN이면 렌더링하지 않음
        const chartLows = chartData.map(d => d.low).filter(v => !isNaN(v));
        const chartHighs = chartData.map(d => d.high).filter(v => !isNaN(v));
        if (chartLows.length === 0 || chartHighs.length === 0) return null;
        const chartMin = Math.min(...chartLows);
        const chartMax = Math.max(...chartHighs);
        const chartHeight = 200; // 차트 높이(px)와 일치시켜야 함
        // recharts에서 넘겨주는 y, height를 활용해 실제 Y축 영역에 맞게 변환
        const priceToY = (price) => {
            if (isNaN(price) || chartMax === chartMin) return y + height;
            // y: Y축 상단, height: Y축 전체 픽셀
            // price가 chartMax면 y, price가 chartMin이면 y+height
            return y + ((chartMax - price) / (chartMax - chartMin)) * height;
        };
        const candleWidth = width * 0.6;
        const candleX = x + (width - candleWidth) / 2;
        const highY = priceToY(payload.high);
        const lowY = priceToY(payload.low);
        const openY = priceToY(payload.open);
        const closeY = priceToY(payload.close);
        // NaN 방지
        if ([highY, lowY, openY, closeY].some(v => isNaN(v))) return null;
        const bodyTop = Math.min(openY, closeY);
        const bodyHeight = Math.abs(openY - closeY);
        const color = payload.isUp ? '#ff4444' : '#0066ff';
        return (
            <g>
                <line
                    x1={candleX + candleWidth / 2}
                    y1={highY}
                    x2={candleX + candleWidth / 2}
                    y2={lowY}
                    stroke={color}
                    strokeWidth="1"
                />
                <rect
                    x={candleX}
                    y={bodyTop}
                    width={candleWidth}
                    height={Math.max(bodyHeight, 1)}
                    fill={color}
                    stroke={color}
                    strokeWidth="1"
                />
            </g>
        );
    };

    // 툴팁 컴포넌트
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div style={{
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '10px',
                    fontSize: '12px'
                }}>
                    <p style={{ margin: 0 }}>{`날짜: ${data.date}`}</p>
                    <p style={{ margin: 0, color: '#ff4444' }}>{`시가: ${data.open?.toLocaleString()}`}</p>
                    <p style={{ margin: 0, color: '#ff6600' }}>{`고가: ${data.high?.toLocaleString()}`}</p>
                    <p style={{ margin: 0, color: '#0066ff' }}>{`저가: ${data.low?.toLocaleString()}`}</p>
                    <p style={{ margin: 0, color: '#333' }}>{`종가: ${data.close?.toLocaleString()}`}</p>
                    <p style={{ margin: 0, color: '#666' }}>{`거래량: ${data.volume?.toFixed(2)}M`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>
                {(resolvedName || stockName || code)} 주가 차트 ({code})
            </h3>

            {/* 차트 타입 선택 버튼 (항상 표시) */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <button
                    onClick={() => setChartType('daily')}
                    style={{
                        padding: '8px 16px',
                        border: chartType === 'daily' ? '2px solid #1976d2' : '1px solid #ddd',
                        borderRadius: '4px',
                        backgroundColor: chartType === 'daily' ? '#e3f2fd' : 'white',
                        color: chartType === 'daily' ? '#1976d2' : '#666',
                        cursor: 'pointer'
                    }}
                >
                    일봉
                </button>
                <button
                    onClick={() => setChartType('weekly')}
                    style={{
                        padding: '8px 16px',
                        border: chartType === 'weekly' ? '2px solid #1976d2' : '1px solid #ddd',
                        borderRadius: '4px',
                        backgroundColor: chartType === 'weekly' ? '#e3f2fd' : 'white',
                        color: chartType === 'weekly' ? '#1976d2' : '#666',
                        cursor: 'pointer'
                    }}
                >
                    주봉
                </button>
                <button
                    onClick={() => setChartType('monthly')}
                    style={{
                        padding: '8px 16px',
                        border: chartType === 'monthly' ? '2px solid #1976d2' : '1px solid #ddd',
                        borderRadius: '4px',
                        backgroundColor: chartType === 'monthly' ? '#e3f2fd' : 'white',
                        color: chartType === 'monthly' ? '#1976d2' : '#666',
                        cursor: 'pointer'
                    }}
                >
                    월봉
                </button>
            </div>

            {/* 아래 영역: 로딩/에러/차트 */}
            {loading ? (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '400px',
                    fontSize: '16px',
                    color: '#666'
                }}>
                    차트 데이터를 불러오는 중...
                </div>
            ) : error ? (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '400px',
                    fontSize: '16px',
                    color: '#d32f2f',
                    backgroundColor: '#ffeaea',
                    borderRadius: '8px',
                    border: '1px solid #ffcdd2'
                }}>
                    {error}
                </div>
            ) : (
                <>
                    {/* 차트 설명 */}
                    <div style={{ marginBottom: '12px', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                        <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#495057' }}>📊 차트 정보</h4>
                        <div style={{ fontSize: '12px', color: '#6c757d', lineHeight: '1.4' }}>
                            <span style={{ color: '#ff4444', fontWeight: 'bold' }}>■ 빨간색</span>: 상승 (시가 {'<'} 종가) |
                            <span style={{ color: '#0066ff', fontWeight: 'bold' }}> ■ 파란색</span>: 하락 (시가 {'>'} 종가)<br />
                            <strong>심지</strong>: 고가~저가 | <strong>몸통</strong>: 시가~종가 | <strong>거래량</strong>: 하단 막대그래프
                        </div>
                    </div>

                    {/* 주가 차트 (캔들스틱) */}
                    <div style={{ marginBottom: '20px' }}>
                        <ResponsiveContainer width="100%" height={300}>
                            <ComposedChart data={chartData} margin={{ top: 40, right: 40, left: 40, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={(value) => value.substring(5)}
                                />
                                <YAxis
                                    domain={['auto', 'auto']}
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={(value) => value.toLocaleString()}
                                    allowDataOverflow={true}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                {/* 캔들스틱 바 */}
                                <Bar
                                    dataKey="close" // dummy, shape만 사용
                                    shape={<CustomCandlestick chartData={chartData} />}
                                    isAnimationActive={false}
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>

                    {/* 거래량 차트 */}
                    <div>
                        <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#495057' }}>거래량 (백만주)</h4>
                        <ResponsiveContainer width="100%" height={120}>
                            <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 10 }}
                                    tickFormatter={(value) => value.substring(5)}
                                />
                                <YAxis
                                    tick={{ fontSize: 10 }}
                                    tickFormatter={(value) => value.toFixed(1)}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="volume">
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.isUp ? '#ff4444' : '#0066ff'} />
                                    ))}
                                </Bar>
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </>
            )}
        </div>
    );
}
