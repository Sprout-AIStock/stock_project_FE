import React from 'react';
import './style.css';
import { AiOutlineStock } from 'react-icons/ai';

const ThemeSection = () => {
    return (
        <div className="theme-wrapper">
            <div className="theme-title"><AiOutlineStock className="theme-icon" /> 테마별 종목 보기</div>
            <div className="theme-grid">
                <div className="theme-box">
                    <div className="theme-name">AI</div>
                    <ul>
                        <li>한글과컴퓨터</li>
                        <li>솔트룩스</li>
                    </ul>
                </div>
                <div className="theme-box">
                    <div className="theme-name">반도체</div>
                    <ul>
                        <li>삼성전자</li>
                        <li>DB하이텍</li>
                    </ul>
                </div>
                <div className="theme-box">
                    <div className="theme-name">로봇</div>
                    <ul>
                        <li>레인보우로보틱스</li>
                        <li>휴림로봇</li>
                    </ul>
                </div>
                <div className="theme-box">
                    <div className="theme-name">전기차</div>
                    <ul>
                        <li>LG에너지솔루션</li>
                        <li>포스코퓨처엠</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ThemeSection;
