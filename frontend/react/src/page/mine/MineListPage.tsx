import React from "react";
import { RouteComponentProps } from "react-router-dom";
import MineList from "../../component/mine/MineList";
import { MineTypeList } from "../../backend/mine";
import { Subscription } from "rxjs";
import mineService from "../../backend/mine.service";
// @ts-ignore
import enterMineMP3 from "../../audio/enter_mine.mp3";
// @ts-ignore
import enterMineOGG from "../../audio/enter_mine.ogg";
import { Howl } from "howler";
import { Helmet } from "react-helmet";

type State = {
    status: "loading";
} | {
    status: "error";
} | {
    status: "loaded";
    mineTypeList: MineTypeList;
} | {
    status: "entering mine";
    mineTypeList: MineTypeList;
    enteringMineId: number;
};

class MineListPage extends React.Component<RouteComponentProps, State> {
    readonly state: Readonly<State> = {
        status: "loading"
    };

    request?: Subscription;

    enterMineSound = new Howl({
        src: [enterMineMP3, enterMineOGG],
        preload: true
    });

    componentDidMount() {
        this.request = mineService.getMineTypes()
            .subscribe({
                next: value => this.setState({ status: "loaded", mineTypeList: value.data }),
                error: err => this.setState({ status: "error" })
            });
    }

    componentWillUnmount() {
        this.request && this.request.unsubscribe();
    }

    render() {
        return <>
            <Helmet title="Mine List - PBBG" />
            {(() => {
                switch (this.state.status) {
                    case "loading": return <MineList status={this.state.status} />;
                    case "error": return <MineList status={this.state.status} />;
                    case "loaded": return <MineList status={this.state.status} mineTypeList={this.state.mineTypeList} onEnterMine={this.handleEnterMine} />;
                    case "entering mine": return <MineList status={this.state.status} mineTypeList={this.state.mineTypeList} enteringMineId={this.state.enteringMineId} />;
                }
            })()}
        </>;
    }

    handleEnterMine = (mineTypeId: number) => {
        this.setState({ status: "entering mine", enteringMineId: mineTypeId });

        this.request = mineService.enterMine({ mineTypeId })
            .subscribe({
                next: value => {
                    this.setState({ status: "loaded" });
                    this.enterMineSound.play();
                    this.props.history.push({ pathname: "/mine", state: { mine: value.data } });
                },
                error: err => this.setState({ status: "error" })
            });
    };
}

export default MineListPage;
