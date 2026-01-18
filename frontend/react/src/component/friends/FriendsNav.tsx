import React from "react";
import { NavLink } from "react-router-dom";

const FriendsNav: React.FC = () => <nav className="FriendsNav">
    <ul>
        <li><NavLink to="/friends" end className={({ isActive }) => isActive ? "active" : ""}>Your Friends</NavLink></li>
        <li><NavLink to="/friends/add" end className={({ isActive }) => isActive ? "active" : ""}>Add a Friend</NavLink></li>
        <li><NavLink to="/friends/pending" end className={({ isActive }) => isActive ? "active" : ""}>Pending Invites</NavLink></li>
    </ul>
</nav>;

export default FriendsNav;
