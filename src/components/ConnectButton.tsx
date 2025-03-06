"use client";

import { useAppKit } from "@reown/appkit/react";

export const ConnectButton = () => {
    const { open } = useAppKit();

    return (
        <button className="connect-button" onClick={() => open()}>
            Connect Wallet
        </button>
    );
};
