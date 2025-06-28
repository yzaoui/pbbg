import React from "react";
import "./PBBGProgressBar.scss";

interface Props {
    className?: string;
    value: number
    max: number;
}

const PBBGProgressBar: React.FC<Props> = ({ className, value, max }) => <div className={`PBBGProgressBar${className ? ` ${className}` : ""}`}>
    <div className="outer">
        <div className="inner" style={{ width: `${(value / max) * 100}%` }} />
    </div>
</div>;

export default PBBGProgressBar;
