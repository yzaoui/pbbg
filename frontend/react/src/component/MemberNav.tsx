import classNames from "classnames";
import React from "react";
import { NavLink } from "react-router-dom";
import { Subscription } from "rxjs";
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

class MemberNav extends React.Component<Props, State> {
    readonly state: Readonly<State> = {
        status: "loading"
    };

    request?: Subscription;

    componentDidMount(): void {
        this.request = userStatsService.get()
            .subscribe({
                next: value => this.setState({ status: "loaded", username: value.data.username }),
                error: err => this.setState({ status: "error" })
            });
    }

    componentWillUnmount() {
        this.request && this.request.unsubscribe();
    }

    render() {
        return <nav className={classNames("sidebar", { "open" : this.props.menuOpen })}>
            <div className="username">{this.renderUsername()}</div>
            <div className="navigation">
                {navItems.map(({ to, emoji, label, end }) =>
                    <NavLink key={to} to={to} end={end} className={({ isActive }) => isActive ? "sidebar-item current-site-section" : "sidebar-item"} onClick={this.props.onClickItem}>
                        <span className="sidebar-item-icon" role="img" aria-label="Home">{emoji}</span>
                        <span>{label}</span>
                    </NavLink>
                )}
                <button className="fancy" onClick={handleLogoutClick}>Log out</button>
            </div>
        </nav>;
    }

    renderUsername = () => {
        if (this.state.status === "loading") return <LoadingSpinner />;
        else if (this.state.status === "error") return <i>ERROR</i>;

        return this.state.username;
    };
}

const handleLogoutClick = () => authenticationService.logout();

export default MemberNav;
