const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");

const isEnvProduction = process.argv.includes("production");
const entrypoint = "./src/index.js";

const productionSettings = {
        mode: "production",
        entry: entrypoint,
        output: {
            // output directory will be the root directory of django
            path: path.resolve(__dirname, "../", "wardrobe_manager", "static", "wardrobe_manager"),
            // this is the bundled code we wrote
            filename: 'js/[name].js',
            // this is the bundled library code
              chunkFilename: 'js/[name].chunk.js'
        },
        optimization: {
            minimize: true,
            splitChunks: {
              chunks: 'all',
              name: true,
            },
            runtimeChunk: false,
          },
        devServer: {
            historyApiFallback: true,
            stats: 'normal',
          },
        module: {
            rules: [
                {
                    // for bundling transpiled javascript
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    include: path.resolve(__dirname, 'src'),
                    use: {
                        loader: "babel-loader",
                    }
                },
                {
                    test: /\.css$/,
                    exclude: /node_modules/,
                    include: path.resolve(__dirname, 'src'),
                    use: [
                      // IMPORTANT => don't forget `injectType`  option  
                      // in some cases some styles can be missing due to 
                      // inline styling. 
                      { loader: 'style-loader', options: { injectType: 'styleTag' } },
                      "css-loader"
                    ],
                },
            ]
        },
    };

const devSettings = {
        mode: "development",
        entry: entrypoint,
        output: {
            path: path.resolve(__dirname, './build'),
            publicPath: "/",
            filename: 'static/bundle.js',
            chunkFilename: 'static/[name].chunk.js',
        },
        devtool: 'inline',
        devServer: {
            historyApiFallback: true,
            contentBase: './dist',
            stats: 'minimal',
          },
        module: {
            rules: [
                {   // using transpiled javascript
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    include: path.resolve(__dirname, 'src'),
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-env"],
                            plugins: ["@babel/plugin-proposal-object-rest-spread"],
                            // for fast development environment
                            // enable caching transpilation
                            cacheDirectory: true
                        },
                    }
                },
                {
                    test: /\.css$/,
                    exclude: /node_modules/,
                    include: path.resolve(__dirname, 'src'),
                    use: [
                      // IMPORTANT => don't forget `injectType`  option  
                      // in some cases some styles can be missing due to 
                      // inline styling. 
                      { loader: 'style-loader', options: { injectType: 'styleTag' } },
                      "css-loader",
                      'postcss-loader',
                    ],
                },
            ]
        },
        plugins: [
            new HtmlWebPackPlugin({
                template: "./src/index.html",
            })
        ]
    };
    

module.exports = devSettings;