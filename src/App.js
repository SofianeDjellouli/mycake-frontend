import React, { Suspense, useState, useCallback, Fragment, useEffect } from "react";
import { MuiPickersUtilsProvider as DatePickerContext } from "@material-ui/pickers";
import utils from "@date-io/dayjs";
import { useRoutes, useRedirect } from "hookrouter";
import { Header, Snackbar, fallback, Footer } from "./components";
import { routes as _routes, useToggle, GlobalContext, loadStyle, firebase } from "./utils";
import "./style.css";

const App = _ => {
  const [snackbar, setSnackbar] = useState({}),
    [user, setUser] = useState(undefined),
    toggleLoad = useToggle(),
    closeSnackbar = useCallback(_ => setSnackbar(({ type }) => ({ message: "", type })), []);

  useRedirect("/profile", user ? "/profile" : "/");
  useRedirect("/sign-up", user ? "/" : "/sign-up");

  const routes = useRoutes(_routes);

  /* useEffect(_ => {
    class SubPromise extends Promise {
      constructor(executor) {
        super((resolve, reject) =>
          executor(resolve, err => {
            if (isDev) console.error(err);
            const { message } = err,
              error =
                (message || err).toString() || "An error occured. Please try again or contact us.";
            setSnackbar({ message: error });
            throw error;
          })
        );
      }

      catch(success, reject) {
        return super.catch(success, reject);
      }
    }
    window.Promise = SubPromise;
  }, []);*/

  useEffect(
    _ => {
      loadStyle(
        "https://fonts.googleapis.com/css?family=Montserrat:400,500,600,700&display=swap"
      ).then(toggleLoad.toggle);
    },
    [toggleLoad.toggle]
  );
  useEffect(_ => {
    firebase.auth().onAuthStateChanged(user => setUser(user || undefined));
  }, []);
  return toggleLoad.toggled ? (
    <Fragment>
      <GlobalContext.Provider value={{ setSnackbar, user }}>
        <Header />
        <Suspense {...{ fallback }}>
          <DatePickerContext {...{ utils }}>{routes}</DatePickerContext>
        </Suspense>
        <Footer />
      </GlobalContext.Provider>
      <Snackbar {...{ ...snackbar, closeSnackbar }} />
    </Fragment>
  ) : (
    fallback
  );
};

export default App;
