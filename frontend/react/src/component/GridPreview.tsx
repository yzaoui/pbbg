import React from "react";
import "./GridPreview.scss";
import { Point } from "../backend/inventory";

interface Props {
    grid: Point[];
    center: Point;
}

const GridPreview: React.FC<Props> = ({ grid, center }) => <div className="GridPreview">
    <table>
        <tbody>
        {createRows(grid, center)}
        </tbody>
    </table>
</div>;

const createRows = (grid: Point[], center: Point) => {
    const trs = [];

    for (let y = 0; y < 3; y++) {
        const tds = [];
        for (let x = 0; x < 3; x++) {
            tds.push(<td
                key={x}
                // If grid contains a cell at this [x, y], then set "data-in-range" attribute
                {...(grid.some(cell => (cell.x + center.x === x) && (cell.y + center.y === y) ) ? { "data-in-range": "" } : {})}
            />)
        }
        trs.push(<tr key={y}>{tds}</tr>)
    }

    return trs;
};

export default GridPreview;
