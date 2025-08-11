import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import logoImg from "../../assets/slogan.png";
import "./style.css";

export default function BannerWithSearch() {
    const [query, setQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [showRelatedSearches, setShowRelatedSearches] = useState(false);
    const [relatedSearches, setRelatedSearches] = useState([]);
    const navigate = useNavigate();

    // 키워드 검색 (관련검색어용)
    const searchStocksByKeyword = async (keyword) => {
        try {
            console.log('관련검색어 API 호출:', keyword);
            const response = await fetch(`/api/stocks/search/keyword?q=${encodeURIComponent(keyword)}`);
            console.log('API 응답 상태:', response.status);
            if (response.ok) {
                const results = await response.json();
                console.log('관련검색어 결과:', results);
                return results || [];
            }
        } catch (error) {
            console.error('키워드 검색 API 호출 실패:', error);
        }
        return [];
    };

    // 정확한 종목명 검색
    const searchStockByName = async (stockName) => {
        try {
            const response = await fetch(`/api/stocks/search?name=${encodeURIComponent(stockName)}`);
            if (response.ok) {
                const result = await response.json();
                return result;
            }
        } catch (error) {
            console.error('종목명 검색 API 호출 실패:', error);
        }
        return null;
    };

    // 검색어 입력 시 관련검색어 제안
    const handleInputChange = async (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.trim().length > 0) {
            setIsSearching(true);

            // 키워드 검색 API 호출로 관련검색어 데이터 가져오기
            const results = await searchStocksByKeyword(value.trim());

            if (results.length > 0) {
                setRelatedSearches(results.slice(0, 8)); // 최대 8개만 표시
                setShowRelatedSearches(true);
            } else {
                setRelatedSearches([]);
                setShowRelatedSearches(false);
            }

            setIsSearching(false);
        } else {
            setShowRelatedSearches(false);
            setRelatedSearches([]);
            setIsSearching(false);
        }
    };

    // 관련검색어 항목 클릭 시
    const handleRelatedSearchClick = (stock) => {
        setQuery(stock.stockName);
        setShowRelatedSearches(false);
        navigateToStock(stock.stockCode);
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
        setShowRelatedSearches(false);

        try {
            // 정확한 종목명 검색 API 호출
            const result = await searchStockByName(keyword);

            if (result) {
                // 검색된 종목으로 이동
                navigateToStock(result.stockCode);
            } else {
                alert("종목 정보를 찾을 수 없습니다.");
                setIsSearching(false);
            }
        } catch (error) {
            console.error('검색 실패:', error);
            alert("검색 중 오류가 발생했습니다.");
            setIsSearching(false);
        }
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
                        onFocus={() => query.trim().length > 0 && setShowRelatedSearches(true)}
                        onBlur={() => setTimeout(() => setShowRelatedSearches(false), 200)}
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

                {/* 관련검색어 드롭다운 */}
                {showRelatedSearches && relatedSearches.length > 0 && (
                    <div className="suggestions-dropdown">
                        {relatedSearches.map((stock, index) => (
                            <div
                                key={index}
                                className="suggestion-item"
                                onClick={() => handleRelatedSearchClick(stock)}
                            >
                                <span className="suggestion-name">{stock.stockName}</span>
                                <span className="suggestion-code">({stock.stockCode})</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
