import "./style.css";
import { FaNewspaper } from "react-icons/fa";

export default function MacroNewsPanel() {
    const newsList = [
        { title: "FOMC 회의, 기준금리 동결", date: "2025.07.29" },
        { title: "미국 고용지표 예상 상회", date: "2025.07.28" },
        { title: "중국 2분기 GDP 5.2% 성장", date: "2025.07.27" },
        { title: "유럽 ECB, 금리 인하 시사", date: "2025.07.25" }
    ];

    return (
        <div className="macro-panel">
            <h2 className="macro-title">
                <FaNewspaper className="macro-icon" />
                거시경제 주요 뉴스
            </h2>
            <ul className="macro-news-list">
                {newsList.map((item, index) => (
                    <li key={index} className="macro-news-item">
                        <div className="news-headline">{item.title}</div>
                        <div className="news-date">{item.date}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
