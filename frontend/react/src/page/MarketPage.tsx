import { Howl } from "howler";
import React, { useEffect, useRef, useState } from "react";
import { Subscription } from "rxjs";
import { UserAndGameMarkets } from "../backend/market";
import marketService from "../backend/market.service";
import LoadingSpinner from "../component/LoadingSpinner";
import GameMarket from "../component/market/GameMarket";
import UserMarket from "../component/market/UserMarket";
import goldSrc from "../img/gold.png";
import "./MarketPage.scss";
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

const MarketPage: React.FC = () => {
    const [state, setState] = useState<State>({ status: "loading" });
    const buyRequestRef = useRef<Subscription>(null);
    const sellRequestRef = useRef<Subscription>(null);
    const transactionSound = useRef(new Howl({
        src: [transactionMP3, transactionOGG],
        preload: true
    }));

    useEffect(() => {
        const subscription = marketService.getMarkets()
            .subscribe({
                next: value => setState({
                    status: "loaded",
                    markets: value.data,
                    buying: false,
                    selling: false
                }),
                error: _err => setState({ status: "error" })
            });

        return () => {
            subscription.unsubscribe();
            buyRequestRef.current?.unsubscribe();
            sellRequestRef.current?.unsubscribe();
        };
    }, []);

    const handleBuy = (orders: Map<number, number | undefined>) => {
        if (state.status !== "loaded") return;

        buyRequestRef.current?.unsubscribe();

        setState(prevState => {
            if (prevState.status !== "loaded") return prevState;
            return { ...prevState, buying: true };
        });

        const ordersArray = Array.from(orders, ([id, quantity]) => ({ id, quantity }));

        buyRequestRef.current = marketService.buy({ orders: ordersArray })
            .subscribe({
                next: value => {
                    transactionSound.current.play();
                    setState(prevState => {
                        if (prevState.status !== "loaded") return prevState;
                        return { ...prevState, buying: false, markets: value.data };
                    });
                },
                error: _err => setState({ status: "error" })
            });
    };

    const handleSell = (orders: Map<number, number | undefined>) => {
        if (state.status !== "loaded") return;

        sellRequestRef.current?.unsubscribe();

        setState(prevState => {
            if (prevState.status !== "loaded") return prevState;
            return { ...prevState, selling: true };
        });

        const ordersArray = Array.from(orders, ([id, quantity]) => ({ id, quantity }));

        sellRequestRef.current = marketService.sell({ orders: ordersArray })
            .subscribe({
                next: value => {
                    transactionSound.current.play();
                    setState(prevState => {
                        if (prevState.status !== "loaded") return prevState;
                        return { ...prevState, selling: false, markets: value.data };
                    });
                },
                error: _err => {}
            });
    };

    if (state.status === "error") return <>ERROR</>;

    return <>
        <title>Market - PBBG</title>
        <div className="Market">
            <h1>Market</h1>
            <div className="gold">
                You have: {goldImg}{state.status === "loading" ?
                    <LoadingSpinner style={{ width: "18px", height: "18px", borderWidth: "4px" }} />
                :
                    state.markets.gold
                }
            </div>
            <div className="for-sale">
                <h2>For sale</h2>
                {state.status === "loading" ?
                    <LoadingSpinner />
                :
                    <GameMarket
                        marketItems={state.markets.gameMarket.items}
                        userGold={state.markets.gold}
                        buying={state.buying}
                        onBuy={handleBuy}
                    />
                }
            </div>
            <div className="inventory">
                <h2>Your inventory</h2>
                {state.status === "loading" ?
                    <LoadingSpinner />
                    :
                    <UserMarket
                        marketItems={state.markets.userMarket.items}
                        selling={state.selling}
                        onSell={handleSell}
                    />
                }
            </div>
        </div>
    </>;
};

const goldImg = <img src={goldSrc} alt="Gold icon" style={{ width: "16px", height: "16px" }} />;

export default MarketPage;
