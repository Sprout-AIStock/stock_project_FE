import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import { FaIndustry, FaDna, FaShoppingCart, FaOilCan, FaNewspaper } from 'react-icons/fa';

const ThemeSection = () => {
    const [activeTab, setActiveTab] = useState('기술');
    const navigate = useNavigate();

    // 종목명 → 종목코드 매핑 예시 (실제 데이터에 맞게 수정 필요)
    const stockMap = {
        '삼성전자': '005930',
        '네이버': '035420',
        '카카오': '035720',
        'LG전자': '066570',
        'SK하이닉스': '000660',
        '엔씨소프트': '036570',
        '셀트리온': '068270',
        '삼성바이오로직스': '207940',
        '한미약품': '128940',
        '유한양행': '000100',
        '대웅제약': '069620',
        '녹십자': '006280',
        '아모레퍼시픽': '090430',
        'LG생활건강': '051900',
        '롯데케미칼': '011170',
        'CJ제일제당': '097950',
        '오리온': '271560',
        '농심': '004370',
        'SK이노베이션': '096770',
        'GS칼텍스': '', // 비상장
        '한국전력': '015760',
        'SK가스': '018670',
        '한국가스공사': '036460',
        'S-Oil': '010950',
    };

    // 실제 주요 종목은 BE에서 받아올 예정. 아래는 빈 배열로 틀만 유지
    const themes = {
        '기술': {
            icon: <FaIndustry />,
            color: '#3b82f6',
            stocks: [], // BE에서 받아올 데이터로 대체 예정
            news: []
        },
        '바이오': {
            icon: <FaDna />,
            color: '#10b981',
            stocks: [],
            news: []
        },
        '소비재': {
            icon: <FaShoppingCart />,
            color: '#f59e0b',
            stocks: [],
            news: []
        },
        '에너지': {
            icon: <FaOilCan />,
            color: '#ef4444',
            stocks: [],
            news: []
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
                            {/* 주요 종목은 BE에서 받아온 배열로 렌더링 예정. 틀만 구현 */}
                            {currentTheme.stocks.length === 0 ? (
                                <div className="stock-card empty">주요 종목 데이터 없음</div>
                            ) : (
                                currentTheme.stocks.map((stock, idx) => (
                                    <div
                                        key={idx}
                                        className="stock-card"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => {
                                            // stock.code가 있다고 가정하고 상세페이지 이동
                                            if (stock.code) {
                                                navigate(`/stock/${stock.code}`);
                                            } else {
                                                alert('종목 코드 정보를 찾을 수 없습니다.');
                                            }
                                        }}
                                    >
                                        <span className="theme-stock-name">{stock.name || stock}</span>
                                    </div>
                                ))
                            )}
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
