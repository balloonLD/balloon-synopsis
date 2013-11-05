this["visaRDF"] = this["visaRDF"] || {};
this["visaRDF"]["templates"] = this["visaRDF"]["templates"] || {};

Handlebars.registerPartial("isotopeItemContent", Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n			<h3 class=\"itemContent labelEn ellipsis\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.label),stack1 == null || stack1 === false ? stack1 : stack1.value)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h3>\r\n		";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n			<div class=\"itemContent descriptionEn ellipsis\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.description),stack1 == null || stack1 === false ? stack1 : stack1.value)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n		";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n			<div class=\"itemContent predicate\" style=\"display:none\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.predicate),stack1 == null || stack1 === false ? stack1 : stack1.value)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n                        ";
  options = {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data};
  stack2 = ((stack1 = helpers.predicateLabelRetriver),stack1 ? stack1.call(depth0, depth0.predicate, options) : helperMissing.call(depth0, "predicateLabelRetriver", depth0.predicate, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n		";
  return buffer;
  }
function program6(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n                            <div class=\"itemContent predicateLabel\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.predicate),stack1 == null || stack1 === false ? stack1 : stack1.label)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n                        ";
  return buffer;
  }

  buffer += "		";
  stack1 = helpers['if'].call(depth0, depth0.label, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n		";
  options = {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data};
  stack2 = ((stack1 = helpers.ifLang),stack1 ? stack1.call(depth0, depth0.description, options) : helperMissing.call(depth0, "ifLang", depth0.description, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n		";
  stack2 = helpers['if'].call(depth0, depth0.predicate, {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  return buffer;
  }));

this["visaRDF"]["templates"]["filterOptions"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n				<li><a data-filter-value=\"";
  if (stack1 = helpers.value) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.value; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"";
  if (stack1 = helpers.value) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.value; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.label) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.label; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</a></li>\r\n			";
  return buffer;
  }

  buffer += "	<div class=\"option-combo filter\">\r\n		<h2>Filter:</h2>\r\n		<ul class=\"option-set clearfix\" data-option-key=\"filter\">\r\n			";
  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n		</ul>\r\n	</div>";
  return buffer;
  });

this["visaRDF"]["templates"]["groupDropDown"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      		<option value=";
  if (stack1 = helpers.val) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.val; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + ">";
  if (stack1 = helpers.label) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.label; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</option>\r\n		";
  return buffer;
  }

  buffer += "	<select id=\"GroupDropDown\">\r\n		";
  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n    </select>";
  return buffer;
  });

this["visaRDF"]["templates"]["isotopeItem"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; partials = partials || Handlebars.partials; data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var stack1;
  return escapeExpression(((stack1 = ((stack1 = depth0.type),stack1 == null || stack1 === false ? stack1 : stack1.value)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1));
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n			<h2 class=\"showUri\" style=\"display:none\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.subject),stack1 == null || stack1 === false ? stack1 : stack1.value)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h2>\r\n		";
  return buffer;
  }

  buffer += "	<div class=\"item "
    + escapeExpression(((stack1 = ((stack1 = depth0.subject),stack1 == null || stack1 === false ? stack1 : stack1.token)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " ";
  stack2 = helpers['if'].call(depth0, depth0.type, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += " ";
  if (stack2 = helpers.index) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.index; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">\r\n		";
  stack2 = helpers['if'].call(depth0, depth0.subject, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n		<p class=\"number\" style=\"display:none\">";
  if (stack2 = helpers.index) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.index; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</p>\r\n		";
  stack2 = self.invokePartial(partials.isotopeItemContent, 'isotopeItemContent', depth0, helpers, partials, data);
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n	</div>";
  return buffer;
  });

this["visaRDF"]["templates"]["overlayContent"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n		<h1>";
  if (stack1 = helpers.label) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.label; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h1>\r\n		<div class=\"innerScroll\">\r\n			<div></div>\r\n		</div>\r\n	";
  return buffer;
  }

  buffer += "	";
  stack1 = helpers['if'].call(depth0, depth0.label, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer;
  });

this["visaRDF"]["templates"]["overlayItem"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "		<div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.cssClass),stack1 == null || stack1 === false ? stack1 : stack1.overlay)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.cssClass),stack1 == null || stack1 === false ? stack1 : stack1.overlay)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "_";
  if (stack2 = helpers.index) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.index; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">\r\n			<span class=\"close\">close</span>\r\n			<div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.cssClass),stack1 == null || stack1 === false ? stack1 : stack1.overlayContent)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n			</div>\r\n		</div>";
  return buffer;
  });

this["visaRDF"]["templates"]["plugin"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "		<div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.cssClass),stack1 == null || stack1 === false ? stack1 : stack1.overlay)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.cssClass),stack1 == null || stack1 === false ? stack1 : stack1.overlay)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "_";
  if (stack2 = helpers.index) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.index; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">\r\n			<span class=\"close\">close</span>\r\n			<div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.cssClass),stack1 == null || stack1 === false ? stack1 : stack1.overlayContent)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n			</div>\r\n		</div>";
  return buffer;
  });

this["visaRDF"]["templates"]["previewItem"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "		<div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.cssClass),stack1 == null || stack1 === false ? stack1 : stack1.preview)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.cssClass),stack1 == null || stack1 === false ? stack1 : stack1.preview)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "_";
  if (stack2 = helpers.index) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.index; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">\r\n			<div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.cssClass),stack1 == null || stack1 === false ? stack1 : stack1.previewContent)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n			</div>\r\n		</div>";
  return buffer;
  });

this["visaRDF"]["templates"]["sortOptions"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "";
  buffer += "\r\n				<li><a data-sort-value=\""
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "\" class=\""
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "\">"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</a></li>\r\n			";
  return buffer;
  }

  buffer += "	<div class=\"option-combo sorter\">\r\n		<h2>Sort:</h2>\r\n		<ul class=\"option-set clearfix\" data-option-key=\"sortBy\">\r\n			";
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data};
  stack2 = ((stack1 = helpers.keysEach),stack1 ? stack1.call(depth0, depth0, options) : helperMissing.call(depth0, "keysEach", depth0, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n		</ul>\r\n	</div>";
  return buffer;
  });;/**
* VisaRDF is a JQuery Plugin for RDF visualization.
* 
* @module VisaRDF
* @main Plugin
**/

