import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export const useAuth = () => {

    const { isAuthenticated, user, userRole } = useSelector(
        (state: RootState) => state.user
    );
    // console.log("User authentication status:", { isAuthenticated, user,userRole });

    return { isAuthenticated, user, userRole };
};

