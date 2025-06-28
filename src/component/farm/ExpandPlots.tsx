import React from "react";
import LoadingSpinner from "../LoadingSpinner";

type Props = {
    loading: boolean;
    onExpand: () => void;
}

const ExpandPlots: React.FC<Props> = ({ loading, onExpand }) => <div className="ExpandPlots">
    {loading &&
        overlay
    }
    <button className="fancy" onClick={onExpand} disabled={loading} />
</div>;

const overlay = <div className="overlay">
    <div className="spinner-holder">
        <LoadingSpinner />
    </div>
</div>;

export default ExpandPlots;
