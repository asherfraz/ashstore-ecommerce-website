import { User } from "../models";

const hasBlankPassword = async (userId: string) => {
    try {
        const user = await User.findById(userId).select('+password');
        if (!user) {
            return null;
        }

        // password -  !user.password || user.password.trim() === '' || user.password.length === 0;
        const hasNoPassword = !user.password || user.password.trim() === '' || user.password.length === 0;

        return hasNoPassword;
    } catch (error) {
        console.error(`Error checking password for user ${userId}:`, error);
        throw new Error(`Failed to check user password: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
export default hasBlankPassword;