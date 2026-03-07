import { getRoute } from "./routeService.js";

const source = {
  latitude: 26.9124,
  longitude: 75.7873, 
};

const destination = {
  latitude: 26.8467,
  longitude: 75.8035, 
};

async function testRoute() {
  const result = await getRoute(source, destination);
  console.log("ROUTE RESULT 👉", result);
}

testRoute();
