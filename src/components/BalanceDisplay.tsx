"use client";

import { useAppKitAccount } from "@reown/appkit/react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useWKII } from "@/hooks/useWKII";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import { parseEther, formatUnits } from "viem";
import { BalanceItem } from "./BalanceItem";

// Constants from the WKII contract
const WKII_DECIMALS = 18;

// Helper function for formatting balances
const formatBalance = (
    value: bigint | undefined,
    decimals: number,
    displayDecimals = 4
): string => {
    if (!value) return "0";

    // Convert to string with full precision
    const formatted = formatUnits(value, decimals);
    // Parse to number and format with decimal limit
    return Number(formatted).toLocaleString("en-US", {
        maximumFractionDigits: displayDecimals,
        minimumFractionDigits: 0,
    });
};

// Define a function to check for wallet rejection in different error formats
const isWalletRejection = (error: any): boolean => {
    if (!error) return false;

    // Check main error message
    if (
        typeof error.message === "string" &&
        (error.message.includes("rejected") ||
            error.message.includes("denied") ||
            error.message.includes("User rejected"))
    ) {
        return true;
    }

    // Check for viem ContractFunctionExecutionError with details
    if (error.name === "ContractFunctionExecutionError" && error.details) {
        return (
            error.details.includes("denied") ||
            error.details.includes("rejected")
        );
    }

    // Check for nested error objects
    if (error.error) {
        return isWalletRejection(error.error);
    }

    return false;
};

// Add these helper functions before the component definition
const clearStatusAfterDelay = (
    setStatusFn: (status: string) => void,
    delay = 10000
) => {
    setTimeout(() => setStatusFn(""), delay);
};

const handleTransactionSuccess = (
    type: "wrap" | "unwrap",
    amount: string,
    setStatusFn: (status: string) => void,
    refetchFn: () => void
) => {
    const action = type === "wrap" ? "wrapped" : "unwrapped";
    const token = type === "wrap" ? "KII" : "WKII";

    setTimeout(() => {
        setStatusFn(`Successfully ${action} ${amount} ${token} tokens!`);
        refetchFn();
        clearStatusAfterDelay(setStatusFn);
    }, 5000);
};

