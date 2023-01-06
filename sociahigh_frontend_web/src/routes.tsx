import {Route, Routes as DOMRoutes} from 'react-router-dom';
import {
  Home,
  Login,
  EventDetail,
  EventGuests,
  EventListing,
  CreateAccount,
  InvitationListing,
} from './pages';
import {RoutesEnum} from './utils/enums';

export const public_routes = [
  {pathname: RoutesEnum.LOGIN, component: <Login />},
  {pathname: RoutesEnum.CREATE_ACCOUNT, component: <CreateAccount />},
];
export const private_routes = [
  {pathname: RoutesEnum.HOME, component: <Home />},
  {pathname: RoutesEnum.EVENTS, component: <EventListing />},
  {pathname: RoutesEnum.INVITATIONS, component: <InvitationListing />},
  {pathname: RoutesEnum.EVENTS_DETAIL, component: <EventDetail />},
  {pathname: RoutesEnum.EVENTS_CREATE, component: <EventDetail />},
  {pathname: RoutesEnum.EVENTS_GUESTS, component: <EventGuests />},
];

export function Routes() {
  return (
    <DOMRoutes>
      {public_routes.map(route => (
        <Route
          key={route.pathname}
          path={route.pathname}
          element={route.component}
        />
      ))}

      {private_routes.map(route => (
        <Route
          key={route.pathname}
          path={route.pathname}
          element={route.component}
        />
      ))}
    </DOMRoutes>
  );
}
