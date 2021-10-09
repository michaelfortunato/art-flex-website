import "../styles/globals.css";
import Head from "next/head";
import theme from "theme";

import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { ApolloProvider } from "@apollo/client/react";
import { ThemeProvider as MuiThemeProvider, responsiveFontSizes } from "@material-ui/core/styles";
import { ThemeProvider } from "styled-components";
import { StylesProvider } from "@material-ui/core/styles";
import { useEffect } from "react";
import { SWRConfig } from "swr";
import store from '../redux-store/store'
import { Provider } from 'react-redux'


import axios from 'axios'
const ART_FLEX_URL = "/api"
axios.defaults.baseURL = ART_FLEX_URL

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);
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
            <SWRConfig value={{
              fetcher: (url) => fetch(ART_FLEX_URL + url).then(res => res.json())
            }}>
              <StylesProvider injectFirst>
                <MuiThemeProvider theme={theme}>
                  <ThemeProvider theme={theme}>
                    <Component {...pageProps} />
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
