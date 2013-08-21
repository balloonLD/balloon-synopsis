// safety net for unclosed plugins and/or chained functions
;
(function($, window, document, undefined) {

    // get global vars
    var $window = $(window);

    // ========================= VisaRDF Constants ===============================
    var cons = {
        
        "TYPE_TAG" : "-filter-_",

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
            loading : {
                loadingDone : "loadingDone",
                loadingStart : "loadingStarted"
            }
        },

        "MESSAGES" : {
            error : {
                ajax : "Error on loading data.",
                remote : "Error on loading remote data.",
                template : "Error on loading template data."
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

                    // if this element cannot fit in the current row
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

    // JQuery custom selector expression : class-prefix
    $.expr[':']['class-prefix'] = function(ele, index, match) {
        var prefix = match[3];

        if (prefix) {
            var sel = '[class^="' + prefix + '"], [class*=" ' + prefix + '"]';
            return $(ele).is(sel);
        } else {
            return true;
        }
    };

    // JQuery custom selector expression : regex (modified the version of James
    // Padolsey -
    // http://james.padolsey.com/javascript/regex-selector-for-jquery/)
    jQuery.expr[':'].regex = function(elem, index, match) {
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

    function isUndefinedOrNull(a) {
        return ((typeof a === "undefined") || (a === null));
    }

    // Replace dummy of query string
    function replaceDummy(query, replacement) {
        return query.replace(new RegExp(cons.DUMMY, "g"), replacement);
    }

    // Get window size with or without Scrollbar.
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

    // Get clip data of given type of box
    function getClip(name) {
        switch (name) {
            case cons.CSS_CLASSES.overlay:
                var winsize = getWindowSize(true);
                return 'rect(0px ' + winsize.width + 'px ' + winsize.height + 'px 0px)';
                break;
            case cons.CSS_CLASSES.preview:
                var winsize = getWindowSize(false);
                return 'rect(' + winsize.height * 0.25 + 'px ' + winsize.width * 0.75 + 'px ' + winsize.height * 0.75 + 'px ' + winsize.width * 0.25 + 'px)';
                break;
            default:
                console.log("No clip data found.");
                return "";
        }
    }

    // Get layoutprop of given item
    function getItemLayoutProp($item) {
        var scrollT = $window.scrollTop(), scrollL = $window.scrollLeft(), itemOffset = $item.offset();
        return {
            left : itemOffset.left - scrollL,
            top : itemOffset.top - scrollT,
            width : $item.outerWidth(),
            height : $item.outerHeight()
        };
    }

    // Get browser dependent event names. (Uses Modernizr)
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

    // ========================= Variables for all VisaRDF instances ===============================

    // Deferred to inform if the plugin was already initialized once
    var globalInitDfd = $.Deferred(),

    // Name of the plugin
    pluginName = "visaRDF",

    // rdf store instance(SPARQL endpoint)
    rdfStore,
    
    // rdf store instance(SPARQL endpoint)
    eventManagers = [],

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
    id = 0;

    // Returns a unique PluginID
    function generateId() {
        return id++;
    };
    
    // ========================= VisaRDF: eventManager Class ==============================
    Plugin.EventManager = function(stdObject) {
        if (!stdObject) {
            return false;
        }    
        this.stdObject = stdObject;
        
        // History of event handler bindings
        this._evHandlerHistory = {};
    }
  
    // Add an event handler to given object. Save it in the history for cleanup purposes.  
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
    
    // Remove an event handler from given object and history. Removal by id possible.
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
   
    Plugin.EventManager.prototype.trigger = function(eventType, param, object) {
        if(object) {
            object.trigger(eventType, param);
        } else {
            this.stdObject.trigger(eventType, param);
        }
    }
    
    Plugin.EventManager.prototype.destroy = function() {
        $.each(this._evHandlerHistory, function(eventType, binding) {
            $.each(binding, function(i, val) {
                val.object.off(eventType, val.handler);
            });
        });
    }

    // ========================= VisaRDF: rdfStore Class ==============================
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
    Plugin.LayoutEngine = function(container, options) {
        this._container = container;
        container.isotope(options);
    }
        
    Plugin.LayoutEngine.prototype.add = function(elements, callback) {
        this._container.isotope("insert", elements, callback);
    };
        
    Plugin.LayoutEngine.prototype.reLayout = function() {
        this._container.isotope("reLayout");
    };
        
    Plugin.LayoutEngine.prototype.remove = function(elements, callback) {
        this._container.isotope("remove", elements, callback);
    };
        
    Plugin.LayoutEngine.prototype.updateSortData = function(element) {
        this._container.isotope("updateSortData", element);
    };
        
    Plugin.LayoutEngine.prototype.updateOptions = function(options) {
        this._container.isotope(options);
    };
        
    // ========================= VisaRDF: View Class ==================================
    Plugin.View = function($container, options, plugin, queries) {
        
        // List of added items.
        this._itemHistory = {
            length : 0
        };

        this._literalHistory = {};
        this.previews = [];
        this.queries = queries;
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
        
        this._initBrowsability = function($items) {

            $items.each(function() {
                var $item = $(this);

                if (that.options.usePreviews) {
                    if (that.options.previewAsOverlay === true) {
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
        
        this._addItemsHelp = function(items, batchSize) {
            var rest = items.slice(batchSize);
            if (rest.length > 0) {
                that.addItems(rest);
            } else {
                eventManagers[that.plugin.pluginID].trigger(cons.EVENT_TYPES.loading.loadingDone, that, that.$container);
            }
        }
    }
    
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
            that.layoutEngine.updateSortData(that.$viewContainer.find(".element"));
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
    
    Plugin.View.prototype.update = function() {
        var that = this, emptyResults = true;
        eventManagers[that.plugin.pluginID].trigger(cons.EVENT_TYPES.loading.loadingStart, that, that.$container);
        for ( var i = 0; i < this.queries.length; i++) {
            rdfStore.executeQuery(this.queries[i].query, function(results) {
                if (results && results.length !== 0) {
                    emptyResults = false;
                    if (that.queries[i].type) {
                        // Add types for filtering
                        for ( var j = 0; j < results.length; j++) {
                            results[j].type = {
                                value : that.queries[i].type
                            };
                        }
                    }
                    that.addItems(results);
                } else if (i === that.queries.length - 1 && emptyResults) {
                    eventManagers[that.plugin.pluginID].trigger(cons.EVENT_TYPES.loading.loadingDone, that, that.$container);
                }
            });
        }
    },
    
    Plugin.View.prototype.addItems = function(items) {
        var length = items.length, that = this, batchSize = ((length < that.options.batchSize) ? length : that.options.batchSize);

        this.$outerContainer.find('> .loading').text(parseInt(batchSize / length * 100) + "% -");

        // current batch
        var batch = items.slice(0, batchSize);

        // isoEles / HistoryAwareEach needs plugincontext
        batch.view = that;

        $.each(batch, function(i, val) {
            // use literal value as label on literals
            if (val.subject.token === "literal") {
                val.label = val.subject;
            }
            if (val.label) {
                val.label.value = unescape(val.label.value);
                val.subject.token = cons.TOKEN_TAG + val.subject.token;
            }
        });
        var $elements = $(templates.isotopeElements(batch));

        $.each($elements, function(i, val) {
            $(val).css("background-color", "rgba(125, 125, 125 ,0.2)");
        });

        if (!isUndefinedOrNull($elements.html())) {

            // Use given width/height
            $elements.css({
                width : this.options.elementStyle.dimension.width,
                height : this.options.elementStyle.dimension.height
            });

            that.layoutEngine.add($elements, function() {
                $elements.find('.ellipsis').ellipsis();
                var $nodes = $elements.filter("."  + cons.CSS_CLASSES.toToken("patternClasses.uri"));
                var $literals = $elements.filter("."  + cons.CSS_CLASSES.toToken("patternClasses.literal"));

                $.each($nodes, function(i, val) {
                    $(val).data("uri", $(val).find(".showUri").html());
                });

                // Init overlays on new elements
                that._initBrowsability($nodes);
                $.each($nodes, function(i, val) {
                    var color = new RGBColor(that.options.elementStyle.colors[i % that.options.elementStyle.colors.length]);
                    $(val).css("background-color", "rgba(" + color.r + ", " + color.g + ", " + color.b + " ,1)");
                });
                $.each($literals, function(i, val) {
                    $(val).css("background-color", "rgba(" + 125 + ", " + 125 + ", " + 125 + " ,1)");
                });

                that._addItemsHelp(items, batchSize);
            })
        } else {
            that._addItemsHelp(items, batchSize);
        }
    }
    
    Plugin.View.prototype.removeAllItems = function() {
        var that = this;
        that.layoutEngine.remove($(".element"), function() {
            that._itemHistory = {
                length : 0
            };
            that._literalHistory = {};
            console.log("view cleared");
        });
    }
        
    // ========================= VisaRDF: InitView Class ==============================
    Plugin.InitView = function($container, options, plugin) {
        Plugin.View.call(this, $container, options, plugin, plugin.options.initQueries);
    }
        
    //pseudo class inheritance of Preview
    Plugin.InitView.prototype =  Object.create(Plugin.View.prototype);
    Plugin.InitView.prototype.constructor = Plugin.InitView;
    
    // ========================= VisaRDF: DetailView Class ==============================
    Plugin.DetailView = function($container, options, plugin, item) {
        var that = this;
        this.$item = $(item);
        this.uri = this.$item.find('.showUri').html();
        this.plugin = plugin;
        
        var $overlay = $container.find(cons.CSS_CLASSES.toSelector("overlay") + '_' + that.$item.index());
        if ($overlay.length < 1) {
            var overlay = templates.overlayElement({
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
							itemSelector : '.element',
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
            
            if (that.options.remoteOptions.remoteDynamicly) {
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
    
    Plugin.DetailView.prototype.loadByRemote  = function() {
                
        var that = this;
        // Get elements who are in a relation to
        // current item
        var remoteSubjectOf = replaceDummy(
            that.plugin._queries.remoteSubjectOf, this.uri), remoteObjectOf = replaceDummy(that.plugin._queries.remoteObjectOf, this.uri);
        
        //remote needed?
        if (that.options.remoteOptions.remoteDynamicly) {
            if (that._remoteLoaders == undefined) {
                that._remoteLoaders = []
                $.each(that.options.remoteOptions.remoteBackend, function(i, val){
                    that._remoteLoaders.push(new Plugin.YQLRemoteLoader(val, that.plugin.pluginID));
                });
            }
            $.each(that._remoteLoaders, function(i, val){
                val.loadByQuery(remoteSubjectOf + " LIMIT " + that.options.remoteOptions.remoteLimit);
                val.loadByQuery(remoteObjectOf + " LIMIT " + that.options.remoteOptions.remoteLimit);
            });
        }
    }

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
    Plugin.Preview = function(parentView, $item) {
        this.parentView = parentView;
        this.$item = $item;
    };
        
    Plugin.Preview.prototype.close = function() {
        this.$preview.data('isShown', false);
    }
    
    Plugin.Preview.prototype.open = function() {
        this.$preview.data('isShown', true);
    }
        
    Plugin.Preview.prototype.click = function() {
        if (!this.$item.data('isExpanded')) {
            this.$item.data('isExpanded', true);
            this.parentView.plugin.addView(new Plugin.DetailView(this.parentView.$container, this.parentView.options, this.parentView.plugin, this.$item));
        }
    }
        
    Plugin.PreviewOverlay = function(parentView, $item) {
        Plugin.Preview.call(this, parentView, $item);
        var that = this;
        var preview = templates.previewElement({
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
        
    Plugin.PreviewOverlay.prototype.click = function() {
        
        //call super
        Plugin.Preview.prototype.click.call(this);

        // <---- hide preview and deactivate transitions
        // ---->
        this.close();
    // <!--- hide preview and deactivate transitions
    // ---->
    }
     
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
        
    Plugin.PreviewInlay = function(parentView, $item) {
        Plugin.Preview.call(this, parentView, $item);
        this.$preview = this.$item;
    };
        
    //pseudo class inheritance of Preview
    Plugin.PreviewInlay.prototype = Object.create(Plugin.Preview.prototype);
    Plugin.PreviewInlay.prototype.constructor = Plugin.PreviewInlay;
    
    Plugin.PreviewInlay.prototype.open = function() {
        var that = this;
        if (!this.$preview.data('isShown')) {
            var $items = that.parentView.$viewContainer.children("div");
            $items.css({
                "width" : that.parentView.options.elementStyle.dimension.width,
                "height" : that.parentView.options.elementStyle.dimension.height
            });
            $items.removeClass(cons.CSS_CLASSES.previewItem);
            that.parentView.layoutEngine.reLayout();

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
//                var content = templates.isotopeElementContent(data[0]);
//                this.$item.find(".itemContent").remove();
//                this.$item.append(content);
//            });
            that.parentView.layoutEngine.reLayout();
                                
            // <---- Add close event ---->
            eventManagers[that.parentView.plugin.pluginID].addEventHandler('dblclick', function() {
                that.close();
                eventManagers[that.parentView.plugin.pluginID].removeEventHandler('dblclick', "previewOverlayClose");
                eventManagers[that.parentView.plugin.pluginID].removeEventHandler('click', "previewOverlayClick");
            }
            , $window, "previewOverlayClose");
        
            // <!--- Add close event ---->
    
            // <---- preview click Event ---->
            eventManagers[that.parentView.plugin.pluginID].addEventHandler('click', function() {
                that.click();
                eventManagers[that.parentView.plugin.pluginID].removeEventHandler('click', "previewOverlayClick");
            }, that.$preview, "previewOverlayClick");
        // <!--- preview click Event ---->
        }
            
        Plugin.Preview.prototype.open.call(this);
    }
        
    Plugin.PreviewInlay.prototype.click = function() {
        Plugin.Preview.prototype.click.call(this);
    }
        
    Plugin.PreviewInlay.prototype.close = function() {
        var that = this;
        that.$item.css({
            "width" : that.parentView.options.elementStyle.dimension.width,
            "height" : that.parentView.options.elementStyle.dimension.height
        });
        that.parentView.layoutEngine.reLayout();
        Plugin.Preview.prototype.close.call(this);
    }

    // ========================= VisaRDF: TemplatesLoader Class ==============================
    Plugin.TemplatesLoader = function(dfd) {
        this._templateInitDfd = dfd;
        this._neededTemps = [ "filterOptions", "sortOptions", "groupDropDown", "isotopeElements", "overlayContent", "overlayElement", "previewElement" ];

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
        
    // ========================= VisaRDF: YQLRemoteLoader Class ==============================
    Plugin.YQLRemoteLoader = function(site, ownerID) {
        this.ownerID = ownerID;
        
        // If no url was passed, exit.
        if (!site) {
            alert('No site was passed.');
        } else {
            this.site = site; 
        }
        
        
        // Accepts a query and a callback function to run.
        this._requestCrossDomain = function(query, callback) {

            var that = this, success = false;
            eventManagers[that.ownerID].trigger(cons.EVENT_TYPES.loading.loadingStart, that);
            
            window.cbFunc = function(data, textStatus, jqXHR) {
                success = true;
                // console.log(success);

                // If we have something to work with...
                console.log(data)
                if (data && data.query.results) {
                    callback(data.query.results.sparql.result);
                }
                // Else, Maybe we requested a site that doesn't exist, and
                // nothing returned.
                else
                    console.log('Nothing returned from getJSON.');
                eventManagers[that.ownerID].trigger(cons.EVENT_TYPES.loading.loadingDone, that);
            };

            // If no query was passed, exit.
            if (!query) {
                alert('No query was passed.');
            }

            // Take the provided url, and add it to a YQL query. Make sure you
            // encode it!
            var yql = 'http://query.yahooapis.com/v1/public/yql?q='
            + encodeURIComponent('use "http://triplr.org/sparyql/sparql.xml" as sparql; select * from sparql where query="' + query + '" and service="'
                + this.site) + '"&format=json&callback=cbFunc';

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
                    if (!success) {
                        eventManagers[that.ownerID].trigger(cons.EVENT_TYPES.loading.loadingDone, that);
                    }
                }
            });
        };
    }

    Plugin.YQLRemoteLoader.prototype.loadByQuery = function (query) {
        var that = this;
        this._requestCrossDomain(query, function(data){// Generate insertionQuery out of the resultset.
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
                    eventManagers[that.ownerID].trigger(cons.EVENT_TYPES.storeModified.insert, this);
                });
            }
        });
    };

    // ========================= visaRDF ===============================

    // Default options
    var defaults = {
        data : undefined,
        dataLoc : undefined,
        dataFormat : undefined,
        templatesPrecompiled : true,
        templatesPath : "templates_wrapped/templates.html",
        sparqlData : undefined,
        initQueries : [ {
            query : "SELECT ?subject ?label ?description ?type WHERE { ?subject rdfs:label ?label . OPTIONAL { ?subject rdfs:description ?description } . OPTIONAL { ?subject rdfs:comment ?description }. OPTIONAL {?subject rdfs:type ?type}}"
        } ],

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
        
        viewOptions : {
            generateSortOptions : true,
            usePreviews : false,
            previewAsOverlay : false,
            generateFilterOptions : true,
            batchSize : 25,
            supportRegExpFilter : true,
            
            filterBy : [ {
                value : "*",
                label : "showAll"
            } ],
        
            elementStyle : {
                dimension : {
                    width : 200,
                    height : 200
                },
                colors : [ '#e2674a', '#99CC99', '#3399CC', '#33CCCC', '#996699', '#C24747', '#FFCC66', '#669999', '#CC6699', '#339966', '#666699' ]
            },
            
            remoteOptions : {
                defaultRemoteQuery : "SELECT ?subject ?predicate ?object { BIND( rdfs:label as ?predicate) ?subject ?predicate ?object. ?subject a <http://dbpedia.org/ontology/Place> . ?subject <http://dbpedia.org/property/rulingParty> ?x } LIMIT 500",
                remoteBackend : ["http://zaire.dimis.fim.uni-passau.de:8080/bigdata/sparql"],
                remoteLimit : 100,
                remoteDynamicly : true
            },

            layoutEngine : {
                sortBy : 'number',
                getSortData : {
                    number : function($elem) {
                        var number = $elem.hasClass('element') ? $elem.find('.number').text() : $elem.attr('data-number');
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

    // Plugin constructor
    function Plugin(element, options) {
        // <---- private utility functions ---->
        /**
             * Uses $.proxy() to overwrite the context of a given function with the
             * widget context.
             * 
             * @arguments
             * @param {Function}
             *            fn Function to modifie
             * @return function with modified context
             */
        this._selfProxy = function(fn) {
            return $.proxy(fn, this);
        };
        // <!--- instance private utility functions ---->


        this.pluginID = generateId();

        this._$element = $(element);
        this.$body = $('BODY');
        
        eventManagers[this.pluginID] = new Plugin.EventManager(this._$element);

        // Give parentelement of the plugin a correspondending plugin class
        this._$element.addClass(pluginName + "_" + this.pluginID);

        // Use $.extend to merge the plugin options element with the defaults
        this.options = $.extend(true, {}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;

        this._expandedOverlaysCount = 0;

        // SPARQL query variable
        this._queries = {};

        this.init();
    }

    Plugin.prototype = {

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

        // <---- private functions ---->
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

            // Helper to add elements. (needs current plugin context)
            Handlebars.registerHelper('historyAwareEach', function(context, options) {
                var fn = options.fn;
                var i = 0, ret = "", data;

                if (options.data) {
                    data = Handlebars.createFrame(options.data);
                }

                if (context && typeof context === 'object') {
                    if (context instanceof Array) {
                        for ( var j = context.length; i < j; i++) {
                            // console.log(context)
                            switch (context[i].subject.token) {

                                // If element isn't a literal or blank node add it
                                case cons.CSS_CLASSES.toToken("patternClasses.uri"):
                                    var currentUri = context[i].subject.value;

                                    // If element isn't already created, create it
                                    if (!(currentUri in context.view._itemHistory)) {
                                        if (context[i].label) {

                                            // Only subjects with labels in english
                                            // or undefined language
                                            if (context[i].label.lang === undefined || context[i].label.lang === "en") {

                                                // increment index and give it back
                                                // to
                                                // the template
                                                if (data) {
                                                    context[i].index = data.index = context.view._itemHistory.length++;
                                                    data.uri = currentUri;
                                                }
                                                ret = ret + fn(context[i], {
                                                    data : data
                                                });

                                                // Save added item in history
                                                context.view._itemHistory[currentUri] = context[i];
                                            }
                                        }
                                    } else {

                                        // Check for element update
                                        var update = false;
                                        $.each(context[i], function(j, val) {
                                            if (val !== null) {
                                                if (context.view._itemHistory[currentUri][j] === null) {
                                                    context.view._itemHistory[currentUri][j] = val;
                                                    update = true;
                                                } else if (j === "type"
                                                    && (context.view._itemHistory[currentUri][j].value
                                                        .indexOf(context.view._itemHistory[currentUri][j].value) === -1)) {

                                                    // An element can have more than
                                                    // one
                                                    // type
                                                    context.view._itemHistory[currentUri][j].value += " " + val.value;
                                                    update = true;
                                                }
                                            }
                                        });

                                        // Update element if needed
                                        if (update) {
                                            data.index = context.view._itemHistory[currentUri].index;

                                            // If element isn't already added we
                                            // need to
                                            // remove it from ret
                                            $tempDiv = $('<div/>').append(ret);
                                            $tempDiv.remove("." + context.view._itemHistory[currentUri].index);
                                            var temp = $tempDiv.children();
                                            $.each(temp, function(i, val) {
                                                ret += $(val).html();
                                            });

                                            // If element is already added we need
                                            // to
                                            // remove it from isotope
                                            context.view.layoutEngine.remove($(context.view.$container).find("." + context.view._itemHistory[currentUri].index));

                                            ret = ret + fn(context.view._itemHistory[currentUri], {
                                                data : data
                                            });
                                        }
                                    }
                                    break;
                                case cons.CSS_CLASSES.toToken("patternClasses.literal"):
                                    if (!(context[i].predicate.value in context.view._literalHistory)) {
                                        context.view._literalHistory[context[i].predicate.value] = [];
                                        context.view._literalHistory[context[i].predicate.value].push(context[i].subject.value);
                                        // increment index and give it back
                                        // to
                                        // the template
                                        if (data) {
                                            context[i].index = data.index = context.view._itemHistory.length++;
                                        }
                                        ret = ret + fn(context[i], {
                                            data : data
                                        });

                                    } else {
                                        if ($.inArray(context[i].subject.value, context.view._literalHistory[context[i].predicate.value]) === -1) {

                                            context.view._literalHistory[context[i].predicate.value].push(context[i].subject.value);
                                            if (data) {
                                                context[i].index = data.index = context.view._itemHistory.length++;
                                            }
                                            ret = ret + fn(context[i], {
                                                data : data
                                            });
                                        } else {
                                        // console.log(context[i]);
                                        // console.log(context.view._literalHistory)
                                        // console.log("duplicated literal
                                        // found");
                                        }
                                    }
                                    break;
                                case  cons.CSS_CLASSES.toToken("patternClasses.blanknode"):
                                    // increment index and give it back
                                    // to
                                    // the template
                                    console.log(context[i]);
                                    var blankNodeQuery = replaceDummy(that._queries.blankNodeQuery, context[i].subject.value);
                                    rdfStore.executeQuery(blankNodeQuery, function(data) {
                                        console.log(data);
                                    });
                                    console.log("TODO blanknode");
                            }
                        }
                    }
                }
                return ret;
            });

            // Helper to check if language of given context is undefined or "en"
            Handlebars.registerHelper('ifLang', function(context, options) {
                if (context && (context.lang === undefined || context.lang === "en")) {
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
                blankNodeQuery : "SELECT ?object WHERE {<" + cons.DUMMY + "> ?predicate ?object}"
            };
        },

        /**
             * Check whether the plugin is initialized with insertion options and
             * call insertion methods if needed.
             * 
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

        /*
             * Loads file at dataURL and invokes callback with loaded data
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
                var $overlays = that._$element.children(cons.CSS_CLASSES.toSelector("overlay"));
                $overlays.css('clip', getClip(cons.CSS_CLASSES.overlay));
                var innerScrolls = $overlays.find('.innerScroll');
                innerScrolls.css("width", ($window.width() - parseInt($overlays.css("padding-left")) - parseInt($overlays.css("padding-right"))) + "px");
                innerScrolls.css("height", $window.height() * 0.95 + "px");
                // <!--- overlay modification ---->

                // <---- preview modification ---->
                if (that.options.previewAsDiv) {
                    var $previews = that._$element.children(cons.CSS_CLASSES.toSelector("preview"));
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
                that._views.push(new Plugin.InitView(that._$element, that.options.viewOptions, that));
            
                if (!that._checkInsertion()) {
                    if (that.options.sparqlData === undefined) {
                        that._views[0].update();
                    } else {
                        that._views[0].addItems(that.options.sparqlData);
                    }
                }
            });
        },

        addView : function(view) {
            this._views.push(view);
        },
        
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
             * @arguments
             * @param data
             *            Rdf-data to be inserted
             * @param dataFormat
             *            Format of the data
             */
        insertData : function(data, dataFormat) {
            var that = this;
            $.when(globalInitDfd.promise()).done(function() {
                console.log("instert")
                rdfStore.insertData(data, dataFormat, function() {
                    console.log("instert")
                    eventManagers[that.pluginID].trigger(cons.EVENT_TYPES.storeModified.insert, that);
                });
            });
        },

        /**
             * Insert rdf-data of given location in the store.
             * 
             * @arguments
             * @param dataURL
             *            URL of the data
             * @param dataFormat
             *            Format of the data
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
             * @arguments
             * @param file
             *            file
             * @param dataFormat
             *            Format of the data
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
             * default query.
             * 
             * @arguments
             * @param url
             *            URL of the SPARQL service
             */
        insertRemoteData : function(url) {
            var that = this;
            $.when(globalInitDfd.promise()).done(function() {
                that.insertRemoteDataQuery(url, that._queries.defaultRemoteQuery);
            });
        },

        /**
             * Insert rdf-data of given url SPARQL service in the store. Use the
             * given query.
             * 
             * @arguments
             * @param url
             *            URL of the SPARQL service
             * @param query
             *            query for the SPARQL service
             */
        insertRemoteDataQuery : function(url, query) {

            var that = this;

            $.when(globalInitDfd.promise()).done(function() {
                if (query === undefined || query === "") {
                    query = that._queries.defaultRemoteQuery;
                } else {
                    new Plugin.YQLRemoteLoader(url, that.pluginID).loadByQuery(query);
                }
            });
        },

        /**
             * Clear the store and View.
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
             * Clean up after plugin (destroy bindings..)
             */
        destroy : function() {
            var that = this;
            eventManagers[that.pluginID].destory();
            eventManagers[that.pluginID] = undefined;
            that._$element[pluginName] = null;
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
