"use client";

import { WebSocketProvider } from "next-ws/client";
import { PropsWithChildren, ReactNode, useEffect, useState } from "react";
import { formatWebSocketUrl } from "~/utils/url";

export interface IProps {
  children: ReactNode;
  data: any;
}

export default function RootLayout(p: PropsWithChildren) {
  const [wsURL, setWsURL] = useState<string | null>(null);

  useEffect(() => {
    setWsURL(formatWebSocketUrl("/api/ws"));
  }, []);

  return (
    <html lang="en" style={{ fontFamily: "sans-serif" }}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css"
        />
      </head>
      <body>
        {wsURL && (
          <WebSocketProvider url={wsURL}>{p.children}</WebSocketProvider>
        )}
      </body>
    </html>
  );
}
