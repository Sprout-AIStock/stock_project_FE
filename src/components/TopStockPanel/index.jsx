import { FaSearchDollar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./style.css";

const TopStockPanel = () => {
    const navigate = useNavigate();
    // 종목명 → 종목코드 매핑 예시 (실제 데이터에 맞게 수정 필요)
    const stockMap = {
        '삼성전자': '005930',
        '카카오': '035720',
        'LG에너지솔루션': '373220',
        'SK하이닉스': '000660',
        '현대차': '005380',
    };
    const topStocks = [
        { name: '삼성전자', change: '+3.2%' },
        { name: '카카오', change: '-1.1%' },
        { name: 'LG에너지솔루션', change: '+2.5%' },
        { name: 'SK하이닉스', change: '+1.8%' },
        { name: '현대차', change: '+1.2%' }
    ];
    const handleClick = (name) => {
        const code = stockMap[name];
        if (code) {
            navigate(`/stock/${code}`);
        } else {
            alert('종목 코드 정보를 찾을 수 없습니다.');
        }
    };
    return (
        <div className="topstock-panel">
            <div className="panel-header">
                <FaSearchDollar className="panel-icon" />
                <h2 className="panel-title">인기 검색 종목</h2>
            </div>
            <div className="topstock-list">
                {topStocks.map((stock, idx) => (
                    <div key={idx} className="topstock-item" style={{ cursor: 'pointer' }} onClick={() => handleClick(stock.name)}>
                        <div className="stock-info">
                            <span className="topstock-rank">{idx + 1}</span>
                            <span className="topstock-name">{stock.name}</span>
                        </div>
                        <span className={`stock-change ${stock.change.startsWith('+') ? 'bullish' : 'bearish'}`}>
                            {stock.change}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopStockPanel;
