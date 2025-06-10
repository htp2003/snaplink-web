// App.tsx
import React from "react";
import useRouteElements from "./router/useRouteElements";

const App: React.FC = () => {
  const routeElements = useRouteElements();
  return <div>{routeElements}</div>;
};

export default App;
