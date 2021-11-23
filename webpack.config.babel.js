/* eslint-disable indent */
let fs = require('fs');
let path = require('path');
let webpack = require('webpack');
let env = require('./src/config/development');
let autoprefixer = require('autoprefixer');

const PROD = process.env.npm_lifecycle_event;
console.log(PROD, '///////////');

const staticBase = 'js/';
const contentBase = './src/build';
let initConfig = {
    resolve: {
        extensions: ['', '.js', '.vue'],
        alias: {
            'vue$': 'vue/dist/vue.common.js'
        }
    },
    entry: './src/app.js',
    output: {
        path: path.join(__dirname, contentBase, staticBase),
        publicPath: staticBase,
        filename: 'common.min.js'
    },
    module: {
        loaders: [{
            test: /\.js?$/,
            exclude: '/node_modules/',
            loader: 'babel',
            query: {
                compact: false
            }
        }, {
            test: /\.json$/,
            exclude: [/node_modules/],
            loaders: ['json-loader']
        }, {
            test: /\.vue$/,
            exclude: [/node_modules/],
            loaders: ['vue-loader']
        }, {
            test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
            loader: 'file?limit=8192&name=imgHash/[hash:10].[name].[ext]'
        },
        {
            test: /\.less$/,
            loader: 'style-loader!css-loader!less-loader'
        }]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.DedupePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        })
    ],
    postcss: function (){
        return [
            // precss(),
            autoprefixer({
                browsers: ['last 3 versions', 'iOS 8', 'Android 4']
            })
        ];
    },
    eslint: {
        configFile: '.eslintrc' // Rules for eslint
    }
};
var writeObj = {
    date: new Date(Date.now() + 8 * 60 * 60 * 1000)
};
if (PROD === 'build'){
    fs.writeFile('./src/config/version.json', JSON.stringify(writeObj), (err) => {
        if (err) throw err;
        console.log('It\'s saved!');
    });
}
var scriptArr = ['dev', 'build-dev'];
if (scriptArr.indexOf(PROD) > -1){
    // initConfig.devtool = 'source-map';
    initConfig.devtool = 'eval';
    initConfig.progress = true;
    initConfig.devServer = {
        contentBase,
        port: env.hot_server_port,
        hot: true,
        inline: true,
        open: true,
        host: '0.0.0.0'
    };
}

if (PROD === 'host-dev'){
    // initConfig.devtool = 'source-map';
    initConfig.devtool = 'eval';
    initConfig.progress = true;
    initConfig.devServer = {
        contentBase,
        port: env.hot_server_port || 3002,
        hot: true,
        inline: true,
        open: true,
        host: '172.20.10.3'
    };
}

module.exports = initConfig;
