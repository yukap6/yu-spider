/**
 * Created by jingweirong on 16/3/13.
 */
module.exports = {
    entry: [
        '/www/assets/js/entry.js'
    ],
    output: {
        path: __dirname + '/www/static/js',
        publicpath: '/www/static/js/',
        filename: 'bundle.js'
    },
    loaders: [
        { test: /\.jsx?$/, loaders: ['jsx?harmony']}
    ]
};