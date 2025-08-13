import "./style.css";
import { FaNewspaper } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function MacroNewsPanel() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError("");
                // BE: 거시경제 키워드 프리셋
                const res = await fetch(`/api/news/macro?display=5&start=1`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const raw = await res.json();
                const payload = raw?.data || raw; // ApiResponse 언랩
                const list = Array.isArray(payload) ? payload : [];
                const mapped = list.map(n => ({
                    title: n.title,
                    date: (n.pubDate || '').split(' ').slice(0, 4).join(' '),
                    url: n.link || n.originallink || '#'
                }));
                setItems(mapped);
            } catch (e) {
                setError("뉴스 로딩 실패");
                setItems([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div className="macro-panel">
            <div className="panel-header">
                <FaNewspaper className="panel-icon" />
                <h2 className="panel-title">거시경제 주요 뉴스</h2>
            </div>
            <ul className="macro-news-list">
                {loading ? (
                    <li className="macro-news-item">로딩 중...</li>
                ) : error ? (
                    <li className="macro-news-item">{error}</li>
                ) : items.length === 0 ? (
                    <li className="macro-news-item">뉴스 없음</li>
                ) : (
                    items.map((item, index) => (
                        <li key={index} className="macro-news-item">
                            <div className="news-headline">{item.title}</div>
                            <div className="news-date">{item.date}</div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}
