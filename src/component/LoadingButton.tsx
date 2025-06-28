import React, { ButtonHTMLAttributes } from "react";
import classNames from "classnames";
import LoadingSpinner from "./LoadingSpinner";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    loading: boolean
}

const LoadingButton: React.FC<Props> = ({ loading, ...rest }) => <button
    className={classNames("fancy", rest.className)}
    {...(loading && {
        disabled: true,
        style: { cursor: "not-allowed" }
    })}
    {...rest}
>
    {rest.children}
    {loading && <LoadingSpinner style={{ width: "14px", height: "14px", borderWidth: "3px", marginLeft: "5px" }} />}
</button>;

export default LoadingButton;
