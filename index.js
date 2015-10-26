const postcss = require('postcss')

module.exports = postcss.plugin('postcss-prefix', postcssPrefix)

function postcssPrefix (prefix, options) {
  options = options || {}

  return function (root) {
    root.walkRules(function (rule) {
      if (rule.selector === ':root') return
      rule.selector = prefix + rule.selector
    })
  }
}
