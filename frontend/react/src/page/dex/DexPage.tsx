import React from "react";
import { Link, Route, RouteComponentProps } from "react-router-dom";
import "./DexPage.scss";
import DexUnitsPage from "./DexUnitsPage";
import DexItemsPage from "./DexItemsPage";
import DexPlantsPage from "./DexPlantsPage";

const DexPage: React.FC<RouteComponentProps> = ({ match }) => <>
    <Route path={match.url + "/"} exact component={Index} />
    <Route path={match.url + "/items"} component={DexItemsPage} />
    <Route path={match.url + "/units"} component={DexUnitsPage} />
    <Route path={match.url + "/plants"} component={DexPlantsPage} />
</>;

class Index extends React.Component<RouteComponentProps> {
    componentDidMount() {
        document.title = "Dex - PBBG";
    }

    render() {
        const { match } = this.props;

        return <div className="DexPage">
            <Link to={match.url + "/items"}>Items</Link>
            <Link to={match.url + "/units"}>Units</Link>
            <Link to={match.url + "/plants"}>Plants</Link>
        </div>;
    }
}

export default DexPage;
