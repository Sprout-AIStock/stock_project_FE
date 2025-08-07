import React, { useState } from 'react';
import './style.css';
import { FaIndustry, FaDna, FaShoppingCart, FaOilCan, FaNewspaper } from 'react-icons/fa';

const ThemeSection = () => {
    const [activeTab, setActiveTab] = useState('기술');

    const themes = {
        '기술': {
            icon: <FaIndustry />,
            color: '#3b82f6',
            stocks: ['삼성전자', '네이버', '카카오', 'LG전자', 'SK하이닉스', '엔씨소프트'],
            news: [
                { title: '삼성전자, AI 반도체 신제품 출시로 글로벌 시장 선도', date: '2024-08-07' },
                { title: '네이버 클라우드, 글로벌 확장 가속화', date: '2024-08-06' },
                { title: '카카오, 메타버스 플랫폼 투자 확대', date: '2024-08-05' },
                { title: 'LG전자, 스마트홈 기술 혁신 발표', date: '2024-08-04' }
            ]
        },
        '바이오': {
            icon: <FaDna />,
            color: '#10b981',
            stocks: ['셀트리온', '삼성바이오로직스', '한미약품', '유한양행', '대웅제약', '녹십자'],
            news: [
                { title: '셀트리온, 신약 임상 3상 성공으로 주가 급등', date: '2024-08-07' },
                { title: '바이오 섹터 투자 급증세, K-바이오 붐 지속', date: '2024-08-05' },
                { title: '삼성바이오로직스, 글로벌 CMO 시장 확대', date: '2024-08-04' },
                { title: '한미약품, 혁신 신약 개발 성과 발표', date: '2024-08-03' }
            ]
        },
        '소비재': {
            icon: <FaShoppingCart />,
            color: '#f59e0b',
            stocks: ['아모레퍼시픽', 'LG생활건강', '롯데케미칼', 'CJ제일제당', '오리온', '농심'],
            news: [
                { title: '화장품 해외 수출 호조, K-뷰티 글로벌 확산', date: '2024-08-06' },
                { title: '소비심리 회복 신호, 내수 소비재 반등', date: '2024-08-04' },
                { title: 'LG생활건강, 프리미엄 브랜드 확장', date: '2024-08-03' },
                { title: '식품업계, 건강 기능성 제품 트렌드', date: '2024-08-02' }
            ]
        },
        '에너지': {
            icon: <FaOilCan />,
            color: '#ef4444',
            stocks: ['SK이노베이션', 'GS칼텍스', '한국전력', 'SK가스', '한국가스공사', 'S-Oil'],
            news: [
                { title: '신재생에너지 투자 확대, 그린 전환 가속', date: '2024-08-07' },
                { title: '원유가격 상승 전망, 정유업계 수혜', date: '2024-08-05' },
                { title: 'SK이노베이션, 배터리 사업 분할 추진', date: '2024-08-04' },
                { title: '전력요금 인상 논의, 전력주 주목', date: '2024-08-03' }
            ]
        }
    };

    const currentTheme = themes[activeTab];

    return (
        <div className="theme-wrapper">
            <div className="panel-header">
                <FaNewspaper className="panel-icon" />
                <h2 className="panel-title">섹터별 종목 & 뉴스</h2>
            </div>

            {/* 탭 네비게이션 */}
            <div className="tab-navigation">
                {Object.keys(themes).map((themeName) => (
                    <button
                        key={themeName}
                        className={`tab-button ${activeTab === themeName ? 'active' : ''}`}
                        onClick={() => setActiveTab(themeName)}
                        style={{ '--theme-color': themes[themeName].color }}
                    >
                        <span className="tab-icon" style={{ color: themes[themeName].color }}>
                            {themes[themeName].icon}
                        </span>
                        <span className="tab-name">{themeName}</span>
                    </button>
                ))}
            </div>

            {/* 활성 탭 콘텐츠 */}
            <div className="tab-content" style={{ '--theme-color': currentTheme.color }}>
                <div className="content-grid">
                    {/* 주요 종목 섹션 */}
                    <div className="stocks-section">
                        <div className="section-header">
                            <h3 className="section-title">주요 종목</h3>
                            <span className="stocks-count">{currentTheme.stocks.length}개</span>
                        </div>
                        <div className="stocks-grid">
                            {currentTheme.stocks.map((stock, idx) => (
                                <div key={idx} className="stock-card">
                                    <span className="stock-name">{stock}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 관련 뉴스 섹션 */}
                    <div className="news-section">
                        <div className="section-header">
                            <h3 className="section-title">관련 뉴스</h3>
                            <span className="news-count">{currentTheme.news.length}개</span>
                        </div>
                        <div className="news-grid">
                            {currentTheme.news.map((newsItem, idx) => (
                                <div key={idx} className="news-card">
                                    <div className="news-headline">{newsItem.title}</div>
                                    <div className="news-date">{newsItem.date}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThemeSection;
