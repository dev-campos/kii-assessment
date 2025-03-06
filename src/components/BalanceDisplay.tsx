"use client";

import { useAppKitAccount } from "@reown/appkit/react";
import { useBalance } from "wagmi";
import { useState } from "react";
import { useWKII } from "../hooks/useWKII";

const WKII_ADDRESS = "0xd51e7187e54a4A22D790f8bbDdd9B54b891Bc920";

export const BalanceDisplay = () => {
    const { address, isConnected } = useAppKitAccount();
    const [amount, setAmount] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [txStatus, setTxStatus] = useState<string>("");

    // Get native token balance
    const { data: nativeBalance, isLoading: isLoadingNative } = useBalance({
        address: address as `0x${string}`,
    });

    // Get WKII balance
    const { data: wKiiBalance, isLoading: isLoadingWKII } = useBalance({
        address: address as `0x${string}`,
        token: WKII_ADDRESS,
    });

    const { wrap, isWrapping, unwrap, isUnwrapping } = useWKII();

    const handleWrap = async () => {
        if (!amount) return;

        setError("");
        setTxStatus("Wrapping KII tokens...");

        try {
            await wrap(amount);
            setTxStatus("Successfully wrapped KII tokens!");
            setAmount("");
        } catch (err: any) {
            console.error("Wrap error:", err);
            setError(
                err?.message || "Failed to wrap tokens. Please try again."
            );
            setTxStatus("");
        }
    };

    const handleUnwrap = async () => {
        if (!amount) return;

        setError("");
        setTxStatus("Unwrapping WKII tokens...");

        try {
            await unwrap(amount);
            setTxStatus("Successfully unwrapped WKII tokens!");
            setAmount("");
        } catch (err: any) {
            console.error("Unwrap error:", err);
            setError(
                err?.message || "Failed to unwrap tokens. Please try again."
            );
            setTxStatus("");
        }
    };

    if (!isConnected) {
        return (
            <section>
                <h2>Token Operations</h2>
                <p>
                    Please connect your wallet to view balances and perform
                    token operations.
                </p>
            </section>
        );
    }

    return (
        <section>
            <h2>Token Operations</h2>

            <div className="address-display">
                <p>
                    Connected:{" "}
                    <span className="address-value">
                        {address?.slice(0, 6)}...{address?.slice(-4)}
                    </span>
                </p>
            </div>

            <div className="balances-display">
                <div className="balance-item">
                    <span className="balance-label">Native KII:</span>
                    <span className="balance-value">
                        {isLoadingNative
                            ? "Loading..."
                            : `${nativeBalance?.formatted || "0"} KII`}
                    </span>
                </div>
                <div className="balance-item">
                    <span className="balance-label">Wrapped KII:</span>
                    <span className="balance-value">
                        {isLoadingWKII
                            ? "Loading..."
                            : `${wKiiBalance?.formatted || "0"} WKII`}
                    </span>
                </div>
            </div>

            <div className="token-actions">
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Amount to wrap/unwrap"
                    step="0.000001"
                />

                <div className="button-group">
                    <button
                        className="wrap-button"
                        onClick={handleWrap}
                        disabled={
                            isWrapping ||
                            isUnwrapping ||
                            !amount ||
                            isLoadingNative
                        }>
                        {isWrapping ? "Wrapping..." : "Wrap KII"}
                    </button>
                    <button
                        className="unwrap-button"
                        onClick={handleUnwrap}
                        disabled={
                            isUnwrapping ||
                            isWrapping ||
                            !amount ||
                            isLoadingWKII
                        }>
                        {isUnwrapping ? "Unwrapping..." : "Unwrap WKII"}
                    </button>
                </div>

                {txStatus && <p className="tx-status">{txStatus}</p>}
                {error && <p className="error-message">{error}</p>}
            </div>
        </section>
    );
};
