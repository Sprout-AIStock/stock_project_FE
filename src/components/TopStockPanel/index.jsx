import { FaSearchDollar } from "react-icons/fa";
import "./style.css";

const TopStockPanel = () => {
    return (
        <div className="topstock-panel">
            <div className="panel-header">
                <FaSearchDollar className="panel-icon" />
                <h2 className="panel-title">인기 검색 종목</h2>
            </div>
            <div className="topstock-list">
                {[
                    { name: '삼성전자', change: '+3.2%' },
                    { name: '카카오', change: '-1.1%' },
                    { name: 'LG에너지솔루션', change: '+2.5%' },
                    { name: 'SK하이닉스', change: '+1.8%' },
                    { name: '현대차', change: '+1.2%' }
                ].map((stock, idx) => (
                    <div key={idx} className="topstock-item">
                        <div className="stock-info">
                            <span className="topstock-rank">{idx + 1}</span>
                            <span className="stock-name">{stock.name}</span>
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
