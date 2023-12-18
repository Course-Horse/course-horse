import "@/styles/globals.scss";
import type { AppProps } from "next/app";

import Footer from "@/components/footer/footer";

export default function App({
  Component,
  pageProps: { ...pageProps },
}: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Footer />
    </>
  );
}
