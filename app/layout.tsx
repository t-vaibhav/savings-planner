import type { Metadata } from "next";
import { DM_Sans, Mukta, Playwrite_NO } from "next/font/google";
import "./globals.css";
const dmSans = DM_Sans({
    variable: "--font-dm-sans",
    subsets: ["latin"],
});

const mukta = Mukta({
    weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
    title: "Savings Planner | Vaibhav Tiwari",
    description: "Created by Vaibhav Tiwari",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${dmSans.className} antialiased overflow-x-hidden`}
            >
                {children}
            </body>
        </html>
    );
}
