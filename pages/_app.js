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

const ART_FLEX_URL = "https://api.art-flex.co"

function MyApp({ Component, pageProps }) {
  theme = responsiveFontSizes(theme);

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
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
            <SWRConfig value = {{
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
        </div>
      </main>
    </div>
  );
}

export default MyApp;
