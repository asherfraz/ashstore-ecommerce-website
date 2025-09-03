import axios from "axios"

const axiosApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
})


// auto token refresh

// /protected-resource -> 401
// /refresh -> authenthicated state
// /protected-resource


axiosApi.interceptors.response.use(
    (config) => config,
    async (error) => {
        const originalReq = error.config;

        // extract the value of message from json response if it exists
        const errorMessage = error.response && error.response.data && error.response.data.message;

        if (
            errorMessage === 'Unauthorized' &&
            (error.response.status === 401 || error.response.status === 500) &&
            originalReq &&
            !originalReq._isRetry
        ) {
            originalReq._isRetry = true;

            try {
                await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/refresh`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                });

                return axiosApi.request(originalReq);
            } catch (error) {
                return error;
            }
        }
        throw error;
    }
);


export default axiosApi;