import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

// Compatibility types for React Router v5-style props
export interface RouteComponentProps<Params = {}, State = any> {
    match: {
        params: Params;
        isExact: boolean;
        path: string;
        url: string;
    };
    location: {
        pathname: string;
        search: string;
        hash: string;
        state: State;
        key: string;
    };
    history: {
        push: (path: string | { pathname: string; state?: any }) => void;
        replace: (path: string | { pathname: string; state?: any }) => void;
        go: (n: number) => void;
        goBack: () => void;
        goForward: () => void;
    };
}

/**
 * Higher-Order Component that injects React Router v6 hooks as props
 * to maintain compatibility with class components using RouteComponentProps.
 *
 * Usage:
 * ```tsx
 * class MyPage extends React.Component<RouteComponentProps<{ id: string }>> {
 *   // ... use this.props.match.params.id, this.props.history.push(), etc.
 * }
 * export default withRouter(MyPage);
 * ```
 */
export function withRouter<P extends RouteComponentProps<any, any>>(
    Component: React.ComponentType<P>
) {
    return (props: Omit<P, keyof RouteComponentProps>) => {
        const location = useLocation();
        const navigate = useNavigate();
        const params = useParams();

        const match = {
            params,
            isExact: true, // v6 doesn't have exact matching concept
            path: location.pathname,
            url: location.pathname,
        };

        const history = {
            push: (path: string | { pathname: string; state?: any }) => {
                if (typeof path === 'string') {
                    navigate(path);
                } else {
                    navigate(path.pathname, { state: path.state });
                }
            },
            replace: (path: string | { pathname: string; state?: any }) => {
                if (typeof path === 'string') {
                    navigate(path, { replace: true });
                } else {
                    navigate(path.pathname, { replace: true, state: path.state });
                }
            },
            go: (n: number) => navigate(n),
            goBack: () => navigate(-1),
            goForward: () => navigate(1),
        };

        return (
            <Component
                {...(props as P)}
                match={match}
                location={location}
                history={history}
            />
        );
    };
}
