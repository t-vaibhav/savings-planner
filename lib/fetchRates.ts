import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY;

if (!API_KEY) {
    console.warn("Missing NEXT_PUBLIC_EXCHANGE_RATE_API_KEY");
}

const api = axios.create({
    baseURL: `https://v6.exchangerate-api.com/v6/${API_KEY}`,
});

/**
 * USD -> INR
 */
export const dollarToInr = async (): Promise<number | null> => {
    try {
        const res = await api.get("/latest/USD");
        return res.data?.conversion_rates?.INR ?? null;
    } catch (error) {
        console.error("Error fetching USD → INR rate:", error);
        return null;
    }
};

/**
 * INR -> USD
 */
export const inrToDollar = async (): Promise<number | null> => {
    try {
        const res = await api.get("/latest/INR");
        return res.data?.conversion_rates?.USD ?? null;
    } catch (error) {
        console.error("Error fetching INR → USD rate:", error);
        return null;
    }
};
