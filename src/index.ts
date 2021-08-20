require("dotenv").config();

import {
  getDepartures,
  getDirectionsForRoute,
  getRoute,
  getRoutes,
  getStops,
} from "./api";
import { ApolloServer, gql } from "apollo-server";
import { getRouteTypeName } from "./util";

const typeDefs = gql`
  type Query {
    route(route_id: Int!): Route
    routes(route_type: Int, route_type_name: String): [Route!]!

    directions(route_id: Int!): [Direction!]!

    stop(route_id: Int!, route_type: Int!): [Stop!]!

    departures(route_type: Int!, stop_id: Int!, route_id: Int): [Departure!]!
  }

  type Route {
    route_service_status: RouteServiceStatus!
    route_type: Int!
    route_id: Int!
    route_name: String!
    route_number: String!
    route_gtfs_id: String!
    route_type_name: String!
    directions: [Direction]
    stops: [Stop]
  }

  type RouteServiceStatus {
    description: String!
    timestamp: String!
  }

  type Direction {
    route_direction_description: String!
    direction_id: Int!
    direction_name: String!
    # route_id: Int
    # route_type: Int

    route: Route
  }

  type Stop {
    disruption_ids: [Int!]!
    stop_suburb: String!
    route_type: Int!
    stop_latitude: Float!
    stop_longitude: Float!
    stop_sequence: Int!
    stop_ticket: StopTicket!
    stop_id: Int!
    stop_name: String!
    stop_landmark: String!
    departures(route_id: Int): [Departure!]!
  }

  type StopTicket {
    ticket_type: String!
    zone: String!
    is_free_fare_zone: Boolean!
    ticket_machine: Boolean!
    ticket_checks: Boolean!
    vline_reservation: Boolean!
    ticket_zones: [Int!]!
  }

  type Departure {
    stop_id: Int!
    route_id: Int!
    run_id: Int!
    run_ref: String!
    direction_id: Int!
    disruption_ids: [Int!]!
    scheduled_departure_utc: String!
    estimated_departure_utc: String!
    at_platform: Boolean!
    platform_number: String!
    flags: String!
    departure_sequence: Int!
  }
`;

const resolvers = {
  Query: {
    routes: async (_, { route_type, route_type_name }) => {
      const routes = await getRoutes();

      if (route_type !== undefined) {
        return routes.filter((route) => route.route_type === route_type);
      }

      if (route_type_name !== undefined) {
        return routes.filter(
          (route) => getRouteTypeName(route.route_type) === route_type_name
        );
      }

      return routes;
    },

    route: async (_, { route_id }) => {
      const route = await getRoute(route_id);
      return route;
    },

    directions: async (_, { route_id }) => {
      const directions = await getDirectionsForRoute(route_id);
      return directions;
    },

    stop: async (_, { route_id, route_type }) => {
      const stops = await getStops(route_id, route_type);
      return stops;
    },

    departures: async (_, { route_type, stop_id, route_id }) => {
      const departures = await getDepartures(route_type, stop_id, route_id);
      return departures;
    },
  },

  Route: {
    route_type_name: (parent) => {
      getRouteTypeName(parent.route_type);
    },
    directions: async (parent) => {
      const directions = await getDirectionsForRoute(parent.route_id);
      return directions;
    },
    stops: async (parent) => {
      const stops = await getStops(parent.route_id, parent.route_type);
      return stops;
    },
  },

  Direction: {
    route: async (parent) => {
      const route = await getRoute(parent.route_id);
      return route;
    },
  },

  Stop: {
    departures: async (parent, { route_id }) => {
      const departures = await getDepartures(
        parent.route_type,
        parent.stop_id,
        route_id
      );
      return departures;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
