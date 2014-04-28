/**
 * bSynopsis is a JQuery Plugin for RDF visualization.
 * 
 * @module bSynopsis
 * @main Plugin
 * @param {} $
 * @param {}
 *            window
 * @param {}
 *            document
 * @param {}
 *            undefined
 */

// safety net for unclosed plugins and/or chained functions
;
(function($, window, document, undefined) {

	// get global vars
	var $window = $(window);

	// ========================= bSynopsis Constants
	// ===============================
	var CONS = {
		// Part of CSS class to indicate a filterable
		FA_TAG : "synopsis_filter_",
		// Part of CSS class to indicate a token
		TOKEN_TAG : "synopsis_token_",
		NODE_TYPES : {
			stdNode : "stdNode",
			literal : "literal",
			blankNode : "blankNode",
			resNode : "resNode"
		},
		CSS_PREFIX : "synopsis_",

		// CSS classes to use
		CSS_CLASSES : {
			outerContainer : "outerContainer",
			viewContainer : "container",
			options : "options",
			optionCombo : "option-combo",
			optionSet : "option-set",
			groupLabel : "groupLabel",
			filter : "filter",
			clearfix : "clearfix",
			loader : "loading",
			preview : "preview",
			previewItem : "preview-item",
			previewContent : "previewContent",
			overlay : "overlay",
			overlayContent : "overlayContent",
			innerScroll : "innerScroll",
			innerNoScroll : "innerNoScroll",
			buttonClose : "close",
			timelineContainer : "timelineContainer",
			timeline : "timeline",
			buttonTimeline : "btnTimeline",
			sorter : "sorter",
			textScale : "textScale",
			tileClasses : {
				tile : "tile",
				content : "tileContent",
				label : "label",
				showURI : "showURI",
				predicate : "predicate",
				predicateLabel : "predicateLabel",
				typeImage : "typeImage",
				number : "number"
			},
			typeClasses : {
				incoming : "incoming",
				outgoing : "outgoing"
			},
			patternClasses : {
				uri : "uri",
				literal : "literal",
				blanknode : "blank"
			}
		},
		// Placeholder in query strings
		DUMMY : "#replaceMe#",
		// Event types for Pub/Sub system
		EVENT_TYPES : {
			store : {
				insert : "dataInsert"
			},
			loading : {
				done : "loadingDone",
				start : "loadingStarted"
			},
			layout : {
				done : "layoutingDone"
			}
		},
		MESSAGES : {
			out : {
				selectAllFilters : "Select All"
			},
			error : {
				ajax : "Error on loading data.",
				remote : "Error on loading remote data.",
				template : "Error on loading template data.",
				tokenType : "Unknown token type of item."
			},
			warn : {
				cssAppend : "CSS classes already defined",
				fileTypeNotKnown : "Couldn't get filetype. Using: ",
				filterInput : "Filterinput is empty",
				filterName : "Filtername duplicate found"
			}
		}
	};

	var UTIL = {
		toClass : function(str) {
			return CONS.CSS_PREFIX + str;
		},
		toToken : function(str) {
			return CONS.TOKEN_TAG + str;
		},
		toFilterable : function(str) {
			return CONS.FA_TAG + str;
		},
		toClassSelector : function(str) {
			return "." + CONS.CSS_PREFIX + str;
		},
		toSelector : function(str) {
			return "." + str;
		}
	};

	// Add prefix to given objects strings
	function objPrefixer(prefix, obj) {
		$.each(obj, function(i, val) {
			if (typeof val === "string") {
				obj[i] = prefix + val;
			} else {
				objPrefixer(prefix, val);
			}
		});
	}

	// Add css_prefix to css_classes
	objPrefixer(CONS.CSS_PREFIX, CONS.CSS_CLASSES);

	// ========================= Extend Isotope ===============================

	// Extend Isotope - groupRows custom layout mode
	// Modified Version of
	// http://isotope.metafizzy.co/custom-layout-modes/category-rows.html
	$
			.extend(
					$.Isotope.prototype,
					{
						_groupRowsReset : function() {
							this.groupRows = {
								x : 0,
								y : 0,
								gutter : 0,
								height : 0,
								currentGroup : null
							};
						},
						_groupRowsLayout : function($elems) {
							var instance = this, containerWidth = this.element
									.width(), sortBy = this.options.sortBy, props = this.groupRows;

							$elems
									.each(function() {
										var $this = $(this), atomW = $this
												.outerWidth(true), atomH = $this
												.outerHeight(true), group = $
												.data(this, 'isotope-sort-data')[sortBy];

										if (group !== props.currentGroup) {
											// new group, new row
											props.x = 0;
											props.height += props.currentGroup ? instance.groupRows.gutter
													: 0;
											props.y = props.height;
											props.currentGroup = group;

											if (instance.groupRows.gutter < atomH) {
												instance.groupRows.gutter = atomH;
											}

										} else {

											if (props.x !== 0
													&& atomW + props.x > containerWidth) {

												// if this item cannot fit in
												// the current row
												props.x = 0;
												props.y = props.height;
											}
										}

										$this
												.find(
														UTIL
																.toSelector(CONS.CSS_CLASSES.groupLabel))
												.remove();
										// label for new group
										if (group !== '') {
											var prefix = group.split("_")[0]
													+ "_";
											var groups = group.split(prefix), divBox = "<div class='"
													+ CONS.CSS_CLASSES.groupLabel
													+ "' >";
											for (var i = 1; i < groups.length; i++) {
												divBox += groups[i];
											}
											divBox += "</div>";
											$this.append(divBox);
										}

										// position the atom
										instance._pushPosition($this, props.x,
												props.y);

										props.height = Math.max(
												props.y + atomH, props.height);
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

	// ========================= JQuery custom selectors
	// ===============================
	/**
	 * class JQuery custom selectors
	 * 
	 * @class bSynopsis_JQuery_Custom
	 */

	/**
	 * JQuery custom class prefix selector.
	 * 
	 * @method class-prefix
	 * @param {}
	 *            ele
	 * @param {}
	 *            index
	 * @param {}
	 *            match
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
	 * JQuery custom regex selector. (modified the version of James Padolsey -
	 * http://james.padolsey.com/javascript/regex-selector-for-jquery/)
	 * 
	 * @method regex
	 * @param {}
	 *            elem
	 * @param {}
	 *            index
	 * @param {}
	 *            match
	 */
	$.expr[':'].regex = function(elem, index, match) {
		var matchParams = match[3].split(','), validLabels = /^(data|css):/, attr = {
			method : matchParams[0].match(validLabels) ? matchParams[0]
					.split(':')[0] : 'attr',
			property : matchParams.shift().replace(validLabels, '')
		}, regexFlags = 'ig', regex;
		try {
			regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g, ''),
					regexFlags);
		} catch (e) {
			return false;
		}
		return regex.test(jQuery(elem)[attr.method](attr.property));
	};

	// ========================= bSynopsis class private utility functions
	// ===============================
	/**
	 * class private utility functions
	 * 
	 * @class bSynopsis_GLOBAL_UTIL
	 */

	/**
	 * Checks if given variable is undenfined or null.
	 * 
	 * @method isUndefinedOrNull
	 * @param {Object}
	 *            a Variable to check
	 * @return {Boolean} Returns true on success
	 */
	function isUndefinedOrNull(a) {
		return ((typeof a === "undefined") || (a === null));
	}
	
	// Only print to console, if DEBUG mode is enabled
	var print = console.log.bind(console);
	function appendCssClasses(obj) {
		if (obj) {
			if (!obj.CSS_CLASSES) {
				obj.CSS_CLASSES = CONS.CSS_CLASSES;
			} else {
				console.log(CONS.MESSAGES.warn.cssAppend);
			}
		}
		return obj;
	}

	/**
	 * Replace the DUMMY constants of given query with the given
	 * replacementstring.
	 * 
	 * @method replaceDummy
	 * @param {String}
	 *            query Query to work with
	 * @param {String}
	 *            replacement String to replace the CONS.DUMMY of given query
	 * @return {String} Returns the query with replaced DUMMY constants
	 */
	function replaceDummy(query, replacement) {
		return query.replace(new RegExp(CONS.DUMMY, "g"), replacement);
	}

	/**
	 * Used to deepCopy a javascript object.
	 * 
	 * @private
	 * @method deepCopy
	 * @param {Object}
	 *            obj Object to clone
	 * @return copy of the object
	 */
	function deepCopy(obj) {
		return owl.deepCopy(obj);
	}
	/**
	 * Gets the current window size of the browser.
	 * 
	 * @method getWindowSize
	 * @param {Boolean}
	 *            withoutScrollbar Flag to assign if the scrollbar should be
	 *            considered
	 * @return {Object} Object which contains the width and the height of the
	 *         window.
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
	 * @param {String}
	 *            name CSS name as defined in CONS.CSS_CLASSES of given div box
	 * @return {Object} Rectangle Object / Clip data
	 */
	function getClip(name) {
		var winsize;
		switch (name) {
		case CONS.CSS_CLASSES.overlay:
			winsize = getWindowSize(true);
			return 'rect(0px ' + winsize.width + 'px ' + winsize.height
					+ 'px 0px)';
			break;
		case CONS.CSS_CLASSES.preview:
			winsize = getWindowSize(false);
			return 'rect(' + winsize.height * 0.25 + 'px ' + winsize.width
					* 0.75 + 'px ' + winsize.height * 0.75 + 'px '
					+ winsize.width * 0.25 + 'px)';
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
	 * @param {$item}
	 *            $item JQuery item
	 * @return {Object} Object which contains the layoutprops
	 */
	function getItemLayoutProp($item) {
		var scrollT = $window.scrollTop(), scrollL = $window.scrollLeft(), itemOffset = $item
				.offset();
		return {
			left : itemOffset.left - scrollL,
			top : itemOffset.top - scrollT,
			width : $item.outerWidth(),
			height : $item.outerHeight()
		};
	}

	/**
	 * Get browser dependent event names. (Uses Modernizr)
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

	// ========================= bSynopsis: RemoteEngine Class
	// ==============================
	/**
	 * Class to provide a function for SPARQL querying of the service located at
	 * the given url. YQL is used to fetch the queryresults.
	 * 
	 * @class RemoteEngine
	 * @constructor
	 */
	var RemoteEngine = function() {

		var counter = 0;

		// This function uses YQL to give a SPARQL query to a remote service.
		// Accepts a query, the adress of the service and a callback function to
		// run.
		this._requestSPARQLCrossDomain = function(query, url, callback) {

			var that = this, success = false, cnt = counter++;

			// Use cnt to stop callbackoverwriting on simultan calls
			window["cbFunc" + cnt] = function(data, textStatus, jqXHR) {

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
				window["cbFunc" + cnt] = undefined;
			};

			// If no query was passed, exit.
			if (!query) {
				alert('No query was passed.');
			}

			// Take the provided url, and add it to a YQL query. Make sure you
			// encode it!
			var yql = 'http://query.yahooapis.com/v1/public/yql?q='
					+ encodeURIComponent('use "http://triplr.org/sparyql/sparql.xml" as sparql; select * from sparql where query="'
							+ query + '" and service="' + url)
					+ '"&format=json&callback=cbFunc' + cnt;

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

	};

	/**
	 * Method for querying the given url with given query. Executes given
	 * callback function with results.
	 * 
	 * @method executeQuery
	 * @param {String}
	 *            query Query to execute
	 * @param {String}
	 *            url URL of service to execute the query on
	 * @param {Function}
	 *            callback Callback function to be executed with query results
	 */
	RemoteEngine.prototype.executeQuery = function(query, url, callback) {
		this._requestSPARQLCrossDomain(query, url, callback);
	};

	// ========================= Cache class ===============================
	/**
	 * This class defines a cache.
	 * 
	 * @class Cache
	 * @constructor
	 */
	var Cache = function() {
		this.values = {};
	};

	/**
	 * Adds the key and value to the cache.
	 * 
	 * @method add
	 * @param {String}
	 *            key Key to map to the value
	 * @param {String}
	 *            val Value to add to the cache
	 */
	Cache.prototype.add = function(key, val) {
		this.values[key] = val;
	};

	/**
	 * Retrives the to the key correspondending value
	 * 
	 * @method retrieve
	 * @param {String}
	 *            key Key to map to the value
	 * @return {String} Value to which the key maps
	 */
	Cache.prototype.retrieve = function(key) {
		return this.values[key];
	};

	/**
	 * Check if the cache contains a value for the given key
	 * 
	 * @method contains
	 * @param {String}
	 *            key Key to map to the value
	 * @return {Boolean} true if cache contains a value for the given key
	 */
	Cache.prototype.contains = function(key) {
		return key in this.values;
	};

	// ========================= Variables for all bSynopsis instances ===============================
	/**
	 * class public functions
	 * 
	 * @class bSynopsis_GLOBAL
	 */

	// Deferred to inform if the plugin was already initialized once
	var globalInitDfd = $.Deferred(),
	// Name of the plugin
	pluginName = "bSynopsis",
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
	// namespaces variable with defaultnamespaces
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
	}

	// ========================= bSynopsis: Event Class
	// ==============================
	Plugin.Event = function(sender) {
		this._sender = sender;
		this._listeners = [];
	};

	Plugin.Event.prototype = {
		attach : function(listener) {
			this._listeners.push(listener);
		},
		notify : function(args) {
			var index;

			for (index = 0; index < this._listeners.length; index += 1) {
				this._listeners[index](this._sender, args);
			}
		}
	};

	// ========================= bSynopsis: eventManager Class
	// ==============================
	/**
	 * Class to manage eventHandlers
	 * 
	 * @class Plugin.EventManager
	 * @constructor
	 * @param {jQuery}
	 *            stdObject Default object for adding of eventHandlers
	 */
	Plugin.EventManager = function(stdObject) {
		if (!stdObject) {
			print("EventManager not created");
			return false;
		}
		this.stdObject = stdObject;

		// History of event handler bindings
		this._evHandlerHistory = {};
	};

	/**
	 * Add an event handler to given object. Save it in the history for cleanup
	 * purposes.
	 * 
	 * @method addEventHandler
	 * @param {String}
	 *            eventType Type of the event as defined in cons
	 * @param {Function}
	 *            handler Eventhandler function to trigger on event
	 * @param {String}
	 *            object Object to add the eventhandler to
	 * @param {String}
	 *            id ID to add to the eventhandler
	 */
	Plugin.EventManager.prototype.addEventHandler = function(eventType,
			handler, object, id) {
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
	};

	/**
	 * Remove an event handler from given object and history. Removal by id is
	 * possible.
	 * 
	 * @method removeEventHandler
	 * @param {String}
	 *            eventType Type of the event as defined in CONS
	 * @param {Function}
	 *            id ID of the eventHandler to be removed
	 * @param {String}
	 *            object Object to remove the eventhandler from
	 */
	Plugin.EventManager.prototype.removeEventHandler = function(eventType, id,
			object) {
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
	};

	/**
	 * Trigger the event with given parameters on given object.
	 * 
	 * @method trigger
	 * @param {String}
	 *            eventType Type of the event as defined in CONS
	 * @param {Object}
	 *            param Array of parameters to give to the triggered function
	 * @param {String}
	 *            object Object to trigger the event on
	 */
	Plugin.EventManager.prototype.trigger = function(eventType, param, object) {
		if (object) {
			object.trigger(eventType, param);
		} else {
			this.stdObject.trigger(eventType, param);
		}
	};

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
	};

	// ========================= bSynopsis: rdfStore Class
	// ==============================
	/**
	 * Class to wrap and create a rdfStore Object. Default: rdfstore-js
	 * https://github.com/antoniogarrote/rdfstore-js
	 * 
	 * @class Plugin.RdfStore
	 * @constructor
	 * @param {Object}
	 *            options Options object for the rdf store
	 * @param {Function}
	 *            callback Callback function to execute after class creation
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

		// Init rdfstore-js
		new rdfstore.Store(options, function(store) {
			that._store = store;
			callback();
		});
		// TODO store as worker?
		//		rdfstore.connect("js/lib/rdfstore-js/index.js", options, function(success, store) {
		//		    if(success) {
		//		        // store is a connection to the worker
		//		        console.log(store.isWebWorkerConnection === true);
		//		      } else {
		//		        // connection was not possible. A store object has been returned instead
		//		    	  print("fail on webworker store");
		//		      }   
		//			that._store = store;
		//			callback();
		//		});
	};

	/**
	 * Inserts given data in the store
	 * 
	 * @method insertData
	 * @param {String}
	 *            data Data to insert into the store
	 * @param {String}
	 *            dataFormat Format of given data
	 * @param {Function}
	 *            callback Callback function to be called after loading in the
	 *            store.
	 */
	Plugin.RdfStore.prototype.insertData = function(data, dataFormat, callback) {
		var that = this;

		if (dataFormat === "text/turtle" || dataFormat === "text/plain"
				|| dataFormat === "text/n3") {
			// get prefix terms and update namespaces
			var prefixTerms = data.match(/.*@prefix.*>(\s)*./g);
			if (prefixTerms) {
				$.each(prefixTerms,
						function(i, val) {
							var prefixTerm = (val.split(/>(\s)*./)[0])
									.split(/:(\s)*</);
							var prefix = prefixTerm[0].replace(/@prefix(\s)*/,
									"");
							var uri = prefixTerm[2];
							if (isUndefinedOrNull(namespaces[prefix])) {
								namespaces[prefix] = uri;
								that._generateQueryPrefix(prefix, uri);
							}
						});
			}
		} else if (dataFormat === "application/ld+json"
				|| dataFormat === "application/json") {
			var prefixes = data["@context"];
			if (prefixes) {
				$.each(prefixes, function(i, val) {
					if (isUndefinedOrNull(namespaces[val])) {
						namespaces[i] = val;
						that._generateQueryPrefix(i, val);
					}
				});
			}
		}
		this._store.load(dataFormat, data, function(store) {
			callback();
		});
	};

	/**
	 * Executes given query on the store
	 * 
	 * @method executeQuery
	 * @param {String}
	 *            query Data to insert into the store
	 * @param {Function}
	 *            callback Callback function to be called with the results of
	 *            the execution.
	 * @param {Function}
	 *            fail Callback function to be called if the execution fails.
	 */
	Plugin.RdfStore.prototype.executeQuery = function(query, callback, fail) {
		this._store.execute(this._queryPrefixes + query, function(success,
				results) {
			if (success) {
				callback(results);
			} else {
				print("Error on executing: " + query);
				fail();
			}
		});
	};

	// ========================= bSynopsis: LayoutEngine Class
	// ==============================
	/**
	 * Layout engine to add items to. Default: jQuery.isotope
	 * http://isotope.metafizzy.co/
	 * 
	 * @class Plugin.LayoutEngine
	 * @constructor
	 * @param {jQuery}
	 *            container Container to use the layout engine on
	 * @param {Object}
	 *            options Options object for the layout engine
	 */
	Plugin.LayoutEngine = function(container, options) {
		this._container = container;
		// Use isotope on layout callback to trigger event
		container.isotope($.extend(options, {onLayout : function() {
						container.trigger(CONS.EVENT_TYPES.layout.done);
					}}));
	};

	/**
	 * Adds items to the layout engine
	 * 
	 * @method add
	 * @param {jQuery}
	 *            items Div boxes which are to be added
	 * @param {Function}
	 *            callback Callback function
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
	 * @param {jQuery}
	 *            items Div boxes which are to be removed
	 * @param {Function}
	 *            callback Callback function
	 */
	Plugin.LayoutEngine.prototype.remove = function(items, callback) {
		this._container.isotope("remove", items, callback);
	};

	/**
	 * Update the sort data of the layout engine on specified items
	 * 
	 * @method updateSortData
	 * @param {item}
	 *            item Items for which sort data should be updated
	 */
	Plugin.LayoutEngine.prototype.updateSortData = function(item) {
		this._container.isotope("updateSortData", item);
	};

	/**
	 * Update the options of the layout engine
	 * 
	 * @method updateSortData
	 * @param {Object}
	 *            options Options object of the layout engine
	 */
	Plugin.LayoutEngine.prototype.updateOptions = function(options) {
		this._container.isotope(options);
	};


	// ========================= bSynopsis: Node Class ==============================
	/**
	 * Base node to represent an abstract element of the rdf graph.
	 * 
	 * @class Plugin.Node
	 * @constructor
	 * @param {Object}
	 *            data Data of a single resource of a select query. Must contain index.
	 */
	Plugin.Node = function(data, style) {
		//this.label = data.label;
		//this.description = data.description;
		this.id = data.index; // ID for this node
		this.type = CONS.NODE_TYPES.stdNode; // Node Type
		this.useTemplateID = this.type; // Use Templated stored under this name
		this.filterables = []; // Classes used for filtering
		this.componentTypes = {};
		this.components = {}; // Components of the node
		this.style = style;
		if (data.predicate) { // Empty predicates are possible on init view
			this.filterables.push(UTIL.toFilterable(data.predicate.type));
			this.addComponent("predicate", data.predicate);
		}
		if(data.description) {
			this.addComponent("description", data.description);
		}
	};

	/**
	 * Add a new component to this node
	 * 
	 * @method addNewComponent
	 */
	Plugin.Node.prototype.addComponent = function(type, data, style) {
		if(this.componentTypes[type]) {		// Increase counter
			this.componentTypes[type]++;
		} else {
			this.componentTypes[type] = 1;
		}
		var id = type + this.componentTypes[type];
		var predComp;
		if (style) {
			predComp = new Plugin.Node.Component(id, type, data, style);
		} else {
			predComp = new Plugin.Node.Component(id, type, data);
		}
		this.components[id] = predComp;
	}
	
	/**
	 * Check if node has this component. You can search for type or id
	 * 
	 * @method hasComponent
	 * @param {String}
	 *            id ID to look for.
	 * @returns {Boolean}
	 */
	Plugin.Node.prototype.hasComponent = function(id) { // Increment counter and return
		return this.components.hasOwnProperty(id)
	}
	
	/**
	 * Check if node has this component type and get the first component of this type. Returns false if no object is found.
	 * 
	 * @method getFComponentOT
	 * @param {String}
	 *            type Type to look for.
	 * @returns {Object}
	 */
	Plugin.Node.prototype.getFComponentOT = function(type) { // Increment counter and return
		if(this.componentTypes[type]) {
			return this.components[type+"1"];
		} else {
			return false;
		}
	}
	
	/**
	 * Check if node has a component of this type. Returns false or true.
	 * 
	 * @method hasComponentType
	 * @param {String}
	 *            type Type to look for.
	 * @returns {Boolean}
	 */
	Plugin.Node.prototype.hasComponentType = function(type) { // Increment counter and return
		return this.componentTypes.hasOwnProperty(type);
	}
	
	Plugin.Node.prototype.forEachComponentType = function(type, fn) { // Increment counter and return
		for (var i = 1; i <= this.componentTypes[type]; i++) {
			fn(this.components[type+i]);
		}
	}

	/**
	 * Return type of node
	 * 
	 * @method getType
	 */
	Plugin.Node.prototype.getType = function() {
		return this.type;
	};

	/**
	 * Return template name to use for this node
	 * 
	 * @method getTemplateIdentifier
	 */
	Plugin.Node.prototype.getTemplateIdentifier = function() {
		return this.useTemplateID;
	};

	/**
	 * Set label of predicate with given position number.
	 * 
	 * @method setPredicateLabel
	 * @param {Integer}
	 *            ind
	 * @param{String} label
	 */
	Plugin.Node.prototype.setPredicateLabel = function(i, label) {
		this.components["predicate" + i].label = label;
	};

	Plugin.Node.prototype.generateTile = function() {
		var $tile = $(templates["tileWrapper"](appendCssClasses({
			node : this
		}))).append($(templates[this.useTemplateID](appendCssClasses({
			node : this
		}))));
		$tile.data("node", this);
		print("Tile generated");
		print($tile);
		return $tile;
	};

	/**
	 * Node component to be shown on a tile
	 * 
	 * @class Plugin.Node
	 * @constructor
	 * @param {Object}
	 *            data Data of a single resource of a select query. Must contain
	 *            label and index.
	 */
	Plugin.Node.Component = function(id, type, data, style) {
		this.id = id;
		this.type = type;
		this.data = data;
		this.style = style;
	};

	/**
	 * Extension of base node to represent an std element of the rdf graph.
	 * 
	 * @class Plugin.ResNode
	 * @constructor
	 * @param {Object}
	 *            data Data of a single resource of a select query. Must contain
	 *            label and index.
	 * @param {Object}
	 *            itemStyle Node style object.   
	 */
	Plugin.ResNode = function(data) {
		// Call node constructor
		Plugin.Node.call(this, data);
		var that = this;
		// Function for ID generation
		var generateID = function() {		
			var id = that.components.uri1.data;
			that.forEachComponentType("predicate", function(predicate){
				id += predicate.value;
			});
			return id;
		};
		this.type = CONS.NODE_TYPES.resNode;		// Overwrite std node type
		this.addComponent("uri", data.subject.value, {display : "none"});
		if (isUndefinedOrNull(data.label)) {
			this.addComponent("label",{
				value : this.uri
			}); 
		} else {
			data.label.value = unescape(data.label.value);
			this.addComponent("label", data.label); 
		}
		this.id = generateID();				// Overwrite id
		print(this);
	};

	Plugin.ResNode.prototype = Object.create(Plugin.Node.prototype);
	Plugin.ResNode.prototype.constructor = Plugin.ResNode;

	/**
	 * Merges data of given node with own data.
	 * 
	 * @method setPredicateLabel
	 * @param {Node}
	 *            otherNode
	 * @returns {}
	 */
	Plugin.ResNode.prototype.merge = function(otherNode) {
		var that = this, update = false;
		$.each(otherNode, function(prop, propVal) {
			switch (prop) {
			case "label":
				if ((propVal.lang && propVal.lang === "en")
						&& !(propVal.lang || propVal.lang === "en")) {
					update = true;
					this.label = propVal;
				}
				break;

			case "predicates":
				var updatePred = true;
				$.each(that.predicates, function(i, predicate) {
					if (predicate.value === propVal[0].value
							&& predicate.type === propVal[0].type) {
						updatePred = false;
					} else if (that.filterables.indexOf(UTIL
							.toFilterable(propVal[0].type)) === -1) {
						that.filterables.push(UTIL
								.toFilterable(propVal[0].type));
					}
				});
				if (updatePred) {
					update = true;
					that.predicates.push(propVal[0]);
				}
			}
		});
		return update;
	};

	Plugin.ResNode.prototype.generateTile = function() {
		var $tile = Plugin.Node.prototype.generateTile.call(this);
		print("ResNode Tile generated");
		return $tile;
	}

	Plugin.LiteralNode = function(data) {
		var that = this;
		// Call node constructor
		Plugin.Node.call(this, data);
		// Function for ID generation
		var generateID = function() {			
			var id = that.getFComponentOT("label").data.value;
			that.forEachComponentType("predicate", function(predicate){
				id += predicate.value;
			});
			return id;
		};
		this.type = CONS.NODE_TYPES.literal;
		print(data.subject.value)
		this.addComponent("label", data.subject);
		this.id = generateID();
		print(this);
	};

	Plugin.LiteralNode.prototype = Object.create(Plugin.Node.prototype);
	Plugin.LiteralNode.prototype.constructor = Plugin.LiteralNode;

	Plugin.LiteralNode.prototype.generateTile = function() {
		var $tile = Plugin.Node.prototype.generateTile.call(this);
		print("LiteralNode Tile generated");
		return $tile;
	}

	Plugin.BlankNode = function(data) {
		// Call node constructor
		Plugin.Node.call(this, data);
		var that = this;
		// Function for ID generation
		var generateID = function() {			
			return '_' + Math.random().toString(36).substr(2, 9); // TODO
		};
		this.type = CONS.NODE_TYPES.blankNode;
		this.addComponent("label", {
			value : "BlankNode - TODO"
		});
		this.id = generateID();
	};

	Plugin.BlankNode.prototype = Object.create(Plugin.Node.prototype);
	Plugin.BlankNode.prototype.constructor = Plugin.BlankNode;

	Plugin.BlankNode.prototype.generateTile = function() {
		var $tile = Plugin.Node.prototype.generateTile.call(this);
		print("BlankNode Tile generated");
		return $tile;
	};

	Plugin.NodeFactory = {
		makeNode : function(data, options) {
			var node;
			switch (data.subject.token) {
			case UTIL.toToken(CONS.CSS_CLASSES.patternClasses.blanknode):
				node = new Plugin.BlankNode(data);
				break;
			case UTIL.toToken(CONS.CSS_CLASSES.patternClasses.literal):
				node = new Plugin.LiteralNode(data, options.literalStyle);
				break;
			case UTIL.toToken(CONS.CSS_CLASSES.patternClasses.uri):
				if (data.label
						&& (data.label.lang === undefined || data.label.lang === "en")) {
					node = new Plugin.ResNode(data, options.itemStyle);
				}
				break;
			default:
				console.log(CONS.MESSAGES.error.tokenType + data.subject.token);
			}
			return node;
		}
	};


	// ========================= bSynopsis: Layer Class
	// ==================================
	/**
	 * Layer to be shown
	 * 
	 * @class Plugin.Layer
	 * @constructor
	 * @param {jQuery}
	 *            $container Parent div container
	 * @param {Object}
	 *            options Options object of the view
	 * @param {Plugin}
	 *            plugin Parent plugin
	 * @param {Object}
	 *            queries Queries to use in the view
	 */
	Plugin.Layer = function($container, options, plugin, queries) {

		var that = this;

		this.plugin = plugin;
		this.options = options;

		// Use this node filters
		this.filterNames = [];
		$.each(plugin.options.nodeFilters, function(i, filter) {
			print("Filters found:");
			print(filter);
			that.filterNames.push(i);
		});
		$.each(plugin.options.tileFilters, function(i, filter) {
			print(filter);
			if (that.filterNames[i]) {
				console.log(CONS.MESSAGES.warn.filterName);
			} else {
				that.filterNames.push(i);
			}
		});

		this.model = new Plugin.Layer.Model(queries, options.modelOptions,
				plugin._queries.label);
		this.view = new Plugin.Layer.View(this.model, $container,
				options.viewOptions);

		this.model.itemsAdded.attach(function(sender, args) {
			that.view.paint(args.addedNodes, that.plugin);
		});

		if (options.generateSortOptions || options.generateFilterOptions
				|| plugin.options.generateTimeline) {
			this.view.addOptionsBox();
			if (options.generateSortOptions) {
				this.view.addSorter();
			}
			if (options.generateFilterOptions) {
				this.view.addIsotopeFilter();
			}
		}
	};

	Plugin.Layer.prototype.update = function() {
		this.model.update();
	};

	Plugin.Layer.prototype.switchFilterState = function(filterName) {
		var that = this;

		if (filterName === "on") {
			that.filterNames = [];
			$.each(that.plugin.options.nodeFilters, function(i, filter) {
				that.filterNames.push(i);
			});
			$.each(that.plugin.options.tileFilters, function(i, filter) {
				if (that.filterNames[i]) {
					console.log(CONS.MESSAGES.warn.filterName);
				} else {
					that.filterNames.push(i);
				}
			});
		} else {

			if (this.filterNames.indexOf(filterName) !== -1) {
				this.filterNames
						.splice(this.filterNames.indexOf(filterName), 1);
			} else {
				this.filterNames.push(filterName);
			}
		}

		var nodeFilters = {};
		var tileFilters = {};
		$.each(this.filterNames, function(i, val) {
			if (that.plugin.options.nodeFilters[val]) {
				nodeFilters[val] = that.plugin.options.nodeFilters[val];
			}
			if (that.plugin.options.tileFilters[val]) {
				tileFilters[val] = that.plugin.options.tileFilters[val];
			}
		});

		this.view.clearView(function() {
			that.view.paint(that.model.getNodes(), that.plugin, nodeFilters,
					tileFilters);
		});
	};
	/**
	 * Clear the view
	 * 
	 * @method removeAllItems
	 */
	Plugin.Layer.prototype.removeAllItems = function() {
		this.model.clearModel();
	};
	
	Plugin.Layer.Model = function(viewQueries, options, labelQuery) {

		var that = this;
		this.viewQueries = viewQueries;
		this.labelQuery = labelQuery;
		this.options = options;

		// List of added items.
		this._nodes = {};
		this.nodesLength = 0;

		this.itemsAdded = new Plugin.Event(this);
		this.modelCleared = new Plugin.Event(this);
		this.itemUpdated = new Plugin.Event(this);

		// Helper for batch adding
		this._checkItemsHelp = function(items, batchSize) {
			var rest = items.slice(batchSize);
			if (rest.length > 0) {
				that.checkItems(rest);
			}
		};

		/**
		 * Fetches and updates the labels of the predicates of given node
		 * 
		 * @private
		 * @method _fetchPredicateLabel
		 * @param {Plugin.Node}
		 *            node Node to fetch the predicate labels for
		 */
		this._fetchPredicateLabel = function(node) {

			if (node.hasComponentType("predicate")) {
				for(var i = 1; i < node.componentTypes["predicate"]; i++) {
					var predicate = node.components["predicate"+i];
					if (!labelCache.contains(predicate.value)) {
						var labelQuery = replaceDummy(that.labelQuery, 
								predicate.value);
						rdfStore.executeQuery(labelQuery, function(results) {
							if (results && results[0]) {
								$.each(results, function(i, result) {
									node.setPredicateLabel(i,
											result.label.value);
									labelCache.add(predicate.value,
											result.label.value);
								});
							}
						});
					} else {
						node.setPredicateLabel(i, labelCache
								.retrieve(predicate.value));
					}
				}
			}
			return node;
		};

	};

	/**
	 * Give back a copy of in model stored nodes
	 * 
	 * @return {Object} nodes A copy of the stored nodes
	 */
	Plugin.Layer.Model.prototype.getNodes = function() {
		return deepCopy(this._nodes);
	};

	/**
	 * Look in given resultSet for Items to add to the model.
	 * 
	 * @method checkItems
	 * @param {Object}
	 *            resultSet ResultSet of a Select query
	 */
	Plugin.Layer.Model.prototype.checkItems = function(resultSet) {
		var length = resultSet.length, that = this, batchSize = ((length < that.options.batchSize) ? length
				: that.options.batchSize);

		// current batch
		var batch = resultSet.slice(0, batchSize);
		var addedNodes = {};

		$.each(batch, function(i, val) {
			val.subject.token = UTIL.toToken(UTIL
					.toClass(val.subject.token));
			val.index = that.nodesLength + 1;
			var node = Plugin.NodeFactory.makeNode(val, that.options);

			if (node) {

				switch (node.getType()) {
				case CONS.NODE_TYPES.resNode:
					if (!(node.id in that._nodes)) {
						that._nodes[node.id] = node;
						that.nodesLength++;
					} else {
						if (that._nodes[node.id].merge(node)) {
							node = that._nodes[node.id];
							that.itemUpdated.notify(node);
						} else {
							node = undefined;
						}
					}
					break;
				case CONS.NODE_TYPES.literal:
					if (!(node.id in that._nodes)) {
						that._nodes[node.id] = node;
						that.nodesLength++;
					} else {
						// TODO check literal UPDATE
						node = undefined;
						print("literalupdate");
					}
					break;
				case CONS.NODE_TYPES.blankNode:
					if (!(node.id in that._nodes)) {
						that._nodes[node.id] = node;
						that.nodesLength++;
					} else {
						// TODO check blankNode UPDATE ?
						print(node);
						print("blankNodeupdate");
						node = undefined;
					}
					break;
				}
				if (node) {
					node = that._fetchPredicateLabel(node);
					addedNodes[node.id] = node;
				}
			}
		});
		this.itemsAdded.notify({
			"addedNodes" : deepCopy(addedNodes),
			"allNodes" : this.getNodes()
		});
		that._checkItemsHelp(resultSet, batchSize);
	};

	/**
	 * Get data for the model by querying the local store
	 * 
	 * @method update
	 */
	Plugin.Layer.Model.prototype.update = function() {
		var that = this;
		this.allResults = [];
		// Concat all results for filtering before adding
		for (var i = 0; i < this.viewQueries.length; i++) {
			rdfStore
					.executeQuery(
							this.viewQueries[i].query,
							function(results) {
								if (results && results.length !== 0) {
									for (var j = 0; j < results.length; j++) {
										// Add types for filtering
										if (that.viewQueries[i].type) {
											results[j].predicate.type = that.viewQueries[i].type;
										}
										that.allResults.push(results[j]);
									}
								}
							});
		}

		if (this.allResults.length > 0) {
			that.checkItems(this.allResults);
		} else {
			print("Nothing to add to View");
		}
	};

	Plugin.Layer.Model.prototype.clearModel = function() {
		this._nodes = {};
		this.modelCleared.notify();
	};

	Plugin.Layer.View = function(model, $container, viewOptions) {

		var that = this;
		this.options = viewOptions;

		this._model = model;

		this.$container = $container;
		this.$outerContainer = $('<div class="'
				+ CONS.CSS_CLASSES.outerContainer + '"></div>');
		this.$viewContainer = $('<div class="' + CONS.CSS_CLASSES.viewContainer
				+ '"></div>');
		this.$container.append(this.$outerContainer);
		this.$outerContainer.append(this.$viewContainer);
		this.layoutEngine = new Plugin.LayoutEngine(this.$viewContainer,
				viewOptions.layoutEngine);

		this._getCorrespondingTile = function(node) {
			var $tile = this.$viewContainer.find(UTIL.toClassSelector(node.id));
			print("CorrespondingTile");
			print($tile);
			return $tile;
		};

		// attach model listeners
		// on items added
		// this._model.itemsAdded.attach(
		// function(sender, nodes) {

		// //Generate tiles for nodes
		// var $literalTiles = $("<div>");
		// var $resTiles = $("<div>");
		// var $blankNodeTiles = $("<div>");
		//
		// $.each(nodes, function(i, node) {
		// that._generateTile(node, $resTiles, $literalTiles, $blankNodeTiles);
		// });
		//                
		// $literalTiles = $literalTiles.children();
		// $resTiles = $resTiles.children();
		// $blankNodeTiles = $blankNodeTiles.children();
		// var $allTiles =
		// $().add($resTiles).add($blankNodeTiles).add($literalTiles);
		// var $browsableTiles = $().add($resTiles).add($blankNodeTiles);
		//
		// //Add all tiles
		// that.layoutEngine.add($allTiles, function(){
		// that._initBrowsability($browsableTiles);
		// });

		// });

		// on items update
		// this._model.itemUpdated.attach(
		// function(sender, node) {
		// var $tile = that._getCorrespondingTile(node);
		// that.layoutEngine.remove($tile);
		// });

		// on model clearing
		this._model.modelCleared.attach(function(sender) {
			that.layoutEngine.remove($(UTIL
					.toSelector(CONS.CSS_CLASSES.tileClasses.tile)),
					function() {
						print("view cleared");
					});
		});
	};

	Plugin.Layer.View.prototype.paint = function(nodes, plugin, nodeFilters,
			tileFilters) {
		var that = this;
		if (nodeFilters) {
			filters = nodeFilters;
		} else {
			filters = plugin.options.nodeFilters;
		}
		var startTime = new Date().getTime();

		// Run nodeFilters on nodes
		$.each(filters, function(i, filter) {
			if (!$.isEmptyObject(nodes)) {
				nodes = filter.fn(plugin, nodes, filter.config, that);
			} else {
				console.log(CONS.MESSAGES.warn.filterInput);
			}
			print("Filter " + i + " done at: " + (new Date().getTime() - startTime) + " milisec");
		});

		// Generate all tiles
		var $tiles = $("<div>");
		$.each(nodes, function(i, node) {
			$tiles.append($(node.generateTile()));
		});

		if (tileFilters) {
			filters = tileFilters;
		} else {
			filters = plugin.options.tileFilters;
		}

		// Run tileFilters on tiles
		$tiles = $tiles.children();
		$.each(filters, function(i, filter) {
			$tiles = filter.fn(plugin, $tiles, filter.config, that);
			print("Filter " + i + " done at: " + (new Date().getTime() - startTime) + " milisec");
		});
		this.addTiles($tiles);
	};

	Plugin.Layer.View.prototype.clearView = function(callback) {
		this.removeTiles(this.$viewContainer.find(UTIL
				.toSelector(CONS.CSS_CLASSES.tileClasses.tile)));
		// this.$viewContainer.find(".item").remove();
		// this.layoutEngine.reLayout();
		if (callback) {
			callback();
		}
	};

	Plugin.Layer.View.prototype.removeTiles = function($tiles, callback) {
		var that = this;
		$.each($tiles, function(i, tile) {
			var $tile = $(tile);
			that.layoutEngine.remove($tile);
		});
	};

	Plugin.Layer.View.prototype.addTiles = function($tiles) {
		var that = this;
		this.layoutEngine.add($tiles);
	};

	Plugin.Layer.View.prototype.addOptionsBox = function() {
		this.$optionsContainer = $('<section class="'
				+ CONS.CSS_CLASSES.options + '" class="'
				+ CONS.CSS_CLASSES.clearfix + '"></section>');
		this.$container.prepend(this.$optionsContainer);
	};

	Plugin.Layer.View.prototype.addSorter = function() {
		// Add sortoptions
		var that = this;

		var sortData = $.extend({}, this.options.layoutEngine.getSortData);
		delete sortData["group"];
		var sortOptions = templates.sortOptions(appendCssClasses({
			optionSet : sortData
		}));
		this.$optionsContainer.prepend(sortOptions);
		var $sorter = this.$optionsContainer.find(' > '
				+ UTIL.toSelector(CONS.CSS_CLASSES.sorter));

		// Set selected on view
		$sorter.find('.' + this.options.layoutEngine.sortBy).addClass(
				"selected");
		var $sortLinks = this.$optionsContainer.find('a');

		$sorter.append(templates.groupDropDown(appendCssClasses({
			type : {
				label : "type",
				val : CONS.FA_TAG
			},
			token : {
				label : "node-type",
				val : CONS.TOKEN_TAG
			}
		})));
		var $sorterGroup = $sorter.find('#GroupDropDown');

		// Add onChange
		$sorterGroup.change(function(e) {

			// get href attribute, minus the '#'
			var groupBy = $(this).val();

			that.$container.find(
					UTIL.toSelector(CONS.CSS_CLASSES.sorter)
							+ ' > > > .selected').removeClass('selected');
			that.layoutEngine.updateOptions({
				getSortData : {
					group : function($elem) {
						var classes = $elem.attr("class");
						var pattern = new RegExp("(\s)*[a-zA-Z0-9]*" + groupBy
								+ "[a-zA-Z0-9_]*(\s)*", 'g');
						var groups = classes.match(pattern), group = "";
						if (groups !== null) {
							for (var i = 0; i < groups.length; i++) {
								group += groups[i] + " ";
							}
						}
						return group;
					}
				}
			});
			that.layoutEngine.updateSortData(that.$viewContainer.find(UTIL
					.toSelector(CONS.CSS_CLASSES.tileClasses.tile)));
			that.$container.find(
					"> > " + UTIL.toSelector(CONS.CSS_CLASSES.groupLabel))
					.remove();
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
			that.$optionsContainer.find(
					UTIL.toSelector(CONS.CSS_CLASSES.sorter)
							+ ' > > > .selected').removeClass("selected");
			that.$container.find(
					"> > " + UTIL.toSelector(CONS.CSS_CLASSES.groupLabel))
					.remove();
			$(this).addClass("selected");
			that.layoutEngine.updateOptions({
				layoutMode : 'masonry',
				sortBy : sortName
			});
			return false;
		});
	};

	Plugin.Layer.View.prototype.addIsotopeFilter = function() {
		// Add options
		var that = this;
		var filterOptions = templates.filterOptions(appendCssClasses({
			filterOptions : that.options.filterBy
		}));
		this.$optionsContainer.append(filterOptions);

		var $filter = this.$optionsContainer.find(' > '
				+ UTIL.toSelector(CONS.CSS_CLASSES.filter));
		var $filterLinks = $filter.find('a');

		// Add onClick
		$filterLinks.click(function() {
			// get href attribute, minus the '#'
			var selector = $(this).attr('data-filter-value');
			if (selector !== '*') {
				selector = "." + CONS.FA_TAG + selector;
			}
			that.$container.find(
					UTIL.toSelector(CONS.CSS_CLASSES.filter)
							+ ' > > > .selected').removeClass('selected');
			$(this).addClass('selected');
			that.layoutEngine.updateOptions({
				filter : selector
			});
			return false;
		});

		$filter
				.append('<input id="filterField" type="text" size="25" value="Enter search here.">');
		var $filterBox = $filter.find('#filterField');

		// Add onKey
		$filterBox
				.keyup(function(e) {

					// get href attribute, minus the '#'
					var selector = $(this).val();
					if (selector !== '') {
						if (selector !== '*') {
							if (that.options.supportRegExpFilter) {
								try {
									selector = "div:regex(class, " + selector
											+ "), div > div:contains("
											+ selector + ")";
								} catch (e) {
									selector = "div > div:contains(" + selector
											+ ")";
								}
							} else {
								selector = "div > div:contains(" + selector
										+ ")";
							}
						}
					} else {
						selector = '*';
					}

					that.$container.find(
							UTIL.toSelector(CONS.CSS_CLASSES.filter)
									+ ' > > > .selected').removeClass(
							'selected');
					that.layoutEngine.updateOptions({
						filter : selector
					});
					return false;
				});
	};

	// ========================= bSynopsis: InitLayer Class
	// ==============================
	/**
	 * Initialization view of the plugin
	 * 
	 * @class Plugin.InitLayer
	 * @extends Plugin.Layer
	 * @constructor
	 * @param {jQuery}
	 *            $container Container of the initialization view
	 * @param {Object}
	 *            options Options object
	 * @param {Plugin}
	 *            plugin The parent plugin of the initialization view
	 */
	Plugin.InitLayer = function($container, options, plugin) {
		Plugin.Layer.call(this, $container, options, plugin,
				plugin.options.initQueries);
	};

	// pseudo class inheritance
	Plugin.InitLayer.prototype = Object.create(Plugin.Layer.prototype);
	Plugin.InitLayer.prototype.constructor = Plugin.InitLayer;

	// ========================= bSynopsis: DetailLayer Class
	// ==============================
	/**
	 * Detailed view of an subject / item
	 * 
	 * @class Plugin.DetailLayer
	 * @extends Plugin.Layer
	 * @constructor
	 * @param {jQuery}
	 *            $container Container of the detail view
	 * @param {Object}
	 *            options Options object
	 * @param {Plugin}
	 *            plugin The parent plugin of the detail view
	 * @param {jQuery}
	 *            $item Item to get the detail view from
	 */
	Plugin.DetailLayer = function($container, options, plugin, $item) {
		var that = this;
		this.$item = $item;
		this.node = $item.data("node");

		if (plugin.options.generateTimeline) {
			var $timelineNode = $(templates.timelineItem(that.node));
			$timelineNode.css({
				"background-color" : that.$item.css("background-color")
			});
			plugin._$timeline.prepend($timelineNode);
			$timelineNode.data("node", that.node);
			$timelineNode.click(function() {
				plugin.addLayer(plugin.generateLayer($timelineNode));
				plugin._$timelineContainer.data("isExpanded", false);
				plugin._$timelineContainer.css({
					opacity : 0,
					zIndex : -1
				});
			})
		}

		var queries = [];
		switch (that.node.getType()) {
		case CONS.NODE_TYPES.literal:
			var literalIsObjectOf = replaceDummy(
					plugin._queries.literalIsObjectOf, this.node.getFComponentOT("value").data);
			queries.push({
				query : literalIsObjectOf,
				type : CONS.CSS_CLASSES.typeClasses.incoming
			});
			break;
		case CONS.NODE_TYPES.resNode:
		default:
			var subjectOfQuery = replaceDummy(plugin._queries.selectSubjectOf,
					this.node.getFComponentOT("uri").data);
			var objectOfQuery = replaceDummy(
					plugin._queries.selectObjectOf, this.node.getFComponentOT("uri").data);
			queries.push({
				query : subjectOfQuery,
				type : CONS.CSS_CLASSES.typeClasses.outgoing
			});
			queries.push({
				query : objectOfQuery,
				type : CONS.CSS_CLASSES.typeClasses.incoming
			});
		}

		var $overlayContent = $container.find('> '
				+ UTIL.toSelector(CONS.CSS_CLASSES.overlayContent));

		if (plugin.options.generateTimeline) {
			// <---- open timeline click Event ---->
			var $btnTimeline = $container.find('> span'
					+ UTIL.toSelector(CONS.CSS_CLASSES.buttonTimeline));
			eventManagers[plugin.pluginID]
					.addEventHandler('click',
							function() {
								if (plugin._$timelineContainer
										.data("isExpanded")) {
									plugin._$timelineContainer.data(
											"isExpanded", false);
									plugin._$timelineContainer.css({
										opacity : 0,
										zIndex : -1
									});
								} else {
									plugin._$timelineContainer.data(
											"isExpanded", true);
									var color = new RGBColor(that.$item
											.css("background-color"));
									color.r -= 20;
									color.b -= 20;
									color.g -= 20;
									plugin._$timelineContainer.css({
										"background-color" : color.toRGB(),
										opacity : 1,
										zIndex : 9999
									});
								}
							}, $btnTimeline);
			// <!---open timeline click Event ---->
		}

		// <---- close click Event ---->
		var $close = $container.find('> span'
				+ UTIL.toSelector(CONS.CSS_CLASSES.buttonClose));
		eventManagers[plugin.pluginID].addEventHandler('click', function() {
			that.close();
		}, $close);
		// <!--- close click Event ---->

		// Input for the handlebar
		// template
		var input = {};
		input.label = $item.find(
				UTIL.toSelector(CONS.CSS_CLASSES.tileClasses.label)).text();

		// write new data
		$overlayContent.append($(templates.overlayContent(appendCssClasses({
			node : this.node
		}))));

		Plugin.Layer.call(this, $overlayContent.find(UTIL
				.toSelector(CONS.CSS_CLASSES.innerScroll)), options, plugin,
				queries);

		this.$overlay = $container;

		// JQuery multiSelect
		// http://www.erichynds.com/blog/jquery-ui-multiselect-widget
		this.$overlay.find("#filterSelect").multiSelect({
			'selectAllText' : CONS.MESSAGES.out.selectAllFilters
		}, function(select) {
			that.switchFilterState(select.val());
		});
		this.$overlayContent = $overlayContent;

		// Function to init content of given full view overlay.
		this._initOverlayContent = function($container, callback) {

			that.update();

			if (that.options.remoteOptions.remoteDynamically) {
				that.loadByRemote();
			}

			// Set background color
			var color = new RGBColor(that.$item.css("background-color"));
			$container.css("background-color", color.toRGB());
			$.each($overlayContent.children('div'
					+ UTIL.toSelector("innerScroll")), function(i, val) {
				color.r -= 10;
				color.b -= 10;
				color.g -= 10;
				$(val).css("background", color.toRGB());
			});

			// Set content width
			// $overlayContent.find('> .overlayColumn').css("width", 100 + "%");

			// Set innerScrollBox width and height
			$overlayContent
					.find(UTIL.toSelector(CONS.CSS_CLASSES.innerScroll))
					.css(
							"width",
							($window.width()
									- parseInt($container.css("padding-left")) - parseInt($container
									.css("padding-right")))
									+ "px");
			$overlayContent
					.find(UTIL.toSelector(CONS.CSS_CLASSES.innerScroll))
					.css(
							"height",
							$window.height()
									- $overlayContent
											.find(
													UTIL
															.toSelector(CONS.CSS_CLASSES.innerNoScroll))
											.height() + "px");

			callback();
		};

		// Fill overlay with content
		that
				._initOverlayContent(
						$container,
						function() {
							// <---- overlay show function ---->
							var previewClip = getClip(CONS.CSS_CLASSES.preview), overlayClip = getClip(CONS.CSS_CLASSES.overlay);

							// Make overlay visible
							$container.css({
								clip : supportTransitions ? previewClip
										: overlayClip,
								opacity : 1,
								zIndex : 9998,
								pointerEvents : 'auto'
							});

							if (supportTransitions) {
								$container
										.on(
												transEndEventName,
												function() {

													$container
															.off(transEndEventName);

													setTimeout(
															function() {
																$container
																		.css(
																				'clip',
																				overlayClip)
																		.on(
																				transEndEventName,
																				function() {
																					$container
																							.off(transEndEventName);
																					plugin.$body
																							.addClass('noscroll');
																				});
															}, 25);

												});
							} else {
								plugin.$body.addClass('noscroll');
							}
							// <!--- overlay show function ---->
						});
	};

	// pseudo class inheritance of Layer
	Plugin.DetailLayer.prototype = Object.create(Plugin.Layer.prototype);
	Plugin.DetailLayer.prototype.constructor = Plugin.DetailLayer;

	/**
	 * Load children by remote service
	 * 
	 * @method loadByRemote
	 */
	Plugin.DetailLayer.prototype.loadByRemote = function() {

		var that = this;

		if (!that.remoteDataLoader) {
			that.remoteDataLoader = new Plugin.RemoteDataLoader(
					that.options.remoteOptions.remoteBackend,
					that.plugin.pluginID);
		}

		// Get items who are in a relation to
		// current item
		switch (that.node.getType()) {
		case CONS.NODE_TYPES.resNode:
			var remoteSubjectOf = replaceDummy(
					that.plugin._queries.remoteSubjectOf, that.node.getFComponentOT("uri").data), remoteObjectOf = replaceDummy(
					that.plugin._queries.remoteObjectOf, that.node.getFComponentOT("uri").data);

			// remote needed?
			that.remoteDataLoader.insertByQuery(remoteSubjectOf + " LIMIT "
					+ that.options.remoteOptions.remoteLimit);
			that.remoteDataLoader.insertByQuery(remoteObjectOf + " LIMIT "
					+ that.options.remoteOptions.remoteLimit);
			break;
		case CONS.NODE_TYPES.literal:
			var remoteLiteralIsObjectOf = replaceDummy(
					that.plugin._queries.remoteLiteralIsObjectOf,
					that.node.getFComponentOT("value"));

			// remote needed?
			that.remoteDataLoader.insertByQuery(remoteLiteralIsObjectOf
					+ " LIMIT " + that.options.remoteOptions.remoteLimit);
			break;
		}
	};

	/**
	 * Closes the view
	 * 
	 * @method close
	 */
	Plugin.DetailLayer.prototype.close = function() {
		var that = this;

		// clear old data
		that.plugin.removeLayer(that);

		var layoutProp = getItemLayoutProp(that.$item), itemClip = 'rect('
				+ layoutProp.top + 'px ' + (layoutProp.left + layoutProp.width)
				+ 'px ' + (layoutProp.top + layoutProp.height) + 'px '
				+ layoutProp.left + 'px)';
		that.$overlay.children().remove('');
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
					that.$overlay.css('opacity', 0).on(transEndEventName,
							function() {
								that.$overlay.off(transEndEventName).css({
									clip : 'auto',
									zIndex : -1
								});
								that.$overlay.remove();
								that.$item.data('isExpanded', false);
							});
				}, 25);

			});
		} else {
			that.$overlay.css({
				opacity : 0,
				zIndex : -1
			});
			that.$overlay.remove();
		}
		// <!--- overlay hide ---->
	};

	// ========================= bSynopsis: Preview Class
	// ==============================
	// TODO preview

	// ========================= bSynopsis: TemplatesLoader Class
	// ==============================
	/**
	 * Handlebars templates loader to load precompiled or nonprecompiled
	 * templates
	 * 
	 * @class Plugin.TemplatesLoader
	 * @constructor
	 * @param {Deferred
	 *            Object} dfd Deferred Object to resolve when loading is done
	 */
	Plugin.TemplatesLoader = function(dfd) {
		this._templateInitDfd = dfd;
		this._neededTemps = [ "filterOptions", "sortOptions", "tileWrapper",
				"stdNode", "groupDropDown", "overlayContent", "overlayWrapper",
				"previewItem", "timelineWrapper", "timelineItem" ];

		this._methodsAreLoaded = function(/*
		 * array of templatenames which must
		 * be loaded
		 */) {
			var i = 0, methodName;
			while (arguments[0[i++]] !== undefined) {
				if (typeof templates[arguments[i]] !== 'function') {
					return false;
				}
			}
			return true;
		};
	};

	Plugin.TemplatesLoader.prototype._isLoaded = function() {
		if (this._methodsAreLoaded(this._neededTemps)) {
			this._templateInitDfd.resolve();
			return true;
		} else {
			console.log(CONS.MESSAGES.error.template);
			this._templateInitDfd.reject();
			return false;
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

	Plugin.TemplatesLoader.prototype.getPrecompiledTemplates = function() {
		templates = window[pluginName]["templates"];
		return this._isLoaded();
	};

	// ========================= bSynopsis: RemoteDataLoader Class
	// ==============================
	/**
	 * Loader to load remote data from services at the given urls and add them
	 * to the view
	 * 
	 * @class Plugin.RemoteDataLoader
	 * @constructor
	 * @param {Array}
	 *            sites Array of URLs of SPARQL services to query
	 * @param {Integer}
	 *            pluginID ID of parten plugin
	 */
	Plugin.RemoteDataLoader = function(sites, pluginID) {
		this.sites = sites;
		this.pluginID = pluginID;

		// Inserts Data by querying given service
		this._insertDataByQuery = function(query, site, callback) {

			// Execute selection query
			remoteEngine.executeQuery(query, site, function(data) {

				// Generate insertionQuery out of the resultset.
				if (data) {
					if (data.subject !== undefined) {
						data = [ data ];
					}
					var insertionQuery = "INSERT DATA {";
					$.each(data, function(i, val) {
						if (val.subject === undefined) {
							print("Resultset disfigured.");
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
							insertionQuery += '"' + escape(val.object.value)
									+ '". ';
						}
						if (val.labelSub) {
							insertionQuery += '<' + val.subject.value
									+ '> rdfs:label "' + val.labelSub.value
									+ '". ';
						}
						if (val.labelObj) {
							insertionQuery += '<' + val.object.value
									+ '> rdfs:label "' + val.labelObj.value
									+ '". ';
						}
						if (val.labelPred) {
							labelCache.add(val.predicate.value,
									val.labelPred.value);
						}
					});
					insertionQuery += "}";

					// Execute insertion
					rdfStore.executeQuery(insertionQuery, function() {
						if (callback) {
							callback(true);
						}
					});
				} else {
					if (callback) {
						callback(false);
					}
				}
			});
		};
	};

	// Inserts Data by querying all services
	Plugin.RemoteDataLoader.prototype.insertByQuery = function(query) {
		var that = this;

		// Inform the plugin something is loading
		eventManagers[that.pluginID].trigger(
				CONS.EVENT_TYPES.loading.start, that);

		$.each(that.sites, function(i, val) {
			that._insertDataByQuery(query, val, function(success) {
				// Inform the plugin loading is done
				eventManagers[that.pluginID].trigger(
						CONS.EVENT_TYPES.loading.done, that);
				if (success) {
					// Inform the plugin that the store has been modified
					eventManagers[that.pluginID].trigger(
							CONS.EVENT_TYPES.store.insert, that);
				}
			});
		});
	};

	// ========================= bSynopsis ===============================

	// Plugin constructor
	/**
	 * Main plugin class of bSynopsis
	 * 
	 * @class Plugin
	 * @constructor
	 * @param {jQuery}
	 *            obj Parent object of the plugin
	 * @param {Object}
	 *            options Options for the plugin
	 */

	// Default options
	/**
	 * Default options for bSynopsis.
	 * 
	 * @property defaults
	 * @type Object
	 */
	var defaults = {
		/**
		 * Filters to be used before node display. Filters only work on single
		 * batches. The batchSize should be chosen big enough if Nodefilters are
		 * to be used. New filters must have a unique identifier.
		 * 
		 * @property defaults.filters
		 * @type Object
		 */
		nodeFilters : {
			/**
			 * Filters blacklisted resources defined by predicate URIs in config
			 * options. Only RegEx allowed.
			 * 
			 * @property defaults.nodeFilters.blacklistPredURI
			 * @type Object
			 */
			blacklistPredURI : {
				fn : function(plugin, nodes, config) {
					$.each(nodes, function(i, node) {
						if (node.hasComponentType("predicate") && config) {
							$.each(config, function(j, exp) {
								for(var i = 0; i <= node.componentTypes.predicate; i++) {
									var res = new RegExp(exp)
									.exec(node.components["predicate"+i].value);
									if (res !== null) {
										delete nodes[i];
									}
								}
							});
						}
					});
					return nodes;
				},
				config : new Array()
			//Regex to be filtered
			},

			/**
			 * Filters blacklisted resources defined by URIs in config options.
			 * Only RegEx allowed.
			 * 
			 * @property defaults.nodeFilters.blacklistURI
			 * @type Object
			 */
			blacklistURI : {
				fn : function(plugin, nodes, config) {
					$.each(nodes, function(i, node) {
						if (node.hasComponentType("uri") && config) {
							$.each(config, function(j, exp) {
								var res = new RegExp(exp).exec(node.components.uri1);
								if (res !== null) {
									delete nodes[i];
								}
							});
						}
					});
					return nodes;
				},
				config : new Array()
			//Regex to be filtered
			},

			/**
			 * Merges resNodes describing the same resource (subject or
			 * object).
			 * 
			 * @property defaults.nodeFilters.multiResNode
			 * @type Object
			 */
			multiResNode : {
				fn : function(plugin, nodes, config) {
					var tempArray = new Array();
					$.each(nodes, function(i, node) {
						if (node.type === "resNode") {
							if (node.components.uri1 in tempArray) {
								tempArray[node.components.uri1].type = "multiResNode";
								//tempArray[node.components.uri1].merge(node); //TODO merge
								//delete nodes[i];
							} else {
								tempArray[node.components.uri1] = node;
							}
						}
					});
					return nodes;
				}
			},

			blankNode : {
				fn : function(plugin, nodes, config) {
					$.each(nodes, function(i, node) {
						if (node.getType() == CONS.NODE_TYPES.stdNode) {
							//TODO Blanknode
							print("TODO Blanknode");
						}
					});
					return nodes;
				},
				config : {

				}
			}

		},
		/**
		 * Filters for tiles
		 * 
		 * @property defaults.tileFilters
		 * @type Object
		 */
		tileFilters : {
			/**
			 * Scales tiles
			 * 
			 * @property defaults.tileFilters.scale
			 * @type Object
			 */
			scale : {
				fn : function(plugin, $tiles, config) {
					
					$.each($tiles, function(i, tile) {
						var $tile = $(tile);
						var node = $tile.data("node");
						var nStyle;
						if(node.style) { // Style passed via node
							nStyle = node.style;
						} else if (config.defaultStyles[node.getType()]) { // Style chosen via node type
							nStyle = config.defaultStyles[node.getType()];
						} else { // Default style
							nStyle = config.defaultStyles["stdNode"];
						}
						if (typeof nStyle.height != "number") { // If height of tiles should be dynamic (depending on components)
							if(node.dynLayoutFn) {	// Function passed via node
								node.dynLayoutFn($tile, node, nStyle, config);
							} else if (config.defaultDynLayoutFns[node.getType()]) { // Function chosen via node type
								config.defaultDynLayoutFns[node.getType()]($tile, node, nStyle, config);
							} else { // Default function
								config.defaultDynLayoutFns["stdNode"]($tile, node, nStyle, config);
							}
						} else {	// If height should be static
							if(node.layoutFn) { // Function passed via node
								node.layoutFn($tile, node, nStyle, config);
							} else if (config.defaultLayoutFns[node.getType()]) { // Function chosen via node type
								config.defaultLayoutFns[node.getType()]($tile, node, nStyle, config);
							} else { // Default function
								config.defaultLayoutFns["stdNode"]($tile, node, nStyle, config);
							}
						}
					});
					return $tiles;
				},
				config : {
					multiplicator : 1,
					defaultLayoutFns : {
						stdNode : function($tile, node, nStyle, config) {
							var anchorY = $tile.height() + nStyle.topPadding;
							var mult = config.multiplicator;
							$tile.width(nStyle.width * mult);
							var height = nStyle.height * mult;
							$tile.height(height);
							var contentHeight = height - (nStyle.topPadding + nStyle.bottomPadding * mult);
							var temp = 0;
							var cStyles = [];
							$.each(node.components, function(i, component) {
								if(component.style) {
									cStyles[i] = component.style;
								} else if (config.defaultContentStyles[component.type]) {
									cStyles[i] = config.defaultContentStyles[component.type];
								} else {
									cStyles[i] = config.defaultContentStyles["stdComponent"];
								}
								if (cStyles[i] && (!cStyles[i].display || cStyles[i].display != "none")) {
									temp += cStyles[i].height;
								}
							});
							$.each(node.components, function(i, component) {
								if (cStyles[i] && (!cStyles[i].display || cStyles[i].display != "none")) {
									var cStyle = cStyles[i];
									if(component.layoutFn) {
										anchorY = component.layoutFn($tile, node, nStyle, component, cStyle, config, anchorY, contentHeight, temp);
									} else if (config.defaultContentLayoutFns[component.type]) {
										anchorY = config.defaultContentLayoutFns[component.type]($tile, node, nStyle, component, cStyle, config, anchorY, contentHeight, temp);
									} else {
										anchorY = config.defaultContentLayoutFns["stdComponent"]($tile, node, nStyle, component, cStyle, config, anchorY, contentHeight, temp);
									}
								}
							});
						}
					},
					defaultDynLayoutFns : {
						stdNode : function($tile, node, nStyle, config) {
							var startY = $tile.height();
							var mult = config.multiplicator;
							var anchorY = startY + (nStyle.topPadding  * mult);
							$tile.width(nStyle.width * mult);
							$.each(node.components, function(i, component) {
								var cStyle;
								if(component.style) {
									cStyle = component.style;
								} else if (config.defaultContentStyles[component.type]) {
									cStyle = config.defaultContentStyles[component.type];
								} else {
									cStyle = config.defaultContentStyles["stdComponent"];
								}
									if (cStyle && (!cStyle.display || cStyle.display != "none")) {
										if(component.dynLayoutFn) {
											anchorY = component.dynLayoutFn($tile, node, nStyle, component, cStyle, config, anchorY);
										} else if (config.defaultContentDynLayoutFns[component.type]) {
											anchorY = config.defaultContentDynLayoutFns[component.type]($tile, node, nStyle, component, cStyle, config, anchorY);
										} else {
											anchorY = config.defaultContentDynLayoutFns["stdComponent"]($tile, node, nStyle, component, cStyle, config, anchorY);
										}
									}
							});
							$tile.height(anchorY + (nStyle.bottomPadding * mult) - startY);
						}
					},
					defaultContentLayoutFns : {
						predicate : function($tile, node, nStyle, component,
								cStyle, config, anchorY, contentHeight, divisor) {
							var $component = $tile.find(UTIL.toClassSelector(component.id));
							print(UTIL.toClassSelector(component.id));
							console.log($component)
							var mult = config.multiplicator;
							var cHeight = contentHeight * (cStyle.height / divisor) - nStyle.spacing * mult;
							var cWidth = ((nStyle.width - nStyle.leftPadding - nStyle.rightPadding) * mult);
							$component.height(cHeight);
							$component.width(cWidth);
							$component.css("top", anchorY);
							$component.css("left", nStyle.leftPadding);
							anchorY += (cHeight + nStyle.spacing * mult);
							$component.children().height(cHeight);
							var $typeImage = $tile.find(UTIL.toSelector(CONS.CSS_CLASSES.tileClasses.typeImage));
							var $predicate = $tile.find(UTIL.toSelector(CONS.CSS_CLASSES.tileClasses.predicate));
							var $predicateLabel = $tile.find(UTIL.toSelector(CONS.CSS_CLASSES.tileClasses.predicateLabel));
							var imageWidth = cWidth * 0.2;
							$typeImage.height("auto");
							$typeImage.width(imageWidth);
							$predicateLabel.css("left", imageWidth);
							$predicateLabel.width(cWidth - imageWidth);
							$predicate.width(cWidth);
							return anchorY;
						},
						stdComponent : function($tile, node, nStyle, component, cStyle, config, anchorY, contentHeight, divisor) {
							var $component = $tile.find(UTIL.toClassSelector(component.id));
							var mult = config.multiplicator;
							var cHeight = contentHeight * (cStyle.height / divisor) - nStyle.spacing * mult;
							$component.width((nStyle.width - nStyle.leftPadding - nStyle.rightPadding) * mult);
							$component.height(cHeight);
							$component.css("top", anchorY);
							$component.css("left", nStyle.leftPadding);
							anchorY += (cHeight + nStyle.spacing * mult);
							return anchorY;
						}
					},
					defaultContentDynLayoutFns : {
						predicate : function($tile, node, nStyle, component,
								cStyle, config, anchorY) {
							var $component = $tile.find(UTIL.toClassSelector(component.id));
							var mult = config.multiplicator;
							var cHeight = cStyle.height * mult;
							var cWidth = (nStyle.width - nStyle.leftPadding - nStyle.rightPadding) * mult;
							$component.height(cHeight);
							$component.width(cWidth);
							$component.css("top", anchorY);
							$component.css("left", nStyle.leftPadding);
							anchorY += (cHeight + nStyle.spacing * mult);
							$component.children().height(cHeight);
							var $typeImage = $tile.find(UTIL.toSelector(CONS.CSS_CLASSES.tileClasses.typeImage));
							var $predicate = $tile.find(UTIL.toSelector(CONS.CSS_CLASSES.tileClasses.predicate));
							var $predicateLabel = $tile.find(UTIL.toSelector(CONS.CSS_CLASSES.tileClasses.predicateLabel));
							var imageWidth = cWidth * 0.2;
							$typeImage.height("auto");
							$typeImage.width(imageWidth);
							$predicateLabel.css("left", imageWidth);
							$predicateLabel.width(cWidth - imageWidth);
							$predicate.width(cWidth);
							return anchorY;
						},
						stdComponent : function($tile, node, nStyle, component, cStyle, config, anchorY) {
							var $component = $tile.find(UTIL.toClassSelector(component.id));
							var mult = config.multiplicator;
							$component.width((nStyle.width - nStyle.leftPadding - nStyle.rightPadding) * mult);
							$component.height(cStyle.height * mult);
							$component.css("top", anchorY);
							$component.css("left", nStyle.leftPadding);
							anchorY += ((cStyle.height + nStyle.spacing) * mult);
							return anchorY;
						}
					},
					defaultStyles : {
						/**
						 * Styles of literal items.
						 * 
						 * @property defaults.tileFilters.scale.config.defaultStyles.literal
						 * @type Object
						 */
						//literal : {
							/**
							 * Width of literal items.
							 * 
							 * @property defaults.tileFilters.scale.config.defaultStyles.literal.width
							 * @type Integer
							 * @default 200
							 */
							//width : 200,
							/**
							 * Height of literal items.
							 * 
							 * @property defaults.tileFilters.scale.config.defaultStyles.literal.height
							 * @type Integer
							 * @default 100
							 */
							//height : 100
						//},
						/**
						 * Styles of res nodes.
						 * 
						 * @property defaults.tileFilters.scale.config.defaultStyles.stdNode
						 * @type Object
						 */
						stdNode : {
							/**
							 * Width of items.
							 * 
							 * @property defaults.tileFilters.scale.config.defaultStyles.stdNode.width
							 * @type Integer
							 * @default 200
							 */
							width : 200,
							/**
							 * Height of items.
							 * 
							 * @property defaults.tileFilters.scale.config.defaultStyles.stdNode.width
							 * @type Integer or String
							 * @default 200 / dynamic
							 */
							height : "dynamic",
							topPadding : 10,
							leftPadding : 10,
							rightPadding : 10,
							bottomPadding : 10,
							spacing : 5
						}
					},
					defaultContentStyles : {
						predicate : {
							height : 20
						},
						label : {
							height : 40
						},
						stdComponent : {
							height : 40
						}
					}
				}
			},

			/**
			 * Scales text of tiles
			 * 
			 * @property defaults.tileFilters.backgroundColor
			 * @type Object
			 */
			textScale : {
				webWorker : true,
				fn : function(plugin, $tiles, config, view) {
					// On layout done event
					view.$viewContainer.on(CONS.EVENT_TYPES.layout.done, function() {
						var $fitHere = $tiles.find(UTIL.toSelector(CONS.CSS_CLASSES.textScale));
						//$fitHere.css({"word-wrap":"break-word"});
						$fitHere.parent().textfill({
							maxFontPixels : 80,
							minFontPixels : 8
						});
					});
					return $tiles;
				},
				config : {
					
				}
			},

			/**
			 * Sets backgroundColor for tiles
			 * 
			 * @property defaults.tileFilters.backgroundColor
			 * @type Object
			 */
			backgroundColor : {
				fn : function(plugin, $tiles, config) {
					var counter = 0;
					$.each($tiles,
									function(i, tile) {
										counter++;
										var $tile = $(tile);
										var colorArray;
										var node = $tile.data("node");
										if(node.style && node.style.bgColors) {
											colorArray = node.style.bgColors;
										} else if (config.defaultStyles[node.getType()]) {
											colorArray = config.defaultStyles[node.getType()].bgColors;
										} else {
											colorArray = config.defaultStyles["stdNode"].bgColors;
										}
										var color = new RGBColor(colorArray[counter % colorArray.length]);
										if (color) {
											$tile.css("background-color",
													"rgba(" + color.r + ", "
															+ color.g + ", "
															+ color.b + " ,1)");
										}
									});
					return $tiles;
				},
				config : {
					defaultStyles : {
						literal : {
							/**
							 * Color of literal items.
							 * 
							 * @property defaults.tileFilters.backgroundColor.config.defaultStyles.literal.bgColors
							 * @type Array
							 * @default [ '#777777' ]
							 */
							bgColors : [ '#777777' ]
						},
						blankNode : {
							bgColors : [ '#777777' ]
						},
						stdNode : {
							/**
							 * Colors of items.
							 * 
							 * @property defaults.tileFilters.backgroundColor.config.defaultStyles.stdNode.bgColors
							 * @type Array
							 * @default [ '#e2674a', '#99CC99', '#3399CC',
							 *          '#33CCCC', '#996699', '#C24747', '#FFCC66',
							 *          '#669999', '#CC6699', '#339966', '#666699' ]
							 */
							bgColors : [ '#e2674a', '#99CC99', '#3399CC', '#33CCCC',
										'#996699', '#C24747', '#FFCC66', '#669999',
										'#CC6699', '#339966', '#666699' ]
						}
					}
				}
			},

			/**
			 * Loads background images
			 * 
			 * @property defaults.tileFilters.backgroundImg
			 * @type Object
			 */
			backgroundImg : {
				fn : function(plugin, $tiles) {
					$
							.each(
									$tiles,
									function(i, tile) {
										var $tile = $(tile);
										var node = $tile.data("node"), image_url = "";
										switch (node.getType()) {
										case CONS.NODE_TYPES.resNode:
											image_url = node.getFComponentOT("uri").data;
											break;

										case CONS.NODE_TYPES.literal:
											image_url = node.getFComponentOT("label").data.value;
											break;
										}
										var tmpArray = image_url.replace(">",
												"").split(".");
										image_url.replace("<", "");
										switch (tmpArray[tmpArray.length - 1]) {
										case "png":
										case "jpeg":
										case "svg":
										case "jpg":

											if (image_url) {
												var $img = $('<img src="'
														+ image_url + '">');
												$img
														.load(function() {
															var width = $img
																	.width();
															var height = $img
																	.height();
															var ratio = width
																	/ height;
															var tile_width = $tile
																	.width();
															var tile_height = $tile
																	.height();
															var tile_ration = tile_width
																	/ tile_height;
															var actual_width = 0;

															if (tile_ration > ratio) {
																actual_width = tile_width
																		/ ratio;
																$img
																		.width(tile_width
																				/ ratio);
																$img
																		.height(tile_height);
															} else {
																$img
																		.width(actual_width);
																$img
																		.height(tile_width
																				* ratio);
															}

															// TODO opacity
															// variable
															$img
																	.css({
																		"left" : (tile_width - actual_width) / 2,
																		"opacity" : 0.5,
																		"position" : "absolute"
																	});
														});
												$tile.prepend($img);
											}
											break;
										}
									});
					return $tiles;
				}
			},

			/**
			 * Enables mouseover for URIs
			 * 
			 * @property defaults.tileFilters.predicateLabel
			 * @type Object
			 */
			predicateLabel : {
				fn : function(plugin, $tiles) {
					$
							.each(
									$tiles,
									function(i, tile) {
										var $tile = $(tile);
										var $predicate = $tile
												.find(UTIL
																.toSelector(CONS.CSS_CLASSES.tileClasses.predicate));
										var $typeImage = $tile
												.find(UTIL
																.toSelector(CONS.CSS_CLASSES.tileClasses.typeImage));
										var $predicateLabel = $tile
												.find(UTIL
																.toSelector(CONS.CSS_CLASSES.tileClasses.predicateLabel));

										// Show full URI on mouse enter
										$tile.on("mouseenter",
												function() {
													$predicate.css("visibility",
															"visible");
													$typeImage.css("visibility",
															"hidden");
													$predicateLabel.css(
															"visibility", "hidden");
												});

										$tile
												.on(
														"mouseleave",
														function() {
															$predicateLabel
																	.stop(true,
																			true);

															// Timeout prevents
															// flickering on
															// mousemovement
															window
																	.setTimeout(
																			function() {
																				$predicate
																						.css(
																								"visibility",
																								"hidden");
																				$typeImage
																						.css(
																								"visibility",
																								"visible");
																				$predicateLabel
																						.css(
																								"visibility",
																								"visible");
																			},
																			100);
														});
									});
					return $tiles;
				}
			},

			/**
			 * Initializes the browsability of tiles
			 * 
			 * @property defaults.tileFilters.browsablity
			 * @type Object
			 */
			browsablity : {
				fn : function(plugin, $tiles, config) {
					$.each($tiles, function(i, tile) {
						var $tile = $(tile);
						var node = $tile.data("node");
						var nodeType = node.getType();
						if (nodeType in config.types) {
							$.each(config.types[nodeType].browsingFns, function(fnLabel, fn) {
								fn(plugin, node, $tile);
							});
						} else {
							$.each(config.defaultFns, function(fnLabel, fn) {
								fn(plugin, node, $tile);
							});
						}
					});
					return $tiles;
				},
				config : {
					types : {
						blankNode : {
									browsingFns : {
										fn : function(plugin, node, $tile) {
											$tile.click(function() {
												//TODO
											});
										}
									}
						}
					},
					defaultFns : {
						fn : function(plugin, node, $tile) {
							$tile.click(function() {
								plugin.addLayer(plugin.generateLayer($tile));
							});
						}
					}
				}
			}
		},
		/**
		 * Raw RDF data given on plugin startup. This data will be loaded into
		 * the store.
		 * 
		 * @property defaults.data
		 * @type String
		 * @default undefined
		 */
		data : undefined,
		/**
		 * Path to file with Raw RDF data given on plugin startup. This file
		 * will be parsed and loaded into the store.
		 * 
		 * @property defaults.dataLoc
		 * @type String
		 * @default undefined
		 */
		dataLoc : undefined,
		/**
		 * Format of the RDF data which is given on plugin startup.
		 * 
		 * @property defaults.dataFormat
		 * @type String
		 * @default undefined
		 */
		dataFormat : undefined,
		/**
		 * Flag to activate the usage of precompiled handlebars templates.
		 * 
		 * @property defaults.templatesPrecompiled
		 * @type Boolean
		 * @default true
		 */
		templatesPrecompiled : true,
		/**
		 * Path of the html file which can be used to load handlebars templates
		 * dynamically.
		 * 
		 * @property defaults.templatesPath
		 * @type String
		 * @default "templates_wrapped/templates.html"
		 */
		templatesPath : "templates_wrapped/templates.html",
		/**
		 * SPARQL resultset which can be used to insert data into the store on
		 * init.
		 * 
		 * @property defaults.sparqlData
		 * @type Object
		 * @default undefined
		 */
		sparqlData : undefined,
		/**
		 * Flag to indicate whether a timeline should be generated and used.
		 * 
		 * @property defaults.generateTimeline
		 * @type Boolean
		 * @default true
		 */
		generateTimeline : true,
		/**
		 * Query/queries to use for the initialization view of the plugin.
		 * 
		 * @property defaults.initQueries
		 * @type Object
		 * @default [ { query : "SELECT ?subject ?label ?description ?type WHERE {
		 *          ?subject rdfs:label ?label . OPTIONAL { ?subject
		 *          rdfs:description ?description } . OPTIONAL { ?subject
		 *          rdfs:comment ?description }. OPTIONAL {?subject rdfs:type
		 *          ?type}}" } ]
		 */
		initQueries : [ {
			query : "SELECT ?subject ?label ?description ?type WHERE { ?subject rdfs:label ?label . OPTIONAL { ?subject rdfs:description ?description } . OPTIONAL { ?subject rdfs:comment ?description }. OPTIONAL {?subject rdfs:type ?type}}"
		} ],
		/**
		 * Options for the rdf store class. Uses rdfstore-js
		 * https://github.com/antoniogarrote/rdfstore-js options structure.
		 * 
		 * @property defaults.rdfstoreOptions
		 * @type Object
		 */
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
		 * Options for the bSynopsis view layer.
		 * 
		 * @property defaults.layerOptions
		 * @type Object
		 */
		layerOptions : {
			/**
			 * Flag to indicate whether the sort interface should be generated.
			 * 
			 * @property defaults.layerOptions.generateSortOptions
			 * @type Boolean
			 * @default true
			 */
			generateSortOptions : true,
			/**
			 * Flag to indicate whether previews should be used.
			 * 
			 * @property defaults.layerOptions.generateSortOptions
			 * @type Boolean
			 * @default true
			 */
			usePreviews : false,
			/**
			 * Flag to indicate which kind of previews should be used. Possible
			 * options are
			 * 
			 * @property defaults.layerOptions.previewAsOverlay
			 * @type Boolean
			 * @default Overlay
			 */
			previewAsOverlay : true,
			/**
			 * Flag to indicate whether the filter interface should be
			 * generated.
			 * 
			 * @property defaults.layerOptions.generateFilterOptions
			 * @type Boolean
			 * @default true
			 */
			generateFilterOptions : true,

			/**
			 * Options for the model holding node results.
			 * 
			 * @property defaults.layerOptions.modelOptions
			 * @type Object
			 */
			modelOptions : {
				/**
				 * Batch size of items which can be loaded simultaniosly in the
				 * view. Filters only work on single batches. The batchSize
				 * should be chosen big enough if Nodefilters are to be used.
				 * 
				 * @property defaults.layerOptions.modelOptions.batchSize
				 * @type Integer
				 * @default 25
				 */
				batchSize : 25

			},
			/**
			 * Options for remote loading of data.
			 * 
			 * @property defaults.layerOptions.remoteOptions
			 * @type Object
			 */
			remoteOptions : {
				/**
				 * Default remote load query. Used on insertRemoteData() if no
				 * query parameter is given.
				 * 
				 * @property defaults.layerOptions.remoteOptions.defaultRemoteQuery
				 * @type String
				 * @default "SELECT ?subject ?predicate ?object { BIND(
				 *          rdfs:label as ?predicate) ?subject ?predicate
				 *          ?object. ?subject a
				 *          <http://dbpedia.org/ontology/Place> . ?subject
				 *          <http://dbpedia.org/property/rulingParty> ?x } LIMIT
				 *          500"
				 */
				defaultRemoteQuery : "SELECT ?subject ?predicate ?object { BIND( rdfs:label as ?predicate) ?subject ?predicate ?object. ?subject a <http://dbpedia.org/ontology/Place> . ?subject <http://dbpedia.org/property/rulingParty> ?x } LIMIT 500",
				/**
				 * Backend services to query on remote loading.
				 * 
				 * @property defaults.layerOptions.remoteOptions.remoteBackend
				 * @type Array
				 * @default ["http://zaire.dimis.fim.uni-passau.de:8080/bigdata/sparql"]
				 */
				remoteBackend : [ "http://zaire.dimis.fim.uni-passau.de:8080/bigdata/sparql" ],
				/**
				 * Limit for items loaded by a single remote load.
				 * 
				 * @property defaults.layerOptions.remoteOptions.remoteLimit
				 * @type Integer
				 * @default 100
				 */
				remoteLimit : 100,
				/**
				 * Flag to indicate whether automatic remote load on detail view
				 * should be done.
				 * 
				 * @property defaults.layerOptions.remoteOptions.remoteDynamically
				 * @type Boolean
				 * @default true
				 */
				remoteDynamically : true,
				/**
				 * Remote backends to query for predicate label information.
				 * 
				 * @property defaults.layerOptions.remoteOptions.remoteLabelBackend
				 * @type Array
				 * @default ["http://zaire.dimis.fim.uni-passau.de:8080/bigdata/sparql","http://dbpedia.org/sparql"]
				 */
				remoteLabelBackend : [
						"http://zaire.dimis.fim.uni-passau.de:8080/bigdata/sparql",
						"http://dbpedia.org/sparql" ],
				/**
				 * Flag to indicate whether remote label information should be
				 * loaded if needed.
				 * 
				 * @property defaults.layerOptions.remoteOptions.remoteLabels
				 * @type Boolean
				 * @default true
				 */
				remoteLabels : true
			},
			/**
			 * Options for the bSynopsis views.
			 * 
			 * @property defaults.layerOptions.viewOptions
			 * @type Object
			 */
			viewOptions : {
				/**
				 * Flag to indicate whether the filter should use regular
				 * expressions.
				 * 
				 * @property defaults.layerOptions.viewOptions.supportRegExpFilter
				 * @type Boolean
				 * @default true
				 */
				supportRegExpFilter : true,

				/**
				 * Default filter to be added to the filter interface.
				 * 
				 * @property defaults.layerOptions.viewOptions.filterBy
				 * @type Object
				 * @default [ { value : "*", label : "showAll" } ]
				 */
				filterBy : [ {
					value : "*",
					label : "showAll"
				} ],

				/**
				 * Options for the layoutEngine. Uses isotope
				 * http://isotope.metafizzy.co/ options structure.
				 * 
				 * @property defaults.layerOptions.viewOptions.layoutEngine
				 * @type Object
				 */
				layoutEngine : {
					sortBy : 'number',
					getSortData : {
						number : function($elem) {
							var number = $elem.hasClass('item') ? $elem
									.find(
											UTIL
													.toSelector(CONS.CSS_CLASSES.tileClasses.number))
									.text()
									: $elem.attr('data-number');
							return parseInt(number, 10);
						},
						alphabetical : function($elem) {
							var label = $elem
									.find(UTIL
											.toSelector(CONS.CSS_CLASSES.tileClasses.label)), itemText = label.length ? label
									: $elem;
							return itemText.text();
						}
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
		 * @param {Function}
		 *            fn Function to modifie
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
		this._$parent.addClass(pluginName);

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
			print("Init RDFSTORE");
			if (isUndefinedOrNull(rdfStore)) {
				rdfStore = new Plugin.RdfStore(that.options.rdfstoreOptions,
						function(store) {
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
			
			// Helper to get first component of given type
			Handlebars.registerHelper('toClass', function(str) {
				return UTIL.toClass(str);
			});
			
			// Helper to get first component of given type
			Handlebars.registerHelper('tScaleWrap', function(str) {
				str = Handlebars.Utils.escapeExpression(str);//escape
				return new Handlebars.SafeString("<span class='" + CONS.CSS_CLASSES.textScale + "' style='position:static'>" + str + "</span>");//mark as encoded
			});
			
			// Helper to get first component of given type
			Handlebars.registerHelper('firstComp', function(context, type, options) {
				var out = '';
				if (context.hasComponentType(type)) {
					out += options.fn(context.components[type+"1"]);
				}
				return out;
			});
			
			// Helper to get first component of given type
			Handlebars.registerHelper('hasCompType', function(context, type, options) {
				if (context.hasComponentType(type)) {
					return options.fn(this);
				}
			});
			
			// Helper to get each component of given type
			Handlebars.registerHelper('compsEach', function(context, type, options) {
				var out = '';
				context.forEachComponentType(type, function(component){
					out += options.fn(component);
				});
				return out;
			});

			// Helper to iterate over keys of given context
			Handlebars.registerHelper('keysEach', function(context, options) {
				var out = '';
				for ( var key in context) {
					out += options.fn(key);
				}
				return out;
			});

			// Helper to check if language of given context is undefined or "en"
			Handlebars
					.registerHelper(
							'ifLang',
							function(context, options) {
								if (context
										&& (context.lang === undefined || context.lang === "en")) {
									return options.fn(this);
								}
							});

			Handlebars.registerHelper('predicateLabelRetriver', function(ctx,
					options) {
				if (ctx && !ctx.label) {
					var uriArray = ctx.value.split("#");
					if (uriArray.length === 1) {
						uriArray = uriArray[0].split("/");
					}
					ctx.label = uriArray[uriArray.length - 1];
				}
				return options.fn(this);
			});

			var loader = new Plugin.TemplatesLoader(templateInitDfd);
			if (that.options.templatesPrecompiled) {
				loader.getPrecompiledTemplates();
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
				defaultRemoteQuery : this.options.layerOptions.remoteOptions.defaultRemoteQuery,
				remoteSubjectOf : " SELECT DISTINCT ?subject ?predicate ?object ?labelObj ?labelPred WHERE { BIND (<"
						+ CONS.DUMMY
						+ "> as ?subject) ?subject ?predicate ?object. OPTIONAL { ?object rdfs:label ?labelObj }. OPTIONAL { ?predicate rdfs:label ?labelPred }}",
				remoteObjectOf : " SELECT DISTINCT ?subject ?predicate ?object ?labelSub ?labelPred WHERE {BIND (<"
						+ CONS.DUMMY
						+ "> as ?object) ?subject ?predicate ?object. OPTIONAL { ?subject rdfs:label ?labelSub }. OPTIONAL { ?predicate rdfs:label ?labelPred }}",
				remoteLiteralIsObjectOf : " SELECT DISTINCT ?subject ?predicate ?object ?labelSub ?labelPred WHERE {BIND ('"
						+ CONS.DUMMY
						+ "' as ?object) ?subject ?predicate ?object. OPTIONAL { ?subject rdfs:label ?labelSub }. OPTIONAL { ?predicate rdfs:label ?labelPred }}",
				selectSubjectOf : " SELECT DISTINCT ?subject ?predicate ?label ?description WHERE {<"
						+ CONS.DUMMY
						+ "> ?predicate ?subject. OPTIONAL { ?subject rdfs:label ?label}. OPTIONAL { ?subject rdfs:description ?description } . OPTIONAL { ?subject rdfs:comment ?description }}",
				selectObjectOf : " SELECT DISTINCT ?subject ?predicate ?type ?label ?description WHERE {?subject ?predicate <"
						+ CONS.DUMMY
						+ ">. OPTIONAL { ?subject rdfs:label ?label}. OPTIONAL { ?subject rdfs:description ?description } . OPTIONAL { ?subject rdfs:comment ?description }}",
				literalIsObjectOf : "SELECT DISTINCT ?subject ?predicate ?type ?label ?description WHERE {?subject ?predicate ?oLiteral. FILTER (STR(?oLiteral)='"
						+ CONS.DUMMY
						+ "'). OPTIONAL { ?subject rdfs:label ?label}. OPTIONAL { ?subject rdfs:description ?description } . OPTIONAL { ?subject rdfs:comment ?description }}",
				previewQuery : " SELECT DISTINCT ?label ?description ?type WHERE { <"
						+ CONS.DUMMY
						+ "> rdfs:label ?label . OPTIONAL { <"
						+ CONS.DUMMY
						+ "> rdfs:description ?description } . OPTIONAL { <"
						+ CONS.DUMMY
						+ "> rdfs:comment ?description } . OPTIONAL { <"
						+ CONS.DUMMY + "> rdfs:type ?type}}",
				label : "SELECT DISTINCT ?label WHERE { <"
						+ CONS.DUMMY
						+ "> rdfs:label ?label . FILTER(LANG(?label) = '' || LANGMATCHES(LANG(?label), 'en'))}",
				blankNodeQuery : "SELECT DISTINCT ?object WHERE {<"
						+ CONS.DUMMY + "> ?predicate ?object}"
			};
		},
		/**
		 * Check whether the plugin is initialized with insertion options and
		 * call insertion methods if needed.
		 * 
		 * @private
		 * @method _checkInsertion
		 * @returns {Boolean} true if data was inserted, false if not
		 */
		_checkInsertion : function() {
			var that = this, inserted = false;
			if (!isUndefinedOrNull(that.options.dataFormat)) {
				if (!isUndefinedOrNull(that.options.dataLoc)) {
					inserted = true;
					that
							._ajaxLoadData(
									that.options.dataLoc,
									that.options.dataFormat,
									function(rdfData, dataFormat) {
										rdfStore
												.insertData(
														rdfData,
														dataFormat,
														function() {
															eventManagers[that.pluginID]
																	.trigger(
																			CONS.EVENT_TYPES.store.insert,
																			that);
														});
									});
				} else if (!isUndefinedOrNull(that.options.data)) {
					inserted = true;
					rdfStore.insertData(that.options.data,
							that.options.dataFormat, function() {
								eventManagers[that.pluginID].trigger(
										CONS.EVENT_TYPES.store.insert,
										that);
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
		 * @param {String}
		 *            dataURL URL where the data is located
		 * @param {String}
		 *            dataFormat Format of the data
		 * @param {String}
		 *            callback Function to call after loading with results
		 * @return function with modified context
		 */
		_ajaxLoadData : function(dataURL, dataFormat, callback) {
			var that = this;
			eventManagers[that.pluginID].trigger(
					CONS.EVENT_TYPES.loading.start, that);

			// print("_ajaxLoadData");
			$.ajax({
				url : dataURL,
				dataType : "text",
				success : function(rdfData) {
					callback(rdfData, dataFormat);
				}
			}).fail(
					function() {
						eventManagers[that.pluginID].trigger(
								CONS.EVENT_TYPES.loading.done, that);
						alert(CONS.MESSAGES.error.ajax);
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
			eventManagers[this.pluginID].addEventHandler(
					CONS.EVENT_TYPES.store.insert, function(ev) {
						$.each(that._views, function(key, view) {
							view.update();
							print("view " + key + " is updating");
						});
					});

			// Add a smartresize listener (smartresize to be found in
			// jQuery.isotope)
			eventManagers[this.pluginID]
					.addEventHandler(
							'smartresize',
							function(ev, $invoker) {

								// <---- overlay modification ---->
								var $overlays = that._$parent.children(UTIL
										.toSelector(CONS.CSS_CLASSES.overlay));
								$overlays.css('clip',
										getClip(CONS.CSS_CLASSES.overlay));
								var innerScrolls = $overlays
										.find(UTIL
												.toSelector(CONS.CSS_CLASSES.innerScroll));
								innerScrolls
										.css(
												"width",
												($window.width()
														- parseInt($overlays
																.css("padding-left")) - parseInt($overlays
														.css("padding-right")))
														+ "px");
								innerScrolls
										.css(
												"height",
												$window.height()
														- $overlays
																.find(
																		UTIL
																				.toSelector(CONS.CSS_CLASSES.innerNoScroll))
																.height()
														+ "px");
								// <!--- overlay modification ---->
							}, $window);

			if (that.options.generateTimeline) {
				that._$timelineContainer = $('<div class="'
						+ CONS.CSS_CLASSES.timelineContainer + '">');
				that._$parent.prepend(that._$timelineContainer);
				that._$timeline = $('<ul class="' + CONS.CSS_CLASSES.timeline
						+ '"></ul>');
				that._$timelineContainer.append(that._$timeline);
			}

			// Init templating and RdfStore if needed
			if (globalInitDfd.state() === "pending") {
				globalInitDfd = $.Deferred();
				$
						.when(that._initRdfStore(), that._initTemplating())
						.done(
								function() {

									// Load runtime templates
									var tmp_templates = {};
									$
											.each(
													that.options.nodeFilters,
													function(i, filter) {
														if (filter.template) {
															if (templates[i]) {
																console
																		.log("Template with identifier "
																				+ i
																				+ " already defined");
															} else {
																tmp_templates[i] = Handlebars
																		.compile(filter.template);
															}
														}
													});

									$.extend(true, templates, tmp_templates);
									globalInitDfd.resolve();
								});
			}

			// when done check if sort options have to be initialized and data
			// is to be inserted
			$.when(globalInitDfd.promise()).done(
					function() {

						// Init Layer
						that._views = [];
						that._views.push(new Plugin.InitLayer(that._$parent,
								that.options.layerOptions, that));

						if (!that._checkInsertion()) {
							if (that.options.sparqlData === undefined) {
								that._views[0].update();
							} else {
								that._views[0]
										.addItems(that.options.sparqlData);
							}
						}
					});
		},
		/**
		 * Add given Layer object to the plugin
		 * 
		 * @method addLayer
		 * @param {Plugin.Layer}
		 *            layer Layer object to add to the plugin
		 */
		addLayer : function(layer) {
			this._views.push(layer);
		},
		/**
		 * Generates Layer using given tile(with node data).
		 * 
		 * @method generateLayer
		 * @param {jQuery}
		 *            $tile Tile which holds node data
		 */
		generateLayer : function($tile) {
			$tile.data('isExpanded', true);
			var node = $tile.data("node"), that = this, idAddition = Math
					.random().toString(36).substr(2, 9);
			var overlay = templates.overlayWrapper(appendCssClasses({
				"id" : node.id + idAddition
				,
				"nodeFilters" : that.options.nodeFilters,
				"tileFilters" : that.options.tileFilters
			}));
			that._$parent.append(overlay);
			var $overlay = that._$parent.find(
					UTIL.toSelector(CONS.CSS_CLASSES.overlay)).find(
					"div:contains('" + node.id + idAddition + "')").parent();
			var newLayerOptions = $
					.extend(
							true,
							{},
							that.options.layerOptions,
							{
								layoutEngine : {
									itemSelector : UTIL
											.toSelector(CONS.CSS_CLASSES.tileClasses.tile),
									getSortData : {
										type : function($elem) {
											var classes = $elem.attr("class");
											return classes;
										},
										group : function($elem) {
											var classes = $elem.attr("class");
											var pattern = new RegExp(
													"(\s)*[a-zA-Z0-9]*"
															+ CONS.TOKEN_TAG
															+ "[a-zA-Z0-9]*(\s)*",
													'g');
											var groups = classes.match(pattern), group = "";
											for (var i = 0; i < groups.length; i++) {
												group += groups[i] + " ";
											}
											return group;
										}
									}
								},
								viewOptions : {
									filterBy : [
											{
												value : "*",
												label : "showAll"
											},
											{
												value : CONS.CSS_CLASSES.typeClasses.incoming,
												label : "in"
											},
											{
												value : CONS.CSS_CLASSES.typeClasses.outgoing,
												label : "out"
											} ]
								}
							});
			var newLayer;
			if (node.getType() === CONS.NODE_TYPES.resNode) {
				newLayer = new Plugin.DetailLayer($overlay, newLayerOptions,
						that, $tile);
			} else if (node.getType() === CONS.NODE_TYPES.literal) {
				newLayer = new Plugin.DetailLayer($overlay, newLayerOptions,
						that, $tile);
			} else {
				newLayer = new Plugin.DetailLayer($overlay, newLayerOptions,
						that, $tile);
			}
			return newLayer;
		},

		/**
		 * Remove given Layer object from the plugin
		 * 
		 * @method removeLayer
		 * @param {Plugin.Layer}
		 *            view Layer object to remove from the plugin
		 */
		removeLayer : function(view) {
			for (var i = 0; i < this._views.length; i++)
				if (this._views[i] === view) {
					this._views.splice(i, 1);
					if (this._views.length === 1) {
						this.$body.removeClass('noscroll');
					}
					break;
				}
		},
		/**
		 * Insert given rdf-data in the store.
		 * 
		 * @method insertData
		 * @param {String}
		 *            data Rdf-data to be inserted
		 * @param {String}
		 *            dataFormat Format of the data
		 */
		insertData : function(data, dataFormat) {
			var that = this;
			$
					.when(globalInitDfd.promise())
					.done(
							function() {
								rdfStore
										.insertData(
												data,
												dataFormat,
												function() {
													eventManagers[that.pluginID]
															.trigger(
																	CONS.EVENT_TYPES.store.insert,
																	that);
												});
							});
		},
		/**
		 * Insert rdf-data of given location in the store. Consider cross domain
		 * restrictions when using this method.
		 * 
		 * @method insertDataPath
		 * @param {String}
		 *            dataURL URL where rdf data is to be found
		 * @param {String}
		 *            dataFormat Format of the data
		 */
		insertDataPath : function(dataURL, dataFormat) {
			var that = this;
			$.when(globalInitDfd.promise()).done(
					function() {
						that._ajaxLoadData(dataURL, dataFormat, that
								._selfProxy(that.insertData));
					});
		},
		/**
		 * Insert rdf-data of given file in the store.
		 * 
		 * @method insertDataFile
		 * @param {File}
		 *            file File to parse
		 * @param {String}
		 *            dataFormat Format of the data
		 */
		insertDataFile : function(file) {
			var that = this, reader = new FileReader();
			reader.onload = function() {
				var result = this.result;
				var type = "text/turtle";
				if (file.type === "") {
					var extension = file.name.split(".").pop();
					switch (extension) {
					case "ttl":
						type = "text/turtle";
						break;
					case "turtle":
						type = "text/turtle";
						break;
					case "n3":
						type = "text/n3";
						break;
					case "json":
						type = "application/json";
						break;
					case "jsld":
						type = "application/ld+json";
						break;
					default:
						console.log(CONS.MESSAGES.warn.fileTypeNotKnown + type);
					}
				} else {
					type = file.type;
				}
				$.when(globalInitDfd.promise()).done(function() {
					that.insertData(result, type);
				});
			};
			reader.readAsText(file);
		},
		/**
		 * Insert rdf-data of given url SPARQL service in the store. Use the
		 * given query. Is no query given use the default query.
		 * 
		 * @method insertRemoteDataQuery
		 * @param {String}
		 *            url URL of the SPARQL service
		 * @param {String}
		 *            query Query to fetch data
		 */
		insertRemoteDataQuery : function(url, query) {

			var that = this;

			$.when(globalInitDfd.promise()).done(
					function() {
						if (query === undefined || query === "") {
							query = that._queries.defaultRemoteQuery;
						}
						new Plugin.RemoteDataLoader([ url ], that.pluginID)
								.insertByQuery(query);
					});
		},
		/**
		 * Clear the store and Layers.
		 * 
		 * @method clearStore
		 */
		clearStore : function() {
			var that = this;
			rdfStore.executeQuery("CLEAR ALL", function() {
				print("store cleared");
				$.each(that._views, function(i, view) {
					view.removeAllItems();
				});
			});
		},
		/**
		 * 
		 */
		addTileFilter : function() {
			// TODO
		},
		addNodeFilter : function() {
			// TODO
		},
		/**
		 * Runs query on local store.
		 * 
		 * @method runQuery
		 * @param query
		 *            Query to run.
		 * @return results of query
		 */
		runQuery : function(query, callback) {
			var that = this;
			rdfStore.executeQuery(query, function(results) {
				if (callback) {
					callback(results);
				}
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
		return this
				.each(function() {
					if (!$.data(this, "plugin_" + pluginName)) {
						$.data(this, "plugin_" + pluginName, new Plugin(this,
								options));
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
;this["bSynopsis"] = this["bSynopsis"] || {};
this["bSynopsis"]["templates"] = this["bSynopsis"]["templates"] || {};

this["bSynopsis"]["templates"]["filterOptions"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n                            <li><a data-filter-value=\"";
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
    + "</a></li>\r\n                    ";
  return buffer;
  }

  buffer += "    <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.optionCombo)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.filter)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n            <h2>Filter:</h2>\r\n            <ul class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.optionSet)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.clearfix)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" data-option-key=\"filter\">\r\n                    ";
  stack2 = helpers.each.call(depth0, depth0.filterOptions, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n            </ul>\r\n    </div>";
  return buffer;
  });

this["bSynopsis"]["templates"]["groupDropDown"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n            <option value=";
  if (stack1 = helpers.val) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.val; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + ">";
  if (stack1 = helpers.label) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.label; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</option>\r\n            ";
  return buffer;
  }

  buffer += "    <select id=\"GroupDropDown\">\r\n            ";
  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n    </select>";
  return buffer;
  });

this["bSynopsis"]["templates"]["overlayContent"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n            <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.innerNoScroll)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n                <h2>\r\n                    ";
  options = {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data};
  stack2 = ((stack1 = helpers.firstComp || depth0.firstComp),stack1 ? stack1.call(depth0, depth0.node, "label", options) : helperMissing.call(depth0, "firstComp", depth0.node, "label", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n                    \r\n                </h2>\r\n                 ";
  options = {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data};
  stack2 = ((stack1 = helpers.firstComp || depth0.firstComp),stack1 ? stack1.call(depth0, depth0.node, "uri", options) : helperMissing.call(depth0, "firstComp", depth0.node, "uri", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n            </div>\r\n            <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.innerScroll)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n                    <div></div>\r\n            </div>\r\n    ";
  return buffer;
  }
function program2(depth0,data) {
  
  var stack1;
  return escapeExpression(((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.value)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1));
  }

function program4(depth0,data) {
  
  var stack1;
  if (stack1 = helpers.data) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.data; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  return escapeExpression(stack1);
  }

  buffer += "    ";
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data};
  stack2 = ((stack1 = helpers.hasCompType || depth0.hasCompType),stack1 ? stack1.call(depth0, depth0.node, "label", options) : helperMissing.call(depth0, "hasCompType", depth0.node, "label", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  return buffer;
  });

this["bSynopsis"]["templates"]["overlayWrapper"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " <option value="
    + escapeExpression(((stack1 = ((stack1 = data),stack1 == null || stack1 === false ? stack1 : stack1.key)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " selected=\"selected\"> "
    + escapeExpression(((stack1 = ((stack1 = data),stack1 == null || stack1 === false ? stack1 : stack1.key)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " </option> ";
  return buffer;
  }

  buffer += "		      \r\n		<div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.overlay)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n            <div style=\"visibility:hidden\">";
  if (stack2 = helpers.id) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.id; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</div>\r\n            <select multiple=\"multiple\" id=\"filterSelect\">\r\n            ";
  stack2 = helpers.each.call(depth0, depth0.nodeFilters, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n            ";
  stack2 = helpers.each.call(depth0, depth0.tileFilters, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n            </select>\r\n            <span class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.buttonTimeline)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">history</span>\r\n			<span class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.buttonClose)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">close</span>\r\n			<div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.overlayContent)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n			</div>\r\n		</div>";
  return buffer;
  });

this["bSynopsis"]["templates"]["previewItem"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.cssClass),stack1 == null || stack1 === false ? stack1 : stack1.preview)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.cssClass),stack1 == null || stack1 === false ? stack1 : stack1.preview)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "_";
  if (stack2 = helpers.index) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.index; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">\r\n        <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.cssClass),stack1 == null || stack1 === false ? stack1 : stack1.previewContent)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n            TODO\r\n        </div>\r\n</div>";
  return buffer;
  });

this["bSynopsis"]["templates"]["sortOptions"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
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

  buffer += "	<div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.optionCombo)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.sorter)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n		<h2>Sort:</h2>\r\n		<ul class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.optionSet)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.clearfix)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" data-option-key=\"sortBy\">\r\n			";
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data};
  stack2 = ((stack1 = helpers.keysEach || depth0.keysEach),stack1 ? stack1.call(depth0, depth0.optionSet, options) : helperMissing.call(depth0, "keysEach", depth0.optionSet, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n		</ul>\r\n	</div>";
  return buffer;
  });

this["bSynopsis"]["templates"]["stdNode"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function", self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\r\n                    <div class=\"";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.toClass || depth0.toClass),stack1 ? stack1.call(depth0, depth0.type, options) : helperMissing.call(depth0, "toClass", depth0.type, options)))
    + " ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.toClass || depth0.toClass),stack1 ? stack1.call(depth0, depth0.id, options) : helperMissing.call(depth0, "toClass", depth0.id, options)))
    + "\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.tScaleWrap || depth0.tScaleWrap),stack1 ? stack1.call(depth0, ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.value), options) : helperMissing.call(depth0, "tScaleWrap", ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.value), options)))
    + "</div>\r\n            ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n                ";
  options = {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data};
  stack2 = ((stack1 = helpers.ifLang || depth0.ifLang),stack1 ? stack1.call(depth0, depth0, options) : helperMissing.call(depth0, "ifLang", depth0, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n            ";
  return buffer;
  }
function program4(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\r\n                        <div class=\"";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.toClass || depth0.toClass),stack1 ? stack1.call(depth0, depth0.type, options) : helperMissing.call(depth0, "toClass", depth0.type, options)))
    + " ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.toClass || depth0.toClass),stack1 ? stack1.call(depth0, depth0.id, options) : helperMissing.call(depth0, "toClass", depth0.id, options)))
    + "\" style=\"overflow-y: auto;\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.value)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n                ";
  return buffer;
  }

function program6(depth0,data,depth1) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n                    <div class=\"";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.toClass || depth0.toClass),stack1 ? stack1.call(depth0, depth0.id, options) : helperMissing.call(depth0, "toClass", depth0.id, options)))
    + "\">\r\n                        <img class=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth1.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.tileClasses)),stack1 == null || stack1 === false ? stack1 : stack1.typeImage)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" src=\"img/"
    + escapeExpression(((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.type)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + ".png\">\r\n                        <div class=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth1.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.tileClasses)),stack1 == null || stack1 === false ? stack1 : stack1.predicate)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" style=\"visibility:hidden\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.tScaleWrap || depth0.tScaleWrap),stack1 ? stack1.call(depth0, ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.value), options) : helperMissing.call(depth0, "tScaleWrap", ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.value), options)))
    + "</div>\r\n                        ";
  options = {hash:{},inverse:self.noop,fn:self.programWithDepth(7, program7, data, depth1),data:data};
  stack2 = ((stack1 = helpers.predicateLabelRetriver || depth0.predicateLabelRetriver),stack1 ? stack1.call(depth0, depth0.data, options) : helperMissing.call(depth0, "predicateLabelRetriver", depth0.data, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n                    </div>\r\n            ";
  return buffer;
  }
function program7(depth0,data,depth2) {
  
  var buffer = "", stack1, options;
  buffer += "\r\n                            <div class=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth2.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.tileClasses)),stack1 == null || stack1 === false ? stack1 : stack1.predicateLabel)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.tScaleWrap || depth0.tScaleWrap),stack1 ? stack1.call(depth0, ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.label), options) : helperMissing.call(depth0, "tScaleWrap", ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.label), options)))
    + "</div>\r\n                        ";
  return buffer;
  }

  buffer += "            ";
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data};
  stack2 = ((stack1 = helpers.compsEach || depth0.compsEach),stack1 ? stack1.call(depth0, depth0.node, "label", options) : helperMissing.call(depth0, "compsEach", depth0.node, "label", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n            ";
  options = {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data};
  stack2 = ((stack1 = helpers.compsEach || depth0.compsEach),stack1 ? stack1.call(depth0, depth0.node, "description", options) : helperMissing.call(depth0, "compsEach", depth0.node, "description", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n            ";
  options = {hash:{},inverse:self.noop,fn:self.programWithDepth(6, program6, data, depth0),data:data};
  stack2 = ((stack1 = helpers.compsEach || depth0.compsEach),stack1 ? stack1.call(depth0, depth0.node, "predicate", options) : helperMissing.call(depth0, "compsEach", depth0.node, "predicate", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  return buffer;
  });

this["bSynopsis"]["templates"]["tileWrapper"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function", self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, options;
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.toClass || depth0.toClass),stack1 ? stack1.call(depth0, depth0, options) : helperMissing.call(depth0, "toClass", depth0, options)))
    + " ";
  return buffer;
  }

function program3(depth0,data) {
  
  var stack1, options;
  options = {hash:{},data:data};
  return escapeExpression(((stack1 = helpers.toClass || depth0.toClass),stack1 ? stack1.call(depth0, ((stack1 = depth0.node),stack1 == null || stack1 === false ? stack1 : stack1.token), options) : helperMissing.call(depth0, "toClass", ((stack1 = depth0.node),stack1 == null || stack1 === false ? stack1 : stack1.token), options)));
  }

function program5(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\r\n			<h2 class=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.tileClasses)),stack1 == null || stack1 === false ? stack1 : stack1.showURI)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" style=\"display:none\">";
  if (stack2 = helpers.data) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.data; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</h2>\r\n		";
  return buffer;
  }

  buffer += "	<div class=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.tileClasses)),stack1 == null || stack1 === false ? stack1 : stack1.tile)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " ";
  stack2 = helpers.each.call(depth0, ((stack1 = depth0.node),stack1 == null || stack1 === false ? stack1 : stack1.filterables), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.node),stack1 == null || stack1 === false ? stack1 : stack1.token), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += " ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.toClass || depth0.toClass),stack1 ? stack1.call(depth0, ((stack1 = depth0.node),stack1 == null || stack1 === false ? stack1 : stack1.id), options) : helperMissing.call(depth0, "toClass", ((stack1 = depth0.node),stack1 == null || stack1 === false ? stack1 : stack1.id), options)))
    + "\">\r\n		";
  options = {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data};
  stack2 = ((stack1 = helpers.firstComp || depth0.firstComp),stack1 ? stack1.call(depth0, depth0.node, "uri", options) : helperMissing.call(depth0, "firstComp", depth0.node, "uri", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n		<p class=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.tileClasses)),stack1 == null || stack1 === false ? stack1 : stack1.number)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" style=\"display:none\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.node),stack1 == null || stack1 === false ? stack1 : stack1.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</p>\r\n	</div>";
  return buffer;
  });

this["bSynopsis"]["templates"]["timelineItem"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<li>\r\n    "
    + escapeExpression(((stack1 = ((stack1 = depth0.label),stack1 == null || stack1 === false ? stack1 : stack1.value)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n</li>";
  return buffer;
  });

this["bSynopsis"]["templates"]["timelineWrapper"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.timelineContainer)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n    <ul class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.timeline)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n    </ul>\r\n</div>";
  return buffer;
  });