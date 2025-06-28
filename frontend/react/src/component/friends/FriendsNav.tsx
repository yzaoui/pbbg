import React from "react";
import { match, NavLink, NavLinkProps } from "react-router-dom";

interface Props {
    match: match;
}

const FriendsNav: React.FC<Props> = ({ match }) => <nav className="FriendsNav">
    <ul>
        <li><NavLink to={match.url} {...navProps}>Your Friends</NavLink></li>
        <li><NavLink to={`${match.url}/add`} {...navProps}>Add a Friend</NavLink></li>
        <li><NavLink to={`${match.url}/pending`} {...navProps}>Pending Invites</NavLink></li>
    </ul>
</nav>;

const navProps: Partial<NavLinkProps> = {
    activeClassName: "active",
    exact: true
};

export default FriendsNav;
