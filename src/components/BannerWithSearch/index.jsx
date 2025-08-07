import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import logoImg from "../../assets/slogan.png";
import "./style.css";

export default function BannerWithSearch() {
    const [query, setQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const navigate = useNavigate();

    // Mock 주식 데이터 (실제 환경에서는 API에서 가져옴)
    const stockDatabase = [
        { name: "삼성전자", code: "005930" },
        { name: "삼성바이오로직스", code: "207940" },
        { name: "삼성전자우", code: "005935" },
        { name: "삼성SDI", code: "006400" },
        { name: "삼성물산", code: "028260" },
        { name: "삼성생명", code: "032830" },
        { name: "삼성전기", code: "009150" },
        { name: "삼성에스디에스", code: "018260" },
        { name: "삼성화재", code: "000810" },
        { name: "삼성증권", code: "016360" },
        { name: "SK하이닉스", code: "000660" },
        { name: "SK텔레콤", code: "017670" },
        { name: "SK이노베이션", code: "096770" },
        { name: "LG에너지솔루션", code: "373220" },
        { name: "LG화학", code: "051910" },
        { name: "LG전자", code: "066570" },
        { name: "네이버", code: "035420" },
        { name: "카카오", code: "035720" },
        { name: "카카오뱅크", code: "323410" },
        { name: "현대차", code: "005380" },
        { name: "현대모비스", code: "012330" },
        { name: "셀트리온", code: "068270" },
        { name: "셀트리온헬스케어", code: "091990" },
        { name: "POSCO홀딩스", code: "005490" },
        { name: "KB금융", code: "105560" },
        { name: "신한지주", code: "055550" }
    ];

    // 검색어 입력 시 자동완성 제안
    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.trim().length > 0) {
            // 띄어쓰기 제거한 검색어로 비교
            const searchTerm = value.trim().replace(/\s+/g, '');
            const searchTermLower = searchTerm.toLowerCase();

            const filtered = stockDatabase.filter(stock => {
                const stockNameNoSpace = stock.name.replace(/\s+/g, '');
                const stockNameLower = stockNameNoSpace.toLowerCase();

                return stockNameNoSpace.includes(searchTerm) ||
                    stockNameLower.includes(searchTermLower) ||
                    stock.name.includes(value.trim()) ||
                    stock.code.includes(value.trim());
            }).slice(0, 8); // 최대 8개만 표시

            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
            setSuggestions([]);
        }
    };

    // 인기 검색어 가져오기 (백엔드 API 활용)
    const fetchPopularKeywords = async () => {
        try {
            const response = await fetch('/api/keywords/top');
            if (response.ok) {
                const keywords = await response.json();
                // 인기 검색어를 stockDatabase에 추가하거나 활용
                const popularStocks = keywords.map(item => ({
                    name: item.keyword,
                    code: stockDatabase.find(stock => stock.name === item.keyword)?.code || "미확인"
                })).filter(item => item.code !== "미확인");

                // 기존 데이터와 합치기
                const combinedData = [...stockDatabase];
                popularStocks.forEach(popular => {
                    if (!combinedData.find(stock => stock.name === popular.name)) {
                        combinedData.unshift(popular); // 인기 검색어를 앞에 추가
                    }
                });

                return combinedData;
            }
        } catch (error) {
            console.log('인기 검색어 로딩 실패, Mock 데이터 사용');
        }
        return stockDatabase; // 실패 시 기본 Mock 데이터 반환
    };

    // 제안 항목 클릭 시
    const handleSuggestionClick = (stock) => {
        setQuery(stock.name);
        setShowSuggestions(false);
        navigateToStock(stock.code);
    };

    // 실제 검색 실행
    const navigateToStock = async (stockCode) => {
        setIsSearching(true);
        await new Promise(resolve => setTimeout(resolve, 300)); // 시뮬레이션
        setIsSearching(false);
        navigate(`/stock/${encodeURIComponent(stockCode)}`);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const keyword = query.trim();
        if (!keyword) return;

        setIsSearching(true);
        setShowSuggestions(false);

        // 1. 먼저 stockDatabase에서 종목 코드 찾기 (띄어쓰기 무시)
        let stockCode = null;
        const keywordNoSpace = keyword.replace(/\s+/g, '');
        const keywordLower = keywordNoSpace.toLowerCase();

        const foundStock = stockDatabase.find(stock => {
            const stockNameNoSpace = stock.name.replace(/\s+/g, '');
            const stockNameLower = stockNameNoSpace.toLowerCase();

            return stock.name === keyword ||
                stock.name.toLowerCase() === keyword.toLowerCase() ||
                stockNameNoSpace === keywordNoSpace ||
                stockNameLower === keywordLower ||
                stock.code === keyword;
        });

        if (foundStock) {
            stockCode = foundStock.code;
        } else {
            // 2. 실제 백엔드에서 종목 정보 확인 (종목 코드로 검색)
            try {
                const res = await fetch(`/api/stock/search/${encodeURIComponent(keyword)}`);
                if (res.ok) {
                    const data = await res.json();
                    stockCode = data.code || keyword;
                } else {
                    // 3. 백엔드에서도 못 찾으면 기본값
                    alert("종목 정보를 찾을 수 없습니다. 삼성전자로 이동합니다.");
                    stockCode = "005930"; // 기본값: 삼성전자
                }
            } catch (err) {
                // API 호출 실패 시 Mock 데이터 사용 (띄어쓰기 무시)
                const mockStockMapping = {
                    "삼성전자": "005930",
                    "sk하이닉스": "000660",
                    "lg에너지솔루션": "373220",
                    "네이버": "035420",
                    "카카오": "035720",
                    "현대차": "005380",
                    "셀트리온": "068270",
                };

                // 띄어쓰기 제거한 키워드로도 검색
                const keywordNoSpaceForMapping = keywordNoSpace.toLowerCase();
                const keywordOriginalLower = keyword.toLowerCase();

                stockCode = mockStockMapping[keywordOriginalLower] ||
                    mockStockMapping[keyword] ||
                    mockStockMapping[keywordNoSpaceForMapping] ||
                    "005930"; // 기본값: 삼성전자

                console.log('API 호출 실패, Mock 데이터 사용');
            }
        }

        console.log(`검색어: ${keyword} → 종목코드: ${stockCode}`);

        // 약간의 로딩 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 300));
        setIsSearching(false);
        navigate(`/stock/${encodeURIComponent(stockCode)}`);
    };

    return (
        <div className="banner-container">
            {/* 로고 */}
            <img src={logoImg} alt="Logo" className="banner-logo" />

            {/* 검색창 */}
            <div className="search-wrapper">
                <form className="search-box" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="종목명을 입력하세요"
                        value={query}
                        onChange={handleInputChange}
                        onFocus={() => query.trim().length > 0 && setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        className="search-input"
                    />
                    <button className="search-button" type="submit" disabled={isSearching}>
                        {isSearching ? (
                            <div className="loading-spinner"></div>
                        ) : (
                            <FiSearch className="search-icon" />
                        )}
                    </button>
                </form>

                {/* 자동완성 드롭다운 */}
                {showSuggestions && suggestions.length > 0 && (
                    <div className="suggestions-dropdown">
                        {suggestions.map((stock, index) => (
                            <div
                                key={index}
                                className="suggestion-item"
                                onClick={() => handleSuggestionClick(stock)}
                            >
                                <span className="suggestion-name">{stock.name}</span>
                                <span className="suggestion-code">({stock.code})</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
