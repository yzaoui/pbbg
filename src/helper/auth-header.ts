import authenticationService from '../authentication.service';

/**
 * Authorization header with JWT token
 */
function authHeader(): Record<string, string> {
    const currentUserToken = authenticationService.currentUserValue;
    if (currentUserToken) {
        return { Authorization: `Bearer ${currentUserToken}` };
    } else {
        return {};
    }
}

export default authHeader;
