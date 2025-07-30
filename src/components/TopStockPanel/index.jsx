import { FaSearchDollar } from "react-icons/fa";
import "./style.css";

const TopStockPanel = () => {
    return (
        <div className="topstock-panel">
            <div className="topstock-title"><FaSearchDollar className="topstock-icon" /> 인기 검색 종목</div>
            <ol className="topstock-list">
                {[
                    { name: '삼성전자', change: '+3.2%' },
                    { name: '카카오', change: '-1.1%' },
                    { name: 'LG에너지솔루션', change: '+2.5%' },
                    { name: 'SK하이닉스', change: '+1.8%' },
                    { name: '현대차', change: '+1.2%' },
                    { name: 'POSCO홀딩스', change: '+0.9%' },
                    { name: '네이버', change: '+0.7%' },
                    { name: '기아', change: '+0.5%' },
                    { name: '삼성SDI', change: '+0.3%' },
                    { name: '셀트리온', change: '-0.8%' },
                ].map((stock, idx) => (
                    <li key={idx}>
                        <span className="topstock-rank">{idx + 1}.</span> {stock.name} (
                        <span className={stock.change.startsWith('+') ? 'bullish' : 'bearish'}>
                            {stock.change}
                        </span>
                        )
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default TopStockPanel;
