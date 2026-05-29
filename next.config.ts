import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // mapbox-gl 3.x ships with "type":"module"; transpilePackages makes webpack
  // handle it correctly in the client bundle instead of treating it as bare ESM.
  transpilePackages: ["mapbox-gl"],
};

export default nextConfig;
