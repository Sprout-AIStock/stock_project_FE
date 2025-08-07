import { FaFire } from "react-icons/fa";
import "./style.css";

const PopularNewsPanel = () => {
    return (
        <div className="popularnews-panel">
            <div className="panel-header">
                <FaFire className="panel-icon" />
                <h2 className="panel-title">인기 기사</h2>
            </div>
            <div className="popularnews-list">
                <div className="popularnews-item">
                    <div className="popularnews-headline">외국인, 5일 연속 순매수</div>
                    <div className="popularnews-date">2025.07.29</div>
                </div>
                <div className="popularnews-item">
                    <div className="popularnews-headline">코스피 상승, 전기차 강세</div>
                    <div className="popularnews-date">2025.07.28</div>
                </div>
            </div>
        </div>
    );
};

export default PopularNewsPanel;
