import React, { ChangeEventHandler } from "react";
import FriendsSectionHeader from "./FriendsSectionHeader";
import { FriendInfo } from "../../backend/friends";
import LoadingSpinner from "../LoadingSpinner";
import AddFriendsContentBody from "./AddFriendsContentBody";

interface LoadingProps {
    loading: true;
}

interface LoadedProps {
    loading?: false;
    searchResults: FriendInfo[] | null;
    searching: boolean;
    onSearchUser: (text: string) => void;
}

type Props = LoadingProps | LoadedProps;

interface State {
    value: string;
}

class AddFriendsContent extends React.Component<Props, State> {
    readonly state: Readonly<State> = {
        value: ""
    };

    searchTimeout: (number | null) = null;

    render() {
        return <div className="AddFriendsContent">
            <FriendsSectionHeader>
                <span>ADD A FRIEND</span>
            </FriendsSectionHeader>
            {this.props.loading ?
                <LoadingSpinner />
            :
                <AddFriendsContentBody
                    searchText={this.state.value}
                    searching={this.props.searching}
                    searchResults={this.props.searchResults}
                    handleValueChange={this.handleValueChange}
                />
            }
        </div>;
    }

    handleValueChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const text = event.target.value;

        this.setState({ value: text });

        if (this.searchTimeout !== null) clearTimeout(this.searchTimeout);

        if (text.length > 0) this.searchTimeout = window.setTimeout(() => {
            if (this.props.loading) return;
            this.props.onSearchUser(text)
        }, 600);
    }
}

export default AddFriendsContent;
