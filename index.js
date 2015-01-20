
/**
 * Module dependencies.
 */

var getDocument = require('get-document');

/**
 * Module exports.
 */

module.exports = getBoundingClientRect;

/**
 * Returns the "bounding client rectangle" of the given `TextNode`,
 * `HTMLElement`, or `Range`.
 *
 * @param {Node} node
 * @return {TextRectangle}
 * @public
 */

function getBoundingClientRect (node) {
  var rect = null;
  var doc = getDocument(node);

  if (node.nodeType === 3 /* TEXT_NODE */) {
    // see: http://stackoverflow.com/a/6966613/376773
    var range = doc.createRange();
    range.selectNodeContents(node);
    node = range;
  }

  if ('function' === typeof node.getBoundingClientRect) {
    rect = node.getBoundingClientRect();

    if (node.startContainer && rect.left === 0 && rect.top === 0) {
      // Range instances sometimes report all `0`s
      // see: http://stackoverflow.com/a/6847328/376773
      var span = doc.createElement('span');

      // Ensure span has dimensions and position by
      // adding a zero-width space character
      span.appendChild(doc.createTextNode('\u200b'));
      node.insertNode(span);
      rect = span.getBoundingClientRect();

      // Remove temp SPAN and glue any broken text nodes back together
      var spanParent = span.parentNode;
      spanParent.removeChild(span);
      spanParent.normalize();
    }

  }

  return rect;
}
