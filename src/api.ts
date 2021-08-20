import axios from "axios";
import crypto from "crypto";

const applySignature = (url: string): string => {
  const hash = crypto
    .createHmac("sha1", process.env.API_KEY)
    .update(url)
    .digest("hex")
    .toUpperCase();

  return `${process.env.BASE_URL}${url}&signature=${hash}`;
};

const getRoutesURL = (): string => {
  let URL = `/v3/routes`;
  URL = URL + (URL.includes("?") ? "&" : "?") + `devid=${process.env.DEV_ID}`;

  return applySignature(URL);
};

export const getRoutes = () =>
  axios(getRoutesURL()).then((res) => res.data.routes);

const getRouteURL = (route_id: number): string => {
  let URL = `/v3/routes/${route_id}`;
  URL = URL + (URL.includes("?") ? "&" : "?") + `devid=${process.env.DEV_ID}`;

  return applySignature(URL);
};

export const getRoute = (route_id: number) =>
  axios(getRouteURL(route_id)).then((res) => res.data.route);

const getDirectionsForRouteURL = (route_id: number): string => {
  let URL = `/v3/directions/route/${route_id}`;
  URL = URL + (URL.includes("?") ? "&" : "?") + `devid=${process.env.DEV_ID}`;

  return applySignature(URL);
};

export const getDirectionsForRoute = (route_id: number) =>
  axios(getDirectionsForRouteURL(route_id)).then((res) => res.data.directions);

const getStopsURL = (route_id: number, route_type: number): string => {
  let URL = `/v3/stops/route/${route_id}/route_type/${route_type}`;
  URL = URL + (URL.includes("?") ? "&" : "?") + `devid=${process.env.DEV_ID}`;

  return applySignature(URL);
};

export const getStops = (route_id: number, route_type: number) =>
  axios(getStopsURL(route_id, route_type)).then((res) => res.data.stops);

const getDeparturesURL = (
  route_type: number,
  stop_id: number,
  route_id?: number
): string => {
  let URL;

  if (route_id !== undefined) {
    URL = `/v3/departures/route_type/${route_type}/stop/${stop_id}/route/${route_id}`;
  } else {
    URL = `/v3/departures/route_type/${route_type}/stop/${stop_id}`;
  }

  URL = URL + (URL.includes("?") ? "&" : "?") + `devid=${process.env.DEV_ID}`;

  return applySignature(URL);
};

export const getDepartures = (
  route_type: number,
  stop_id: number,
  route_id?: number
) =>
  axios(getDeparturesURL(route_type, stop_id, route_id)).then(
    (res) => res.data.departures
  );
