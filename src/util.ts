export const getRouteTypeName = (route_type: number): string => {
  switch (route_type) {
    case 0:
      return "Train";
    case 1:
      return "Tram";
    case 2:
      return "Bus";
    case 3:
      return "Vline";
    case 4:
      return "Night Bus";
  }
};
