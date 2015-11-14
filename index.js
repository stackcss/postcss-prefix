const postcss = require('postcss')

module.exports = postcss.plugin('postcss-prefix', postcssPrefix)

function postcssPrefix (prefix, options) {
  options = options || {}

  return function (root) {
    root.walkRules(function (rule) {
      rule.selectors = rule.selectors.map(function (selector) {
        if (rule.selector.indexOf(':root') === 0) return selector
        return prefix + selector
      })
      rule.selector = rule.selectors.join(', ')
    })
  }
}
