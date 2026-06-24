import "./Mine.scss";

import React, { HTMLAttributes, MouseEventHandler, RefObject, useEffect, useMemo, useRef } from "react";

import { isGridPreviewable } from "../../backend/dex";
import { InventoryEntry, Point } from "../../backend/inventory";
import { Mine as MineData } from "../../backend/mine";

interface Props extends HTMLAttributes<HTMLDivElement> {
    mine: MineData;
    pickaxe: InventoryEntry | null;
    submittingAction: Point | null;
    onMineAction: (x: number, y: number) => void;
}

const MINE_TILES_PER_BG = 8;
const MINE_TILE_SIZE = 18;

const Mine: React.FC<Props> = ({ mine, pickaxe, submittingAction, onMineAction, ...rest }) => {
    const tdRefsRef = useRef<RefObject<HTMLTableDataCellElement | null>[][]>(
        mine.cells.map(row => row.map(() => React.createRef()))
    );
    const backgroundImgIndices = useMemo(
        () => mine.cells.map(row => row.map(() => Math.floor(Math.random() * 8))),
        [mine.cells]
    );
    const backgroundStyle = useMemo(() => {
        const background = { src: mine.type.bgURL, tiles: MINE_TILES_PER_BG };
        let style = "";
        for (let i = 0; i < background.tiles; i++) {
            style += `.Mine td.background-${i}:not([data-in-range]):not([data-submitting]), .Mine[data-submitting] td.background-${i}:not([data-submitting])` +
                ` { background-image: url(${background.src}); background-position-x: -${i * MINE_TILE_SIZE}px }`;
        }
        return style;
    }, [mine.type.bgURL]);

    useEffect(() => {
        if (submittingAction === null) {
            tdRefsRef.current.forEach(row => row.forEach(cell => cell.current?.removeAttribute("data-submitting")));
        }
    }, [submittingAction]);

    const clearAttributeFromAllCells = (attribute: "data-in-range" | "data-submitting") =>
        tdRefsRef.current.forEach(row => row.forEach(cell => cell.current?.removeAttribute(attribute)));

    const setAttributeToInRangeCells = (attribute: "data-in-range" | "data-submitting", grid: Point[], target: Point) => grid
        .map(point => ({ x: point.x + target.x, y: point.y + target.y })) // Project pickaxe cells onto mine grid
        .forEach(point => {
            // If this point is within bounds, set its data-in-range attribute
            if (point.x >= 0 && point.x < mine.width && point.y >= 0 && point.y < mine.height) {
                tdRefsRef.current[point.y][point.x]!.current!.setAttribute(attribute, "");
            }
        });

    const handleCellMouseEnter: MouseEventHandler<HTMLTableDataCellElement> = ({ currentTarget: td }) => {
        const x = parseInt(td.getAttribute("data-x")!);
        const y = parseInt(td.getAttribute("data-y")!);

        const basePickaxe = pickaxe!.item.baseItem;
        if (!isGridPreviewable(basePickaxe)) throw Error();

        /* Remove all data-in-range attributes */
        clearAttributeFromAllCells("data-in-range");

        /* Add data-in-range for cells in range */
        setAttributeToInRangeCells("data-in-range", basePickaxe.grid, { x, y });
    };

    const handleMineMouseLeave: MouseEventHandler<HTMLTableElement> = () => {
        clearAttributeFromAllCells("data-in-range");
    };

    const handleCellClick: MouseEventHandler<HTMLTableDataCellElement> = ({ currentTarget: td }) => {
        const x = parseInt(td.getAttribute("data-x")!);
        const y = parseInt(td.getAttribute("data-y")!);

        const basePickaxe = pickaxe!.item.baseItem;
        if (!isGridPreviewable(basePickaxe)) throw Error();

        setAttributeToInRangeCells("data-submitting", basePickaxe.grid, { x, y });

        onMineAction(x, y);
    };

    const pickaxeLoaded = pickaxe !== null;
    const isSubmittingAction = submittingAction !== null;

    return <div className="Mine" {...(pickaxeLoaded && !isSubmittingAction ? { "data-can-mine": "", onMouseLeave: handleMineMouseLeave } :
        isSubmittingAction ? { "data-submitting": "" } : {})} {...rest}>
        <style>{backgroundStyle}</style>
        <table>
            <tbody>
            {mine.cells.map((row, y) =>
                <tr key={y}>
                    {row.map((cell, x) =>
                        <td key={x}
                            className={`background-${backgroundImgIndices[y][x]}`}
                            ref={tdRefsRef.current[y][x]}
                            {...(pickaxeLoaded ? { onMouseEnter: handleCellMouseEnter } : {})}
                            {...(pickaxeLoaded && !isSubmittingAction ? { onClick: handleCellClick } : {})}
                            title={cell && cell.name}
                            data-x={x}
                            data-y={y}
                        >
                            {cell && <img src={cell.imageURL} alt={cell.name + " sprite"} />}
                        </td>
                    )}
                </tr>
            )}
            </tbody>
        </table>
    </div>;
};

export default Mine;
