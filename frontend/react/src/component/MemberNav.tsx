import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import userStatsService from "../backend/user-stats.service";
import authenticationService from "./../authentication.service";
import LoadingSpinner from "./LoadingSpinner";

const navItems = [
    { to: "/", emoji: "🏠", label: "Home", end: true },
    { to: "/squad", emoji: "👥", label: "Squad", end: true },
    { to: "/inventory", emoji: "🎒", label: "Inventory", end: true },
    { to: "/market", emoji: "💰", label: "Market", end: true },
    { to: "/battle", emoji: "⚔️", label: "Battle", end: true },
    { to: "/mine", emoji: "⛏️", label: "Mine", end: false },
    { to: "/farm", emoji: "🌱", label: "Farm", end: true },
    { to: "/dex", emoji: "📚", label: "Dex", end: false },
    { to: "/friends", emoji: "🎉", label: "Friends", end: false },
    { to: "/about", emoji: "❓", label: "About", end: true },
    { to: "/settings", emoji: "⚙️", label: "Settings", end: true }
];

interface Props {
    menuOpen: boolean;
    onClickItem: () => void;
}

interface LoadingState {
    status: "loading";
}

interface ErrorState {
    status: "error";
}

interface LoadedState {
    status: "loaded";
    username: string;
}

type State = LoadingState | ErrorState | LoadedState;

const MemberNav: React.FC<Props> = ({ menuOpen, onClickItem }) => {
    const [state, setState] = useState<State>({ status: "loading" });

    useEffect(() => {
        const subscription = userStatsService.get()
            .subscribe({
                next: value => setState({ status: "loaded", username: value.data.username }),
                error: _err => setState({ status: "error" })
            });

        return () => subscription.unsubscribe();
    }, []);

    const renderUsername = () => {
        if (state.status === "loading") return <LoadingSpinner />;
        else if (state.status === "error") return <i>ERROR</i>;

        return state.username;
    };

    return <nav className={classNames("sidebar", { "open" : menuOpen })}>
        <div className="username">{renderUsername()}</div>
        <div className="navigation">
            {navItems.map(({ to, emoji, label, end }) =>
                <NavLink key={to} to={to} end={end} className={({ isActive }) => isActive ? "sidebar-item current-site-section" : "sidebar-item"} onClick={onClickItem}>
                    <span className="sidebar-item-icon" role="img" aria-label="Home">{emoji}</span>
                    <span>{label}</span>
                </NavLink>
            )}
            <button className="fancy" onClick={handleLogoutClick}>Log out</button>
        </div>
    </nav>;
};

const handleLogoutClick = () => authenticationService.logout();

export default MemberNav;