// safety net for unclosed plugins and/or chained functions
;
(function($, window, document, undefined) {

    // get global vars
    var $window = $(window);

    // ========================= VisaRDF Constants ===============================
    var cons = {
        
        // Part of CSS class to indicate a filterable
        "TYPE_TAG" : "-filter-_",

        // Part of CSS class to indicate a token
        "TOKEN_TAG" : "token_",

        // CSS classes to use
        "CSS_CLASSES" : {
            outerContainer : "outerContainer",
            viewContainer : "container",
            options : "options",
            clearfix : "clearfix",
            loader : "loading",
            preview : "preview",
            previewItem : "preview-item",
            previewContent : "previewContent",
            overlay : "overlay",
            overlayContent : "overlayContent",
            typeClasses : {
                incoming : "incoming",
                outgoing : "outgoing"
            },
            patternClasses : {
                uri : "uri",
                literal : "literal",
                blanknode : "blank"
            },
            toToken : function(id) {
                var idChain = id.split("."), it = this;
                for ( var i = 0; i < idChain.length; i++) {
                    it = it[idChain[i]];
                }
                return cons.TOKEN_TAG + it;
            },
            toType : function(id) {
                var idChain = id.split("."), it = this;
                for ( var i = 0; i < idChain.length; i++) {
                    it = it[idChain[i]];
                }
                return cons.TYPE_TAG + it;
            },
            toSelector : function(id) {
                var idChain = id.split("."), it = this;
                for ( var i = 0; i < idChain.length; i++) {
                    it = it[idChain[i]];
                }
                return "." + it;
            }
        },

        // Placeholder in query strings
        "DUMMY" : "#replaceMe#",
        
        // Event types for Pub/Sub system
        "EVENT_TYPES" : {
            storeModified : {
                insert : "dataInsert"
            },
            labelUpdate : "labelUpdate",
            loading : {
                loadingDone : "loadingDone",
                loadingStart : "loadingStarted"
            }
        },

        "MESSAGES" : {
            error : {
                ajax : "Error on loading data.",
                remote : "Error on loading remote data.",
                template : "Error on loading template data.",
                tokenType : "Unkown token type of item."
            }
        }
    };

    // ========================= Extend Isotope ===============================

    // Extend Isotope - groupRows custom layout mode
    // Modified Version of
    // http://isotope.metafizzy.co/custom-layout-modes/category-rows.html
    $.extend($.Isotope.prototype, {

        _groupRowsReset : function() {
            this.groupRows = {
                x : 0,
                y : 0,
                height : 0,
                currentGroup : null
            };
        },

        _groupRowsLayout : function($elems) {
            var instance = this, containerWidth = this.element.width(), sortBy = this.options.sortBy, props = this.groupRows;

            $elems.each(function() {
                var $this = $(this), atomW = $this.outerWidth(true), atomH = $this.outerHeight(true), group = $.data(this, 'isotope-sort-data')[sortBy];

                if (group !== props.currentGroup) {
                    // new group, new row
                    props.x = 0;
                    props.height += props.currentGroup ? instance.groupRows.gutter : 0;
                    props.y = props.height;
                    props.currentGroup = group;

                } else if (props.x !== 0 && atomW + props.x > containerWidth) {

                    // if this item cannot fit in the current row
                    props.x = 0;
                    props.y = props.height;
                }

                $this.find(".groupLabel").remove();
                // label for new group
                if (group !== '') {
                    var prefix = group.split("_")[0] + "_";
                    var groups = group.split(prefix), divBox = "<div class='groupLabel'>";
                    for ( var i = 1; i < groups.length; i++) {
                        divBox += groups[i];
                    }
                    divBox += "</div>";
                    $this.append(divBox);
                }

                // position the atom
                instance._pushPosition($this, props.x, props.y);

                props.height = Math.max(props.y + atomH, props.height);
                props.x += atomW;
            });
        },

        _groupRowsGetContainerSize : function() {
            return {
                height : this.groupRows.height
            };
        },

        _groupRowsResizeChanged : function() {
            return true;
        }

    });

    // ========================= JQuery custom selectors ===============================
    /**
    * class JQuery custom selectors
    * @class VisaRDF_JQuery_Custom
    **/

    /**
    * JQuery custom class prefix selector.
    *
    * @method class-prefix
    * @param {} elem 
    * @param {} index 
    * @param {} match 
    */
    $.expr[':']['class-prefix'] = function(ele, index, match) {
        var prefix = match[3];

        if (prefix) {
            var sel = '[class^="' + prefix + '"], [class*=" ' + prefix + '"]';
            return $(ele).is(sel);
        } else {
            return true;
        }
    };

    /**
    * JQuery custom regex selector. (modified the version of James Padolsey - http://james.padolsey.com/javascript/regex-selector-for-jquery/)
    *
    * @method regex
    * @param {} elem 
    * @param {} index 
    * @param {} match 
    */
    $.expr[':'].regex = function(elem, index, match) {
        var matchParams = match[3].split(','), validLabels = /^(data|css):/, attr = {
            method : matchParams[0].match(validLabels) ? matchParams[0].split(':')[0] : 'attr',
            property : matchParams.shift().replace(validLabels, '')
        }, regexFlags = 'ig', regex;
        try {
            regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g, ''), regexFlags);
        } catch (e) {
            return false;
        }
        return regex.test(jQuery(elem)[attr.method](attr.property));
    };

    // ========================= VisaRDF class private utility functions ===============================
    /**
    * class private utility functions
    * @class VisaRDF_GLOBAL_UTIL
    **/

    /**
    * Checks if given variable is undenfined or null.
    *
    * @method isUndefinedOrNull
    * @param {Object} a Variable to check
    * @return {Boolean} Returns true on success
    */
    function isUndefinedOrNull(a) {
        return ((typeof a === "undefined") || (a === null));
    }

    /**
    * Replace the DUMMY constants of given query with the given replacementstring.
    *
    * @method replaceDummy
    * @param {String} query Query to work with
    * @param {String} replacement String to replace the cons.DUMMY of given query
    * @return {String} Returns the query with replaced DUMMY constants
    */
    function replaceDummy(query, replacement) {
        return query.replace(new RegExp(cons.DUMMY, "g"), replacement);
    }

    /**
    * Gets the current window size of the browser.
    *
    * @method getWindowSize
    * @param {Boolean} withoutScrollbar Flag to assign if the scrollbar should be considered
    * @return {Object} Object which contains the width and the height of the window.
    */
    function getWindowSize(withoutScrollbar) {
        var w = null, h = null;
        if (withoutScrollbar) {
            if ($('BODY').hasClass('noscroll')) {
                w = $window.width(), h = $window.height();
            } else {
                $('BODY').addClass('noscroll');
                w = $window.width(), h = $window.height();
                $('BODY').removeClass('noscroll');
            }
        } else {
            w = $window.width(), h = $window.height();
        }
        return {
            width : w,
            height : h
        };
    }

    /**
    * Gets the clip data of given type of div box
    *
    * @method getClip
    * @param {String} name CSS name as defined in cons.CSS_CLASSES of given div box
    * @return {Object} Rectangle Object / Clip data
    */
    function getClip(name) {
        var winsize;
        switch (name) {
            case cons.CSS_CLASSES.overlay:
                winsize = getWindowSize(true);
                return 'rect(0px ' + winsize.width + 'px ' + winsize.height + 'px 0px)';
                break;
            case cons.CSS_CLASSES.preview:
                winsize = getWindowSize(false);
                return 'rect(' + winsize.height * 0.25 + 'px ' + winsize.width * 0.75 + 'px ' + winsize.height * 0.75 + 'px ' + winsize.width * 0.25 + 'px)';
                break;
            default:
                console.log("No clip data found.");
                return "";
        }
    }

    /**
    * Gets the layoutprop of given item
    *
    * @method getItemLayoutProp
    * @param {$item} $item JQuery item
    * @return {Object} Object which contains the layoutprops
    */
    function getItemLayoutProp($item) {
        var scrollT = $window.scrollTop(), scrollL = $window.scrollLeft(), itemOffset = $item.offset();
        return {
            left : itemOffset.left - scrollL,
            top : itemOffset.top - scrollT,
            width : $item.outerWidth(),
            height : $item.outerHeight()
        };
    }

    /**
    *  Get browser dependent event names. (Uses Modernizr)
    *
    * @method getTransEndEventName
    * @return {String} TransitionEnd event name of the current browser
    */
    function getTransEndEventName() {
        var transEndEventNames = {
            'WebkitTransition' : 'webkitTransitionEnd',
            'MozTransition' : 'transitionend',
            'OTransition' : 'oTransitionEnd',
            'msTransition' : 'MSTransitionEnd',
            'transition' : 'transitionend'
        };
        // transition end event name
        return transEndEventNames[Modernizr.prefixed('transition')];
    }
    
    // ========================= VisaRDF: RemoteEngine Class ==============================
    /**
    * Class to provide a function for SPARQL querying of the service located at the given url. YQL is used to fetch the queryresults.
    *
    * @class RemoteEngine
    * @constructor
    */
    var RemoteEngine = function() {
        
        var counter = 0;
        
        // This function uses YQL to give a SPARQL query to a remote service. Accepts a query, the adress of the service and a callback function to run.
        this._requestSPARQLCrossDomain = function(query, url, callback) {

            var that = this, success = false, cnt = counter++;
            
            // Use cnt to stop callbackoverwriting on simultan calls
            window["cbFunc"+cnt] = function(data, textStatus, jqXHR) {

                // If we have something to work with...
                if (data && data.query && data.query.results) {
                    success = true;
                    callback(data.query.results.sparql.result, success);
                }

                // Else, Maybe we requested a site that doesn't exist, and
                // nothing returned.
                else
                    console.log('Nothing returned from getJSON.');
                callback(null, success);
                
                // Delete old callbackfunction
                window["cbFunc"+cnt] = undefined;
            };

            // If no query was passed, exit.
            if (!query) {
                alert('No query was passed.');
            }

            // Take the provided url, and add it to a YQL query. Make sure you
            // encode it!
            var yql = 'http://query.yahooapis.com/v1/public/yql?q='
            + encodeURIComponent('use "http://triplr.org/sparyql/sparql.xml" as sparql; select * from sparql where query="' + query + '" and service="'
                + url) + '"&format=json&callback=cbFunc' + cnt;

            // Request that YSQL string, and run a callback function.
            // Pass a defined function to prevent cache-busting.
            // $.getJSONP(yql, cbFunc);
            $.ajax({
                dataType : 'jsonp',
                url : yql,
                success : window.cbFunc,
                error : function(jqXHR, textStatus, errorThrown) {
                    // console.log(yql);
                    console.log("Error on yql query.");
                    // console.log(textStatus);
                    // console.log(jqXHR);
                    console.log(errorThrown);
                    callback(null, success);
                }
            });
        };
        
    }
    
    /**
    * Method for querying the given url with given query. Executes given callback function with results.
    *
    * @method executeQuery
    * @param {String} query Query to execute
    * @param {String} url URL of service to execute the query on
    * @param {Function} callback Callback function to be executed with query results
    */
    RemoteEngine.prototype.executeQuery = function(query, url, callback) {
        this._requestSPARQLCrossDomain(query, url, callback);
    }
        
    // ========================= Cache class ===============================
    /**
    * This class defines a cache.
    *
    * @class Cache
    * @constructor
    */
    var Cache = function() {
        this.array = [];
    };
    
    /**
    * Adds the key and value to the cache.
    *
    * @method add
    * @param {String} key Key to map to the value
    * @param {String} val Value to add to the cache
    */
    Cache.prototype.add = function(key, val) {
        this.array[key] = val;
    };
    
    /**
    * Retrives the to the key correspondending value
    *
    * @method retrieve
    * @param {String} key Key to map to the value
    * @return {String} Value to which the key maps
    */
    Cache.prototype.retrieve = function(key) {
        return this.array[key];
    };


    /**
    * Check if the cache contains a value for the given key
    *
    * @method contains
    * @param {String} key Key to map to the value
    * @return {Boolean} true if cache contains a value for the given key
    */
    Cache.prototype.contains = function(key) {
        return key in this.array;
    }

    // ========================= Variables for all VisaRDF instances ===============================
    /**
    * class public functions
    * @class VisaRDF_GLOBAL
    **/

    // Deferred to inform if the plugin was already initialized once
    var globalInitDfd = $.Deferred(),

    // Name of the plugin
    pluginName = "visaRDF",

    // rdf store instance(SPARQL endpoint)
    rdfStore,
    
    // remoteEngine for remote queries
    remoteEngine = new RemoteEngine(),
    
    // rdf store instance(SPARQL endpoint)
    eventManagers = [],
    
    // cache for predicate labels
    labelCache = new Cache(),

    // transition end event name
    transEndEventName = getTransEndEventName(),
    // transitions support available?
    supportTransitions = Modernizr.csstransitions,

    //namespaces variable with defaultnamespaces
    namespaces = {
        'rdf' : 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
        'rdfs' : 'http://www.w3.org/2000/01/rdf-schema#',
        'owl' : 'http://www.w3.org/2002/07/owl#',
        'rif' : 'http://www.w3.org/2007/rif#',
        'foaf' : 'http://xmlns.com/foaf/0.1/',
        'dbpedia' : 'http://dbpedia.org/resource/',
        'dbpedia-owl' : 'http://dbpedia.org/ontology/',
        'dbpprop' : 'http://dbpedia.org/property/',
        'geo' : 'http://www.w3.org/2003/01/geo/wgs84_pos#',
        'dc' : 'http://purl.org/dc/terms/'
    },

    // handlebars templates for the plugin
    templates = {},

    // Counter for plugin ids
    idCounter = 0;

    // Returns a unique PluginID
    /**
    * Generate an ID for the plugin.
    *
    * @method generateId
    * @return {Integer} ID of the plugin
    */
    function generateId() {
        return idCounter++;
    };
    
    // ========================= VisaRDF: eventManager Class ==============================
    /**
    * Class to manage eventHandlers
    *
    * @class Plugin.EventManager
    * @constructor
    * @param {jQuery} stdObject Default object for adding of eventHandlers
    */
    Plugin.EventManager = function(stdObject) {
        if (!stdObject) {
            console.log("EventManager not created")
            return false;
        }    
        this.stdObject = stdObject;
        
        // History of event handler bindings
        this._evHandlerHistory = {};
    }
   
    /**
    * Add an event handler to given object. Save it in the history for cleanup purposes.  
    *
    * @method addEventHandler
    * @param {String} eventType Type of the event as defined in cons
    * @param {Function} handler Eventhandler function to trigger on event
    * @param {String} object Object to add the eventhandler to
    * @param {String} id ID to add to the eventhandler
    */
    Plugin.EventManager.prototype.addEventHandler = function(eventType, handler, object, id) {
        var that = this;
        if (object === undefined) {
            object = that.stdObject;
        }
        if (that._evHandlerHistory[eventType] === undefined) {
            that._evHandlerHistory[eventType] = [];
        }
        that._evHandlerHistory[eventType].push({
            "id" : id,
            "object" : object,
            "handler" : handler
        });
        object.on(eventType, handler);
    }
    
    /**
    * Remove an event handler from given object and history. Removal by id is possible.
    *
    * @method removeEventHandler
    * @param {String} eventType Type of the event as defined in cons
    * @param {Function} id ID of the eventHandler to be removed
    * @param {String} object Object to remove the eventhandler from
    */
    Plugin.EventManager.prototype.removeEventHandler = function(eventType, id, object) {
        var that = this;
        $.each(that._evHandlerHistory[eventType], function(i, val) {
            if (id === val.id) {
                if (object !== undefined) {
                    if ($.data(val.object) === $.data(object)) {
                        val.object.off(eventType, val.handler);

                        // Stop each on find
                        return false;
                    }
                } else {

                    // Else delete all entries with id
                    val.object.off(eventType, val.handler);
                }
            }
        });
    }
   
    /**
    * Trigger the event with given parameters on given object.
    *
    * @method trigger
    * @param {String} eventType Type of the event as defined in cons
    * @param {Object} param Array of parameters to give to the triggered function
    * @param {String} object Object to trigger the event on
    */
    Plugin.EventManager.prototype.trigger = function(eventType, param, object) {
        if(object) {
            object.trigger(eventType, param);
        } else {
            this.stdObject.trigger(eventType, param);
        }
    }
    
    /**
    * Destroy this event manager and all his event handlers.
    *
    * @method destroy
    */
    Plugin.EventManager.prototype.destroy = function() {
        $.each(this._evHandlerHistory, function(eventType, binding) {
            $.each(binding, function(i, val) {
                val.object.off(eventType, val.handler);
            });
        });
    }

    // ========================= VisaRDF: rdfStore Class ==============================
    /**
    * Class to wrap and create a rdfStore Object. Default: rdfstore-js https://github.com/antoniogarrote/rdfstore-js
    *
    * @class Plugin.RdfStore
    * @constructor
    * @param {Object} options Options object for the rdf store
    * @param {Function} callback Callback function to execute after class creation
    */
    Plugin.RdfStore = function(options, callback) {
        var that = this;
        this._store = null;

        // Prefixes for SPARQL queries
        this._queryPrefixes = "";

        this._generateQueryPrefix = function(prefix, uri) {
            that._queryPrefixes += "PREFIX " + prefix + ": <" + uri + "> ";
        };

        $.each(namespaces, function(i, val) {
            that._generateQueryPrefix(i, val);
        });

        //Init rdfstore-js
        new rdfstore.Store(options, function(store) {
            that._store = store;
            callback();
        });
    };

    /**
    * Inserts given data in the store
    *
    * @method insertData
    * @param {String} data Data to insert into the store
    * @param {String} dataFormat Format of given data
    * @param {Function} callback Callback function to be called after loading in the store.
    */
    Plugin.RdfStore.prototype.insertData = function(data, dataFormat, callback) {
        var that = this;

        if (dataFormat === "text/turtle" || dataFormat === "text/plain" || dataFormat === "text/n3") {
            // get prefix terms and update namespaces
            var prefixTerms = data.match(/.*@prefix.*>(\s)*./g);
            $.each(prefixTerms, function(i, val) {
                var prefixTerm = (val.split(/>(\s)*./)[0]).split(/:(\s)*</);
                var prefix = prefixTerm[0].replace(/@prefix(\s)*/, "");
                var uri = prefixTerm[2];
                if (isUndefinedOrNull(namespaces[prefix])) {
                    namespaces[prefix] = uri;
                    that._generateQueryPrefix(prefix, uri);
                }
            });
        } else if (dataFormat === "application/ld+json" || dataFormat === "application/json") {
            var prefixes = data["@context"];
            $.each(prefixes, function(i, val) {
                if (isUndefinedOrNull(namespaces[prefix])) {
                    namespaces[i] = val;
                    that._generateQueryPrefix(i, val);
                }
            });
        }

        this._store.load(dataFormat, data, function(store) {
            callback();
        });
    };

    /**
    * Executes given query on the store
    *
    * @method executeQuery
    * @param {String} query Data to insert into the store
    * @param {Function} callback Callback function to be called with the results of the execution.
    * @param {Function} fail Callback function to be called if the execution fails.
    */
    Plugin.RdfStore.prototype.executeQuery = function(query, callback, fail) {
        this._store.execute(this._queryPrefixes + query, function(success, results) {
            if (success) {
                callback(results);
            } else {
                console.log("Error on executing: " + query);
                fail();
            }
        });
    };
        
    // ========================= VisaRDF: LayoutEngine Class ==============================
    /**
    * Layout engine to add items to. Default: jQuery.isotope http://isotope.metafizzy.co/
    *
    * @class Plugin.LayoutEngine
    * @constructor
    * @param {jQuery} container    Container to use the layout engine on
    * @param {Object} options    Options object for the layout engine
    */
    Plugin.LayoutEngine = function(container, options) {
        this._container = container;
        container.isotope(options);
    }

    /**
    * Adds items to the layout engine
    *
    * @method add
    * @param {jQuery} items Div boxes which are to be added
    * @param {Function} callback Callback function
    */
    Plugin.LayoutEngine.prototype.add = function(items, callback) {
        this._container.isotope("insert", items, callback);
    };
        
    /**
    * Repaint the layout of the div boxes
    *
    * @method reLayout
    */
    Plugin.LayoutEngine.prototype.reLayout = function() {
        this._container.isotope("reLayout");
    };
        
    /**
    * Remove items from the layout engine
    *
    * @method remove
    * @param {jQuery} items Div boxes which are to be removed
    * @param {Function} callback Callback function
    */
    Plugin.LayoutEngine.prototype.remove = function(items, callback) {
        this._container.isotope("remove", items, callback);
    };
        
    /**
    * Update the sort data of the layout engine on specified items
    *
    * @method updateSortData
    * @param {item} item Items for which sort data should be updated
    */
    Plugin.LayoutEngine.prototype.updateSortData = function(item) {
        this._container.isotope("updateSortData", item);
    };
        
    /**
    * Update the options of the layout engine
    *
    * @method updateSortData
    * @param {Object} options Options object of the layout engine
    */
    Plugin.LayoutEngine.prototype.updateOptions = function(options) {
        this._container.isotope(options);
    };
        
    // ========================= VisaRDF: View Class ==================================
    /**
    * View of the RDF graph
    *
    * @class Plugin.View
    * @constructor
    * @param {jQuery} $container    Parent div container
    * @param {Object} options      Options object of the view
    * @param {Plugin} plugin        Parent plugin
    * @param {Object} queries   Queries to use in the view
    */
    Plugin.View = function($container, options, plugin, queries) {
        
        // List of added items.
        this._itemHistory = {
            length : 0
        };

        this._literalHistory = {
            length : 0
        };
        this.previews = [];
        this.viewQueries = queries;
        this.$container = $container;
        this.plugin = plugin;
        this.options = options;
        this.$outerContainer = $('<div class="' + cons.CSS_CLASSES.outerContainer + '"></div>');
        this.$viewContainer = $('<div class="' + cons.CSS_CLASSES.viewContainer + '"></div>');

        this.$container.append(this.$outerContainer);
        this.$outerContainer.append(this.$viewContainer);
        
        this.layoutEngine = new Plugin.LayoutEngine(this.$viewContainer, options.layoutEngine);
        
        this.$optionsContainer = $('<section class="' + cons.CSS_CLASSES.options + '" class="' + cons.CSS_CLASSES.clearfix + '"></section>')
        $container.prepend(this.$optionsContainer);
        console.log(this.$optionsContainer)

        if (options.generateSortOptions) {
            this.generateSorter();
        }
        if (options.generateFilterOptions) {
            this.generateFilter();
        }
        
        var that = this;
        
        // <---- loading img ---->
        that.$outerContainer.prepend('<div class="' + cons.CSS_CLASSES.loader + '">');
        that.$outerContainer.append('<div class="' + cons.CSS_CLASSES.loader + '">');

        // Add loading start listener
        eventManagers[plugin.pluginID].addEventHandler(cons.EVENT_TYPES.loading.loadingStart, function(ev, $invoker) {
            // console.log(this);
            if ($invoker === that) {
                if (that.$outerContainer.css("height") < 120) {
                    that.$outerContainer.css("height", "20px");
                }
                that.$outerContainer.find('> ' + cons.CSS_CLASSES.toSelector("loader")).css("visibility", "visible");
            }
        });

        // Add loading done listener
        eventManagers[plugin.pluginID].addEventHandler(cons.EVENT_TYPES.loading.loadingDone, function(ev, $invoker) {
            if ($invoker === that) {
                that.$outerContainer.find('> .loading').text('');
                that.$outerContainer.find('> ' + cons.CSS_CLASSES.toSelector("loader")).css("visibility", "hidden");
            }
        });
        // <!--- loading img ---->

        /**
        * Initializes the browsability of the given items
        *
        * @private
        * @method _initBrowsability
        * @param {jQuery} $items Items which should be browsable
        */
        this._initBrowsability = function($items) {
            $items.each(function() {
                var $item = $(this);
                var color = new RGBColor(that.options.itemStyle.colors[$item.data("index") % that.options.itemStyle.colors.length]);
                $item.css("background-color", "rgba(" + color.r + ", " + color.g + ", " + color.b + " ,1)");
                if (that.options.usePreviews) {
                    if (that.options.previewAsOverlay) {
                        // <---- item click event ---->
                        eventManagers[plugin.pluginID].addEventHandler('click', function(e) {
                            if(that.previews[$item.index()] === undefined) {
                                that.previews[$item.index()] = new Plugin.PreviewOverlay(that, $item);
                            }
                            that.previews[$item.index()].open();
                        }, $item);
                    // <!--- item click event ---->
                    } else {
                        // <---- item click event ---->ä
                        eventManagers[plugin.pluginID].addEventHandler('click', function(e) {
                            if(that.previews[$item.index()] === undefined) {
                                that.previews[$item.index()] = new Plugin.PreviewInlay(that, $item);
                            }
                            that.previews[$item.index()].open();
                        }, $item);
                    //that._addItemClickEvent($item, supportTransitions, transEndEventName);
                    // <!--- item click event ---->
                    }
                } else {
                    eventManagers[plugin.pluginID].addEventHandler('click', function() {
                        plugin.addView(new Plugin.DetailView(that.$container, that.options, that.plugin, this));
                    }, $item);
                //that._addPreviewClickEvent($item, supportTransitions, transEndEventName);
                }
            });
        }
        
        /**
        * Fetches and updates the predicate labels of the shown items
        *
        * @private
        * @method _fetchPredicateLabel
        * @param {jQuery} $items Items which should be updated
        */
        this._fetchPredicateLabel = function($item) {
            
            var predicate = {};
            
            var $predicate = $item.find("> .predicate");
            var $predicateLabel = $item.find("> .predicateLabel");
            
            //Show full URI on mouse enter
            $predicateLabel.on("mouseenter", function(){
                $predicate.css("display", "inline-block");
                $predicateLabel.css("display", "none");
                
                //TODO Clean fontresizing
                $.each($predicate, function(i, item){
                    var $item = $(item);
                    var $fakeDiv = $("<div class='widthCalc'>");
                    $fakeDiv.css("font-size", $item.css("font-size"));
                    $fakeDiv.css("position", "absolute");
                    $fakeDiv.css("visibility", "hidden");
                    $fakeDiv.css("width", "auto");
                    $fakeDiv.css("height", "auto");
                    $fakeDiv.text($item.text());
                    $container.append($fakeDiv);
                    
                    var done = false;
                    var counter = 0;
                    while (!done) {
                        $fakeDiv.css("font-size", $item.css("font-size"));
                        counter++;
                        if ($fakeDiv.width() < $item.width() || counter == 100) {
                            done = true;
                        } else {
                            $item.css("font-size", (parseFloat($item.css("font-size"))-0.1) + "px");
                        }
                    }
                    
                })
            });
            
            //Show label on mouse leave
            $predicate.on("mouseleave", function(){
                $predicate.css("display", "none");
                $predicateLabel.css("display", "inline-block");
            })
            
            predicate.value = $predicate.text();
            
            if (predicate.value != "") {

                if (!labelCache.contains(predicate.value)) {
                    var labelQuery = replaceDummy(plugin._queries.label, predicate.value);
                
                    rdfStore.executeQuery(labelQuery, function(results){
                        if (results && results[0]) {
                            $.each(results, function(i, result){
                                predicate.label = result.label.value;
                                labelCache.add(predicate.value, predicate.label);
                                $predicateLabel.text(predicate.label);
                            });
                        } else if (that.options.remoteOptions.remoteLabels) {
                                
                            // Fetch label by remote query
                            $.each(that.options.remoteOptions.remoteLabelBackend, function(i, val) {
                                remoteEngine.executeQuery(labelQuery, val, function(results, success) {
                                    if (success && results && results[0]) {
                                        $.each(results, function(i, result){
                                            if(result.label.language == "en" || result.label.language == undefined) {
                                                predicate.label = result.label.value;
                                                labelCache.add(predicate.value, predicate.label);
                                                $predicateLabel.text(predicate.label);
                                            }
                                        });
                                    }
                                });
                            });
                            
                        }
                    });
                } else {
                    predicate.label = labelCache.retrieve(predicate.value);
                    console.log("Cached label " + predicate.label);
                    $predicateLabel.text(predicate.label);
                }
            }
        }
        
        //Helper for batch adding
        this._addItemsHelp = function(items, batchSize) {
            var rest = items.slice(batchSize);
            if (rest.length > 0) {
                that.addItems(rest);
            } else {
                eventManagers[that.plugin.pluginID].trigger(cons.EVENT_TYPES.loading.loadingDone, that, that.$container);
            }
        }
        
        /**
        * Generate item to be added to the view
        *
        * @private
        * @method _generateItem
        * @param {Object} item Data of the item
        * @param {jQuery} $tempDiv Temporary item selection
        */
        this._generateItem = function(item, $tempDiv) {
            // If item isn't a literal or blank node add it
            var currentUri = item.subject.value;

            // If item isn't already created, create it
            if (!(currentUri in that._itemHistory)) {
                if (item.label) {

                    // Only subjects with labels in english
                    // or undefined language
                    if (item.label.lang === undefined || item.label.lang === "en") {

                        item.index = (that._itemHistory.length++) + that._literalHistory.length;
                                                
                        var $item = $(templates.isotopeItem(item));
                        $item.css({
                            width : this.options.itemStyle.dimension.width,
                            height : this.options.itemStyle.dimension.height
                        });
                        $item.css("background-color", "rgba(125, 125, 125 ,0.2)");

                        $item.data("uri", currentUri);
                        $item.data("index", item.index);

                        // Save added item in history
                        that._itemHistory[currentUri] = item;
                        
                        this._fetchPredicateLabel($item);
                        
                        $tempDiv.append($item);
                    }
                }
            } else {

                // Check for item update
                var update = false;
                $.each(item, function(j, val) {
                    if (val !== null) {
                        if (that._itemHistory[currentUri][j] === null) {
                            that._itemHistory[currentUri][j] = val;
                            update = true;
                        }
                    }
                });
                
                //TODO Same predicate

                // Update element if needed
                if (update) {

                    // If element isn't already added we
                    // need to
                    // remove it from the temporary Divbox
                    $tempDiv.remove("." + that._itemHistory[currentUri].index);

                    // If element is already added we need
                    // to
                    // remove it from isotope
                    that.layoutEngine.remove($(that.$container).find("." + that._itemHistory[currentUri].index));

                    var $updatedItem = $(templates.isotopeItem(that._itemHistory[currentUri]));
                    $updatedItem.css({
                        width : this.options.itemStyle.dimension.width,
                        height : this.options.itemStyle.dimension.height
                    });
                    $updatedItem.css("background-color", "rgba(125, 125, 125 ,0.2)");
                    
                    $updatedItem.data("uri", currentUri);
                    $updatedItem.data("index", that._itemHistory[currentUri].index);
                    $tempDiv.append($updatedItem);
                }
            }
        }
        
        /**
        * Generate literal to be added to the view
        *
        * @private
        * @method _generateLiteral
        * @param {Object} literal Data of the literal
        * @param {jQuery} $tempDiv Temporary item selection
        */
        this._generateLiteral = function(literal, $tempDiv) {
            if (!(literal.predicate.value in that._literalHistory)) {
                that._literalHistory[literal.predicate.value] = [];
                
                literal.index = that._literalHistory.length++ + that._itemHistory.length;
                                        
                var $literal = $(templates.isotopeItem(literal));
                
                $literal.css({
                    width : this.options.literalStyle.dimension.width,
                    height : this.options.literalStyle.dimension.height
                });
                var color = new RGBColor(that.options.literalStyle.colors[literal.index % that.options.literalStyle.colors.length]);
                $literal.css("background-color", "rgba(" + color.r + ", " + color.g + ", " + color.b + " ,1)");
                                        
                that._literalHistory[literal.predicate.value].push(literal.subject.value);
                
                this._fetchPredicateLabel($literal);
                
                $tempDiv.append($literal);

            } else {
                if ($.inArray(literal.subject.value, that._literalHistory[literal.predicate.value]) === -1) {
                //TODO Other value same predicate?
                } else {
                    // console.log(context[i]);
                    // console.log(context.view._literalHistory)
                    console.log("duplicated literal found");
                }
            }
        }
        
        /**
        * Generate blanknode to be added to the view
        *
        * @private
        * @method _generateBlanknode
        */
        this._generateBlanknode = function() {
            //TODO Blanknodes
            console.log("TODO blanknode");
        }
    }
    
    /**
    * Generate sort interface
    *
    * @method generateSorter
    */
    Plugin.View.prototype.generateSorter = function() {
        // Add sortoptions
        var that = this;
        var sortData = $.extend({}, this.options.layoutEngine.getSortData);
        delete sortData["group"];
        var sortOptions = templates.sortOptions(sortData);
        this.$optionsContainer.prepend(sortOptions);
        var $sorter = this.$optionsContainer.find(' > .sorter');

        // Set selected on view
        $sorter.find('.' + this.options.layoutEngine.sortBy).addClass("selected");
        var $sortLinks = this.$optionsContainer.find('a');

        $sorter.append(templates.groupDropDown({
            type : {
                label : "type",
                val : cons.TYPE_TAG
            },
            token : {
                label : "node-type",
                val : cons.TOKEN_TAG
            }
        }));
        var $sorterGroup = $sorter.find('#GroupDropDown');

        // Add onChange
        $sorterGroup.change(function(e) {

            // get href attribute, minus the '#'
            var groupBy = $(this).val();

            that.$container.find('.sorter > > > .selected').removeClass('selected');
            that.layoutEngine.updateOptions({
                getSortData : {
                    group : function($elem) {
                        var classes = $elem.attr("class");
                        var pattern = new RegExp("(\s)*[a-zA-Z0-9]*" + groupBy + "[a-zA-Z0-9]*(\s)*", 'g');
                        var groups = classes.match(pattern), group = "";
                        if (groups !== null) {
                            for ( var i = 0; i < groups.length; i++) {
                                group += groups[i] + " ";
                            }
                        }
                        return group;
                    }
                }
            });
            that.layoutEngine.updateSortData(that.$viewContainer.find(".item"));
            that.$container.find("> > .groupLabel").remove();
            that.layoutEngine.updateOptions({
                layoutMode : 'groupRows',
                sortBy : "group"
            });
            return false;
        });

        // Add onClick
        $sortLinks.click(function() {
            // get href attribute, minus the '#'
            var sortName = $(this).attr('data-sort-value');
            $sorterGroup.val("Group by...");
            that.$optionsContainer.find('.sorter > > > .selected').removeClass("selected");
            that.$container.find("> > .groupLabel").remove();
            $(this).addClass("selected");
            that.layoutEngine.updateOptions({
                layoutMode : 'masonry',
                sortBy : sortName
            });
            return false;
        });
    }
    
    /**
    * Generate filter interface
    *
    * @method generateFilter
    */
    Plugin.View.prototype.generateFilter = function() {
        // Add options
        var that = this;
        var filterOptions = templates.filterOptions(that.options.filterBy);
        this.$optionsContainer.append(filterOptions);

        var $filter = this.$optionsContainer.find(' > .filter');
        var $filterLinks = $filter.find('a');

        // Add onClick
        $filterLinks.click(function() {
            // get href attribute, minus the '#'
            var selector = $(this).attr('data-filter-value');
            if (selector !== '*') {
                selector = "." + cons.TYPE_TAG + selector;
            }
            that.$container.find('.filter > > > .selected').removeClass('selected');
            $(this).addClass('selected');
            that.layoutEngine.updateOptions({
                filter : selector
            });
            return false;
        });

        $filter.append('<input id="filterField" type="text" size="25" value="Enter search here.">');
        var $filterBox = $filter.find('#filterField');

        // Add onKey
        $filterBox.keyup(function(e) {

            // get href attribute, minus the '#'
            var selector = $(this).val();
            if (selector !== '') {
                if (selector !== '*') {
                    if (that.options.supportRegExpFilter) {
                        try {
                            selector = "div:regex(class, " + selector + "), div > div:contains(" + selector + ")";
                        } catch (e) {
                            selector = "div > div:contains(" + selector + ")";
                        }
                    } else {
                        selector = "div > div:contains(" + selector + ")";
                    }
                }
            } else {
                selector = '*';
            }

            that.$container.find('.filter > > > .selected').removeClass('selected');
            that.layoutEngine.updateOptions({
                filter : selector
            });
            return false;
        });
    }
    
    /**
    * Update the view by querying the local store
    *
    * @method update
    */
    Plugin.View.prototype.update = function() {
        var that = this, emptyResults = true;
        eventManagers[that.plugin.pluginID].trigger(cons.EVENT_TYPES.loading.loadingStart, that, that.$container);
        
        
        rdfStore.executeQuery("CONSTRUCT { ?s rdfs:label ?o . ?s1 rdfs:description ?o1 . ?s2 rdfs:comment ?o2 . ?s3 rdfs:type ?o3} WHERE { ?s rdfs:label ?o . OPTIONAL { ?s1 rdfs:description ?o1 } . OPTIONAL { ?s2 rdfs:comment ?o2 }. OPTIONAL {?s3 rdfs:type ?o3}}", function(results) {
            console.log(results);
        } );
        
        for ( var i = 0; i < this.viewQueries.length; i++) {
            rdfStore.executeQuery(this.viewQueries[i].query, function(results) {
                if (results && results.length !== 0) {
                    emptyResults = false;
                    if (that.viewQueries[i].type) {
                        // Add types for filtering
                        for ( var j = 0; j < results.length; j++) {
                            results[j].type = {
                                value : that.viewQueries[i].type
                            };
                        }
                    }
                    that.addItems(results);
                } else if (i === that.viewQueries.length - 1 && emptyResults) {
                    eventManagers[that.plugin.pluginID].trigger(cons.EVENT_TYPES.loading.loadingDone, that, that.$container);
                }
            });
        }
    },
    
    /**
    * Add given items to the view.
    *
    * @method addItems
    * @param {jQuery} items Items which are to be added to the view
    */
    Plugin.View.prototype.addItems = function(items) {
        var length = items.length, that = this, batchSize = ((length < that.options.batchSize) ? length : that.options.batchSize);

        this.$outerContainer.find('> .loading').text(parseInt(batchSize / length * 100) + "% -");

        // current batch
        var batch = items.slice(0, batchSize);

        var $tempItemContainer = $("<div>");
        var $tempLiteralContainer = $("<div>");
        
        $.each(batch, function(i, val) {
            val.subject.token = cons.TOKEN_TAG + val.subject.token;
            if (val.label) {
                val.label.value = unescape(val.label.value);
            }
            switch (val.subject.token) {

                case cons.CSS_CLASSES.toToken("patternClasses.uri"):
                    that._generateItem(val, $tempItemContainer);
                    break;
                case cons.CSS_CLASSES.toToken("patternClasses.literal"):
                    // use literal value as label on literals
                    val.label = val.subject;
                    if (val.label) {
                        val.label.value = unescape(val.label.value);
                    }
                    that._generateLiteral(val, $tempLiteralContainer);
                    break;
                case  cons.CSS_CLASSES.toToken("patternClasses.blanknode"):
                    that._generateBlanknode(val);
                    break;
                default :
                    console.log(cons.MESSAGES.error.tokenType);
            }
        });
        var $items = $tempItemContainer.children();
        var $literals = $tempLiteralContainer.children();
        var $allNodes = $().add($items).add($literals);
        that.layoutEngine.add($allNodes, function(){
            that._initBrowsability($items);
        });
        
                        
        that._addItemsHelp(items, batchSize);
    }
    
    /**
    * Clear the view
    *
    * @method removeAllItems
    */
    Plugin.View.prototype.removeAllItems = function() {
        var that = this;
        that.layoutEngine.remove($(".item"), function() {
            that._itemHistory = {
                length : 0
            };
            that._literalHistory = {};
            console.log("view cleared");
        });
    }
        
    // ========================= VisaRDF: InitView Class ==============================
    /**
    * Initialization view of the plugin
    *
    * @class Plugin.InitView
    * @extends  Plugin.View
    * @constructor
    * @param {jQuery} $container    Container of the initialization view
    * @param {Object} options    Options object
    * @param {Plugin} plugin    The parent plugin of the initialization view
    */
    Plugin.InitView = function($container, options, plugin) {
        Plugin.View.call(this, $container, options, plugin, plugin.options.initQueries);
    }
        
    //pseudo class inheritance of Preview
    Plugin.InitView.prototype =  Object.create(Plugin.View.prototype);
    Plugin.InitView.prototype.constructor = Plugin.InitView;
    
    // ========================= VisaRDF: DetailView Class ==============================
    /**
    * Detailed view of an subject / item
    *
    * @class Plugin.DetailView
    * @extends  Plugin.View
    * @constructor
    * @param {jQuery} $container    Container of the detail view
    * @param {Object} options    Options object
    * @param {Plugin} plugin    The parent plugin of the detail view
    * @param {jQuery} item    Item to get the detail view from
    */
    Plugin.DetailView = function($container, options, plugin, item) {
        var that = this;
        this.$item = $(item);
        this.uri = this.$item.find('.showUri').html();
        this.plugin = plugin;
        
        var $overlay = $container.find(cons.CSS_CLASSES.toSelector("overlay") + '_' + that.$item.index());
        if ($overlay.length < 1) {
            var overlay = templates.overlayItem({
                "index" : that.$item.index(),
                "cssClass" : {
                    "overlay" : cons.CSS_CLASSES.overlay,
                    "overlayContent" : cons.CSS_CLASSES.overlayContent
                }
            });
            $container.append(overlay);
            $overlay = $container.find('> ' + cons.CSS_CLASSES.toSelector("overlay") + '_' + that.$item.index());
        }
        
        // <---- close click Event ---->
        var $overlayContent = $overlay.find('> ' + cons.CSS_CLASSES.toSelector("overlayContent")), $close = $overlay.find('> span.close');
        eventManagers[that.plugin.pluginID].addEventHandler('click', function() {
            that.close();
        }, $close);
        // <!--- close click Event ---->
       
        var subjectOfQuery = replaceDummy(plugin._queries.selectSubjectOf, this.uri), objectOfQuery = replaceDummy(plugin._queries.selectObjectOf, this.uri);
        var queries = [];
        queries.push({
            query : subjectOfQuery, 
            type : cons.CSS_CLASSES.toType("typeClasses.outgoing")
        });
        queries.push({
            query : objectOfQuery, 
            type : cons.CSS_CLASSES.toType("typeClasses.incoming")
        });
        
        // Input for the handlebar
        // template
        var input = {};
        input.label = that.$item.find('.labelEn').text();
        // write new data
        $overlayContent.append($(templates.overlayContent(input)));
        
        var newViewOptions = $.extend(true, {}, options, {
            layoutEngine : {
                itemSelector : '.item',
                getSortData : {
                    type : function($elem) {
                        var classes = $elem.attr("class");
                        return classes;
                    },
                    group : function($elem) {
                        var classes = $elem.attr("class");
                        var pattern = new RegExp("(\s)*[a-zA-Z0-9]*" + cons.TOKEN_TAG + "[a-zA-Z0-9]*(\s)*", 'g');
                        var groups = classes.match(pattern), group = "";
                        for ( var i = 0; i < groups.length; i++) {
                            group += groups[i] + " ";
                        }
                        return group;
                    }
                }
            },
            filterBy : [ {
                value : "*",
                label : "showAll"
            }, {
                value : cons.CSS_CLASSES.typeClasses.incoming,
                label : "in"
            }, {
                value : cons.CSS_CLASSES.typeClasses.outgoing,
                label : "out"
            } ]
        });
        
        Plugin.View.call(this, $overlayContent.find('.innerScroll'), newViewOptions, plugin, queries);
        
        this.$overlay = $overlay;
        this.$overlayContent = $overlayContent;

        // Init content of given full view overlay.
        this._initOverlayContent = function($overlay, callback) {
            
            that.update();
            
            if (that.options.remoteOptions.remoteDynamically) {
                that.loadByRemote();
            }

            // console.log($item.find('.showUri').html());

            rdfStore.executeQuery(subjectOfQuery, function(subjectOf) {
                rdfStore.executeQuery(objectOfQuery, function(objectOf) {

                    var resultSet = $.merge($.merge([], subjectOf), objectOf);
                    
                    that.addItems(resultSet);
                });
            });

            // Set contet color
            var color = new RGBColor(that.$item.css("background-color"));
            $overlay.css("background-color", color.toRGB());
            $.each($overlayContent.children('div'), function(i, val) {
                color.r -= 10;
                color.b -= 10;
                color.g -= 10;
                $(val).css("background", color.toRGB());
            });

            // Set content width
            $overlayContent.find('> .overlayColumn').css("width", 100 + "%");

            // Set innerScrollBox width and height
            $overlayContent.find('.innerScroll').css("width",
                ($window.width() - parseInt($overlay.css("padding-left")) - parseInt($overlay.css("padding-right"))) + "px");
            $overlayContent.find('.innerScroll').css("height", $window.height() * 0.95 + "px");

            callback();
        }

        // Fill overlay with content
        that._initOverlayContent($overlay, function() {
            // <---- overlay show function ---->
            var previewClip = getClip(cons.CSS_CLASSES.preview), overlayClip = getClip(cons.CSS_CLASSES.overlay);

            // Make overlay visible
            $overlay.css({
                clip : supportTransitions ? previewClip : overlayClip,
                opacity : 1,
                zIndex : 9999,
                pointerEvents : 'auto'
            });

            if (supportTransitions) {
                $overlay.on(transEndEventName, function() {

                    $overlay.off(transEndEventName);

                    setTimeout(function() {
                        $overlay.css('clip', overlayClip).on(transEndEventName, function() {
                            $overlay.off(transEndEventName);
                            plugin.$body.addClass('noscroll');
                        });
                    }, 25);

                });
            } else {
                plugin.$body.addClass('noscroll');
            }
        // <!--- overlay show function ---->
        });

    }
    
    //pseudo class inheritance of Preview
    Plugin.DetailView.prototype =  Object.create(Plugin.View.prototype);
    Plugin.DetailView.prototype.constructor = Plugin.DetailView;

    /**
    * Load children by remote service
    *
    * @method loadByRemote
    */
    Plugin.DetailView.prototype.loadByRemote  = function() {
                
        var that = this;
        
        if(!that.remoteDataLoader) {
            that.remoteDataLoader = new Plugin.RemoteDataLoader(that.options.remoteOptions.remoteBackend, that.plugin.pluginID);
        }
        
        // Get items who are in a relation to
        // current item
        var remoteSubjectOf = replaceDummy(
            that.plugin._queries.remoteSubjectOf, that.uri), remoteObjectOf = replaceDummy(that.plugin._queries.remoteObjectOf, that.uri);
        
        //remote needed?
        if (that.options.remoteOptions.remoteDynamically) {
            that.remoteDataLoader.insertByQuery(remoteSubjectOf + " LIMIT " + that.options.remoteOptions.remoteLimit);
            that.remoteDataLoader.insertByQuery(remoteObjectOf + " LIMIT " + that.options.remoteOptions.remoteLimit);
        }
    }

    /**
    * Closes the view
    *
    * @method close
    */
    Plugin.DetailView.prototype.close = function() {
        var that = this;
            
        // clear old data
        that.plugin.removeView(that);
        that.$overlayContent.children().remove('');

        var layoutProp = getItemLayoutProp(that.$item), itemClip = 'rect(' + layoutProp.top + 'px ' + (layoutProp.left + layoutProp.width) + 'px '
        + (layoutProp.top + layoutProp.height) + 'px ' + layoutProp.left + 'px)';

        that.$overlay.css({
            clip : itemClip,
            opacity : 1,
            pointerEvents : 'none'
        });

        // <---- overlay hide ---->

        if (supportTransitions) {
            that.$overlay.on(transEndEventName, function() {
                that.$overlay.off(transEndEventName);
                setTimeout(function() {
                    that.$overlay.css('opacity', 0).on(transEndEventName, function() {
                        that.$overlay.off(transEndEventName).css({
                            clip : 'auto',
                            zIndex : -1
                        });
                        that.$item.data('isExpanded', false);
                    });
                }, 25);

            });
        } else {
            that.$overlay.css({
                opacity : 0,
                zIndex : -1
            });
        }
    // <!--- overlay hide ---->
    }

    // ========================= VisaRDF: View Class ==============================
    /**
    * Preview of an item in a view
    *
    * @class Plugin.Preview
    * @constructor
    * @param {Array} parentView    Parent view of the preview
    * @param {jQuery} $item    Item to get the preview of
    */
    Plugin.Preview = function(parentView, $item) {
        this.parentView = parentView;
        this.$item = $item;
    };

    /**
    * Closes the preview
    *
    * @method close
    */
    Plugin.Preview.prototype.close = function() {
        this.$preview.data('isShown', false);
    }
    
    /**
    * Opens the preview
    *
    * @method open
    */
    Plugin.Preview.prototype.open = function() {
        this.$preview.data('isShown', true);
    }

    /**
    * On click function to be triggered
    *
    * @method click
    */
    Plugin.Preview.prototype.click = function() {
        if (!this.$item.data('isExpanded')) {
            this.$item.data('isExpanded', true);
            this.parentView.plugin.addView(new Plugin.DetailView(this.parentView.$container, this.parentView.options, this.parentView.plugin, this.$item));
        }
    }

    // ========================= VisaRDF: PreviewOverlay Class ==============================
    /**
    * Preview as an Overlay of an item in a view
    *
    * @class Plugin.PreviewOverlay
    * @extends  Plugin.Preview
    * @constructor
    * @param {Array} parentView    Parent view of the preview
    * @param {jQuery} $item    Item to get the preview of
    */
    Plugin.PreviewOverlay = function(parentView, $item) {
        Plugin.Preview.call(this, parentView, $item);
        var that = this;
        var preview = templates.previewItem({
            "index" : this.$item.index(),
            "cssClass" : {
                "preview" : cons.CSS_CLASSES.preview,
                "previewContent" : cons.CSS_CLASSES.previewContent
            }
        });
        parentView.$container.append(preview);
        this.$preview = parentView.$container.find('> ' + cons.CSS_CLASSES.toSelector("preview") + '_' + $item.index());
        this.$preview.css('background-color', $item.css('background-color'));
        this.$previewContent = this.$preview.children(cons.CSS_CLASSES.toSelector("previewContent"));
        this.$previewContent.text("" + $item.find('.labelEn > div').html());
    };
        
    //pseudo class inheritance of Preview
    Plugin.PreviewOverlay.prototype =  Object.create(Plugin.Preview.prototype);
    Plugin.PreviewOverlay.prototype.constructor = Plugin.PreviewOverlay;

    /**
    * On click function to be triggered
    *
    * @method click
    * @extends Plugin.Preview.click
    */
    Plugin.PreviewOverlay.prototype.click = function() {
        
        //call super
        Plugin.Preview.prototype.click.call(this);

        // <---- hide preview and deactivate transitions
        // ---->
        this.close();
    // <!--- hide preview and deactivate transitions
    // ---->
    }
     
    /**
    * Opens the preview
    *  
    * @method open
    * @extends Plugin.Preview.open
    */
    Plugin.PreviewOverlay.prototype.open = function(supportTransitions, transEndEventName) {
        var that = this;
        
        if (!this.$preview.data('isShown')) {
            
            var layoutProp = getItemLayoutProp(that.$item), itemClip = 'rect(' + layoutProp.top + 'px ' + (layoutProp.left + layoutProp.width) + 'px '
            + (layoutProp.top + layoutProp.height) + 'px ' + layoutProp.left + 'px)', previewClip = getClip(cons.CSS_CLASSES.preview);

            // Make preview visible
            that.$preview.css({
                clip : supportTransitions ? itemClip : previewClip,
                opacity : 1,
                zIndex : 9998,
                pointerEvents : 'auto'
            });

        
            // <---- Add event on window click ---->
            eventManagers[that.parentView.plugin.pluginID].addEventHandler('dblclick', function() {
                that.close();
                eventManagers[that.parentView.plugin.pluginID].removeEventHandler('dblclick', "previewOverlayClose");
            }
            , $window, "previewOverlayClose");
        
            // <!--- Add event on window click ---->
    
            // <---- preview click Event ---->
            eventManagers[that.parentView.plugin.pluginID].addEventHandler('click', function() {
                that.click();
                eventManagers[that.parentView.plugin.pluginID].removeEventHandler('click', "previewOverlayClick");
            }, that.$preview, "previewOverlayClick");
        // <!--- preview click Event ---->
        }
        Plugin.Preview.prototype.open.call(this);
    }

    /**
    * Closes the preview
    *  
    * @method close
    * @extends Plugin.Preview.close
    */
    Plugin.PreviewOverlay.prototype.close = function() {
        
        var that = this;
        
        //call super
        Plugin.Preview.prototype.close.call(this);
            
        var layoutProp = getItemLayoutProp(this.$item), itemClip = 'rect(' + layoutProp.top + 'px ' + (layoutProp.left + layoutProp.width) + 'px '
        + (layoutProp.top + layoutProp.height) + 'px ' + layoutProp.left + 'px)';

        this.$preview.css({
            opacity : 1,
            pointerEvents : 'none',
            clip : itemClip
        });

        if (supportTransitions) {
            that.$preview.on(transEndEventName, function() {
                that.$preview.off(transEndEventName);
                setTimeout(function() {
                    that.$preview.css('opacity', 0).on(transEndEventName, function() {
                        that.$preview.off(transEndEventName).css({
                            clip : 'auto',
                            zIndex : -1
                        });
                    });
                }, 25);

            });
        } else {
            that.$preview.css({
                opacity : 0,
                zIndex : -1
            });
        }
    };
    
    // ========================= VisaRDF: PreviewInlay Class ==============================
    /**
    * Preview as inlay change of given item in a view
    *
    * @class Plugin.PreviewInlay
    * @extends  Plugin.Preview
    * @constructor
    * @param {Array} parentView    Parent view of the preview
    * @param {jQuery} $item    Item to get the preview of
    */
    Plugin.PreviewInlay = function(parentView, $item) {
        Plugin.Preview.call(this, parentView, $item);
        this.$preview = this.$item;
    };
        
    //pseudo class inheritance of Preview
    Plugin.PreviewInlay.prototype = Object.create(Plugin.Preview.prototype);
    Plugin.PreviewInlay.prototype.constructor = Plugin.PreviewInlay;

    /**
    * Opens the preview
    *
    * @method open
    * @extends Plugin.Preview.open
    */
    Plugin.PreviewInlay.prototype.open = function() {
        var that = this;
        if (!this.$preview.data('isShown')) {

            var newWidth, newHeight;

            // get Isotope instance
            // var isotopeInstance =
            // that._$viewContainer.data('isotope');

            newWidth = that.parentView.$viewContainer.width() - 100;
            newHeight = $window.height() - 100;

            this.$item.addClass(cons.CSS_CLASSES.previewItem);
            this.$item.css({
                "width" : newWidth,
                "height" : newHeight
            });

            //            var previewQuery = replaceDummy(that.parentView.plugin._queries.previewQuery, this.$item.data("uri"));
            //
            //            rdfStore.executeQuery(previewQuery, function(data) {
            //                var content = templates.isotopeItemContent(data[0]);
            //                this.$item.find(".itemContent").remove();
            //                this.$item.append(content);
            //            });
            that.parentView.layoutEngine.reLayout();
                                
            eventManagers[that.parentView.plugin.pluginID].trigger('closePreview');
                                
            // <---- Add close event ---->
            eventManagers[that.parentView.plugin.pluginID].addEventHandler('closePreview', function() {
                that.close();
                eventManagers[that.parentView.plugin.pluginID].removeEventHandler('closePreview', "previewOverlayClose");
                eventManagers[that.parentView.plugin.pluginID].removeEventHandler('click', "previewOverlayClick");
            }
            , $window, "previewOverlayClose");
        
            // <!--- Add close event ---->
    
            // <---- preview click Event ---->
            eventManagers[that.parentView.plugin.pluginID].addEventHandler('click', function() {
                that.click();
                eventManagers[that.parentView.plugin.pluginID].trigger('closePreview');
                eventManagers[that.parentView.plugin.pluginID].removeEventHandler('click', "previewOverlayClick");
            }, that.$preview, "previewOverlayClick");
        // <!--- preview click Event ---->
        }
            
        Plugin.Preview.prototype.open.call(this);
    }

    /**
    * On click function to be triggered
    *
    * @method click
    * @extends Plugin.Preview.click
    */
    Plugin.PreviewInlay.prototype.click = function() {
        Plugin.Preview.prototype.click.call(this);
    }

    /**
    * Closes the preview
    *  
    * @method close
    * @extends Plugin.Preview.close
    */
    Plugin.PreviewInlay.prototype.close = function() {
        var that = this;
        that.$item.css({
            "width" : that.parentView.options.itemStyle.dimension.width,
            "height" : that.parentView.options.itemStyle.dimension.height
        });
        that.parentView.layoutEngine.reLayout();
        Plugin.Preview.prototype.close.call(this);
    }

    // ========================= VisaRDF: TemplatesLoader Class ==============================
    /**
    * Handlebars templates loader to load precompiled or nonprecompiled templates
    *
    * @class Plugin.TemplatesLoader
    * @constructor
    * @param {Deferred Object} dfd    Deferred Object to resolve when loading is done
    */
    Plugin.TemplatesLoader = function(dfd) {
        this._templateInitDfd = dfd;
        this._neededTemps = [ "filterOptions", "sortOptions", "isotopeItem", "groupDropDown", "overlayContent", "overlayItem", "previewItem" ];

        this._methodIsLoaded = function(/* array of templatenames which must be loaded */) {
            var i = 0, methodName;
            while ((methodName = arguments[0[i++]])) {
                if (typeof templates[methodName] != 'function') {
                    return false;
                }
            }
            return true;
        };
    };

    Plugin.TemplatesLoader.prototype._isLoaded = function() {
        if (this._methodIsLoaded(this._neededTemps)) {
            this._templateInitDfd.resolve();
        } else {
            console.log(cons.MESSAGES.error.template);
            this._templateInitDfd.rejected();
        }
    };

    Plugin.TemplatesLoader.prototype.extractByFile = function(path) {
        // Get external template file
        var _that = this;
        $.get(path, function(data) {
            var $fakeDiv = $("<div>");
            $fakeDiv.append(data);

            $fakeDiv.children().each(function(i, val) {
                var partial = (val.id.indexOf("par_") !== -1);
                if (partial) {
                    val.id = val.id.slice(4);
                }
                templates[val.id] = Handlebars.compile($(val).html());
                if (partial) {
                    Handlebars.registerPartial(val.id, $(val).html());
                }
            });
            _that._isLoaded();
        }, "html");
    };

    Plugin.TemplatesLoader.prototype.checkPrecompiled = function() {
        templates = window["visaRDF"]["templates"];
        this._isLoaded();
    };
    
    // ========================= VisaRDF: RemoteDataLoader Class ==============================
    /**
    * Loader to load remote data from services at the given urls and add them to the view
    *
    * @class Plugin.RemoteDataLoader
    * @constructor
    * @param {Array} sites    Array of URLs of SPARQL services to query
    * @param {Integer} pluginID    ID of parten plugin
    */
    Plugin.RemoteDataLoader = function(sites, pluginID) {
        this.sites = sites;
        this.pluginID = pluginID;
        
        // Inserts Data by querying given service
        this._insertDataByQuery = function (query, site, callback) {
        
            // Execute selection query
            remoteEngine.executeQuery(query, site, function(data){
            
                // Generate insertionQuery out of the resultset.
                if (data) {
                    if (data.subject !== undefined) {
                        data = [ data ];
                    }
                    var insertionQuery = "INSERT DATA {";
                    $.each(data, function(i, val) {
                        if (val.subject === undefined) {
                            console.log("Resultset disfigured.");
                        } else if (val.subject.type === "uri") {
                            insertionQuery += "<" + val.subject.value + "> ";
                        } else {
                            // TODO BlankNodes
                            insertionQuery += "<" + val.subject.value + "> ";
                        }
                        insertionQuery += "<" + val.predicate.value + "> ";
                        if (val.object.type === "uri") {
                            insertionQuery += "<" + val.object.value + ">. ";
                        } else if (val.object.type === "literal") {
                            insertionQuery += '"' + escape(val.object.value) + '". ';
                        }
                        if (val.labelSub) {
                            insertionQuery += '<' + val.subject.value + '> rdfs:label "' + val.labelSub.value + '". ';
                        // console.log('<' + val.subject.value + '>
                        // rdfs:label "' + val.labelSub.value + '".
                        // ');
                        }
                        if (val.labelObj) {
                            insertionQuery += '<' + val.object.value + '> rdfs:label "' + val.labelObj.value + '". ';
                        // console.log('<' + val.object.value + '>
                        // rdfs:label "' + val.labelObj.value + '".
                        // ');
                        }
                    });
                    insertionQuery += "}";

                    // Execute insertion
                    rdfStore.executeQuery(insertionQuery, function() {
                        if(callback) {
                            callback(true);
                        }
                    });
                } else {
                    if(callback) {
                        callback(false);
                    }
                }
            });
        }
    }
    
    // Inserts Data by querying all services
    Plugin.RemoteDataLoader.prototype.insertByQuery = function(query) {
        var that = this;
         
        // Inform the plugin something is loading
        eventManagers[that.pluginID].trigger(cons.EVENT_TYPES.loading.loadingStart, that);
        
        $.each(that.sites, function(i, val){
            that._insertDataByQuery(query, val, function(success){
                // Inform the plugin loading is done
                eventManagers[that.pluginID].trigger(cons.EVENT_TYPES.loading.loadingDone, that);
                if(success) {
                    // Inform the plugin that the store has been modified
                    eventManagers[that.pluginID].trigger(cons.EVENT_TYPES.storeModified.insert, that);
                }
            });
        });
    };

    // ========================= visaRDF ===============================
    
    // Plugin constructor
    /**
    * Main plugin class of VisaRDF
    *
    * @class Plugin
    * @constructor
    * @param {jQuery} obj    Parent object of the plugin
    * @param {Object} options    Options for the plugin
    */

    // Default options
    /**
    Default options for visaRDF.

    @property defaults 
    @type Object
    **/
    var defaults = {
        /**
        Raw RDF data given on plugin startup. This data will be loaded into the store.

        @property defaults.data 
        @type String
        @default undefined
        **/
        data : undefined,
        
        /**
        Path to file with Raw RDF data given on plugin startup. This file will be parsed
        and loaded into the store.

        @property defaults.dataLoc
        @type String
        @default undefined
        **/
        dataLoc : undefined,
        
        /**
        Format of the RDF data which is given on plugin startup.

        @property defaults.dataFormat 
        @type String
        @default undefined
        **/
        dataFormat : undefined,
        
        /**
        Flag to activate the usage of precompiled handlebars templates.

        @property defaults.templatesPrecompiled 
        @type Boolean
        @default true
        **/
        templatesPrecompiled : true,
        
        /**
        Path of the html file which can be used to load handlebars templates dynamically.

        @property defaults.templatesPath 
        @type String
        @default "templates_wrapped/templates.html"
        **/
        templatesPath : "templates_wrapped/templates.html",
        /**
        SPARQL resultset which can be used to insert data into the store on init.

        @property defaults.sparqlData 
        @type Object
        @default undefined
        **/
        sparqlData : undefined,
        
        /**
        Query/queries to use for the initialization view of the plugin.

        @property defaults.initQueries
        @type Object
        @default [ { query : "SELECT ?subject ?label ?description ?type WHERE { ?subject rdfs:label ?label . OPTIONAL { ?subject rdfs:description ?description } . OPTIONAL { ?subject rdfs:comment ?description }. OPTIONAL {?subject rdfs:type ?type}}" } ]
        **/
        initQueries : [ {
            query : "SELECT ?subject ?label ?description ?type WHERE { ?subject rdfs:label ?label . OPTIONAL { ?subject rdfs:description ?description } . OPTIONAL { ?subject rdfs:comment ?description }. OPTIONAL {?subject rdfs:type ?type}}"
        } ],

        /**
        Options for the rdf store class. Uses rdfstore-js https://github.com/antoniogarrote/rdfstore-js options structure.

        @property defaults.rdfstoreOptions 
        @type Object
        **/
        rdfstoreOptions : {
            persistence : true,
            name : '',
            overwrite : true,
            engine : '',
            engineData : {
                mongoDomain : '',
                mongoPort : '',
                mongoOptions : {}
            }
        },
        
        /**
        Options for the VisaRDF views.

        @property defaults.viewOptions 
        @type Object
        **/
        viewOptions : {
            
            /**
            Flag to indicate whether the sort interface should be generated.

            @property defaults.viewOptions.generateSortOptions
            @type Boolean
            @default true
            **/
            generateSortOptions : true,
            
            /**
            Flag to indicate whether previews should be used.

            @property defaults.viewOptions.generateSortOptions
            @type Boolean
            @default true
            **/
            usePreviews : false,
            
            /**
            Flag to indicate which kind of previews should be used. The plugin uses inlay previews on false.

            @property defaults.viewOptions.previewAsOverlay
            @type Boolean
            @default false
            **/
            previewAsOverlay : false,
            
            /**
            Flag to indicate whether the filter interface should be generated.

            @property defaults.viewOptions.generateFilterOptions
            @type Boolean
            @default true
            **/
            generateFilterOptions : true,
            
            /**
            Batch size of items which can be loaded simultaniosly in the view-

            @property defaults.viewOptions.batchSize
            @type Integer
            @default 25
            **/
            batchSize : 25,
            
            /**
            Flag to indicate whether the filter should use regular expressions.

            @property defaults.viewOptions.supportRegExpFilter
            @type Boolean
            @default true
            **/
            supportRegExpFilter : true,
            
            /**
            Default filter to be added to the filter interface.

            @property defaults.viewOptions.generateSortOptions
            @type Object
            @default [ { value : "*", label : "showAll" } ]
            **/
            filterBy : [ {
                value : "*",
                label : "showAll"
            } ],
            
            /**
            Options for remote loading of data.

            @property defaults.viewOptions.remoteOptions
            @type Object
            **/
            remoteOptions : {
                
                /**
                Default remote load query. Used on insertRemoteData() if no query parameter is given.

                @property defaults.viewOptions.remoteOptions.defaultRemoteQuery
                @type String
                @default "SELECT ?subject ?predicate ?object { BIND( rdfs:label as ?predicate) ?subject ?predicate ?object. ?subject a <http://dbpedia.org/ontology/Place> . ?subject <http://dbpedia.org/property/rulingParty> ?x } LIMIT 500"
                **/
                defaultRemoteQuery : "SELECT ?subject ?predicate ?object { BIND( rdfs:label as ?predicate) ?subject ?predicate ?object. ?subject a <http://dbpedia.org/ontology/Place> . ?subject <http://dbpedia.org/property/rulingParty> ?x } LIMIT 500",
                
                /**
                Backend services to query on remote loading.

                @property defaults.viewOptions.remoteOptions.remoteBackend
                @type Array
                @default ["http://zaire.dimis.fim.uni-passau.de:8080/bigdata/sparql"]
                **/
                remoteBackend : ["http://zaire.dimis.fim.uni-passau.de:8080/bigdata/sparql"],
                
                /**
                Limit for items loaded by a single remote load.

                @property defaults.viewOptions.remoteOptions.remoteLimit
                @type Integer
                @default 100
                **/
                remoteLimit : 100,
                
                /**
                Flag to indicate whether automatic remote load on detail view should be done.

                @property defaults.viewOptions.remoteOptions.remoteDynamically
                @type Boolean
                @default true
                **/
                remoteDynamically : true,
                
                /**
                Remote backends to query for predicate label information.

                @property defaults.viewOptions.remoteOptions.remoteLabelBackend
                @type Array
                @default ["http://zaire.dimis.fim.uni-passau.de:8080/bigdata/sparql","http://dbpedia.org/sparql"]
                **/
                remoteLabelBackend : ["http://zaire.dimis.fim.uni-passau.de:8080/bigdata/sparql","http://dbpedia.org/sparql"],
                
                /**
                Flag to indicate whether remote label information should be loaded if needed.

                @property defaults.viewOptions.remoteOptions.remoteLabels
                @type Boolean
                @default true
                **/
                remoteLabels : true
            },
            
            /**
            Styles of literal items.

            @property defaults.viewOptions.literalStyle
            @type Object
            **/
            literalStyle : {
                /**
                Dimensions of literal items.

                @property defaults.viewOptions.literalStyle.dimension
                @type Object
                **/
                dimension : {
                    /**
                    Width of literal items.

                    @property defaults.viewOptions.literalStyle.dimension.width
                    @type Integer
                    @default 200
                    **/
                    width : 200,
                    
                    /**
                    Height of literal items.

                    @property defaults.viewOptions.literalStyle.dimension.width
                    @type Integer
                    @default 100
                    **/
                    height : 100
                },
                
                /**
                Color of literal items.

                @property defaults.viewOptions.literalStyle.colors
                @type Array
                @default [ '#777777' ]
                **/
                colors : [ '#777777' ]  
            },
            
            /**
            Styles of items.

            @property defaults.viewOptions.itemStyle
            @type Object
            **/
            itemStyle : {
                /**
                Dimensions of items.

                @property defaults.viewOptions.itemStyle.dimension
                @type Object
                **/
                dimension : {
                    /**
                    Width of items.

                    @property defaults.viewOptions.itemStyle.dimension.width
                    @type Integer
                    @default 200
                    **/
                    width : 200,
                    
                    /**
                    Height of items.

                    @property defaults.viewOptions.itemStyle.dimension.width
                    @type Integer
                    @default 200
                    **/
                    height : 200
                },
                
                /**
                Colors of items.

                @property defaults.viewOptions.itemStyle.colors
                @type Array
                @default [ '#e2674a', '#99CC99', '#3399CC', '#33CCCC', '#996699', '#C24747', '#FFCC66', '#669999', '#CC6699', '#339966', '#666699' ]
                **/
                colors : [ '#e2674a', '#99CC99', '#3399CC', '#33CCCC', '#996699', '#C24747', '#FFCC66', '#669999', '#CC6699', '#339966', '#666699' ]
            },

            /**
            Options for the layoutEngine. Uses isotope http://isotope.metafizzy.co/ options structure.

            @property defaults.layoutEngine 
            @type Object
            **/
            layoutEngine : {
                sortBy : 'number',
                getSortData : {
                    number : function($elem) {
                        var number = $elem.hasClass('item') ? $elem.find('.number').text() : $elem.attr('data-number');
                        return parseInt(number, 10);
                    },
                    alphabetical : function($elem) {
                        var labelEn = $elem.find('.labelEn'), itemText = labelEn.length ? labelEn : $elem;
                        return itemText.text();
                    }
                }
            }
        }
    };

    function Plugin(obj, options) {
        // <---- private utility functions ---->
        /**
        * Uses $.proxy() to overwrite the context of a given function with the
        * widget context.
        *
        * @private
        * @method _selfProxy
        * @param {Function} fn Function to modifie
        * @return function with modified context
        */
        this._selfProxy = function(fn) {
            return $.proxy(fn, this);
        };
        // <!--- instance private utility functions ---->


        this.pluginID = generateId();

        this._$parent = $(obj);
        this.$body = $('BODY');
        
        eventManagers[this.pluginID] = new Plugin.EventManager(this._$parent);

        // Give parentobj of the plugin a correspondending plugin class
        this._$parent.addClass(pluginName + "_" + this.pluginID);

        // Use $.extend to merge the given plugin options with the defaults
        this.options = $.extend(true, {}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;

        this._expandedOverlaysCount = 0;

        // SPARQL query variable
        this._queries = {};

        this.init();
    }

    Plugin.prototype = {
        
        // <---- private functions ---->

        /**
        * Initializes the rdf store
        *
        * @private
        * @method _initRdfStore
        */
        _initRdfStore : function() {
            var that = this, rdfStoreInitDfd = $.Deferred();
            // console.log("Init RDFSTORE");
            if (isUndefinedOrNull(rdfStore)) {
                rdfStore = new Plugin.RdfStore(that.options.rdfstoreOptions, function(store) {
                    rdfStoreInitDfd.resolve();
                });
            }
            return rdfStoreInitDfd.promise();
        },

        /**
        * Initializes the templating
        *
        * @private
        * @method _initTemplating
        */
        _initTemplating : function() {
            var that = this, templateInitDfd = $.Deferred();

            // Helper to iterate over keys of given context
            Handlebars.registerHelper('keysEach', function(context, options) {
                var out = '';
                for ( var key in context) {
                    out += options.fn(key);
                }
                return out;
            });

            // Helper to check if language of given context is undefined or "en"
            Handlebars.registerHelper('ifLang', function(context, options) {
                if (context && (context.lang === undefined || context.lang === "en")) {
                    return options.fn(this);
                }
            });
            
            Handlebars.registerHelper('predicateLabelRetriver', function(predicate, options) {
                
                if (predicate) {
                    var uriArray = predicate.value.split("#");
                    if (uriArray.length === 1) {
                        uriArray    = uriArray[0].split("/");
                    }
                    predicate.label = uriArray[uriArray.length-1];
                    return options.fn(this);
                }
            });

            var loader = new Plugin.TemplatesLoader(templateInitDfd);
            if (that.options.templatesPrecompiled) {
                loader.checkPrecompiled();
            } else {
                loader.extractByFile(that.options.templatesPath);
            }
            return templateInitDfd.promise();
        },

        /**
        * Generate the queries of the Plugin
        *
        * @private
        * @method _generateQueries
        */
        _generateQueries : function() {
            var that = this;

            // Generate SPARQL queries
            that._queries = {
                initQueries : this.options.initQueries,
                defaultRemoteQuery : this.options.viewOptions.remoteOptions.defaultRemoteQuery,
                remoteSubjectOf : " SELECT ?subject ?predicate ?object ?labelObj WHERE { BIND (<" + cons.DUMMY
                + "> as ?subject) ?subject ?predicate ?object. OPTIONAL { ?object rdfs:label ?labelObj }}",
                remoteObjectOf : " SELECT ?subject ?predicate ?object ?labelSub WHERE {BIND (<" + cons.DUMMY
                + "> as ?object) ?subject ?predicate ?object. OPTIONAL { ?subject rdfs:label ?labelSub }}",
                selectSubjectOf : " SELECT ?subject ?predicate ?label ?description WHERE {<"
                + cons.DUMMY
                + "> ?predicate ?subject. OPTIONAL { ?subject rdfs:label ?label}. OPTIONAL { ?subject rdfs:description ?description } . OPTIONAL { ?subject rdfs:comment ?description }}",
                selectObjectOf : " SELECT ?subject ?predicate ?type ?label ?description WHERE {?subject ?predicate <"
                + cons.DUMMY
                + ">. OPTIONAL { ?subject rdfs:label ?label}. OPTIONAL { ?subject rdfs:description ?description } . OPTIONAL { ?subject rdfs:comment ?description }}",
                previewQuery : " SELECT ?label ?description ?type WHERE { <" + cons.DUMMY + "> rdfs:label ?label . OPTIONAL { <" + cons.DUMMY
                + "> rdfs:description ?description } . OPTIONAL { <" + cons.DUMMY + "> rdfs:comment ?description } . OPTIONAL { <" + cons.DUMMY
                + "> rdfs:type ?type}}",
                label : "SELECT ?label WHERE { <" + cons.DUMMY + "> rdfs:label ?label . FILTER(LANG(?label) = '' || LANGMATCHES(LANG(?label), 'en'))}",
            
                //TODO blanknodes
                blankNodeQuery : "SELECT ?object WHERE {<" + cons.DUMMY + "> ?predicate ?object}"
            };
        },

        /**
        * Check whether the plugin is initialized with insertion options and
        * call insertion methods if needed.
        *
        * @private
        * @method _checkInsertion
        * @returns inserted true if data was inserted, false if not
        */
        _checkInsertion : function() {
            var that = this, inserted = false;
            if (!isUndefinedOrNull(that.options.dataFormat)) {
                // console.log(this);
                if (!isUndefinedOrNull(that.options.dataLoc)) {
                    inserted = true;
                    that._ajaxLoadData(that.options.dataLoc, that.options.dataFormat, function(rdfData, dataFormat) {
                        rdfStore.insertData(rdfData, dataFormat, function() {
                            eventManagers[that.pluginID].trigger(cons.EVENT_TYPES.storeModified.insert, that);
                        });
                    });
                } else if (!isUndefinedOrNull(that.options.data)) {
                    inserted = true;
                    rdfStore.insertData(that.options.data, that.options.dataFormat, function() {
                        eventManagers[that.pluginID].trigger(cons.EVENT_TYPES.storeModified.insert, that);
                    });
                }
            }
            return inserted;
        },

        /**
        * Loads file at dataURL and invokes callback with loaded data
        *
        * @private
        * @method _ajaxLoadData
        * @param {String} dataURL URL where the data is located
        * @param {String} dataFormat Format of the data
        * @param {String} callback Function to call after loading with results
        * @return function with modified context
        */
        _ajaxLoadData : function(dataURL, dataFormat, callback) {
            var that = this;
            eventManagers[that.pluginID].trigger(cons.EVENT_TYPES.loading.loadingStart, that);

            // console.log("_ajaxLoadData");
            $.ajax({
                url : dataURL,
                dataType : "text",
                success : function(rdfData) {
                    callback(rdfData, dataFormat);
                }
            }).fail(function() {
                eventManagers[that.pluginID].trigger(cons.EVENT_TYPES.loading.loadingDone, that);
                alert(cons.MESSAGES.error.ajax);
            });
        },

        // <!--- instance private functions ---->

        /**
        * Init the plugin. Called by the constructor.
        *
        * @method init
        */
        init : function() {
            var that = this;

            // Generate SPARQL Queries
            that._generateQueries();

            // Add insertion listener
            eventManagers[this.pluginID].addEventHandler(cons.EVENT_TYPES.storeModified.insert, function(ev) {
                $.each(that._views, function(key, view) {
                    view.update();
                    console.log("view " + key +  " is updating");
                });
            });

            // Add a smartresize listener (smartresize to be found in
            // jQuery.isotope)
            eventManagers[this.pluginID].addEventHandler('smartresize', function(ev, $invoker) {

                // <---- overlay modification ---->
                var $overlays = that._$parent.children(cons.CSS_CLASSES.toSelector("overlay"));
                $overlays.css('clip', getClip(cons.CSS_CLASSES.overlay));
                var innerScrolls = $overlays.find('.innerScroll');
                innerScrolls.css("width", ($window.width() - parseInt($overlays.css("padding-left")) - parseInt($overlays.css("padding-right"))) + "px");
                innerScrolls.css("height", $window.height() * 0.95 + "px");
                // <!--- overlay modification ---->

                // <---- preview modification ---->
                if (that.options.previewAsDiv) {
                    var $previews = that._$parent.children(cons.CSS_CLASSES.toSelector("preview"));
                    $previews.css('clip', getClip(cons.CSS_CLASSES.preview));
                } else {
                    var $previews = that._$viewContainer.children(cons.CSS_CLASSES.toSelector("previewItem"));

                    var newWidth, newHeight;
                    newWidth = that._$viewContainer.width() - 100;
                    newHeight = $window.height() - 100;
                    $previews.css({
                        "width" : newWidth,
                        "height" : newHeight
                    });
                    that._view.reLayout();
                }
            // <!--- preview modification ---->
            }, $window);

            // Init templating and RdfStore if needed
            if (globalInitDfd.state() === "pending") {
                globalInitDfd = $.Deferred();
                $.when(that._initRdfStore(), that._initTemplating()).done(function() {
                    globalInitDfd.resolve();
                });
            }

            // when done check if sort options have to be initialized and data
            // is to be inserted
            $.when(globalInitDfd.promise()).done(function() {

                // Init View
                that._views = [];
                that._views.push(new Plugin.InitView(that._$parent, that.options.viewOptions, that));
            
                if (!that._checkInsertion()) {
                    if (that.options.sparqlData === undefined) {
                        that._views[0].update();
                    } else {
                        that._views[0].addItems(that.options.sparqlData);
                    }
                }
            });
        },

        /**
        * Add given View object to the plugin
        *
        * @method addView
        * @param {Plugin.View} view View object to add to the plugin
        */
        addView : function(view) {
            this._views.push(view);
        },

        /**
        * Remove given View object from the plugin
        *
        * @method removeView
        * @param {Plugin.View} view View object to remove from the plugin
        */
        removeView : function(view) {
            for (var i =0; i < this._views.length; i++)
                if (this._views[i] === view) {
                    this._views.splice(i,1);
                    if(this._views.length == 1) {
                        this.$body.removeClass('noscroll');
                    }
                    break;
                }
        },

        /**
        * Insert given rdf-data in the store.
        *
        * @method insertData
        * @param {String} data Rdf-data to be inserted
        * @param {String} dataFormat Format of the data
        */
        insertData : function(data, dataFormat) {
            var that = this;
            $.when(globalInitDfd.promise()).done(function() {
                rdfStore.insertData(data, dataFormat, function() {
                    eventManagers[that.pluginID].trigger(cons.EVENT_TYPES.storeModified.insert, that);
                });
            });
        },

        /**
        * Insert rdf-data of given location in the store.
        *
        * @method insertDataPath
        * @param {String} dataURL URL where rdf data is to be found
        * @param {String} dataFormat Format of the data
        */
        insertDataPath : function(dataURL, dataFormat) {
            var that = this;
            $.when(globalInitDfd.promise()).done(function() {
                that._ajaxLoadData(dataURL, dataFormat, that._selfProxy(that.insertData));
            });
        },

        /**
        * Insert rdf-data of given file in the store.
        *
        * @method insertDataFile
        * @param {File} file File to parse
        * @param {String} dataFormat Format of the data
        */
        insertDataFile : function(file, dataFormat) {
            var that = this, reader = new FileReader();
            reader.onload = function() {
                var result = this.result;
                $.when(globalInitDfd.promise()).done(function() {
                    that.insertData(result, dataFormat);
                });
            };
            reader.readAsText(file);
        },

        /**
        * Insert rdf-data of given url SPARQL service in the store. Use the
        * given query. Is no query given use the default query.
        *
        * @method insertRemoteDataQuery
        * @param {String} url URL of the SPARQL service
        * @param {String} query Query to fetch data
        */
        insertRemoteDataQuery : function(url, query) {

            var that = this;

            $.when(globalInitDfd.promise()).done(function() {
                if (query === undefined || query === "") {
                    query = that._queries.defaultRemoteQuery;
                }
                new Plugin.RemoteDataLoader([url], that.pluginID).insertByQuery(query);
            });
        },

        /**
        * Clear the store and Views.
        *
        * @method clearStore
        */
        clearStore : function() {
            var that = this;
            rdfStore.executeQuery("CLEAR ALL", function() {
                console.log("store cleared");
                $.each(that._views, function(i, view) {
                    view.removeAllItems();
                });
            });
        },

        /**
        * Clean up after plugin (destroy bindings, clear events..)
        *
        * @method destroy
        */
        destroy : function() {
            var that = this;
            eventManagers[that.pluginID].destory();
            eventManagers[that.pluginID] = undefined;
            that._$parent[pluginName] = null;
        }
    };

    // Lightweight plugin frame.
    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);

    // Copyright 2013 Thomas Weissgerber
    //	
    // Licensed under the Apache License, Version 2.0 (the "License");
    // you may not use this file except in compliance with the License.
    // You may obtain a copy of the License at
    //	
    // http://www.apache.org/licenses/LICENSE-2.0
    //	
    // Unless required by applicable law or agreed to in writing, software
    // distributed under the License is distributed on an "AS IS" BASIS,
    // WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    // See the License for the specific language governing permissions and
    // limitations under the License.
