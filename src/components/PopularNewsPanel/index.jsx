import { FaFire } from "react-icons/fa";
import "./style.css";

const PopularNewsPanel = () => {
    return (
        <div className="popularnews-panel">
            <div className="popularnews-title"><FaFire className="popularnews-icon" /> 인기 기사</div>
            <ul className="popularnews-list">
                <li>
                    <div className="popularnews-headline">외국인, 5일 연속 순매수</div>
                    <div className="popularnews-date">2025.07.29</div>
                </li>
                <hr className="popularnews-divider" />
                <li>
                    <div className="popularnews-headline">코스피 상승, 전기차 강세</div>
                    <div className="popularnews-date">2025.07.28</div>
                </li>
            </ul>
        </div>
    );
};

export default PopularNewsPanel;
