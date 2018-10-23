<% if (!isPc) { -%>
const pxtorem = require('postcss-pxtorem')

<% } -%>
module.exports = {
  plugins: [
    require('autoprefixer')<% if (!isPc) { -%>,
    pxtorem({
      rootValue: 100,
      unitPrecision: 5,
      propList: ['*'],
      selectorBlackList: [],
      replace: true,
      mediaQuery: false,
      minPixelValue: 2
    })
<% } -%>
  ],
  // 配置autoprefix
  browsers: [
<% if (!isPc) { -%>
    '> 0.1%',
    'iOS >= 7.0',
    'Android >= 4.3'
<% } else { -%>
    '> 1%',
    'last 2 versions',
    '<%- ieVersion %>'
<% } -%>
  ]
}