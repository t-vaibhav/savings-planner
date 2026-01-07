import { JSX } from "react";

const Loader = (): JSX.Element => {
    return (
        <div className="flex h-screen items-center justify-center overflow-hidden">
            <div className="flex flex-col items-center gap-3">
                <div className="h-14 w-14 animate-spin rounded-full border-4 border-blue-300 border-t-blue-700" />
                <p className="font-medium text-blue-700">
                    Loading your savings…
                </p>
            </div>
        </div>
    );
};

export default Loader;
