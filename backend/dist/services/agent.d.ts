type ChatMessage = {
    role: "user" | "assistant";
    content: string;
};
export declare function aiAgent(message: string, history?: ChatMessage[], language?: "en" | "ar"): {
    type: string;
    tool: string;
    message: string;
    results: {
        id: number;
        name: string;
        city: string;
        emergencyAvailable: boolean;
    }[];
} | {
    type: string;
    message: string;
    tool?: never;
    results?: never;
} | {
    type: string;
    tool: string;
    message: string;
    results: {
        id: number;
        name: string;
        specialty: string;
        city: string;
        hospitalId: number;
        languages: string[];
        available: boolean;
    }[];
};
export {};
//# sourceMappingURL=agent.d.ts.map