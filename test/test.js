
var assert = require('assert');
var getBoundingClientRect = require('../');

describe('getBoundingClientRect', function () {

  var div = document.createElement('div');
  div.innerHTML = '<p>hello</p>';
  div.setAttribute('contenteditable', 'true');
  document.body.appendChild(div);

  after(function () {
    document.body.removeChild(div);
  });

  function assertIsTextRectangle (rect) {
    // see:
    // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIDOMClientRect
    assert.equal('number', typeof rect.bottom);
    assert.equal('number', typeof rect.height);
    assert.equal('number', typeof rect.left);
    assert.equal('number', typeof rect.right);
    assert.equal('number', typeof rect.top);
    assert.equal('number', typeof rect.width);
  }

  it('should return a client rect for a P HTMLElement', function () {
      var p = div.firstChild;
      assert.equal(1 /*Node.ELEMENT_NODE*/, p.nodeType);
      assert.equal('P', p.nodeName);

      var rect = getBoundingClientRect(p);

      assertIsTextRectangle(rect);
  });

  it('should return a client rect for a collapsed Range', function () {
      var range = document.createRange();
      range.setStart(div.firstChild.firstChild, 1);
      range.setEnd(div.firstChild.firstChild, 1);
      assert(range.collapsed);

      var rect = getBoundingClientRect(range);

      assertIsTextRectangle(rect);
  });

  it('should return a client rect for a non-collapsed Range', function () {
      var range = document.createRange();
      range.setStart(div.firstChild.firstChild, 1);
      range.setEnd(div.firstChild.firstChild, 4);
      assert(!range.collapsed);

      var rect = getBoundingClientRect(range);

      assertIsTextRectangle(rect);
  });

  it('should return a client rect for a TextNode', function () {
      var textNode = div.firstChild.firstChild;
      assert.equal(3 /*Node.TEXT_NODE*/, textNode.nodeType);
      assert.equal('hello', textNode.nodeValue);

      var rect = getBoundingClientRect(textNode);

      assertIsTextRectangle(rect);
  });

});
