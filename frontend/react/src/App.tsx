import React, { useEffect, useState } from "react";
import "normalize.css";
import "./common.scss";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppHeader from "./component/AppHeader";
import GuestNav from "./component/GuestNav";
import MemberNav from "./component/MemberNav";
import MemberRoute from "./MemberRoute";
import IndexGuestPage from "./page/IndexGuestPage";
import IndexMemberPage from "./page/IndexMemberPage";
import RegisterPage from "./page/RegisterPage";
import LoginPage from "./page/LoginPage";
import SquadPage from "./page/SquadPage";
import MinePage from "./page/mine/MinePage";
import FarmPage from "./page/FarmPage";
import InventoryPage from "./page/InventoryPage";
import ItemPage from "./page/ItemPage";
import DexPage from "./page/dex/DexPage";
import SettingsPage from "./page/SettingsPage";
import authenticationService from "./authentication.service";
import BattlePage from "./page/BattlePage";
import MarketPage from "./page/MarketPage";
import UserPage from "./page/UserPage";
import FriendsPage from "./page/FriendsPage";
import AboutPage from "./page/AboutPage";

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
