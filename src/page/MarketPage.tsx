import React from 'react';
import { Subscription } from "rxjs";
import "./MarketPage.scss";
import marketService from "../backend/market.service";
import LoadingSpinner from "../component/LoadingSpinner";
import { UserAndGameMarkets } from "../backend/market";
import GameMarket from "../component/market/GameMarket";
import UserMarket from "../component/market/UserMarket";
import goldSrc from "../img/gold.png";
import { Howl } from "howler";
// @ts-ignore
import transactionMP3 from "../audio/transaction.mp3";
// @ts-ignore
import transactionOGG from "../audio/transaction.ogg";

interface LoadingState {
    status: "loading";
}

interface LoadedState {
    status: "loaded";
    markets: UserAndGameMarkets;
    buying: boolean;
    selling: boolean;
}

interface ErrorState {
    status: "error";
}

type State = LoadingState | LoadedState | ErrorState;

class MarketPage extends React.Component<{}, State> {
    readonly state: Readonly<State> = {
        status: "loading"
    };

    request?: Subscription;

    transactionSound = new Howl({
        src: [transactionMP3, transactionOGG],
        preload: true
    });

    componentDidMount() {
        document.title = "Market - PBBG";

        this.request = marketService.getMarkets()
            .subscribe({
                next: value => this.setState(this.stateInitialLoaded(value.data)),
                error: err => this.setState({ status: "error" })
            });
    }

    componentWillUnmount() {
        this.request && this.request.unsubscribe();
    }

    render() {
        if (this.state.status === "error") return "ERROR";

        return <div className="Market">
            <h1>Market</h1>
            <div className="gold">
                You have: {goldImg}{this.state.status === "loading" ?
                    <LoadingSpinner style={{ width: "18px", height: "18px", borderWidth: "4px" }} />
                :
                    this.state.markets.gold
                }
            </div>
            <div className="for-sale">
                <h2>For sale</h2>
                {this.state.status === "loading" ?
                    <LoadingSpinner />
                :
                    <GameMarket
                        marketItems={this.state.markets.gameMarket.items}
                        userGold={this.state.markets.gold}
                        buying={this.state.buying}
                        onBuy={this.handleBuy}
                    />
                }
            </div>
            <div className="inventory">
                <h2>Your inventory</h2>
                {this.state.status === "loading" ?
                    <LoadingSpinner />
                    :
                    <UserMarket
                        marketItems={this.state.markets.userMarket.items}
                        selling={this.state.selling}
                        onSell={this.handleSell}
                    />
                }
            </div>
        </div>;
    }

    handleBuy = (orders: Map<number, number | undefined>) => {
        if (this.state.status !== "loaded") return;

        this.setState({ ...this.state, buying: true });

        const ordersArray = Array.from(orders, ([id, quantity]) => ({ id, quantity }));

        marketService.buy({ orders: ordersArray })
            .subscribe({
                next: value => {
                    this.transactionSound.play();
                    this.setState({ ...this.state, buying: false, markets: value.data });
                },
                error: err => this.setState({ status: "error" })
            });
    };

    handleSell = (orders: Map<number, number | undefined>) => {
        if (this.state.status !== "loaded") return;

        this.setState({ ...this.state, selling: true });

        const ordersArray = Array.from(orders, ([id, quantity]) => ({ id, quantity }));

        marketService.sell({ orders: ordersArray })
            .subscribe({
                next: value => {
                    this.transactionSound.play();
                    this.setState({ ...this.state, selling: false, markets: value.data });
                },
                error: err => {}
            });
    };

    private stateInitialLoaded = (markets: UserAndGameMarkets): LoadedState => ({
        status: "loaded",
        markets: markets,
        buying: false,
        selling: false
    });
}

const goldImg = <img src={goldSrc} alt="Gold icon" style={{ width: "16px", height: "16px" }} />;

export default MarketPage;
