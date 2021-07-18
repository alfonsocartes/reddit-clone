// Style
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
// Amplify: because it's being imported in _app.js it will import it in every page
// which might not be the best soluction becase it will increase the size by a lot
import Amplify from "aws-amplify";
import Head from "next/head";
import React, { useEffect } from "react";

import awsconfig from "../aws-exports";
import Header from "../components/Header";
// Context
import AuthContext from "../context/AuthContext";
import theme from "../theme";

Amplify.configure({ ...awsconfig, ssr: true });

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Reddit Clone</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      {/* I think the Auth context should only wrap the <Component> 
        because it will trigger a re render every time the AWS Hub (Auth) changes */}
      <AuthContext>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Header />
          <Component {...pageProps} />
        </ThemeProvider>
      </AuthContext>
    </>
  );
}

export default MyApp;
