import React, { RefObject } from "react";
import "./PBBGLevelProgress.scss";

interface Props {
    className?: string;
    level: number;
    value: number
    max: number;
}

class PBBGLevelProgress extends React.Component<Props>{
    innerRef: RefObject<HTMLDivElement>;

    timer?: number;
    currentProgress: {
        level: number,
        percentage: number
    };
    currentStep: number = 0;
    targetProgress: {
        level: number,
        percentage: number
    };

    constructor(props: Props) {
        super(props);

        this.innerRef = React.createRef();
        this.currentProgress = this.toProgress(props);
        this.targetProgress = this.toProgress(props);
    }

    render() {
        const { className } = this.props;

        return <div className={`PBBGLevelProgress${className ? ` ${className}` : ""}`}>
            <div className="outer">
                <div ref={this.innerRef} className="inner" style={{ width: `${this.currentProgress.percentage * 100}%` }} />
            </div>
        </div>;
    }

    componentDidUpdate(prevProps: Readonly<Props>) {
        const { level, value, max } = this.props;

        if (!(prevProps.value === value && prevProps.level === level && prevProps.max === max)) {
            const prevPct = prevProps.max > 0 ? prevProps.value / prevProps.max : 0;
            const currPct = max > 0 ? value / max : 0;

            const diff = (level - prevProps.level) + (currPct - prevPct);
            if (diff === 0) return;

            this.targetProgress = {
                level: level,
                percentage: currPct
            };
            this.currentStep = diff / 30;

            clearInterval(this.timer);
            this.timer = window.setInterval(this.onStep, 10);
        }
    }

    onStep = () => {
        let nextProgress = {
            level: this.currentProgress.level,
            percentage: this.currentProgress.percentage + this.currentStep
        };

        if (nextProgress.percentage >= 1 || nextProgress.percentage < 0) {
            let newPct = nextProgress.percentage % 1;
            let excessLvl = Math.trunc(nextProgress.percentage);

            if (newPct < 0) {
                newPct += 1;
                excessLvl -= 1;
            }

            nextProgress = {
                level: nextProgress.level + excessLvl,
                percentage: newPct
            }
        }

        if ((this.currentStep > 0 && (nextProgress.level > this.targetProgress.level || (nextProgress.level === this.targetProgress.level && nextProgress.percentage > this.targetProgress.percentage))) ||
            (this.currentStep < 0 && (nextProgress.level < this.targetProgress.level || (nextProgress.level === this.targetProgress.level && nextProgress.percentage < this.targetProgress.percentage)))) {
            nextProgress = this.targetProgress;
            clearInterval(this.timer);
        }

        this.currentProgress = nextProgress;

        this.innerRef.current!!.style.width = `${this.currentProgress.percentage * 100}%`;
    };

    toProgress = (arg: { level: number, value: number, max: number }) => ({
        level: arg.level,
        percentage: arg.max > 0 ? arg.value / arg.max : 0
    });
}

export default PBBGLevelProgress;
