(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[98],{320:function(t,e,n){!function(t){"use strict";t.defineMode("solr",(function(){var t=/[^\s\|\!\+\-\*\?\~\^\&\:\(\)\[\]\{\}\"\\]/,e=/[\|\!\+\-\*\?\~\^\&]/,n=/^(OR|AND|NOT|TO)$/i;function r(t){return parseFloat(t).toString()===t}function o(t){return function(e,n){for(var r,o=!1;null!=(r=e.next())&&(r!=t||o);)o=!o&&"\\"==r;return o||(n.tokenize=c),"string"}}function i(t){return function(e,n){var r="operator";return"+"==t?r+=" positive":"-"==t?r+=" negative":"|"==t?e.eat(/\|/):"&"==t?e.eat(/\&/):"^"==t&&(r+=" boost"),n.tokenize=c,r}}function u(e){return function(o,i){for(var u=e;(e=o.peek())&&null!=e.match(t);)u+=o.next();return i.tokenize=c,n.test(u)?"operator":r(u)?"number":":"==o.peek()?"field":"string"}}function c(n,r){var s=n.next();return'"'==s?r.tokenize=o(s):e.test(s)?r.tokenize=i(s):t.test(s)&&(r.tokenize=u(s)),r.tokenize!=c?r.tokenize(n,r):null}return{startState:function(){return{tokenize:c}},token:function(t,e){return t.eatSpace()?null:e.tokenize(t,e)}}})),t.defineMIME("text/x-solr","solr")}(n(27))}}]);
//# sourceMappingURL=98.8c6fde36.chunk.js.map