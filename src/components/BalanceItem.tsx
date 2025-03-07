import React from "react";

interface BalanceItemProps {
    tokenSymbol: string;
    tokenName: string;
    isWrapped?: boolean;
    balance: string;
    isLoading: boolean;
    isError?: boolean;
}

export const BalanceItem: React.FC<BalanceItemProps> = ({
    tokenSymbol,
    tokenName,
    isWrapped = false,
    balance,
    isLoading,
    isError = false,
}) => {
    // Extract balance display logic into a helper function
    const getBalanceText = () => {
        if (isLoading) return "Loading...";
        if (isError) return "Error loading balance";
        return `${balance} ${tokenSymbol}`;
    };

    return (
        <div className="balance-item">
            <div className="token-info">
                <div className={`token-icon ${isWrapped ? "wkii" : ""}`}>
                    {tokenSymbol}
                </div>
                <span className="balance-label">{tokenName}:</span>
            </div>
            <span className="balance-value">{getBalanceText()}</span>
        </div>
    );
};
