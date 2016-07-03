const postcss = require('postcss')
const Selector = require('postcss-selector-parser')

module.exports = postcss.plugin('postcss-prefix', postcssPrefix)

function postcssPrefix (prefix, options) {
  options = options || {}

  return function (root) {
    root.walkRules(function (rule) {
      const selector = Selector(
        transformSelectors
      ).process(rule.selector).result

      rule.selector = selector
    })
  }

  function transformSelectors (selectors) {
    selectors.eachInside(function (selector) {
      if (
        // if parent is not selector and
        selector.parent.type !== 'selector' ||
        // if not first node in container
        selector.parent.nodes[0] !== selector ||
        // don't prefix pseudo selector args unless it's `:not`
        (selector.parent.parent.type === 'pseudo' && selector.parent.parent.value !== ':not')
      ) return

      const prefixNode = getPrefixNode(prefix)

      if (selector.type === 'pseudo') {
        switch (selector.value) {
          case ':root':
            return
          case ':host':
            const replacement = Selector.selector()
            replacement.nodes = [prefixNode].concat(selector.clone().nodes)
            selector.replaceWith(replacement)
            return
        }
      }

      // prefix
      //
      // start by prepending a space combinator
      selector.parent.prepend(Selector.combinator({ value: ' ' }))
      // then prepend the prefix node, preserving spacing
      prefixNode.spaces.before = selector.spaces.before
      selector.spaces.before = ''
      selector.parent.prepend(prefixNode)
    })
  }
}

function getPrefixNode (prefix) {
  const sigil = prefix[0]
  const value = prefix.slice(1)

  switch (sigil) {
    case '#':
      return Selector.id({ value: value })
    case '.':
      return Selector.className({ value: value })
  }
}
