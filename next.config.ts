import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // mapbox-gl 3.x ships with "type":"module"; transpilePackages makes webpack
  // handle it correctly in the client bundle instead of treating it as bare ESM.
  transpilePackages: ["mapbox-gl"],
  // A stray lockfile in the home directory makes Next infer the wrong
  // workspace root; pin it to this project.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
