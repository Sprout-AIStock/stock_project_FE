import React, { useState, useEffect } from 'react';
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
            stocks: []
        },
        '바이오': {
            icon: <FaDna />,
            color: '#10b981',
            stocks: []
        },
        '소비재': {
            icon: <FaShoppingCart />,
            color: '#f59e0b',
            stocks: []
        },
        '에너지': {
            icon: <FaOilCan />,
            color: '#ef4444',
            stocks: []
        }
    };

    const currentTheme = themes[activeTab];

    // 테마 뉴스 상태
    const [themeNews, setThemeNews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // 테마 탭 변경 시 뉴스 호출 (/api/news/theme/{themeName})
    useEffect(() => {
        const base = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');
        const keywordMap = { '기술': '반도체', '바이오': '바이오', '소비재': '소비재', '에너지': '에너지' };
        const q = keywordMap[activeTab] || activeTab;
        setLoading(true);
        setError('');
        fetch(`${base}/api/news/theme/${encodeURIComponent(q)}?display=5&start=1`)
            .then(res => res.json())
            .then(raw => {
                const payload = raw?.data || raw; // ApiResponse 언랩
                const items = Array.isArray(payload) ? payload : [];
                const formatted = items.map(it => ({
                    title: it.title,
                    date: (it.pubDate || '').split(' ').slice(0, 4).join(' '),
                    url: it.link || it.originallink || '#'
                }));
                setThemeNews(formatted);
            })
            .catch(() => setThemeNews([]))
            .finally(() => setLoading(false));
    }, [activeTab]);

    return (
        <div className="theme-wrapper">
            <div className="panel-header">
                <FaNewspaper className="panel-icon" />
                <h2 className="panel-title">섹터별 뉴스</h2>
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
                    {/* 섹터별 뉴스 섹션 */}
                    <div className="news-section">
                        <div className="section-header">
                            <h3 className="section-title">관련 뉴스</h3>
                            <span className="news-count">{themeNews.length}개</span>
                        </div>
                        <div className="news-grid">
                            {loading ? (
                                <div className="news-card">뉴스 로딩 중...</div>
                            ) : error ? (
                                <div className="news-card">뉴스 로딩 실패</div>
                            ) : themeNews.length === 0 ? (
                                <div className="news-card">관련 뉴스 없음</div>
                            ) : (
                                themeNews.map((newsItem, idx) => (
                                    <div key={idx} className="news-card">
                                        <div className="news-headline">{newsItem.title}</div>
                                        <div className="news-date">{newsItem.date}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThemeSection;
