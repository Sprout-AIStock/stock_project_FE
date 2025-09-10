import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import BannerWithSearch from './components/bannerWithSearch/BannerWithSearch';
import EconomicIndicators from './components/economicIndicators/EconomicIndicators';
import MacroNewsPanel from './components/macroNewsPanel/MacroNewsPanel';
import ThemeSection from './components/themeSection/ThemeSection';
import SchedulePanel from './components/schedulePanel/SchedulePanel';
import TopStockPanel from './components/topStockPanel/TopStockPanel';
import StockDetail from './pages/stockDetail/StockDetail';
import ReportChat from './pages/reportChat/ReportChat';

function MainPage() {
  return (
    <div className="main-page">
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
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {console.log('App rendered')}
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/stock/:code" element={<StockDetail />} />
        <Route path="/chat" element={<ReportChat />} />
      </Routes>
    </BrowserRouter>
  );
}