export const BalanceDisplay = () => {
    const { /* address, */ isConnected } = useAppKitAccount();
    const [amount, setAmount] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [txStatus, setTxStatus] = useState<string>("");
    const [insufficientNative, setInsufficientNative] = useState(false);
    const [insufficientWrapped, setInsufficientWrapped] = useState(false);

    // Get balances with automatic polling
    const {
        nativeBalance,
        wkiiBalance,
        isLoadingNative,
        isLoadingWKII,
        isErrorNative,
        isErrorWKII,
        refetch,
    } = useTokenBalances();

    const { wrap, isWrapping, unwrap, isUnwrapping } = useWKII();

    // Memoize formatted balances to avoid recalculating on every render
    const formattedNativeBalance = useMemo(
        () => formatBalance(nativeBalance?.value, WKII_DECIMALS),
        [nativeBalance?.value]
    );

    const formattedWrappedBalance = useMemo(
        () => formatBalance(wkiiBalance?.value, WKII_DECIMALS),
        [wkiiBalance?.value]
    );

    // Memoize validation state to reduce calculations
    const validationState = useMemo(() => {
        if (!amount || !nativeBalance || !wkiiBalance) {
            return { insufficientNative: false, insufficientWrapped: false };
        }

        try {
            const amountBigInt = parseEther(amount);
            return {
                insufficientNative: nativeBalance.value < amountBigInt,
                insufficientWrapped: wkiiBalance.value < amountBigInt,
            };
        } catch (err) {
            console.error("Balance validation error:", err);
            return { insufficientNative: false, insufficientWrapped: false };
        }
    }, [amount, nativeBalance, wkiiBalance]);

    // Update state based on validation results
    useEffect(() => {
        setInsufficientNative(validationState.insufficientNative);
        setInsufficientWrapped(validationState.insufficientWrapped);

        // Clear error message when input changes
        if (error) setError("");
    }, [validationState, error]);

    // Add a new effect to reset txStatus and error when amount changes
    useEffect(() => {
        // Clear both status and error messages when user enters a new amount
        if (amount && (txStatus || error)) {
            setTxStatus("");
            setError("");
        }
    }, [amount, txStatus, error]);

    // Memoize handler functions to prevent unnecessary re-renders
    const handleWrap = useCallback(() => {
        if (!amount) return;

        // Final balance check before proceeding
        if (insufficientNative) {
            setError("Insufficient KII balance for wrapping");
            setTxStatus(""); // Clear any existing status messages
            return;
        }

        // Clear previous messages and set initial status
        setError("");
        setTxStatus("Please approve the transaction in your wallet...");
        const amountToWrap = amount;
        setAmount("");

        // Call the async wrap function
        wrap(amountToWrap)
            .then((txHash) => {
                if (txHash) {
                    setTxStatus(
                        `Transaction submitted! Wrapping ${amountToWrap} KII tokens...`
                    );
                    handleTransactionSuccess(
                        "wrap",
                        amountToWrap,
                        setTxStatus,
                        refetch
                    );
                }
            })
            .catch((err: any) => {
                console.error("Wrap error:", err);

                // Handle user rejection or other errors
                if (isWalletRejection(err)) {
                    setError("Transaction was rejected in wallet.");
                } else {
                    // For other errors, display either the message or a fallback
                    const errorMessage =
                        err?.message || "Unknown error occurred";
                    setError(`Failed to wrap tokens: ${errorMessage}`);
                }
                setTxStatus(""); // Clear any existing status messages
            });
    }, [amount, insufficientNative, wrap, refetch]);

    const handleUnwrap = useCallback(() => {
        if (!amount) return;

        // Final balance check before proceeding
        if (insufficientWrapped) {
            setError("Insufficient WKII balance for unwrapping");
            setTxStatus(""); // Clear any existing status messages
            return;
        }

        // Clear previous messages and set initial status
        setError("");
        setTxStatus("Please approve the transaction in your wallet...");
        const amountToUnwrap = amount;
        setAmount("");

        // Call the async unwrap function
        unwrap(amountToUnwrap)
            .then((txHash) => {
                if (txHash) {
                    setTxStatus(
                        `Transaction submitted! Unwrapping ${amountToUnwrap} WKII tokens...`
                    );
                    handleTransactionSuccess(
                        "unwrap",
                        amountToUnwrap,
                        setTxStatus,
                        refetch
                    );
                }
            })
            .catch((err: any) => {
                console.error("Unwrap error:", err);

                // Handle user rejection or other errors
                if (isWalletRejection(err)) {
                    setError("Transaction was rejected in wallet.");
                } else {
                    // For other errors, display either the message or a fallback
                    const errorMessage =
                        err?.message || "Unknown error occurred";
                    setError(`Failed to unwrap tokens: ${errorMessage}`);
                }
                setTxStatus(""); // Clear any existing status messages
            });
    }, [amount, insufficientWrapped, unwrap, refetch]);

    // Memoize the input change handler
    const handleAmountChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setAmount(e.target.value);
        },
        []
    );

    if (!isConnected) {
        return (
            <section>
                <h2>Token Operations</h2>
                <p>
                    Please connect your wallet to view balances and perform
                    token operations.
                </p>
                {/* @ts-expect-error Web component */}
                <appkit-button />
            </section>
        );
    }

    return (
        <section>
            <h2>Token Operations</h2>

            <div className="address-display">
                <div className="address-row">
                    <p className="connection-status">
                        <span className="status-indicator" /> Connected
                    </p>
                    {/* @ts-expect-error Web component */}
                    <appkit-button balance="hide" size="sm" />
                </div>
            </div>

            <div className="balances-display">
                <BalanceItem
                    tokenSymbol="KII"
                    tokenName="Native KII"
                    balance={formattedNativeBalance}
                    isLoading={isLoadingNative}
                    isError={isErrorNative}
                />
                <BalanceItem
                    tokenSymbol="WKII"
                    tokenName="Wrapped KII"
                    isWrapped
                    balance={formattedWrappedBalance}
                    isLoading={isLoadingWKII}
                    isError={isErrorWKII}
                />
                {isErrorNative && (
                    <p className="error-message">
                        Error loading native balance. Please check your network.
                    </p>
                )}
                {isErrorWKII && (
                    <p className="error-message">
                        Error loading WKII balance. The token contract might not
                        be available.
                    </p>
                )}
            </div>

            <div className="token-actions">
                <input
                    type="number"
                    value={amount}
                    onChange={handleAmountChange}
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
                            isLoadingNative ||
                            insufficientNative
                        }
                        title={
                            insufficientNative ? "Insufficient KII balance" : ""
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
                            isLoadingWKII ||
                            insufficientWrapped
                        }
                        title={
                            insufficientWrapped
                                ? "Insufficient WKII balance"
                                : ""
                        }>
                        {isUnwrapping ? "Unwrapping..." : "Unwrap WKII"}
                    </button>
                </div>

                {insufficientNative && amount && (
                    <p className="error-message">
                        Insufficient KII balance for wrapping {amount} KII
                    </p>
                )}
                {insufficientWrapped && amount && (
                    <p className="error-message">
                        Insufficient WKII balance for unwrapping {amount} WKII
                    </p>
                )}

                {txStatus && <p className="tx-status">{txStatus}</p>}
                {error && <p className="error-message">{error}</p>}
            </div>
        </section>
    );
};
