import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),
  route("/api/image", "./routes/api/image.tsx"),
] satisfies RouteConfig;
