import { Request } from "express";
import ipLocation from "iplocation";

export async function getCurrentReqLocation(method: number, req?: Request) {
    try {
        const userAgent = req?.headers['user-agent'] || '';

        if (method === 1) {

            const response = await fetch('http://edns.ip-api.com/json');
            const locationData = await response.json();
            return { ...locationData?.dns, device: userAgent };
        } else if (method === 2) {

            // let ip: string | undefined = req.ip || req.connection.remoteAddress;
            // // If it's IPv6 like "::ffff:192.168.1.1", extract IPv4
            // if (ip && ip.includes('::ffff:')) {
            //     ip = ip.split('::ffff:')[1];
            // }

            // split ip with . if has 4 parts each its valid
            // const ipParts = ip?.split('.');
            // if (ipParts?.length === 4) {
            //     console.log(`Client IP: ${ip}`);
            // }

            // if (!ip || ip === '::1' || ip === '127.0.0.1') {
            // if (!ip || ip === '::1') {
            //     console.warn("Client IP not found");
            //     return null;
            // }

            // const currentReqLocation = await ipLocation(ip as string);
            // const currentReqLocation = await ipLocation(ip as string);
            // console.log(`Showing current request location for the ${ip}:`);
            // console.log(currentReqLocation);
            // return currentReqLocation;
        }
    } catch (err: any) {
        console.error(`[Error]>>>: Getting request location: ** ${err.message} **\n`);
        return null;
    }
}

