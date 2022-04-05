import Head from "next/head";
import theme from "theme";
import { NextPage } from "next";
import { AppProps } from "next/app";
import type { ReactElement, ReactNode } from "react";
import {
  ThemeProvider as MuiThemeProvider,
  StylesProvider
} from "@material-ui/core/styles";
import { ThemeProvider } from "styled-components";
import { useEffect } from "react";
import { SWRConfig } from "swr";
import axios from "axios";
import { Provider } from "react-redux";
import "../styles/globals.css";
import store from "../redux-store/store";

const ART_FLEX_URL = "/api";
axios.defaults.baseURL = ART_FLEX_URL;

type NextPageWithLayout = NextPage & {
  // eslint throws some says page is not used, even though it is on line 36
  // I am moving on ...
  // eslint-disable-next-line no-unused-vars
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles?.parentElement?.removeChild(jssStyles);
    }
  }, []);
  const getLayout = Component.getLayout || (page => page);
  console.log(getLayout);
  return (
    <div>
      <Head>
        <title>Art Flex</title>
        <meta name="description" content="Art Flex website. Uses nextjs!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
          <Provider store={store}>
            <SWRConfig
              value={{
                fetcher: url => axios.get(url).then(res => res.data)
              }}
            >
              <StylesProvider injectFirst>
                <MuiThemeProvider theme={theme}>
                  <ThemeProvider theme={theme}>
                    {getLayout(<Component {...pageProps} />)}
                  </ThemeProvider>
                </MuiThemeProvider>
              </StylesProvider>
            </SWRConfig>
          </Provider>
        </div>
      </main>
    </div>
  );
}

export default MyApp;
