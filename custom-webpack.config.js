var webpack = require('webpack');

module.exports = {
    entry: { 
        background: 'src/background.ts',
        inject: 'src/inject.ts'
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