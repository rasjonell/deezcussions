/*
 * Copyright (C) 2015 Pavel Savshenko
 * Copyright (C) 2011 Google Inc.  All rights reserved.
 * Copyright (C) 2007, 2008 Apple Inc.  All rights reserved.
 * Copyright (C) 2008 Matt Lilek <webkit@mattlilek.com>
 * Copyright (C) 2009 Joseph Pecoraro
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1.  Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 * 2.  Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 * 3.  Neither the name of Apple Computer, Inc. ("Apple") nor the names of
 *     its contributors may be used to endorse or promote products derived
 *     from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

export function cssPath(node: HTMLElement, optimized: boolean = false) {
  if (node.nodeType !== Node.ELEMENT_NODE) return "";
  var steps = [];
  var contextNode = node;
  while (contextNode) {
    var step = cssPathStep(contextNode, !!optimized, contextNode === node);
    if (!step) break; // Error - bail out early.
    steps.push(step);
    if (step.optimized) break;
    contextNode = contextNode.parentNode as HTMLElement;
  }
  steps.reverse();
  return steps.join(" > ");
}

function cssPathStep(
  node: HTMLElement,
  optimized: boolean,
  isTargetNode: boolean
) {
  if (node.nodeType !== Node.ELEMENT_NODE) return null;

  var id = node.getAttribute("id");
  if (optimized) {
    if (id) return new DOMNodePathStep(idSelector(id), true);
    var nodeNameLower = node.nodeName.toLowerCase();
    if (
      nodeNameLower === "body" ||
      nodeNameLower === "head" ||
      nodeNameLower === "html"
    )
      return new DOMNodePathStep(node.nodeName.toLowerCase(), true);
  }
  var nodeName = node.nodeName.toLowerCase();

  if (id)
    return new DOMNodePathStep(nodeName.toLowerCase() + idSelector(id), true);
  var parent = node.parentNode;
  if (!parent || parent.nodeType === Node.DOCUMENT_NODE)
    return new DOMNodePathStep(nodeName.toLowerCase(), true);

  function prefixedElementClassNames(node: HTMLElement) {
    var classAttribute = node.getAttribute("class");
    if (!classAttribute) return [];

    return classAttribute
      .split(/\s+/g)
      .filter(Boolean)
      .map(function (name) {
        // The prefix is required to store "__proto__" in a object-based map.
        return "$" + name;
      });
  }

  function idSelector(id: string) {
    return "#" + escapeIdentifierIfNeeded(id);
  }

  function escapeIdentifierIfNeeded(ident: string) {
    if (isCSSIdentifier(ident)) return ident;
    var shouldEscapeFirst = /^(?:[0-9]|-[0-9-]?)/.test(ident);
    var lastIndex = ident.length - 1;
    return ident.replace(/./g, function (c, i) {
      return (shouldEscapeFirst && i === 0) || !isCSSIdentChar(c)
        ? escapeAsciiChar(c, i === lastIndex)
        : c;
    });
  }

  function escapeAsciiChar(c: string, isLast: boolean) {
    return "\\" + toHexByte(c) + (isLast ? "" : " ");
  }

  function toHexByte(c: string) {
    var hexByte = c.charCodeAt(0).toString(16);
    if (hexByte.length === 1) hexByte = "0" + hexByte;
    return hexByte;
  }

  function isCSSIdentChar(c: string) {
    if (/[a-zA-Z0-9_-]/.test(c)) return true;
    return c.charCodeAt(0) >= 0xa0;
  }

  function isCSSIdentifier(value: string) {
    return /^-?[a-zA-Z_][a-zA-Z0-9_-]*$/.test(value);
  }

  var prefixedOwnClassNamesArray = prefixedElementClassNames(node);
  var needsClassNames = false;
  var needsNthChild = false;
  var ownIndex = -1;
  var siblings = parent.children;
  for (
    var i = 0;
    (ownIndex === -1 || !needsNthChild) && i < siblings.length;
    ++i
  ) {
    var sibling = siblings[i];
    if (sibling === node) {
      ownIndex = i;
      continue;
    }
    if (needsNthChild) continue;
    if (sibling.nodeName.toLowerCase() !== nodeName.toLowerCase()) continue;

    needsClassNames = true;
    var ownClassNames = prefixedOwnClassNamesArray;
    var ownClassNameCount = 0;
    for (var _ in ownClassNames) ++ownClassNameCount;
    if (ownClassNameCount === 0) {
      needsNthChild = true;
      continue;
    }
    var siblingClassNamesArray = prefixedElementClassNames(
      sibling as HTMLElement
    );
    for (var j = 0; j < siblingClassNamesArray.length; ++j) {
      var siblingClass = siblingClassNamesArray[j];
      if (ownClassNames.indexOf(siblingClass)) continue;
      delete ownClassNames[siblingClass];
      if (!--ownClassNameCount) {
        needsNthChild = true;
        break;
      }
    }
  }

  var result = nodeName.toLowerCase();
  if (
    isTargetNode &&
    nodeName.toLowerCase() === "input" &&
    node.getAttribute("type") &&
    !node.getAttribute("id") &&
    !node.getAttribute("class")
  )
    result += '[type="' + node.getAttribute("type") + '"]';
  if (needsNthChild) {
    result += ":nth-child(" + (ownIndex + 1) + ")";
  } else if (needsClassNames) {
    // for (var prefixedName in prefixedOwnClassNamesArray.keySet())
    for (var prefixedName in prefixedOwnClassNamesArray)
      result +=
        "." +
        escapeIdentifierIfNeeded(
          prefixedOwnClassNamesArray[prefixedName].substring(1)
        );
  }

  return new DOMNodePathStep(result, false);
}

function DOMNodePathStep(value: string, optimized: boolean = false) {
  this.value = value;
  this.optimized = optimized;
}

DOMNodePathStep.prototype = {
  toString: function (): string {
    return this.value;
  },
};
