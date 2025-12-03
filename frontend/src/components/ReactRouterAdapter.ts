import { useLocation, useNavigate } from "react-router";
import { QueryParamAdapterComponent } from "use-query-params";

export const ReactRouterAdapter: QueryParamAdapterComponent = ({ children }) => {
  const navigate = useNavigate();
  return children({
    location: useLocation(),
    push: (location) => navigate({ search: location.search }, { state: location.state }),
    replace: (location) => navigate({ search: location.search }, { replace: true, state: location.state }),
  });
};
