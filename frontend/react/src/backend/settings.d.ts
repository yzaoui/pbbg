/**
 * /settings/change-password
 */
export type ChangePasswordRequest = {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
};
export type ChangePasswordResponse = {};
