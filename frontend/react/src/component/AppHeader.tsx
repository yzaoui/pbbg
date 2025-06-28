import "./AppHeader.scss";
import MenuIcon from "../img/menu.svg";
import React from "react";

interface Props {
    onClickMenu: () => void;
}

const AppHeader: React.FC<Props> = ({ onClickMenu }) => <header className="AppHeader">
    <button id="nav-menu-toggle" onClick={onClickMenu}>
        <img src={MenuIcon} />
    </button>
</header>;

export default AppHeader;
