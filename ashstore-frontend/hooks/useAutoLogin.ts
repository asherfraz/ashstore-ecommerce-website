import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { refresh } from "@/api/userApis"
import { BackendResponse } from "@/types/types";

function useAutoLogin() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async function autologinapicall() {
            try {
                //call api
                const response = (await refresh()) as BackendResponse;
                // if response good refresh user data
                if (response?.data?.success) {
                    dispatch({
                        type: "user/setUser",
                        payload: response?.data?.user,
                    });
                }
            } catch (error) {
                console.error("Auto-login failed:", error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);
    return loading;
}

export default useAutoLogin;
