import React from "react";
import { Link } from "react-router-dom";
import banner from "../img/banner.png";

const IndexGuestPage: React.FC = () => {
    return <>
        <title>Home - PBBG</title>
        <img src={banner} alt="Banner" style={{alignSelf: "center"}} />
        <Link to="/register" className="btn" style={{alignSelf: "center"}}>Register</Link>
        <br />
        <Link to="/login" className="btn" style={{alignSelf: "center"}}>Log in</Link>
    </>;
};

export default IndexGuestPage;
