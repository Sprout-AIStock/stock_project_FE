import React from 'react';
import './style.css';
import { FaIndustry, FaDna, FaShoppingCart, FaOilCan, FaNewspaper } from 'react-icons/fa';

const ThemeSection = () => {
    const themes = [
        {
            name: '기술',
            icon: <FaIndustry />,
            stocks: ['삼성전자', '네이버', '카카오', 'LG전자'],
            news: [
                { title: '삼성전자, AI 반도체 신제품 출시', date: '2024-08-07' },
                { title: '네이버 클라우드, 글로벌 확장', date: '2024-08-06' }
            ]
        },
        {
            name: '바이오',
            icon: <FaDna />,
            stocks: ['셀트리온', '삼성바이오로직스', '한미약품', '유한양행'],
            news: [
                { title: '셀트리온, 신약 임상 3상 성공', date: '2024-08-07' },
                { title: '바이오 섹터 투자 급증세', date: '2024-08-05' }
            ]
        },
        {
            name: '소비재',
            icon: <FaShoppingCart />,
            stocks: ['아모레퍼시픽', 'LG생활건강', '롯데케미칼', 'CJ제일제당'],
            news: [
                { title: '화장품 해외 수출 호조', date: '2024-08-06' },
                { title: '소비심리 회복 신호', date: '2024-08-04' }
            ]
        },
        {
            name: '에너지',
            icon: <FaOilCan />,
            stocks: ['SK이노베이션', 'GS칼텍스', '한국전력', 'SK가스'],
            news: [
                { title: '신재생에너지 투자 확대', date: '2024-08-07' },
                { title: '원유가격 상승 전망', date: '2024-08-05' }
            ]
        }
    ];

    const getThemeColor = (themeName) => {
        const colors = {
            '기술': '#3b82f6',
            '바이오': '#10b981',
            '소비재': '#f59e0b',
            '에너지': '#ef4444'
        };
        return colors[themeName] || '#2d72d9';
    };

    return (
        <div className="theme-wrapper">
            <div className="panel-header">
                <FaNewspaper className="panel-icon" />
                <h2 className="panel-title">섹터별 종목 & 뉴스</h2>
            </div>
            <div className="theme-grid">
                {themes.map((theme, index) => (
                    <div key={index} className="theme-item" style={{ '--theme-color': getThemeColor(theme.name) }}>
                        <div className="theme-header">
                            <div className="theme-info">
                                <span className="theme-icon-wrapper" style={{ color: getThemeColor(theme.name) }}>
                                    {theme.icon}
                                </span>
                                <div className="theme-name">{theme.name}</div>
                            </div>
                            <div className="theme-count">{theme.stocks.length}개 종목</div>
                        </div>

                        <div className="theme-stocks">
                            <div className="stocks-title">주요 종목</div>
                            <div className="stocks-list">
                                {theme.stocks.map((stock, idx) => (
                                    <span key={idx} className="stock-tag">
                                        {stock}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="theme-news">
                            <div className="news-title">관련 뉴스</div>
                            <div className="news-list">
                                {theme.news.map((newsItem, idx) => (
                                    <div key={idx} className="news-item">
                                        <div className="news-headline">{newsItem.title}</div>
                                        <div className="news-date">{newsItem.date}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ThemeSection;
