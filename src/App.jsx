
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BannerWithSearch from './components/BannerWithSearch';
import MacroNewsPanel from './components/MacroNewsPanel';
import ThemeSection from './components/ThemeSection';
import TopStockPanel from './components/TopStockPanel';
import PopularNewsPanel from './components/PopularNewsPanel';
import StockDetail from './pages/StockDetail';
import './App.css';

function MainPage() {
  return (
    <>
      {/* 배너 검색 영역 */}
      <div className="banner-area">
        <BannerWithSearch />
      </div>
      <div className="layout-container">
        {/* 좌측: 거시경제 뉴스 */}
        <aside className="panel-box">
          <MacroNewsPanel />
        </aside>
        {/* 중앙: 테마별 보기 */}
        <main>
          <ThemeSection />
        </main>
        {/* 우측: 종목 인기/기사 */}
        <div className="right-panel">
          <div className="panel-box">
            <TopStockPanel />
          </div>
          <div className="panel-box">
            <PopularNewsPanel />
          </div>
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/stock/:code" element={<StockDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
