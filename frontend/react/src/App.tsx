import "normalize.css";
import "./common.scss";

import React, { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import authenticationService from "./authentication.service";
import AppHeader from "./component/AppHeader";
import GuestNav from "./component/GuestNav";
import MemberNav from "./component/MemberNav";
import MemberRoute from "./MemberRoute";
import AboutPage from "./page/AboutPage";
import BattlePage from "./page/BattlePage";
import DexPage from "./page/dex/DexPage";
import FarmPage from "./page/FarmPage";
import FriendsPage from "./page/FriendsPage";
import IndexGuestPage from "./page/IndexGuestPage";
import IndexMemberPage from "./page/IndexMemberPage";
import InventoryPage from "./page/InventoryPage";
import ItemPage from "./page/ItemPage";
import LoginPage from "./page/LoginPage";
import MarketPage from "./page/MarketPage";
import MinePage from "./page/mine/MinePage";
import RegisterPage from "./page/RegisterPage";
import SettingsPage from "./page/SettingsPage";
import SquadPage from "./page/SquadPage";
import UserPage from "./page/UserPage";

const App: React.FC = () => {
    const [currentUserToken, setCurrentUserToken] = useState<string | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const subscription = authenticationService.currentUser.subscribe(token => setCurrentUserToken(token));

        return () => subscription.unsubscribe();
    }, []);

    const handleToggleMenu = () => {
        setMenuOpen(prevMenuOpen => !prevMenuOpen);
    };

    const handleClickNavItem = () => {
        setMenuOpen(false);
    };

    const isLoggedIn = currentUserToken !== null;

    return <BrowserRouter>
        <div className="App">
            <AppHeader onClickMenu={handleToggleMenu} />
            <div className="AppBody">
                {isLoggedIn ? <MemberNav menuOpen={menuOpen} onClickItem={handleClickNavItem} /> : <GuestNav />}
                <main className="pbbg-main">
                    <Routes>
                        <Route path="/" element={isLoggedIn ? <IndexMemberPage /> : <IndexGuestPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/squad" element={<MemberRoute><SquadPage /></MemberRoute>} />
                        <Route path="/inventory" element={<MemberRoute><InventoryPage /></MemberRoute>} />
                        <Route path="/item/:id" element={<ItemPage />} />
                        <Route path="/market" element={<MemberRoute><MarketPage /></MemberRoute>} />
                        <Route path="/battle" element={<MemberRoute><BattlePage /></MemberRoute>} />
                        <Route path="/mine/*" element={<MemberRoute><MinePage /></MemberRoute>} />
                        <Route path="/farm" element={<MemberRoute><FarmPage /></MemberRoute>} />
                        <Route path="/dex/*" element={<MemberRoute><DexPage /></MemberRoute>} />
                        <Route path="/friends/*" element={<MemberRoute><FriendsPage /></MemberRoute>} />
                        <Route path="/about" element={<MemberRoute><AboutPage /></MemberRoute>} />
                        <Route path="/settings" element={<MemberRoute><SettingsPage /></MemberRoute>} />
                        <Route path="/user/:id" element={<UserPage />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
            </div>
        </div>
    </BrowserRouter>;
};

export default App;
