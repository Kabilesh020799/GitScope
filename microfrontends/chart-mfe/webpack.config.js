const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = (env, argv) => {
  const isProd = argv.mode === "production";

  return {
    entry: "./src/index.js",
    mode: isProd ? "production" : "development",
    devServer: {
      port: 3001,
      static: {
        directory: path.join(__dirname, "dist"),
      },
      hot: true,
      historyApiFallback: true,
    },
    output: {
      path: path.resolve(__dirname, "build"), // ✅ Needed for prod
      publicPath: "auto",
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: "babel-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.svg$/,
          type: "asset/resource",
        },
      ],
    },
    plugins: [
      new ModuleFederationPlugin({
        name: "chartMfe",
        filename: "remoteEntry.js", // ✅ This gets emitted to build/
        exposes: {
          "./BarChart": "./src/components/bar-chart",
          "./BubbleChart": "./src/components/bubble-chart",
          "./RadarChart": "./src/components/radar-chart",
          "./WordMap": "./src/components/word-map",
        },
        shared: {
          react: { singleton: true },
          "react-dom": { singleton: true },
        },
      }),
      new HtmlWebpackPlugin({
        template: "./public/index.html",
      }),
    ],
    resolve: {
      extensions: [".js", ".jsx"],
    },
  };
};
