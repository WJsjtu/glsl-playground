const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const Logger = require('./Logger');
const makeDirectory = require('./makeDirectory');
const webpackTask = require('./webpackTask');

const distPath = path.resolve(__dirname, '../dist/');
const sourcePath = path.resolve(__dirname, '../src/');
const libPath = path.resolve(__dirname, '../lib/');

const version = require('./../package.json').version;

makeDirectory(distPath);
makeDirectory(libPath);

const ChainedPromise = require('./ChainedPromise');

ChainedPromise(
    () => {
        const logger = new Logger('build-uncompressed: playground', 'index.js');
        logger.start();

        return webpackTask(
            {
                entry: path.join(sourcePath, 'index.js'),
                output: {
                    path: distPath,
                    filename: 'playground.js',
                    library: 'GLSLPlayground',
                    libraryTarget: 'umd'
                },
                plugins: [
                    new webpack.DefinePlugin({
                        'process.env': {
                            NODE_ENV: JSON.stringify('development'),
                            LIB_VERSION: JSON.stringify(version)
                        }
                    })
                ],
                devtool: false//'source-map'
            }
        ).then(logger.finish.bind(logger), logger.error.bind(logger));
    },
    () => {
        const logger = new Logger('build-compressed: playground', 'index.js');
        logger.start();
        return webpackTask(
            {
                entry: path.join(sourcePath, 'index.js'),
                output: {
                    path: distPath,
                    filename: 'playground.min.js',
                    library: 'GLSLPlayground',
                    libraryTarget: 'umd'
                },
                plugins: [
                    new webpack.DefinePlugin({
                        'process.env': {
                            NODE_ENV: JSON.stringify('production'),
                            LIB_VERSION: JSON.stringify(version)
                        }
                    }),
                    new webpack.optimize.UglifyJsPlugin({
                        sourceMap: false,
                        compress: {
                            dead_code: true,
                            drop_debugger: true,
                            unused: true,
                            if_return: true,
                            warnings: true,
                            join_vars: true
                        },
                        output: {
                            comments: false
                        }
                    })
                ],
                devtool: false//'source-map'
            }
        ).then(logger.finish.bind(logger), logger.error.bind(logger));
    }
);