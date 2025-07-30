
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { TbChartLine, TbBrain, TbNews } from 'react-icons/tb';
import StockChart from '../../components/StockChart';
import StockInsight from '../../components/StockInsight';
import StockIssues from '../../components/StockIssues';
import './style.css';

export default function StockDetail() {
    const { code } = useParams();
    const [stockName, setStockName] = useState("");

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

    if (!code) {
        return (
            <div className="stock-detail-bg">
                <div className="stock-detail-container">
                    <div className="stock-detail-center-panel">
                        <div className="error-message">종목 코드가 없습니다.</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="stock-detail-bg">
            <div className="stock-detail-container">
                <div className="stock-detail-center-panel">
                    <div className="stock-detail-header">
                        <h1 className="stock-detail-title">{stockName}</h1>
                        <p className="stock-detail-code">종목코드: {code}</p>
                    </div>

                    <div className="stock-detail-section">
                        <h2 className="section-title">
                            <TbChartLine className="section-icon" />
                            주가 차트
                        </h2>
                        <StockChart code={code} />
                    </div>

                    <div className="stock-detail-section">
                        <h2 className="section-title">
                            <TbBrain className="section-icon" />
                            AI 인사이트
                        </h2>
                        <StockInsight code={code} />
                    </div>

                    <div className="stock-detail-section" style={{ marginBottom: 0 }}>
                        <h2 className="section-title">
                            <TbNews className="section-icon" />
                            관련 뉴스
                        </h2>
                        <StockIssues code={code} />
                    </div>
                </div>
            </div>
        </div>
    );
}
