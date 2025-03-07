import "@testing-library/jest-dom";
import { expect, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import { TextEncoder, TextDecoder } from "util";

// Extend Vitest's expect with Testing Library matchers
import * as matchers from "@testing-library/jest-dom/matchers";
expect.extend(matchers);

// Reset any request handlers after each test
afterEach(() => {
    cleanup();
    // Clean up any mocks
    vi.restoreAllMocks();
});

// Fix for TextEncoder not being available in Node.js environment
class MockTextEncoder {
    encode(input: string) {
        return new Uint8Array([...input].map((char) => char.charCodeAt(0)));
    }

    // Implement missing properties for compatibility
    encoding = "utf-8";

    // Implement missing methods for compatibility
    encodeInto(source: string, destination: Uint8Array) {
        const encoded = this.encode(source);
        destination.set(encoded);
        return { read: source.length, written: encoded.length };
    }
}

class MockTextDecoder {
    decode(input: Uint8Array) {
        return String.fromCharCode(...input);
    }

    // Implement missing properties for compatibility
    encoding = "utf-8";
    fatal = false;
    ignoreBOM = false;
}

// Add globals
global.TextEncoder = MockTextEncoder;
global.TextDecoder = MockTextDecoder;

// Mock web components
if (typeof window !== "undefined") {
    if (!customElements.get("appkit-button")) {
        customElements.define(
            "appkit-button",
            class extends HTMLElement {
                connectedCallback() {
                    this.innerHTML = "<button>Wallet</button>";
                }
            }
        );
    }
}

// Mock fetch API
global.fetch = vi.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({}),
        ok: true,
        status: 200,
        headers: new Headers(),
        statusText: "OK",
    } as Response)
);
