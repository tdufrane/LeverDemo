var List;
List = (function() {
  var t = {
    "./src/add-async.js": function(t2) {
      t2.exports = function(t3) {
        return function e2(r, n, s) {
          var i = r.splice(0, 50);
          s = (s = s || []).concat(t3.add(i)), r.length > 0 ? setTimeout(function() {
            e2(r, n, s);
          }, 1) : (t3.update(), n(s));
        };
      };
    },
    "./src/filter.js": function(t2) {
      t2.exports = function(t3) {
        return t3.handlers.filterStart = t3.handlers.filterStart || [], t3.handlers.filterComplete = t3.handlers.filterComplete || [], function(e2) {
          if (t3.trigger("filterStart"), t3.i = 1, t3.reset.filter(), void 0 === e2)
            t3.filtered = false;
          else {
            t3.filtered = true;
            var r = t3.items, s = r.length;
            for (var n = 0; n < s; n++) {
              var i = r[n];
              i.filtered = e2(i);
            }
          }
          return t3.update(), t3.trigger("filterComplete"), t3.visibleItems;
        };
      };
    },
    "./src/fuzzy-search.js": function(t2, e2, r) {
      r("./src/utils/classes.js");
      var n = r("./src/utils/events.js"), s = r("./src/utils/extend.js"), i = r("./src/utils/to-string.js"), a = r("./src/utils/get-by-class.js"), o = r("./src/utils/fuzzy.js");
      t2.exports = function(t3, e3) {
        e3 = s(
          {
            location: 0,
            distance: 100,
            threshold: 0.4,
            multiSearch: true,
            searchClass: "fuzzy-search"
          },
          e3 = e3 || {}
        );
        var r2 = {
          search: function(n2, s2) {
            for (var i2 = e3.multiSearch ? n2.replace(/ +$/, "").split(/ +/) : [n2], a2 = 0, o2 = t3.items.length; a2 < o2; a2++)
              r2.item(t3.items[a2], s2, i2);
          },
          item: function(t4, e4, n2) {
            for (var s2 = true, i2 = 0; i2 < n2.length; i2++) {
              for (var a2 = false, o2 = 0, l = e4.length; o2 < l; o2++)
                r2.values(t4.values(), e4[o2], n2[i2]) && (a2 = true);
              a2 || (s2 = false);
            }
            t4.found = s2;
          },
          values: function(t4, r3, n2) {
            if (t4.hasOwnProperty(r3)) {
              var s2 = i(t4[r3]).toLowerCase();
              if (o(s2, n2, e3)) return true;
            }
            return false;
          }
        };
        return n.bind(
          a(t3.listContainer, e3.searchClass),
          "keyup",
          t3.utils.events.debounce(function(e4) {
            var n2 = e4.target || e4.srcElement;
            t3.search(n2.value, r2.search);
          }, t3.searchDelay)
        ), function(e4, n2) {
          t3.search(e4, n2, r2.search);
        };
      };
    },
    "./src/index.js": function(t2, e2, r) {
      var n = r("./node_modules/string-natural-compare/natural-compare.js"), s = r("./src/utils/get-by-class.js"), i = r("./src/utils/extend.js"), a = r("./src/utils/index-of.js"), o = r("./src/utils/events.js"), l = r("./src/utils/to-string.js"), u = r("./src/utils/classes.js"), c = r("./src/utils/get-attribute.js"), f = r("./src/utils/to-array.js");
      t2.exports = function(t3, e3, h) {
        var d, v = this, g = r("./src/item.js")(v), m = r("./src/add-async.js")(v), p = r("./src/pagination.js")(v);
        d = {
          start: function() {
            v.listClass = "list", v.searchClass = "search", v.sortClass = "sort", v.page = 1e4, v.i = 1, v.items = [], v.visibleItems = [], v.matchingItems = [], v.searched = false, v.filtered = false, v.searchColumns = void 0, v.searchDelay = 0, v.handlers = { updated: [] }, v.valueNames = [], v.utils = {
              getByClass: s,
              extend: i,
              indexOf: a,
              events: o,
              toString: l,
              naturalSort: n,
              classes: u,
              getAttribute: c,
              toArray: f
            }, v.utils.extend(v, e3), v.listContainer = "string" == typeof t3 ? document.getElementById(t3) : t3, v.listContainer && (v.list = s(v.listContainer, v.listClass, true), v.parse = r("./src/parse.js")(v), v.templater = r("./src/templater.js")(v), v.search = r("./src/search.js")(v), v.filter = r("./src/filter.js")(v), v.sort = r("./src/sort.js")(v), v.fuzzySearch = r("./src/fuzzy-search.js")(
              v,
              e3.fuzzySearch
            ), this.handlers(), this.items(), this.pagination(), v.update());
          },
          handlers: function() {
            for (var t4 in v.handlers)
              v[t4] && v.handlers.hasOwnProperty(t4) && v.on(t4, v[t4]);
          },
          items: function() {
            v.parse(v.list), void 0 !== h && v.add(h);
          },
          pagination: function() {
            if (void 0 !== e3.pagination) {
              true === e3.pagination && (e3.pagination = [{}]), void 0 === e3.pagination[0] && (e3.pagination = [e3.pagination]);
              for (var t4 = 0, r2 = e3.pagination.length; t4 < r2; t4++)
                p(e3.pagination[t4]);
            }
          }
        }, this.reIndex = function() {
          v.items = [], v.visibleItems = [], v.matchingItems = [], v.searched = false, v.filtered = false, v.parse(v.list);
        }, this.toJSON = function() {
          for (var t4 = [], e4 = 0, r2 = v.items.length; e4 < r2; e4++)
            t4.push(v.items[e4].values());
          return t4;
        }, this.add = function(t4, e4) {
          if (0 !== t4.length) {
            if (!e4) {
              var r2 = [], n2 = false;
              void 0 === t4[0] && (t4 = [t4]);
              for (var s2 = 0, i2 = t4.length; s2 < i2; s2++) {
                var a2;
                n2 = v.items.length > v.page, a2 = new g(t4[s2], void 0, n2), v.items.push(a2), r2.push(a2);
              }
              return v.update(), r2;
            }
            m(t4.slice(0), e4);
          }
        }, this.show = function(t4, e4) {
          return this.i = t4, this.page = e4, v.update(), v;
        }, this.remove = function(t4, e4, r2) {
          var n2 = 0;
          for (var s2 = v.items.length - 1; s2 >= 0; s2--) {
            if (v.items[s2].values()[t4] == e4) {
              v.templater.remove(v.items[s2], r2);
              v.items.splice(s2, 1);
              n2++;
            }
          }
          return v.update(), n2;
        }, this.get = function(t4, e4) {
          for (var r2 = [], n2 = 0, s2 = v.items.length; n2 < s2; n2++) {
            var i2 = v.items[n2];
            i2.values()[t4] == e4 && r2.push(i2);
          }
          return r2;
        }, this.size = function() {
          return v.items.length;
        }, this.clear = function() {
          return v.templater.clear(), v.items = [], v;
        }, this.on = function(t4, e4) {
          return v.handlers[t4].push(e4), v;
        }, this.off = function(t4, e4) {
          var r2 = v.handlers[t4], n2 = a(r2, e4);
          return n2 > -1 && r2.splice(n2, 1), v;
        }, this.trigger = function(t4) {
          for (var e4 = v.handlers[t4].length; e4--; ) v.handlers[t4][e4](v);
          return v;
        }, this.reset = {
          filter: function() {
            for (var t4 = v.items, e4 = t4.length; e4--; ) t4[e4].filtered = false;
            return v;
          },
          search: function() {
            for (var t4 = v.items, e4 = t4.length; e4--; ) t4[e4].found = false;
            return v;
          }
        }, this.update = function() {
          var items = v.items, itemsLen = items.length, vPage = v.page, vI = v.i;
          v.visibleItems = [], v.matchingItems = [], v.templater.clear();
          var visibleCount = 0, matchingCount = 0;
          for (var r2 = 0; r2 < itemsLen; r2++) {
            var item = items[r2];
            var isMatching = item.matching();
            if (isMatching) {
              matchingCount++;
              if (matchingCount >= vI && visibleCount < vPage) {
                item.show();
                v.visibleItems.push(item);
                v.matchingItems.push(item);
                visibleCount++;
              } else {
                v.matchingItems.push(item);
                item.hide();
              }
            } else {
              item.hide();
            }
          }
          return v.trigger("updated"), v;
        }, d.start();
      };
    },
    "./src/item.js": function(t2) {
      t2.exports = function(t3) {
        return function(e2, r, n) {
          var s = this;
          this._values = {}, this.found = false, this.filtered = false;
          this.values = function(e3, r2) {
            if (void 0 === e3) return s._values;
            for (var n2 in e3) s._values[n2] = e3[n2];
            true !== r2 && t3.templater.set(s, s.values());
          }, this.show = function() {
            t3.templater.show(s);
          }, this.hide = function() {
            t3.templater.hide(s);
          }, this.matching = function() {
            return t3.filtered && t3.searched && s.found && s.filtered || t3.filtered && !t3.searched && s.filtered || !t3.filtered && t3.searched && s.found || !t3.filtered && !t3.searched;
          }, this.visible = function() {
            return !(!s.elm || s.elm.parentNode != t3.list);
          }, (function(e3, r2, n2) {
            if (void 0 === r2) n2 ? s.values(e3, n2) : s.values(e3);
            else {
              s.elm = r2;
              var i = t3.templater.get(s, e3);
              s.values(i);
            }
          })(e2, r, n);
        };
      };
    },
    "./src/pagination.js": function(t2, e2, r) {
      var n = r("./src/utils/classes.js"), s = r("./src/utils/events.js"), i = r("./src/index.js");
      t2.exports = function(t3) {
        var e3 = false, r2 = function(r3, s2) {
          if (t3.page < 1)
            return t3.listContainer.style.display = "none", void (e3 = true);
          e3 && (t3.listContainer.style.display = "block");
          var i2, o = t3.matchingItems.length, l = t3.i, u = t3.page, c = Math.ceil(o / u), f = Math.ceil(l / u), h = s2.innerWindow || 2, d = s2.left || s2.outerWindow || 0, v = s2.right || s2.outerWindow || 0;
          v = c - v, r3.clear();
          for (var g = 1; g <= c; g++) {
            var m = f === g ? "active" : "";
            a.number(g, d, v, f, h) ? (i2 = r3.add({ page: g, dotted: false })[0], m && n(i2.elm).add(m), i2.elm.firstChild.setAttribute("data-i", g), i2.elm.firstChild.setAttribute("data-page", u)) : a.dotted(r3, g, d, v, f, h, r3.size()) && (i2 = r3.add({ page: "...", dotted: true })[0], n(i2.elm).add("disabled"));
          }
        }, a = {
          number: function(t4, e4, r3, n2, s2) {
            return this.left(t4, e4) || this.right(t4, r3) || this.innerWindow(t4, n2, s2);
          },
          left: function(t4, e4) {
            return t4 <= e4;
          },
          right: function(t4, e4) {
            return t4 > e4;
          },
          innerWindow: function(t4, e4, r3) {
            return t4 >= e4 - r3 && t4 <= e4 + r3;
          },
          dotted: function(t4, e4, r3, n2, s2, i2, a2) {
            return this.dottedLeft(t4, e4, r3, n2, s2, i2) || this.dottedRight(t4, e4, r3, n2, s2, i2, a2);
          },
          dottedLeft: function(t4, e4, r3, n2, s2, i2) {
            return e4 == r3 + 1 && !this.innerWindow(e4, s2, i2) && !this.right(e4, n2);
          },
          dottedRight: function(t4, e4, r3, n2, s2, i2, a2) {
            return !t4.items[a2 - 1].values().dotted && e4 == n2 && !this.innerWindow(e4, s2, i2) && !this.right(e4, n2);
          }
        };
        return function(e4) {
          var n2 = new i(t3.listContainer.id, {
            listClass: e4.paginationClass || "pagination",
            item: e4.item || "<li><a class='page' href='#'></a></li>",
            valueNames: ["page", "dotted"],
            searchClass: "pagination-search-that-is-not-supposed-to-exist",
            sortClass: "pagination-sort-that-is-not-supposed-to-exist"
          });
          s.bind(n2.listContainer, "click", function(e5) {
            var r3 = e5.target || e5.srcElement, n3 = t3.utils.getAttribute(r3, "data-page"), s2 = t3.utils.getAttribute(r3, "data-i");
            s2 && t3.show((s2 - 1) * n3 + 1, n3);
          }), t3.on("updated", function() {
            r2(n2, e4);
          }), r2(n2, e4);
        };
      };
    },
    "./src/parse.js": function(t2, e2, r) {
      t2.exports = function(t3) {
        var e3 = r("./src/item.js")(t3), n = function(r2, n2) {
          for (var s2 = 0, i = r2.length; s2 < i; s2++)
            t3.items.push(new e3(n2, r2[s2]));
        }, s = function e4(r2, s2) {
          var i = r2.splice(0, 50);
          n(i, s2), r2.length > 0 ? setTimeout(function() {
            e4(r2, s2);
          }, 1) : (t3.update(), t3.trigger("parseComplete"));
        };
        return t3.handlers.parseComplete = t3.handlers.parseComplete || [], function() {
          var e4 = (function(t4) {
            for (var e5 = t4.childNodes, r3 = [], n2 = 0, s2 = e5.length; n2 < s2; n2++)
              void 0 === e5[n2].data && r3.push(e5[n2]);
            return r3;
          })(t3.list), r2 = t3.valueNames;
          t3.indexAsync ? s(e4, r2) : n(e4, r2);
        };
      };
    },
    "./src/search.js": function(t2) {
      t2.exports = function(t3) {
        var e2, r, n, s = {
          resetList: function() {
            t3.i = 1, t3.templater.clear(), n = void 0;
          },
          setOptions: function(t4) {
            2 == t4.length && t4[1] instanceof Array ? e2 = t4[1] : 2 == t4.length && "function" == typeof t4[1] ? (e2 = void 0, n = t4[1]) : 3 == t4.length ? (e2 = t4[1], n = t4[2]) : e2 = void 0;
          },
          setColumns: function() {
            0 !== t3.items.length && void 0 === e2 && (e2 = void 0 === t3.searchColumns ? s.toArray(t3.items[0].values()) : t3.searchColumns);
          },
          setSearchString: function(e3) {
            e3 = (e3 = t3.utils.toString(e3).toLowerCase()).replace(
              /[-[\]{}()*+?.,\\^$|#]/g,
              "\\$&"
            ), r = e3;
          },
          toArray: function(t4) {
            var e3 = [];
            for (var r2 in t4) e3.push(r2);
            return e3;
          }
        }, i = function() {
          for (var n2, s2 = [], i2 = r; null !== (n2 = i2.match(/"([^"]+)"/)); )
            s2.push(n2[1]), i2 = i2.substring(0, n2.index) + i2.substring(n2.index + n2[0].length);
          (i2 = i2.trim()).length && (s2 = s2.concat(i2.split(/\s+/)));
          var items = t3.items, itemsLen = items.length, eLen = e2.length;
          for (var a2 = 0; a2 < itemsLen; a2++) {
            var l = items[a2];
            if (l.found = false, s2.length) {
              var sLen = s2.length;
              for (var u = 0; u < sLen; u++) {
                for (var f = false, h = 0; h < eLen; h++) {
                  var v = l.values(), g = e2[h];
                  if (v.hasOwnProperty(g) && void 0 !== v[g] && null !== v[g]) {
                    if (-1 !== ("string" != typeof v[g] ? v[g].toString() : v[g]).toLowerCase().indexOf(s2[u])) {
                      f = true;
                      break;
                    }
                  }
                }
                if (!f) break;
              }
              l.found = f;
            }
          }
        }, a = function() {
          t3.reset.search(), t3.searched = false;
        }, o = function(o2) {
          return t3.trigger("searchStart"), s.resetList(), s.setSearchString(o2), s.setOptions(arguments), s.setColumns(), "" === r ? a() : (t3.searched = true, n ? n(r, e2) : i()), t3.update(), t3.trigger("searchComplete"), t3.visibleItems;
        };
        return t3.handlers.searchStart = t3.handlers.searchStart || [], t3.handlers.searchComplete = t3.handlers.searchComplete || [], t3.utils.events.bind(
          t3.utils.getByClass(t3.listContainer, t3.searchClass),
          "keyup",
          t3.utils.events.debounce(function(e3) {
            var r2 = e3.target || e3.srcElement;
            "" === r2.value && !t3.searched || o(r2.value);
          }, t3.searchDelay)
        ), t3.utils.events.bind(
          t3.utils.getByClass(t3.listContainer, t3.searchClass),
          "input",
          function(t4) {
            "" === (t4.target || t4.srcElement).value && o("");
          }
        ), o;
      };
    },
    "./src/sort.js": function(t2) {
      t2.exports = function(t3) {
        var e2 = {
          els: void 0,
          clear: function() {
            for (var r2 = 0, n = e2.els.length; r2 < n; r2++)
              t3.utils.classes(e2.els[r2]).remove("asc"), t3.utils.classes(e2.els[r2]).remove("desc");
          },
          getOrder: function(e3) {
            var r2 = t3.utils.getAttribute(e3, "data-order");
            return "asc" == r2 || "desc" == r2 ? r2 : t3.utils.classes(e3).has("desc") ? "asc" : t3.utils.classes(e3).has("asc") ? "desc" : "asc";
          },
          getInSensitive: function(e3, r2) {
            var n = t3.utils.getAttribute(e3, "data-insensitive");
            r2.insensitive = "false" !== n;
          },
          setOrder: function(r2) {
            for (var n = 0, s = e2.els.length; n < s; n++) {
              var i = e2.els[n];
              if (t3.utils.getAttribute(i, "data-sort") === r2.valueName) {
                var a = t3.utils.getAttribute(i, "data-order");
                "asc" == a || "desc" == a ? a == r2.order && t3.utils.classes(i).add(r2.order) : t3.utils.classes(i).add(r2.order);
              }
            }
          }
        }, r = function() {
          t3.trigger("sortStart");
          var r2 = {}, n = arguments[0].currentTarget || arguments[0].srcElement || void 0;
          n ? (r2.valueName = t3.utils.getAttribute(n, "data-sort"), e2.getInSensitive(n, r2), r2.order = e2.getOrder(n)) : ((r2 = arguments[1] || r2).valueName = arguments[0], r2.order = r2.order || "asc", r2.insensitive = void 0 === r2.insensitive || r2.insensitive), e2.clear(), e2.setOrder(r2);
          var s, i = r2.sortFunction || t3.sortFunction || null, a = "desc" === r2.order ? -1 : 1;
          s = i ? function(t4, e3) {
            return i(t4, e3, r2) * a;
          } : function(e3, n2) {
            var s2 = t3.utils.naturalSort;
            return s2.alphabet = t3.alphabet || r2.alphabet || void 0, !s2.alphabet && r2.insensitive && (s2 = t3.utils.naturalSort.caseInsensitive), s2(e3.values()[r2.valueName], n2.values()[r2.valueName]) * a;
          }, t3.items.sort(s), t3.update(), t3.trigger("sortComplete");
        };
        return t3.handlers.sortStart = t3.handlers.sortStart || [], t3.handlers.sortComplete = t3.handlers.sortComplete || [], e2.els = t3.utils.getByClass(t3.listContainer, t3.sortClass), t3.utils.events.bind(e2.els, "click", r), t3.on("searchStart", e2.clear), t3.on("filterStart", e2.clear), r;
      };
    },
    "./src/templater.js": function(t2) {
      var e2 = function(t3) {
        var e3, r = this, n = function(e4, r2) {
          var n2 = e4.cloneNode(true);
          n2.removeAttribute("id");
          for (var s2 = 0, i2 = r2.length; s2 < i2; s2++) {
            var a2 = void 0, o = r2[s2];
            if (o.data)
              for (var l = 0, u = o.data.length; l < u; l++)
                n2.setAttribute("data-" + o.data[l], "");
            else
              o.attr && o.name ? (a2 = t3.utils.getByClass(n2, o.name, true)) && a2.setAttribute(o.attr, "") : (a2 = t3.utils.getByClass(n2, o, true)) && (a2.innerHTML = "");
          }
          return n2;
        }, s = function() {
          for (var e4 = t3.list.childNodes, r2 = 0, n2 = e4.length; r2 < n2; r2++)
            if (void 0 === e4[r2].data) return e4[r2].cloneNode(true);
        }, i = function(t4) {
          if ("string" == typeof t4) {
            if (/<tr[\s>]/g.exec(t4)) {
              var e4 = document.createElement("tbody");
              return e4.innerHTML = t4, e4.firstElementChild;
            }
            if (-1 !== t4.indexOf("<")) {
              var r2 = document.createElement("div");
              return r2.innerHTML = t4, r2.firstElementChild;
            }
          }
        }, a = function(e4, r2, n2) {
          var s2 = void 0, i2 = (function(e5) {
            for (var r3 = 0, n3 = t3.valueNames.length; r3 < n3; r3++) {
              var s3 = t3.valueNames[r3];
              if (s3.data) {
                for (var i3 = s3.data, a2 = 0, o = i3.length; a2 < o; a2++)
                  if (i3[a2] === e5) return { data: e5 };
              } else {
                if (s3.attr && s3.name && s3.name == e5) return s3;
                if (s3 === e5) return e5;
              }
            }
          })(r2);
          i2 && (i2.data ? e4.elm.setAttribute("data-" + i2.data, n2) : i2.attr && i2.name ? (s2 = t3.utils.getByClass(e4.elm, i2.name, true)) && s2.setAttribute(i2.attr, n2) : (s2 = t3.utils.getByClass(e4.elm, i2, true)) && (s2.innerHTML = n2));
        };
        this.get = function(e4, n2) {
          r.create(e4);
          for (var s2 = {}, i2 = 0, a2 = n2.length; i2 < a2; i2++) {
            var o = void 0, l = n2[i2];
            if (l.data)
              for (var u = 0, c = l.data.length; u < c; u++)
                s2[l.data[u]] = t3.utils.getAttribute(
                  e4.elm,
                  "data-" + l.data[u]
                );
            else
              l.attr && l.name ? (o = t3.utils.getByClass(e4.elm, l.name, true), s2[l.name] = o ? t3.utils.getAttribute(o, l.attr) : "") : (o = t3.utils.getByClass(e4.elm, l, true), s2[l] = o ? o.innerHTML : "");
          }
          return s2;
        }, this.set = function(t4, e4) {
          if (!r.create(t4))
            for (var n2 in e4) e4.hasOwnProperty(n2) && a(t4, n2, e4[n2]);
        }, this.create = function(t4) {
          return void 0 === t4.elm && (t4.elm = e3(t4.values()), r.set(t4, t4.values()), true);
        }, this.remove = function(e4) {
          e4.elm.parentNode === t3.list && t3.list.removeChild(e4.elm);
        }, this.show = function(e4) {
          r.create(e4), t3.list.appendChild(e4.elm);
        }, this.hide = function(e4) {
          void 0 !== e4.elm && e4.elm.parentNode === t3.list && t3.list.removeChild(e4.elm);
        }, this.clear = function() {
          if (t3.list.hasChildNodes())
            for (; t3.list.childNodes.length >= 1; )
              t3.list.removeChild(t3.list.firstChild);
        }, (function() {
          var r2;
          if ("function" != typeof t3.item) {
            if (!(r2 = "string" == typeof t3.item ? -1 === t3.item.indexOf("<") ? document.getElementById(t3.item) : i(t3.item) : s()))
              throw new Error(
                "The list needs to have at least one item on init otherwise you'll have to add a template."
              );
            r2 = n(r2, t3.valueNames), e3 = function() {
              return r2.cloneNode(true);
            };
          } else
            e3 = function(e4) {
              var r3 = t3.item(e4);
              return i(r3);
            };
        })();
      };
      t2.exports = function(t3) {
        return new e2(t3);
      };
    },
    "./src/utils/classes.js": function(t2, e2, r) {
      var n = r("./src/utils/index-of.js"), s = /\s+/;
      Object.prototype.toString;
      function i(t3) {
        if (!t3 || !t3.nodeType)
          throw new Error("A DOM element reference is required");
        this.el = t3, this.list = t3.classList;
      }
      t2.exports = function(t3) {
        return new i(t3);
      }, i.prototype.add = function(t3) {
        if (this.list) return this.list.add(t3), this;
        var e3 = this.array();
        return ~n(e3, t3) || e3.push(t3), this.el.className = e3.join(" "), this;
      }, i.prototype.remove = function(t3) {
        if (this.list) return this.list.remove(t3), this;
        var e3 = this.array(), r2 = n(e3, t3);
        return ~r2 && e3.splice(r2, 1), this.el.className = e3.join(" "), this;
      }, i.prototype.toggle = function(t3, e3) {
        return this.list ? (void 0 !== e3 ? e3 !== this.list.toggle(t3, e3) && this.list.toggle(t3) : this.list.toggle(t3), this) : (void 0 !== e3 ? e3 ? this.add(t3) : this.remove(t3) : this.has(t3) ? this.remove(t3) : this.add(t3), this);
      }, i.prototype.array = function() {
        var t3 = (this.el.getAttribute("class") || "").replace(/^\s+|\s+$/g, "").split(s);
        return "" === t3[0] && t3.shift(), t3;
      }, i.prototype.has = i.prototype.contains = function(t3) {
        return this.list ? this.list.contains(t3) : !!~n(this.array(), t3);
      };
    },
    "./src/utils/events.js": function(t2, e2, r) {
      var n = window.addEventListener ? "addEventListener" : "attachEvent", s = window.removeEventListener ? "removeEventListener" : "detachEvent", i = "addEventListener" !== n ? "on" : "", a = r("./src/utils/to-array.js");
      e2.bind = function(t3, e3, r2, s2) {
        for (var o = 0, l = (t3 = a(t3)).length; o < l; o++)
          t3[o][n](i + e3, r2, s2 || false);
      }, e2.unbind = function(t3, e3, r2, n2) {
        for (var o = 0, l = (t3 = a(t3)).length; o < l; o++)
          t3[o][s](i + e3, r2, n2 || false);
      }, e2.debounce = function(t3, e3, r2) {
        var n2;
        return e3 ? function() {
          var s2 = this, i2 = arguments, a2 = function() {
            n2 = null, r2 || t3.apply(s2, i2);
          }, o = r2 && !n2;
          clearTimeout(n2), n2 = setTimeout(a2, e3), o && t3.apply(s2, i2);
        } : t3;
      };
    },
    "./src/utils/extend.js": function(t2) {
      t2.exports = function(t3) {
        for (var e2, r = Array.prototype.slice.call(arguments, 1), n = 0; e2 = r[n]; n++)
          if (e2) for (var s in e2) t3[s] = e2[s];
        return t3;
      };
    },
    "./src/utils/fuzzy.js": function(t2) {
      t2.exports = function(t3, e2, r) {
        var n = r.location || 0, s = r.distance || 100, i = r.threshold || 0.4;
        if (e2 === t3) return true;
        if (e2.length > 32) return false;
        var a = n, o = (function() {
          var t4, r2 = {};
          for (t4 = 0; t4 < e2.length; t4++) r2[e2.charAt(t4)] = 0;
          for (t4 = 0; t4 < e2.length; t4++)
            r2[e2.charAt(t4)] |= 1 << e2.length - t4 - 1;
          return r2;
        })();
        function l(t4, r2) {
          var n2 = t4 / e2.length, i2 = Math.abs(a - r2);
          return s ? n2 + i2 / s : i2 ? 1 : n2;
        }
        var u = i, c = t3.indexOf(e2, a);
        -1 != c && (u = Math.min(l(0, c), u), -1 != (c = t3.lastIndexOf(e2, a + e2.length)) && (u = Math.min(l(0, c), u)));
        var f, h, d = 1 << e2.length - 1;
        c = -1;
        for (var v, g = e2.length + t3.length, m = 0; m < e2.length; m++) {
          for (f = 0, h = g; f < h; )
            l(m, a + h) <= u ? f = h : g = h, h = Math.floor((g - f) / 2 + f);
          g = h;
          var p = Math.max(1, a - h + 1), y = Math.min(a + h, t3.length) + e2.length, C = Array(y + 2);
          C[y + 1] = (1 << m) - 1;
          for (var b = y; b >= p; b--) {
            var j = o[t3.charAt(b - 1)];
            if (C[b] = 0 === m ? (C[b + 1] << 1 | 1) & j : (C[b + 1] << 1 | 1) & j | (v[b + 1] | v[b]) << 1 | 1 | v[b + 1], C[b] & d) {
              var x = l(m, b - 1);
              if (x <= u) {
                if (u = x, !((c = b - 1) > a)) break;
                p = Math.max(1, 2 * a - c);
              }
            }
          }
          if (l(m + 1, a) > u) break;
          v = C;
        }
        return !(c < 0);
      };
    },
    "./src/utils/get-attribute.js": function(t2) {
      t2.exports = function(t3, e2) {
        var r = t3.getAttribute && t3.getAttribute(e2) || null;
        if (!r)
          for (var n = t3.attributes, s = n.length, i = 0; i < s; i++)
            void 0 !== n[i] && n[i].nodeName === e2 && (r = n[i].nodeValue);
        return r;
      };
    },
    "./src/utils/get-by-class.js": function(t2) {
      t2.exports = function(t3, e2, r, n) {
        return (n = n || {}).test && n.getElementsByClassName || !n.test && document.getElementsByClassName ? (function(t4, e3, r2) {
          return r2 ? t4.getElementsByClassName(e3)[0] : t4.getElementsByClassName(e3);
        })(t3, e2, r) : n.test && n.querySelector || !n.test && document.querySelector ? (function(t4, e3, r2) {
          return e3 = "." + e3, r2 ? t4.querySelector(e3) : t4.querySelectorAll(e3);
        })(t3, e2, r) : (function(t4, e3, r2) {
          for (var n2 = [], s = t4.getElementsByTagName("*"), i = s.length, a = new RegExp("(^|\\s)" + e3 + "(\\s|$)"), o = 0, l = 0; o < i; o++)
            if (a.test(s[o].className)) {
              if (r2) return s[o];
              n2[l] = s[o], l++;
            }
          return n2;
        })(t3, e2, r);
      };
    },
    "./src/utils/index-of.js": function(t2) {
      var e2 = [].indexOf;
      t2.exports = function(t3, r) {
        if (e2) return t3.indexOf(r);
        for (var n = 0, s = t3.length; n < s; ++n) if (t3[n] === r) return n;
        return -1;
      };
    },
    "./src/utils/to-array.js": function(t2) {
      t2.exports = function(t3) {
        if (void 0 === t3) return [];
        if (null === t3) return [null];
        if (t3 === window) return [window];
        if ("string" == typeof t3) return [t3];
        if ((function(t4) {
          return "[object Array]" === Object.prototype.toString.call(t4);
        })(t3))
          return t3;
        if ("number" != typeof t3.length) return [t3];
        if ("function" == typeof t3 && t3 instanceof Function) return [t3];
        for (var e2 = [], r = 0, n = t3.length; r < n; r++)
          (Object.prototype.hasOwnProperty.call(t3, r) || r in t3) && e2.push(t3[r]);
        return e2.length ? e2 : [];
      };
    },
    "./src/utils/to-string.js": function(t2) {
      t2.exports = function(t3) {
        return t3 = (t3 = null === (t3 = void 0 === t3 ? "" : t3) ? "" : t3).toString();
      };
    },
    "./node_modules/string-natural-compare/natural-compare.js": function(t2) {
      "use strict";
      var e2, r, n = 0;
      function s(t3) {
        return t3 >= 48 && t3 <= 57;
      }
      function i(t3, e3) {
        for (var i2 = (t3 += "").length, a = (e3 += "").length, o = 0, l = 0; o < i2 && l < a; ) {
          var u = t3.charCodeAt(o), c = e3.charCodeAt(l);
          if (s(u)) {
            if (!s(c)) return u - c;
            for (var f = o, h = l; 48 === u && ++f < i2; ) u = t3.charCodeAt(f);
            for (; 48 === c && ++h < a; ) c = e3.charCodeAt(h);
            for (var d = f, v = h; d < i2 && s(t3.charCodeAt(d)); ) ++d;
            for (; v < a && s(e3.charCodeAt(v)); ) ++v;
            var g = d - f - v + h;
            if (g) return g;
            for (; f < d; )
              if (g = t3.charCodeAt(f++) - e3.charCodeAt(h++)) return g;
            o = d, l = v;
          } else {
            if (u !== c)
              return u < n && c < n && -1 !== r[u] && -1 !== r[c] ? r[u] - r[c] : u - c;
            ++o, ++l;
          }
        }
        return o >= i2 && l < a && i2 >= a ? -1 : l >= a && o < i2 && a >= i2 ? 1 : i2 - a;
      }
      i.caseInsensitive = i.i = function(t3, e3) {
        return i(("" + t3).toLowerCase(), ("" + e3).toLowerCase());
      }, Object.defineProperties(i, {
        alphabet: {
          get: function() {
            return e2;
          },
          set: function(t3) {
            r = [];
            var s2 = 0;
            if (e2 = t3) for (; s2 < e2.length; s2++) r[e2.charCodeAt(s2)] = s2;
            for (n = r.length, s2 = 0; s2 < n; s2++)
              void 0 === r[s2] && (r[s2] = -1);
          }
        }
      }), t2.exports = i;
    }
  }, e = {};
  return (function r(n) {
    if (e[n]) return e[n].exports;
    var s = e[n] = { exports: {} };
    return t[n](s, s.exports, r), s.exports;
  })("./src/index.js");
})();
window.loadLeverJobs = function(options) {
  options.accountName = options.accountName.toLowerCase();
  var jobsContainer = document.getElementById("lever-jobs-container") || document.body;
  var departmentFilter = options.departmentFilter || null;
  var htmlTagsToReplace = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;"
  };
  function sanitizeForHTML(str) {
    if (str === void 0 || str === null) {
      return "";
    }
    return String(str).replace(/[&<>]/g, function(tag) {
      return htmlTagsToReplace[tag] || tag;
    });
  }
  function sanitizeAttribute(str) {
    if (!str) {
      return "uncategorized";
    }
    return sanitizeForHTML(str).replace(/\s+/gi, "");
  }
  function isDepartmentFilterActive() {
    return departmentFilter && Array.isArray(departmentFilter) && departmentFilter.length > 0;
  }
  function groupPostingsByDepartment(responseData) {
    var departments = [];
    var departmentMap = {};
    for (var i = 0; i < responseData.length; i++) {
      var group = responseData[i];
      if (!group || !group.postings || group.postings.length === 0) continue;
      for (var j = 0; j < group.postings.length; j++) {
        var posting = group.postings[j];
        var teamTitle = posting.categories.team || "Uncategorized";
        var teamKey = sanitizeAttribute(teamTitle);
        var deptTitle = posting.categories.department || "Uncategorized";
        var deptKey = sanitizeAttribute(deptTitle);
        if (departmentMap[deptKey] === void 0) {
          departmentMap[deptKey] = departments.length;
          departments.push({
            department: deptKey,
            departmentTitle: deptTitle,
            teams: [],
            teamMap: {}
          });
        }
        var dept = departments[departmentMap[deptKey]];
        if (dept.teamMap[teamKey] === void 0) {
          dept.teamMap[teamKey] = dept.teams.length;
          dept.teams.push({
            team: teamKey,
            teamTitle,
            postings: []
          });
        }
        dept.teams[dept.teamMap[teamKey]].postings.push(posting);
      }
    }
    departments.sort(function(a, b) {
      var aKey = a.department.toLowerCase();
      var bKey = b.department.toLowerCase();
      if (aKey < bKey) return -1;
      if (aKey > bKey) return 1;
      return 0;
    });
    for (var i = 0; i < departments.length; i++) {
      delete departments[i].teamMap;
    }
    return departments;
  }
  function filterByDepartment(departments) {
    if (!isDepartmentFilterActive()) return departments;
    var filtered = [];
    for (var i = 0; i < departments.length; i++) {
      var dept = departments[i];
      for (var f = 0; f < departmentFilter.length; f++) {
        var filterValue = departmentFilter[f].toLowerCase();
        if (dept.departmentTitle.toLowerCase() === filterValue || dept.department.toLowerCase() === filterValue) {
          filtered.push(dept);
          break;
        }
      }
    }
    return filtered;
  }
  function buildPostingLi(posting, deptTitle) {
    return '<li class="lever-job" data-department="' + deptTitle + '" data-team="' + (posting.categories.team || "") + '" data-location="' + (posting.categories.location || "") + '" data-work-type="' + (posting.categories.commitment || "") + '"><a class="lever-job-title" href="' + posting.hostedUrl + '">' + sanitizeForHTML(posting.text) + '</a><span class="lever-job-tag">' + (sanitizeForHTML(posting.categories.location) || "") + "</span></li>";
  }
  function buildJobHtml(departments) {
    var showDepartmentHeaders = departments.length >= 2;
    var htmlParts = [];
    var jobsOnlyParts = [];
    for (var i = 0; i < departments.length; i++) {
      var dept = departments[i];
      if (showDepartmentHeaders) {
        htmlParts.push(
          '<section class="lever-department" data-department="',
          dept.departmentTitle,
          '"><h3 class="lever-department-title">',
          sanitizeForHTML(dept.departmentTitle),
          "</h3>"
        );
      }
      for (var j = 0; j < dept.teams.length; j++) {
        var team = dept.teams[j];
        htmlParts.push(
          '<ul class="lever-team" data-team="',
          team.teamTitle,
          '"><li><h4 class="lever-team-title">',
          sanitizeForHTML(team.teamTitle),
          "</h4><ul>"
        );
        for (var k = 0; k < team.postings.length; k++) {
          var li = buildPostingLi(team.postings[k], dept.departmentTitle);
          htmlParts.push(li);
          jobsOnlyParts.push(li);
        }
        htmlParts.push("</ul></li></ul>");
      }
      if (showDepartmentHeaders) {
        htmlParts.push("</section>");
      }
    }
    return { full: htmlParts.join(""), jobsOnly: jobsOnlyParts.join("") };
  }
  function createJobs(responseData) {
    if (!responseData) return;
    if (typeof responseData === "string")
      responseData = JSON.parse(responseData);
    var departments = groupPostingsByDepartment(responseData);
    departments = filterByDepartment(departments);
    if (departments.length === 0) {
      jobsContainer.innerHTML = "<p class='lever-no-postings'>No results</p>";
      return;
    }
    var html = buildJobHtml(departments);
    jobsContainer.innerHTML = html.full;
    var newListUl = document.querySelector("#new-list ul");
    if (newListUl) {
      newListUl.innerHTML = html.jobsOnly;
    }
    window.leverDepartmentFilterActive = isDepartmentFilterActive();
    window.dispatchEvent(new Event("leverJobsRendered"));
  }
  var url = "https://api.lever.co/v0/postings/" + options.accountName + "?group=team&mode=json";
  fetch(url).then(function(res) {
    if (!res.ok) throw new Error("Lever API error: " + res.status);
    return res.json();
  }).then(createJobs).catch(function() {
    console.error("Error fetching jobs from Lever API.");
    jobsContainer.innerHTML = "<p class='lever-error'>Error fetching jobs.</p>";
  });
};
window.loadLeverJobs(window.leverJobsOptions);
window.addEventListener("leverJobsRendered", function() {
  if (window.leverDepartmentFilterActive) {
    $(".lever-jobs-filter-departments").hide();
  }
  var options = {
    valueNames: [
      "lever-job-title",
      { data: ["location"] },
      { data: ["department"] },
      { data: ["team"] },
      { data: ["work-type"] }
    ]
  };
  var jobList = new List("new-list", options);
  function collectUniqueValues(items, key) {
    var seen = {};
    var values = [];
    for (var i = 0; i < items.length; i++) {
      var val = items[i]._values[key];
      if (val && !seen[val]) {
        seen[val] = true;
        values.push(val);
      }
    }
    return values.sort();
  }
  function populateDropdown(selector, values) {
    var dropdown = $("#lever-jobs-filter " + selector);
    for (var i = 0; i < values.length; i++) {
      dropdown.append("<option>" + values[i] + "</option>");
    }
  }
  populateDropdown(".lever-jobs-filter-locations", collectUniqueValues(jobList.items, "location"));
  populateDropdown(".lever-jobs-filter-departments", collectUniqueValues(jobList.items, "department"));
  populateDropdown(".lever-jobs-filter-teams", collectUniqueValues(jobList.items, "team"));
  populateDropdown(".lever-jobs-filter-work-types", collectUniqueValues(jobList.items, "work-type"));
  function showFilterResults() {
    $("#new-list .list").show();
    $("#lever-jobs-container").hide();
  }
  function hideFilterResults() {
    $("#new-list .list").hide();
    $("#lever-jobs-container").show();
  }
  function updateNoResultsVisibility() {
    if (jobList.visibleItems.length >= 1) {
      $("#lever-no-results").hide();
    } else {
      $("#lever-no-results").show();
    }
  }
  function getSelectedFilters() {
    return {
      location: $("#lever-jobs-filter select.lever-jobs-filter-locations").val(),
      department: $("#lever-jobs-filter select.lever-jobs-filter-departments").val(),
      team: $("#lever-jobs-filter select.lever-jobs-filter-teams").val(),
      "work-type": $("#lever-jobs-filter select.lever-jobs-filter-work-types").val()
    };
  }
  hideFilterResults();
  $("#lever-jobs-filter select").change(function() {
    var selectedFilters = getSelectedFilters();
    jobList.filter(function(item) {
      var itemValues = item.values();
      for (var key in selectedFilters) {
        var filterValue = selectedFilters[key];
        if (filterValue !== null && itemValues[key] !== filterValue) {
          return false;
        }
      }
      return true;
    });
    updateNoResultsVisibility();
    $("#lever-clear-filters").show();
    showFilterResults();
  });
  $("#new-list").on("click", "#lever-clear-filters", function() {
    jobList.filter();
    if (jobList.filtered == false) {
      hideFilterResults();
    }
    $("#lever-jobs-filter select").prop("selectedIndex", 0);
    $("#lever-clear-filters").hide();
    $("#lever-no-results").hide();
  });
  $("#new-list").on("input", "#lever-jobs-search", function() {
    if ($(this).val().length || jobList.filtered == true) {
      showFilterResults();
      updateNoResultsVisibility();
    } else {
      hideFilterResults();
      $("#lever-no-results").hide();
    }
  });
});
