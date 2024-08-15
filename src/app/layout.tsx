"use client";

import { WebSocketProvider } from "next-ws/client";

export interface IProps {
  children: React.ReactNode;
  data: any;
}

export default function RootLayout(p: React.PropsWithChildren) {
  return (
    <html lang="en" style={{ fontFamily: "sans-serif" }}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css"
        />
      </head>
      <body>
        <WebSocketProvider url="ws://localhost:3000/api/ws">
          {p.children}
        </WebSocketProvider>
      </body>
    </html>
  );
}
