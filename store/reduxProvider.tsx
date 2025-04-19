import { Provider } from "react-redux";
import { Store } from "@reduxjs/toolkit";

const ReduxProvider = ({
  children,
  store,
}: {
  children: React.ReactNode;
  store: Store;
}) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
