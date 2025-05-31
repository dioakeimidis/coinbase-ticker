export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "local";
      PORT: number;
      COINBASE_WS_URL: string;
    }
  }
}
