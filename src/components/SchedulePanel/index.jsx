import { useState, useEffect } from "react";
import { TbCalendarEvent, TbClock, TbFlag } from "react-icons/tb";
import "./style.css";

export default function SchedulePanel() {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock 주요 일정 데이터
        const mockSchedules = [
            {
                title: "FOMC 회의 결과 발표",
                date: "2024-08-01",
                time: "03:00",
                type: "monetary",
                importance: "high", // 미국 금리 정책 - 글로벌 경제에 매우 중요
                description: "연방준비제도 금리 결정"
            },
            {
                title: "관세 협약 시행",
                date: "2024-08-01",
                time: "09:00",
                type: "trade",
                importance: "high", // 국제 무역 정책 - 매우 중요
                description: "미중 무역 관련 새로운 협약"
            },
            {
                title: "한국 GDP 발표",
                date: "2024-08-05",
                time: "10:00",
                type: "economic",
                importance: "medium", // 국내 경제지표 - 보통 중요
                description: "2분기 경제성장률 발표"
            },
            {
                title: "미국 고용지표",
                date: "2024-08-07",
                time: "22:30",
                type: "employment",
                importance: "high", // 미국 고용 상황 - 매우 중요
                description: "7월 비농업 고용 지표"
            },
            {
                title: "ECB 정책회의",
                date: "2024-08-15",
                time: "21:00",
                type: "monetary",
                importance: "medium", // 유럽 금리 정책 - 보통 중요
                description: "유럽중앙은행 금리 결정"
            }
        ];

        setSchedules(mockSchedules);
        setLoading(false);
    }, []);

    const getTypeIcon = (type, importance) => {
        const iconClass = `type-icon ${type} importance-${importance}`;
        switch (type) {
            case 'monetary': return <TbFlag className={iconClass} />;
            case 'trade': return <TbFlag className={iconClass} />;
            case 'economic': return <TbFlag className={iconClass} />;
            case 'employment': return <TbFlag className={iconClass} />;
            default: return <TbCalendarEvent className={iconClass} />;
        }
    };

    const getImportanceClass = (importance) => {
        return `importance-${importance}`;
    };

    if (loading) {
        return (
            <div className="schedule-panel">
                <div className="panel-header">
                    <TbCalendarEvent className="panel-icon" />
                    <h2 className="panel-title">주요 일정</h2>
                </div>
                <div className="loading-message">주요 일정 로딩 중...</div>
            </div>
        );
    }

    return (
        <div className="schedule-panel">
            <div className="panel-header">
                <TbCalendarEvent className="panel-icon" />
                <h2 className="panel-title">주요 일정</h2>
            </div>
            <div className="schedules-list">
                {schedules.map((schedule, index) => (
                    <div key={index} className={`schedule-item ${getImportanceClass(schedule.importance)}`}>
                        <div className="schedule-left">
                            {getTypeIcon(schedule.type, schedule.importance)}
                            <div className="schedule-content">
                                <div className="schedule-title">{schedule.title}</div>
                                <div className="schedule-description">{schedule.description}</div>
                            </div>
                        </div>
                        <div className="schedule-right">
                            <div className="schedule-date">{schedule.date}</div>
                            <div className="schedule-time">
                                <TbClock className="clock-icon" />
                                {schedule.time}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
