import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import DexItemsPage from "./DexItemsPage";
import "./DexPage.scss";
import DexPlantsPage from "./DexPlantsPage";
import DexUnitsPage from "./DexUnitsPage";

const DexPage: React.FC = () => <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/items/*" element={<DexItemsPage />} />
    <Route path="/units/*" element={<DexUnitsPage />} />
    <Route path="/plants/*" element={<DexPlantsPage />} />
</Routes>;

class Index extends React.Component {
    componentDidMount() {
        document.title = "Dex - PBBG";
    }

    render() {
        return <div className="DexPage">
            <Link to="/dex/items">Items</Link>
            <Link to="/dex/units">Units</Link>
            <Link to="/dex/plants">Plants</Link>
        </div>;
    }
}

export default DexPage;
