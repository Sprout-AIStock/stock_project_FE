
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BannerWithSearch from './components/BannerWithSearch';
import EconomicIndicators from './components/EconomicIndicators';
import MacroNewsPanel from './components/MacroNewsPanel';
import ThemeSection from './components/ThemeSection';
import SchedulePanel from './components/SchedulePanel';
import TopStockPanel from './components/TopStockPanel';
import PopularNewsPanel from './components/PopularNewsPanel';
import StockDetail from './pages/StockDetail';
import { enableAPI } from './utils/apiToggle';
import './App.css';

// API 강제 활성화
enableAPI();

function MainPage() {
  return (
    <>
      {/* 배너 검색 영역 */}
      <div className="banner-area">
        <BannerWithSearch />
      </div>
      <div className="layout-container">
        {/* 좌측: 경제 지표 + 거시경제 뉴스 */}
        <aside className="left-panel">
          <div className="panel-box">
            <EconomicIndicators />
          </div>
          <div className="panel-box">
            <MacroNewsPanel />
          </div>
        </aside>
        {/* 중앙: 테마별 보기 */}
        <main className="center-panel">
          <ThemeSection />
        </main>
        {/* 우측: 주요 일정 + 종목 인기 */}
        <div className="right-panel">
          <div className="panel-box">
            <SchedulePanel />
          </div>
          <div className="panel-box">
            <TopStockPanel />
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
