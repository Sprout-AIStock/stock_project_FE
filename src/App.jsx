
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BannerWithSearch from './components/BannerWithSearch';
import EconomicIndicators from './components/EconomicIndicators';
import MacroNewsPanel from './components/MacroNewsPanel';
import ThemeSection from './components/ThemeSection';
import SchedulePanel from './components/SchedulePanel';
import TopStockPanel from './components/TopStockPanel';
import PopularNewsPanel from './components/PopularNewsPanel';
import StockInsight from './components/StockInsight';
import StockDetail from './pages/StockDetail';
import ReportChat from './pages/ReportChat';
import { enableAPI } from './utils/apiToggle';
import './App.css';

// API 강제 활성화
enableAPI();

function MainPage() {

  return (
    <>
      {/* 3열 그리드: 각 열에 컴포넌트들을 세로로 쌓기 */}
      <div className="three-column-layout">
        {/* 좌측 열: 경제지표 + 거시경제뉴스 */}
        <div className="left-column">
          <div className="panel-box"><EconomicIndicators /></div>
          <div className="panel-box"><MacroNewsPanel /></div>
        </div>
        
        {/* 중앙 열: 배너 + 섹터별뉴스 */}
        <div className="center-column">
          <div className="banner-area"><BannerWithSearch /></div>
          <main className="center-panel"><ThemeSection /></main>
        </div>
        
        {/* 우측 열: 주요일정 + 인기검색종목 */}
        <div className="right-column">
          <div className="panel-box"><SchedulePanel /></div>
          <div className="panel-box"><TopStockPanel /></div>
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
        <Route path="/chat" element={<ReportChat />} />
      </Routes>
    </BrowserRouter>
  );
}
