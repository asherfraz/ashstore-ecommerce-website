import { User } from "../models";

const hasBlankPassword = async (userId: string) => {
    try {
        const user = await User.findById(userId).select('+password');
        if (!user) {
            return null;
        }
        const hasNoPassword = !user.password || user.password === '';
        return hasNoPassword;
    } catch (error) {
        console.error('Error checking user password:', error);
        throw error;
    }
}
export default hasBlankPassword;