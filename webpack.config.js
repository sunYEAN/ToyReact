const path = require('path');
const resolve = (p) => path.resolve(__dirname, p);
const WebpackPluginHTML = require('html-webpack-plugin');
module.exports = {
    entry: './src/main.js',
    mode: 'development',
    output: {
        path: resolve('dist'),
        filename: "main.js"
    },
    optimization: {
        minimize: false
    },
    resolve: {
        extensions: ['.js']
    },
    devServer: {
        host: '0.0.0.0'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-env"],
                            plugins: [
                                ['@babel/plugin-transform-react-jsx', {
                                    pragma: 'createElement'
                                }]
                            ]
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new WebpackPluginHTML({
            template: resolve('./src/index.html')
        })
    ]
};
