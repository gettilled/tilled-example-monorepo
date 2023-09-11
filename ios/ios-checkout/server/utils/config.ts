import { Configuration } from "tilled-node";

export function getConfig(basePath: string = process.env.TILLED_BASE_PATH || "https://sandbox-api.tilled.com") {
    return new Configuration({ apiKey: process.env.TILLED_SECRET_KEY, basePath, baseOptions: { timeout: 2000 } })
}