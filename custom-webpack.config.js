var webpack = require('webpack');

module.exports = {
    entry: { 
        background: 'src/core/background.ts',
        inject: 'src/core/inject.ts'
    },
    node: {
        stream: true,
        crypto: true,
        global: false
    },
    plugins: [
        new webpack.ProvidePlugin({
          global: require.resolve('./global.js')
        })
    ],
}