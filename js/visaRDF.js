// das Semikolon vor dem Funktions-Aufruf ist ein Sicherheitsnetz für verkettete
// Scripte und/oder andere Plugins die möglicherweise nicht ordnungsgemäß geschlossen wurden.
;
(function($, window, document, undefined) {

	// Add visaRdf stylesheet
	$(document).ready(function() {
		$('head').append('<link rel="stylesheet" href="css/visaRdf.css" type="text/css" />');
	});

	// Default options
	var pluginName = "visaRDF", $window = $(window), defaults = {
		data : undefined,
		dataLoc : undefined,
		dataFormat : undefined,
		templatesPrecompiled : true,
		templatesPath : "templates/templates.html",
		batchSize : 25,
		generateSortOptions : true,
		usePreviews : false,
		previewAsOverlay : false,
		generateFilterOptions : true,
		supportRegExpFilter : true,
		filterBy : [ {
			value : "*",
			label : "showAll"
		} ],
		sparqlData : undefined,
		elementStyle : {
			dimension : {
				width : 200,
				height : 200
			},
			colors : [ '#e2674a', '#99CC99', '#3399CC', '#33CCCC', '#996699', '#C24747', '#FFCC66', '#669999', '#CC6699', '#339966', '#666699' ]
		},
		ns : {
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
		initQueries : [ {
			query : "SELECT ?subject ?label ?description ?type WHERE { ?subject rdfs:label ?label . OPTIONAL { ?subject rdfs:description ?description } . OPTIONAL { ?subject rdfs:comment ?description }. OPTIONAL {?subject rdfs:type ?type}}"
		} ],
		remoteQuery : "SELECT ?subject ?predicate ?object { BIND( rdfs:label as ?predicate) ?subject ?predicate ?object. ?subject a <http://dbpedia.org/ontology/Place> . ?subject <http://dbpedia.org/property/rulingParty> ?x } LIMIT 500",
		remoteBackend : "http://zaire.dimis.fim.uni-passau.de:8080/bigdata/sparql",
		remoteLimit : 100,
		remoteDynamicly : true,
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
		isotopeOptions : {
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
	},

	// rdfStore instance(SPARQL endpoint)
	rdfStore,

	// handlebars templates for the plugin
	templates = {},

	// Deferred to inform if the plugin was already initialized once
	globalInitDfd = $.Deferred();

	// Counter for plugin instances
	pluginInstanceCount = 0,

	// currentLevel
	currentLevel = 0,

	// CSS classes to use
	CSS_CLASSES = {
		outerContainer : "outerContainer",
		isotopeContainer : "container",
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
			return TOKEN_TAG + it;
		},
		toType : function(id) {
			var idChain = id.split("."), it = this;
			for ( var i = 0; i < idChain.length; i++) {
				it = it[idChain[i]];
			}
			return TYPE_TAG + it;
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
	DUMMY = "#replaceMe#",

	TYPE_TAG = "-filter-_",

	TOKEN_TAG = "token_",

	// Event types for Pub/Sub system
	EVENT_TYPES = {
		storeModified : {
			insert : "dataInsert"
		},
		loading : {
			loadingDone : "loadingDone",
			loadingStart : "loadingStarted"
		}
	},

	MESSAGES = {
		error : {
			ajax : "Error on loading data.",
			remote : "Error on loading remote data."
		}
	};

	// Extend Isotope - groupRows custom layout mode
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
					props.height += props.currentGroup ? instance.options.groupRows.gutter : 0;
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

	// JQuery custom selector expression : class-prefix
	$.expr[':']['class-prefix'] = function(elem, index, match) {
		var prefix = match[3];

		if (!prefix)
			return true;

		var sel = '[class^="' + prefix + '"], [class*=" ' + prefix + '"]';
		return $(elem).is(sel);
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

	// <---- class private utility functions ---->
	function isUndefinedOrNull(a) {
		return ((typeof a === "undefined") || (a === null));
	}

	function replaceDummy(query, replacement) {
		return query.replace(new RegExp(DUMMY, "g"), replacement);
	}

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

	function getClip(name) {
		switch (name) {
		case CSS_CLASSES.overlay:
			var winsize = getWindowSize(true);
			return 'rect(0px ' + winsize.width + 'px ' + winsize.height + 'px 0px)';
			break;
		case CSS_CLASSES.preview:
			var winsize = getWindowSize(false);
			return 'rect(' + winsize.height * 0.25 + 'px ' + winsize.width * 0.75 + 'px ' + winsize.height * 0.75 + 'px ' + winsize.width * 0.25 + 'px)';
			break;
		default:
			console.log("No clip data found.");
			return "";
		}
	}

	function getItemLayoutProp($item) {
		var scrollT = $window.scrollTop(), scrollL = $window.scrollLeft(), itemOffset = $item.offset();
		return {
			left : itemOffset.left - scrollL,
			top : itemOffset.top - scrollT,
			width : $item.outerWidth(),
			height : $item.outerHeight()
		};
	}

	function getTransData() {
		var transEndEventNames = {
			'WebkitTransition' : 'webkitTransitionEnd',
			'MozTransition' : 'transitionend',
			'OTransition' : 'oTransitionEnd',
			'msTransition' : 'MSTransitionEnd',
			'transition' : 'transitionend'
		};
		// transition end event name
		return {
			"transEndEventName" : transEndEventNames[Modernizr.prefixed('transition')],
			"transSupport" : Modernizr.csstransitions
		};
	}
	// <!--- class private utility functions ---->

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

		this.cssClasses = $.extend({}, CSS_CLASSES, {
			patternClasses : {
				uri : CSS_CLASSES.toToken("patternClasses.uri"),
				literal : CSS_CLASSES.toToken("patternClasses.literal"),
				blanknode : CSS_CLASSES.toToken("patternClasses.blanknode")
			},
			typeClasses : {
				incoming : CSS_CLASSES.toType("typeClasses.incoming"),
				outgoing : CSS_CLASSES.toType("typeClasses.outgoing")
			}
		});

		this._$body = $('BODY'), this._$element = $(element);
		this._$outerContainer = $('<div class="' + this.cssClasses.outerContainer + '"></div>');
		this._$isotopeContainer = $('<div class="' + this.cssClasses.isotopeContainer + '"></div>');
		this._$element.append(this._$outerContainer);
		this._$outerContainer.append(this._$isotopeContainer);

		pluginInstanceCount++;
		// Give parentelement of the plugin a correspondending plugin class
		this._$element.addClass(pluginName + "_" + pluginInstanceCount);
		this._instanceNumber = pluginInstanceCount;
		this._instanceLevel = currentLevel;

		// Use $.extend to merge the plugin options element with the defaults
		this.options = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;

		this._expandedOverlaysCount = 0;

		// List of added items.
		this._itemHistory = {
			length : 0
		};

		this._literalHistory = {};

		// Prefixes for SPARQL queries variable
		this._queryPrefixes = "";

		// SPARQL query variable
		this._queries = {};

		// <---- private functions ---->
		this._initTemplating = this._selfProxy(function() {
			var that = this, templateInitDfd = $.Deferred();

			// Helper to iterate over keys of given context
			Handlebars.registerHelper('keysEach', function(context, options) {
				var out = '';
				for ( var key in context) {
					out += options.fn(key);
				}
				return out;
			});

			// Helper to add elements, needs current plugin context
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
							case context.plugin.cssClasses.patternClasses.uri:
								var currentUri = context[i].subject.value;

								// If element isn't already created, create it
								if (!(currentUri in context.plugin._itemHistory)) {
									if (context[i].label) {

										// Only subjects with labels in english
										// or undefined language
										if (context[i].label.lang === undefined || context[i].label.lang === "en") {

											// increment index and give it back
											// to
											// the template
											if (data) {
												context[i].index = data.index = context.plugin._itemHistory.length++;
												data.uri = currentUri;
											}
											ret = ret + fn(context[i], {
												data : data
											});

											// Save added item in history
											context.plugin._itemHistory[currentUri] = context[i];
										}
									}
								} else {

									// Check for element update
									var update = false;
									$.each(context[i], function(j, val) {
										if (val !== null) {
											if (context.plugin._itemHistory[currentUri][j] === null) {
												context.plugin._itemHistory[currentUri][j] = val;
												update = true;
											} else if (j === "type"
													&& (context.plugin._itemHistory[currentUri][j].value
															.indexOf(context.plugin._itemHistory[currentUri][j].value) === -1)) {

												// An element can have more than
												// one
												// type
												context.plugin._itemHistory[currentUri][j].value += " " + val.value;
												update = true;
											}
										}
									});

									// Update element if needed
									if (update) {
										data.index = context.plugin._itemHistory[currentUri].index;

										// If element isn't already added we
										// need to
										// remove it from ret
										$tempDiv = $('<div/>').append(ret);
										$tempDiv.remove("." + context.plugin._itemHistory[currentUri].index);
										var temp = $tempDiv.children();
										$.each(temp, function(i, val) {
											ret += $(val).html();
										});

										// If element is already added we need
										// to
										// remove it from isotope
										$(context.plugin._$isotopeContainer).isotope("remove",
												$(context.plugin._$isotopeContainer).find("." + context.plugin._itemHistory[currentUri].index));

										ret = ret + fn(context.plugin._itemHistory[currentUri], {
											data : data
										});
									}
								}
								break;
							case context.plugin.cssClasses.patternClasses.literal:
								if (!(context[i].predicate.value in context.plugin._literalHistory)) {
									context.plugin._literalHistory[context[i].predicate.value] = [];
									context.plugin._literalHistory[context[i].predicate.value].push(context[i].subject.value);
									// increment index and give it back
									// to
									// the template
									if (data) {
										context[i].index = data.index = context.plugin._itemHistory.length++;
									}
									ret = ret + fn(context[i], {
										data : data
									});

								} else {
									if ($.inArray(context[i].subject.value, context.plugin._literalHistory[context[i].predicate.value]) === -1) {

										context.plugin._literalHistory[context[i].predicate.value].push(context[i].subject.value);
										if (data) {
											context[i].index = data.index = context.plugin._itemHistory.length++;
										}
										ret = ret + fn(context[i], {
											data : data
										});
									} else {
										//console.log(context[i]);
										//console.log(context.plugin._literalHistory)
										//console.log("duplicated literal found");
									}
								}
								break;
							case context.plugin.cssClasses.patternClasses.blanknode:
								// increment index and give it back
								// to
								// the template
								console.log(context[i]);
								var blankNodeQuery = replaceDummy(that._queries.blankNodeQuery, context[i].subject.value);
								that._rdfStoreExecuteQuery(blankNodeQuery, function(data) {
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

			
			if (that.options.templatesPrecompiled) {
				
				// <--- extract templates --->
				templates.isoEles = window["visaRDF"]["isotopeElements"];
				templates.isoEleContent = window["visaRDF"]["isotopeElementContent"];
				templates.overlayEle = window["visaRDF"]["overlayElement"];
				templates.overlayCon = window["visaRDF"]["overlayContent"];
				templates.sortOptions = window["visaRDF"]["sortOptions"];
				templates.filterOptions = window["visaRDF"]["filterOptions"];
				templates.previewEle = window["visaRDF"]["previewElement"];
				templates.groupSortDropdown = window["visaRDF"]["groupDropDown"];
				// <!-- extract templates --->
				templateInitDfd.resolve();
			} else {
			// Get external template file
			$.get(that.options.templatesPath, function(data) {
				var $fakeDiv = $("<div>");
				$fakeDiv.append(data);

				// <--- extract templates --->
				templates.isoEles = Handlebars.compile($fakeDiv.find("#visaRDF-isotope-elements").html());
				templates.isoEleContent = Handlebars.compile($fakeDiv.find("#visaRDF-isotope-element-content").html());
				templates.overlayEle = Handlebars.compile($fakeDiv.find("#visaRDF-overlay-element").html());
				templates.overlayCon = Handlebars.compile($fakeDiv.find("#visaRDF-overlay-content").html());
				templates.sortOptions = Handlebars.compile($fakeDiv.find("#visaRDF-sort-options").html());
				templates.filterOptions = Handlebars.compile($fakeDiv.find("#visaRDF-filter-options").html());
				templates.previewEle = Handlebars.compile($fakeDiv.find("#visaRDF-preview-element").html());
				templates.groupSortDropdown = Handlebars.compile($fakeDiv.find("#visaRDF-groupSort-dropdown").html());
				// <!-- extract templates --->

				templateInitDfd.resolve();
			}, "html");
			}
			return templateInitDfd.promise();
		});

		// History of event handler bindings
		this._evHandlerHistory = {};

		this._addEventHandler = this._selfProxy(function(eventType, handler, object, id) {
			var that = this;
			if (object === undefined) {
				object = that._$element.children(that.cssClasses.toSelector('outerContainer'));
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
		});

		this._removeEventHandler = this._selfProxy(function(eventType, id, object) {
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
		});

		this._initBrowsability = this._selfProxy(function($items) {
			var that = this, transData = getTransData(),
			// transition end event name
			transEndEventName = transData.transEndEventName,
			// transitions support available?
			supportTransitions = transData.transSupport;

			$items.each(function() {
				var $item = $(this);

				$item.index = parseInt($item.find('.number').html());

				if (that.options.usePreviews) {
					if (that.options.previewAsOverlay === true) {
						// <---- item click event ---->
						that._addDivPreviewItemClickEvent($item, supportTransitions, transEndEventName);
						// <!--- item click event ---->
					} else {
						// <---- item click event ---->
						that._addItemClickEvent($item, supportTransitions, transEndEventName);
						// <!--- item click event ---->
					}
				} else {
					that._addPreviewClickEvent($item, supportTransitions, transEndEventName);
				}
			});
		});

		this._addDivPreviewItemClickEvent = this._selfProxy(function($item, supportTransitions, transEndEventName) {
			var that = this;
			that._addEventHandler('click', function(e) {

				/*
				 * Stop propagation to not trigger window click event which
				 * closes preview again
				 */
				e.stopPropagation();

				// If preview isn't added already
				that._addDivPreview($item, supportTransitions, transEndEventName, function($preview) {

					// <!--- preview show ---->
					var layoutProp = getItemLayoutProp($item), itemClip = 'rect(' + layoutProp.top + 'px ' + (layoutProp.left + layoutProp.width) + 'px '
							+ (layoutProp.top + layoutProp.height) + 'px ' + layoutProp.left + 'px)', previewClip = getClip(that.cssClasses.preview);

					// Make preview visible
					$preview.css({
						clip : supportTransitions ? itemClip : previewClip,
						opacity : 1,
						zIndex : 9998,
						pointerEvents : 'auto'
					});

					if (supportTransitions) {
						$preview.on(transEndEventName, function() {
							$preview.off(transEndEventName);

							setTimeout(function() {
								$preview.css('clip', previewClip).on(transEndEventName, function() {
									$preview.off(transEndEventName);
								});
							}, 25);

						});
					}
					// <!--- preview show ---->

				});
			}, $item);
		});

		this._addDivPreview = this._selfProxy(function($item, supportTransitions, transEndEventName, callback) {

			var that = this, $previews = $(that.cssClasses.toSelector("preview"));
			var $preview = $previews.filter(that.cssClasses.toSelector("preview") + '_' + $item.index);
			$previews.not($preview).css({
				opacity : 0,
				pointerEvents : 'none',
				zIndex : -1,
				clip : 'auto'
			});
			if ($preview.length < 1) {
				preview = templates.previewEle({
					"index" : $item.index,
					"cssClass" : {
						"preview" : that.cssClasses.preview,
						"previewContent" : that.cssClasses.previewContent
					}
				});
				that._$element.append(preview);
				$preview = that._$element.find('> ' + that.cssClasses.toSelector("preview") + '_' + $item.index);
				$preview.css('background-color', $item.css('background-color'));
				$previewContent = $preview.children(that.cssClasses.toSelector("previewContent"));
				$previewContent.text("" + $item.find('.labelEn > div').html());

				// <---- Add event on window click ---->
				that._addDivPreviewCloseEvent($item, $preview, supportTransitions, transEndEventName);
				// <!--- Add event on window click ---->

				// <---- preview click Event ---->
				that._addDivPreviewClickEvent($item, $preview, supportTransitions, transEndEventName);
				// <!--- preview click Event ---->
				callback($preview);
			} else {
				callback($preview);
			}
		});

		this._addDivPreviewCloseEvent = this._selfProxy(function($item, $preview, supportTransitions, transEndEventName) {
			var that = this;
			that._addEventHandler('click', function(that) {
				if (that._instanceLevel === currentLevel) {
					var layoutProp = getItemLayoutProp($item), itemClip = 'rect(' + layoutProp.top + 'px ' + (layoutProp.left + layoutProp.width) + 'px '
							+ (layoutProp.top + layoutProp.height) + 'px ' + layoutProp.left + 'px)';

					$preview.css({
						opacity : 1,
						pointerEvents : 'none',
						clip : itemClip
					});

					if (supportTransitions) {
						$preview.on(transEndEventName, function() {
							$preview.off(transEndEventName);
							setTimeout(function() {
								$preview.css('opacity', 0).on(transEndEventName, function() {
									$preview.off(transEndEventName).css({
										clip : 'auto',
										zIndex : -1
									});
									$item.data('isExpanded', false);
								});
							}, 25);

						});
					} else {
						$preview.css({
							opacity : 0,
							zIndex : -1
						});
					}
				}
			}, $window);
		});

		this._addDivPreviewClickEvent = this._selfProxy(function($item, $preview, supportTransitions, transEndEventName) {
			var that = this;
			that._addEventHandler('click', function(e) {

				if (!$item.data('isExpanded')) {
					$item.data('isExpanded', true);

					// increment overall level
					if (that._instanceLevel === currentLevel) {
						currentLevel++;
					}

					// increment Counter (only needed if more than 1 Overlay can
					// be opened)
					that._expandedOverlaysCount++;

					// Add overlay if needed
					that._addOverlay($item, supportTransitions, transEndEventName, function($overlay) {

						// Fill overlay with content
						that._initOverlayContent($item, $overlay, function() {
							// <---- overlay show function ---->
							var previewClip = getClip(that.cssClasses.preview), overlayClip = getClip(that.cssClasses.overlay);

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
											that._$body.addClass('noscroll');
										});
									}, 25);

								});
							} else {
								that._$body.addClass('noscroll');
							}
							// <!--- overlay show function ---->
						});
					});
				}

				// <---- hide preview and deactivate transitions
				// ---->
				$preview.css({
					opacity : 0,
					pointerEvents : 'none',
					zIndex : -1,
					clip : 'auto'
				});
				// <!--- hide preview and deactivate transitions
				// ---->
			}, $preview);
		});

		this._addItemClickEvent = this._selfProxy(function($item, supportTransitions, transEndEventName) {
			var that = this;
			that._addEventHandler('click', function(e) {
				var $items = that._$isotopeContainer.children("div");
				$items.css({
					"width" : that.options.elementStyle.dimension.width,
					"height" : that.options.elementStyle.dimension.height
				});
				$items.removeClass(that.cssClasses.previewItem);
				that._$isotopeContainer.isotope('reLayout');
				that._removeEventHandler("click", "previewClick");

				/*
				 * Stop propagation to not trigger window click event which
				 * closes preview again
				 */
				e.stopPropagation();

				var newWidth, newHeight;

				// get Isotope instance
				// var isotopeInstance =
				// that._$isotopeContainer.data('isotope');

				newWidth = that._$isotopeContainer.width() - 100;
				newHeight = $window.height() - 100;

				$item.addClass(that.cssClasses.previewItem);
				$item.css({
					"width" : newWidth,
					"height" : newHeight
				});

				var previewQuery = replaceDummy(that._queries.previewQuery, $item.data("uri"));

				that._rdfStoreExecuteQuery(previewQuery, function(data) {
					var content = templates.isoEleContent(data[0]);
					$item.find(".itemContent").remove();
					$item.append(content);
				});
				that._$isotopeContainer.isotope('reLayout');

				// <---- add preview click Event ---->
				that._addPreviewClickEvent($item, supportTransitions, transEndEventName);
				// <!--- add preview click Event ---->

				// <---- Add event on window click ---->
				that._addPreviewCloseEvent($item, supportTransitions, transEndEventName);
				// <!--- Add event on window click ---->

				$item.off('click', this);
			}, $item);
		});

		this._addPreviewClickEvent = this._selfProxy(function($item, supportTransitions, transEndEventName) {
			var that = this;
			that._addEventHandler('click', function(e) {
				var $items = that._$isotopeContainer.children("div");
				$items.css({
					"width" : that.options.elementStyle.dimension.width,
					"height" : that.options.elementStyle.dimension.height
				});
				that._$isotopeContainer.isotope('reLayout');

				if (!$item.data('isExpanded')) {
					$item.data('isExpanded', true);

					// increment overall level
					if (that._instanceLevel === currentLevel) {
						currentLevel++;
					}

					// increment Counter (only needed if more than 1 Overlay can
					// be opened)
					that._expandedOverlaysCount++;

					// Add overlay if needed
					that._addOverlay($item, supportTransitions, transEndEventName, function($overlay) {

						// Fill overlay with content
						that._initOverlayContent($item, $overlay,
								function() {
									// <---- overlay show function ---->
									var layoutProp = getItemLayoutProp($item), itemClip = 'rect(' + layoutProp.top + 'px '
											+ (layoutProp.left + layoutProp.width) + 'px ' + (layoutProp.top + layoutProp.height) + 'px ' + layoutProp.left
											+ 'px)', overlayClip = getClip(that.cssClasses.overlay);

									// Make overlay visible
									$overlay.css({
										clip : supportTransitions ? itemClip : overlayClip,
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
													that._$body.addClass('noscroll');
												});
											}, 25);

										});
									} else {
										that._$body.addClass('noscroll');
									}
									// <!--- overlay show function ---->
								});
					});
				}
				if (that.options.usePreviews) {
					$item.off("click", this);
				}
			}, $item, "previewClick");
		});

		this._addPreviewCloseEvent = this._selfProxy(function($item, supportTransitions, transEndEventName) {
			var that = this;
			that._addEventHandler('click', function() {
				$item.css({
					"width" : that.options.elementStyle.dimension.width,
					"height" : that.options.elementStyle.dimension.height
				});
				that._$isotopeContainer.isotope('reLayout');
				$item.off('click');
				that._addItemClickEvent($item, supportTransitions, transEndEventName);
			}, $window);
		});

		this._addOverlay = this._selfProxy(function($item, supportTransitions, transEndEventName, callback) {
			var that = this, $overlay = that._$element.find('> ' + that.cssClasses.toSelector("overlay") + '_' + $item.index);
			if ($overlay.length < 1) {
				var overlay = templates.overlayEle({
					"index" : $item.index,
					"cssClass" : {
						"overlay" : that.cssClasses.overlay,
						"overlayContent" : that.cssClasses.overlayContent
					}
				});
				that._$element.append(overlay);
				$overlay = that._$element.find('> ' + that.cssClasses.toSelector("overlay") + '_' + $item.index);

				// <---- close click Event ---->
				that._addOverlayCloseEvent($item, $overlay, supportTransitions, transEndEventName);
				// <!--- close Event ---->
				callback($overlay);
			} else {
				callback($overlay);
			}
		});

		this._addOverlayCloseEvent = this._selfProxy(function($item, $overlay, supportTransitions, transEndEventName) {
			var that = this, $overlayContent = $overlay.find('> ' + that.cssClasses.toSelector("overlayContent")), $close = $overlay.find('> span.close');
			that._addEventHandler('click', function() {

				that._expandedOverlaysCount--;
				if (that._expandedOverlaysCount === 0) {
					if (--currentLevel === 0) {
						that._$body.removeClass('noscroll');
					}
				}

				var layoutProp = getItemLayoutProp($item), itemClip = 'rect(' + layoutProp.top + 'px ' + (layoutProp.left + layoutProp.width) + 'px '
						+ (layoutProp.top + layoutProp.height) + 'px ' + layoutProp.left + 'px)';

				$overlay.css({
					clip : itemClip,
					opacity : 1,
					pointerEvents : 'none'
				});

				// <---- overlay hide ---->
				// clear old data
				$overlayContent.find('div:class-prefix(visaRDF)').data('plugin_visaRDF').destroy();
				$overlayContent.children().remove('');

				if (supportTransitions) {
					$overlay.on(transEndEventName, function() {
						$overlay.off(transEndEventName);
						setTimeout(function() {
							$overlay.css('opacity', 0).on(transEndEventName, function() {
								$overlay.off(transEndEventName).css({
									clip : 'auto',
									zIndex : -1
								});
								$item.data('isExpanded', false);
							});
						}, 25);

					});
				} else {
					$overlay.css({
						opacity : 0,
						zIndex : -1
					});
				}
				// <!--- overlay hide ---->
			}, $close);
		});

		this._initOverlayContent = this
				._selfProxy(function($item, $overlay, callback) {
					var that = this, $overlayContent = $overlay.find('> ' + that.cssClasses.toSelector("overlayContent")), uri = $item.find('.showUri').html();

					// Get elements who are in a relation to
					// current item
					var subjectOfQuery = replaceDummy(that._queries.selectSubjectOf, uri), objectOfQuery = replaceDummy(that._queries.selectObjectOf, uri), remoteSubjectOf = replaceDummy(
							that._queries.remoteSubjectOf, uri), remoteObjectOf = replaceDummy(that._queries.remoteObjectOf, uri);
					// console.log($item.find('.showUri').html());

					that._rdfStoreExecuteQuery(subjectOfQuery, function(subjectOf) {
						that._rdfStoreExecuteQuery(objectOfQuery, function(objectOf) {

							// Input for the handlebar
							// template
							var input = {};
							input.label = $item.find('.labelEn').text();

							// Add types for filtering
							for ( var i = 0; i < subjectOf.length; i++) {
								subjectOf[i].type = {
									value : that.cssClasses.typeClasses.outgoing
								};
							}
							for ( var i = 0; i < objectOf.length; i++) {
								objectOf[i].type = {
									value : that.cssClasses.typeClasses.incoming
								};
							}

							// write new data
							$overlayContent.append($(templates.overlayCon(input)));

							var resultSet = $.merge($.merge([], subjectOf), objectOf);
							$overlayContent.find('> .innerScroll > div').visaRDF($.extend(true, {}, that.options, {
								dataLoc : null,
								dataFormat : null,
								sparqlData : resultSet,
								generateSortOptions : true,
								generateFilterOptions : true,
								isotopeOptions : {
									itemSelector : '.element',
									layoutMode : 'masonry',
									groupRows : {
										gutter : 20
									},
									getSortData : {
										type : function($elem) {
											var classes = $elem.attr("class");
											return classes;
										},
										group : function($elem) {
											var classes = $elem.attr("class");
											var pattern = new RegExp("(\s)*[a-zA-Z0-9]*" + TOKEN_TAG + "[a-zA-Z0-9]*(\s)*", 'g');
											var groups = classes.match(pattern), group = "";
											for ( var i = 0; i < groups.length; i++) {
												group += groups[i] + " ";
											}
											return group;
										}
									}
								},
								initQueries : [ {
									query : subjectOfQuery,
									type : that.cssClasses.typeClasses.outgoing
								}, {
									query : objectOfQuery,
									type : that.cssClasses.typeClasses.incoming
								} ],
								filterBy : [ {
									value : "*",
									label : "showAll"
								}, {
									value : CSS_CLASSES.typeClasses.incoming,
									label : "in"
								}, {
									value : CSS_CLASSES.typeClasses.outgoing,
									label : "out"
								} ],
							}));
						});
					});

					if (that.options.remoteDynamicly) {
						that._addEventHandler(EVENT_TYPES.loading.loadingDone, function(ev, $invoker) {
							var contentVisaRDF = $overlayContent.find('div:class-prefix(visaRDF)').data('plugin_visaRDF');
							if ($invoker === contentVisaRDF) {
								that._removeEventHandler(EVENT_TYPES.loading.loadingDone, "remoteSubjectOf", $overlayContent);
								contentVisaRDF.insertRemoteDataQuery(that.options.remoteBackend, remoteSubjectOf + " LIMIT " + that.options.remoteLimit);
								that._addEventHandler(EVENT_TYPES.loading.loadingDone,
										function(ev, $invoker) {
											if ($invoker === contentVisaRDF) {
												that._removeEventHandler(EVENT_TYPES.loading.loadingDone, "remoteObjectOf", $overlayContent);
												contentVisaRDF.insertRemoteDataQuery(that.options.remoteBackend, remoteObjectOf + " LIMIT "
														+ that.options.remoteLimit);
											}
										}, $overlayContent, "remoteObjectOf");
							}
						}, $overlayContent, "remoteSubjectOf");
					}

					// Set contet color
					var color = new RGBColor($item.css("background-color"));
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
				});

		this._initRdfStore = this._selfProxy(function() {
			var that = this, rdfStoreInitDfd = $.Deferred();
			// console.log("Init RDFSTORE");
			if (isUndefinedOrNull(rdfStore)) {
				new rdfstore.Store(that.options.rdfstoreOptions, that._selfProxy(function(store) {
					rdfStore = store;
					rdfStoreInitDfd.resolve();
				}));
			}
			return rdfStoreInitDfd.promise();
		});

		this._generateQueryPrefixes = this._selfProxy(function() {
			var that = this;
			that._queryPrefixes = "";

			// Generate prefixes for SPARQL queries by using namesspaces
			// given in
			// options
			$.each(this.options.ns, this._selfProxy(function(i, val) {
				that._generateQueryPrefix(i, val);
			}));
		});

		this._generateQueryPrefix = this._selfProxy(function(prefix, uri) {
			var that = this;
			that._queryPrefixes += "PREFIX " + prefix + ": <" + uri + "> ";
		});

		this._generateQueries = this
				._selfProxy(function() {
					var that = this;

					// Generate SPARQL queries
					that._queries = {
						initQueries : this.options.initQueries,
						remoteQuery : this.options.remoteQuery,
						remoteSubjectOf : " SELECT ?subject ?predicate ?object ?labelObj WHERE { BIND (<" + DUMMY
								+ "> as ?subject) ?subject ?predicate ?object. OPTIONAL { ?object rdfs:label ?labelObj }}",
						remoteObjectOf : " SELECT ?subject ?predicate ?object ?labelSub WHERE {BIND (<" + DUMMY
								+ "> as ?object) ?subject ?predicate ?object. OPTIONAL { ?subject rdfs:label ?labelSub }}",
						selectSubjectOf : " SELECT ?subject ?predicate ?label ?description WHERE {<"
								+ DUMMY
								+ "> ?predicate ?subject. OPTIONAL { ?subject rdfs:label ?label}. OPTIONAL { ?subject rdfs:description ?description } . OPTIONAL { ?subject rdfs:comment ?description }}",
						selectObjectOf : " SELECT ?subject ?predicate ?type ?label ?description WHERE {?subject ?predicate <"
								+ DUMMY
								+ ">. OPTIONAL { ?subject rdfs:label ?label}. OPTIONAL { ?subject rdfs:description ?description } . OPTIONAL { ?subject rdfs:comment ?description }}",
						previewQuery : " SELECT ?label ?description ?type WHERE { <" + DUMMY + "> rdfs:label ?label . OPTIONAL { <" + DUMMY
								+ "> rdfs:description ?description } . OPTIONAL { <" + DUMMY + "> rdfs:comment ?description } . OPTIONAL { <" + DUMMY
								+ "> rdfs:type ?type}}",
						blankNodeQuery : "SELECT ?object WHERE {<" + DUMMY + "> ?predicate ?object}"
					};
				});

		this._isotopeAddBatches = this._selfProxy(function(items) {
			var length = items.length, that = this, batchSize = ((length < that.options.batchSize) ? length : that.options.batchSize);

			this._$outerContainer.find('> .loading').text(parseInt(batchSize / length * 100) + "% -");

			// current batch
			var batch = items.slice(0, batchSize);

			// isoEles / HistoryAwareEach needs plugincontext
			batch.plugin = that;

			$.each(batch, function(i, val) {
				// use literal value as label on literals
				if (val.subject.token === "literal") {
					val.label = val.subject;
				}
				if (val.label) {
					val.label.value = unescape(val.label.value);
					val.subject.token = TOKEN_TAG + val.subject.token;
				}
			});
			var $elements = $(templates.isoEles(batch));

			$.each($elements, function(i, val) {
				$(val).css("background-color", "rgba(125, 125, 125 ,0.2)");
			});

			if (!isUndefinedOrNull($elements.html())) {

				// Use given width/height
				$elements.css({
					width : this.options.elementStyle.dimension.width,
					height : this.options.elementStyle.dimension.height
				});

				that._$isotopeContainer.isotope('insert', $elements, function() {
					$elements.find('.ellipsis').ellipsis();
					$nodes = $elements.filter(that.cssClasses.toSelector("patternClasses.uri"));
					$literals = $elements.filter(that.cssClasses.toSelector("patternClasses.literal"));

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

					that._isotopeAddBatchesHelp(items, batchSize);
				});
			} else {
				that._isotopeAddBatchesHelp(items, batchSize);
			}
		});

		this._isotopeAddBatchesHelp = this._selfProxy(function(items, batchSize) {
			var that = this, rest = items.slice(batchSize);
			if (rest.length > 0) {
				that._isotopeAddBatches(rest);
			} else {
				$(that._$outerContainer).trigger(EVENT_TYPES.loading.loadingDone, that);
			}
		});

		/**
		 * Check whether the plugin is initialized with insertion options and
		 * call insertion methods if needed.
		 * 
		 * @returns inserted true if data was inserted, false if not
		 */
		this._checkInsertion = this._selfProxy(function() {
			var that = this, inserted = false;
			if (!isUndefinedOrNull(that.options.dataFormat)) {
				// console.log(this);
				if (!isUndefinedOrNull(that.options.dataLoc)) {
					inserted = true;
					that._ajaxLoadData(that.options.dataLoc, that.options.dataFormat, function(rdfData, dataFormat) {
						that._rdfStoreInsertData(rdfData, dataFormat, function() {
							$(that._$outerContainer).trigger(EVENT_TYPES.storeModified.insert, that);
						});
					});
				} else if (!isUndefinedOrNull(that.options.data)) {
					inserted = true;
					that._rdfStoreInsertData(that.options.data, that.options.dataFormat, function() {
						$(that._$outerContainer).trigger(EVENT_TYPES.storeModified.insert, that);
					});
				}
			}
			return inserted;
		});

		/**
		 * Check whether the plugin is initialized with the sort options
		 * generation option and generate the sort options if needed.
		 */
		this._checkSortGeneration = this._selfProxy(function() {
			if (this.options.generateSortOptions) {
				// Add options
				var $element = this._$element, $isotopeContainer = this._$isotopeContainer;
				var sortData = $.extend({}, this.options.isotopeOptions.getSortData);
				delete sortData["group"];
				var sortOptions = templates.sortOptions(sortData);
				var $options = $element.find(".options");
				$options.prepend(sortOptions);
				$sorter = $options.find(' > .sorter');

				// Set selected on view
				$sorter.find('.' + this.options.isotopeOptions.sortBy).addClass("selected");
				$sortLinks = $options.find('a');

				$sorter.append(templates.groupSortDropdown({
					type : {
						label : "type",
						val : TYPE_TAG
					},
					token : {
						label : "node-type",
						val : TOKEN_TAG
					}
				}));
				$sorterGroup = $sorter.find('#GroupDropDown');

				// Add onChange
				$sorterGroup.change(function(e) {

					// get href attribute, minus the '#'
					var groupBy = $(this).val();

					$element.find('.sorter > > > .selected').removeClass('selected');
					$isotopeContainer.isotope({
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
					$isotopeContainer.isotope('updateSortData', $isotopeContainer.find(".element"));
					$isotopeContainer.find("> > .groupLabel").remove();
					$isotopeContainer.isotope({
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
					$element.find('.sorter > > > .selected').removeClass("selected");
					$isotopeContainer.find("> > .groupLabel").remove();
					$(this).addClass("selected");
					$isotopeContainer.isotope({
						layoutMode : 'masonry',
						sortBy : sortName
					});
					return false;
				});
			}
		});

		/**
		 * Check whether the plugin is initialized with the filter options
		 * generation option and generate the filter options if needed.
		 */
		this._checkFilterGeneration = this._selfProxy(function() {
			var that = this;
			if (that.options.generateFilterOptions) {
				// Add options
				var $element = that._$element;
				var filterOptions = templates.filterOptions(that.options.filterBy);
				var $options = $element.find(".options");
				$options.append(filterOptions);

				$filter = $options.find(' > .filter');
				$filterLinks = $filter.find('a');

				// Add onClick
				$filterLinks.click(function() {
					// get href attribute, minus the '#'
					var selector = $(this).attr('data-filter-value');
					if (selector !== '*') {
						selector = "." + TYPE_TAG + selector;
					}
					$element.find('.filter > > > .selected').removeClass('selected');
					$(this).addClass('selected');
					$element.find(that.cssClasses.toSelector("isotopeContainer")).isotope({
						filter : selector
					});
					return false;
				});

				$filter.append('<input id="filterField" type="text" size="25" value="Enter search here.">');
				$filterBox = $filter.find('#filterField');

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

					$element.find('.filter > > > .selected').removeClass('selected');
					$element.find(that.cssClasses.toSelector("isotopeContainer")).isotope({
						filter : selector
					});
					return false;
				});
			}
		});

		this._rdfStoreExecuteQuery = this._selfProxy(function(query, callback) {
			var that = this;
			rdfStore.execute(that._queryPrefixes + query, function(success, results) {
				if (success) {
					callback(results);
				} else {
					$(that._$outerContainer).trigger(EVENT_TYPES.loading.loadingDone, that);
					console.log("Error on executing: " + query);
				}
			});
		});

		/*
		 * Inserts given data in store.
		 */
		this._rdfStoreInsertData = this._selfProxy(function(data, dataFormat, callback) {
			var that = this;
			$(that._$outerContainer).trigger(EVENT_TYPES.loading.loadingStart, that);

			if (dataFormat === "remote") {
			}

			if (dataFormat === "text/turtle" || dataFormat === "text/plain" || dataFormat === "text/n3") {
				// get prefix terms and update namespaces
				var prefixTerms = data.match(/.*@prefix.*>(\s)*./g);
				$.each(prefixTerms, function(i, val) {
					var prefixTerm = (val.split(/>(\s)*./)[0]).split(/:(\s)*</);
					var prefix = prefixTerm[0].replace(/@prefix(\s)*/, "");
					var uri = prefixTerm[2];
					if (isUndefinedOrNull(that.options.ns[prefix])) {
						that.options.ns[prefix] = uri;
						that._generateQueryPrefix(prefix, uri);
					}
					// if (prefixTerms.length - 1 === i) {
					//
					// // filter prefix terms out
					// var nonPrefixes = data.replace(/.*@prefix.*>(\s)*./g,
					// "");
					// }
				});
			} else if (dataFormat === "application/ld+json" || dataFormat === "application/json") {
				var prefixes = data["@context"];
				$.each(prefixes, function(i, val) {
					if (isUndefinedOrNull(that.options.ns[prefix])) {
						that.options.ns[i] = val;
						that._generateQueryPrefix(i, val);
					}
				});
			}

			// TODO Long loading times due to parser
			rdfStore.load(dataFormat, data, function(store) {
				callback();
			});
		});

		/*
		 * Loads file at dataURL and invokes callback with loaded data
		 */
		this._ajaxLoadData = this._selfProxy(function(dataURL, dataFormat, callback) {
			var that = this;
			$(that._$outerContainer).trigger(EVENT_TYPES.loading.loadingStart, that);
			// console.log("_ajaxLoadData");
			$.ajax({
				url : dataURL,
				dataType : "text",
				success : function(rdfData) {
					callback(rdfData, dataFormat);
				}
			}).fail(function() {
				$(that._$outerContainer).trigger(EVENT_TYPES.loading.loadingDone, that);
				alert(MESSAGES.error.ajax);
			});
		});

		this._updateView = this._selfProxy(function(initQueries) {
			var that = this, emptyResults = true;
			$(that._$outerContainer).trigger(EVENT_TYPES.loading.loadingStart, that);
			for ( var i = 0; i < initQueries.length; i++) {
				that._rdfStoreExecuteQuery(initQueries[i].query, function(results) {
					if (results && results.length !== 0) {
						emptyResults = false;
						if (initQueries[i].type) {
							// Add types for filtering
							for ( var j = 0; j < results.length; j++) {
								results[j].type = {
									value : initQueries[i].type
								};
							}
						}
						that._isotopeAddBatches(results);
					} else if (i === initQueries.length - 1 && emptyResults) {
						$(that._$outerContainer).trigger(EVENT_TYPES.loading.loadingDone, that);
					}
				});
			}
		});

		// Accepts a url and a callback function to run.
		this._requestCrossDomain = function(site, query, callback) {

			var that = this, success = false;
			$(that._$outerContainer).trigger(EVENT_TYPES.loading.loadingStart, this);

			// If no url was passed, exit.
			if (!site) {
				alert('No site was passed.');
				return false;
			}

			// If no query was passed, exit.
			if (!query) {
				alert('No query was passed.');
				return false;
			}

			// Take the provided url, and add it to a YQL query. Make sure you
			// encode it!
			var yql = 'http://query.yahooapis.com/v1/public/yql?q='
					+ encodeURIComponent('use "http://triplr.org/sparyql/sparql.xml" as sparql; select * from sparql where query="' + query + '" and service="'
							+ site) + '"&format=json&callback=cbFunc';

			// Request that YSQL string, and run a callback function.
			// Pass a defined function to prevent cache-busting.
			// $.getJSONP(yql, cbFunc);
			$.ajax({
				dataType : 'jsonp',
				url : yql,
				success : window.cbFunc,
				error : function(jqXHR, textStatus, errorThrown) {
					//console.log(yql);
					console.log("Error on yql query.");
					//console.log(textStatus);
					//console.log(jqXHR);
					console.log(errorThrown);
					if (!success) {
						that._$outerContainer.trigger(EVENT_TYPES.loading.loadingDone, that);
					}
				}
			});

			window.cbFunc = function(data, textStatus, jqXHR) {
				success = true;
				//console.log(success);
				
				// If we have something to work with...
				// console.log(data)
				if (data && data.query.results) {
					callback(data.query.results.sparql.result);
				}
				// Else, Maybe we requested a site that doesn't exist, and
				// nothing returned.
				else
					console.log('Nothing returned from getJSON.');
				that._$outerContainer.trigger(EVENT_TYPES.loading.loadingDone, that);
			};
		},

		// <!--- instance private functions ---->

		this.init();
	}

	Plugin.prototype = {

		init : function() {
			
			// Init Isotope
			this._$isotopeContainer.isotope(this.options.isotopeOptions);

			// Generate SPARQL Query Prefixes
			this._generateQueryPrefixes();

			// Generate SPARQL Queries
			this._generateQueries();

			// <---- loading img ---->
			this._$outerContainer.prepend('<div class="' + this.cssClasses.loader + '">');
			this._$outerContainer.append('<div class="' + this.cssClasses.loader + '">');

			// Add loading start listener

			this._addEventHandler(EVENT_TYPES.loading.loadingStart, this._selfProxy(function(ev, $invoker) {
				// console.log(this);
				if ($invoker === this) {
					if (this._$outerContainer.css("height") < 120) {
						this._$outerContainer.css("height", "20px");
					}
					this._$outerContainer.find('> ' + this.cssClasses.toSelector("loader")).css("visibility", "visible");
				}
			}));

			// Add loading done listener
			this._addEventHandler(EVENT_TYPES.loading.loadingDone, this._selfProxy(function(ev, $invoker) {
				if ($invoker === this) {
					this._$outerContainer.find('> .loading').text('');
					this._$outerContainer.find('> ' + this.cssClasses.toSelector("loader")).css("visibility", "hidden");
				}
			}));
			// <!--- loading img ---->

			// Add insertion listener
			this._addEventHandler(EVENT_TYPES.storeModified.insert, this._selfProxy(function(ev, $invoker) {
				this._updateView(this._queries.initQueries);
			}));

			// Add a smartresize listener (smartresize to be found in
			// jQuery.isotope)
			this._addEventHandler('smartresize', this._selfProxy(function(ev, $invoker) {

				// <---- overlay modification ---->
				var $overlays = this._$element.children(this.cssClasses.toSelector("overlay"));
				$overlays.css('clip', getClip(CSS_CLASSES.overlay));
				var innerScrolls = $overlays.find('.innerScroll');
				innerScrolls.css("width", ($window.width() - parseInt($overlays.css("padding-left")) - parseInt($overlays.css("padding-right"))) + "px");
				innerScrolls.css("height", $window.height() * 0.95 + "px");
				// <!--- overlay modification ---->

				// <---- preview modification ---->
				if (this.options.previewAsDiv) {
					var $previews = this._$element.children(this.cssClasses.toSelector("preview"));
					$previews.css('clip', getClip(this.cssClasses.preview));
				} else {
					var $previews = this._$isotopeContainer.children(this.cssClasses.toSelector("previewItem"));

					var newWidth, newHeight;
					newWidth = this._$isotopeContainer.width() - 100;
					newHeight = $window.height() - 100;
					$previews.css({
						"width" : newWidth,
						"height" : newHeight
					});
					this._$isotopeContainer.isotope('reLayout');
				}
				// <!--- preview modification ---->
			}), $window);

			// Init templating and RdfStore if needed
			if (globalInitDfd.state() === "pending") {
				globalInitDfd = $.Deferred();
				$.when(this._initRdfStore(), this._initTemplating()).done(function() {
					globalInitDfd.resolve();
				});
			}

			// when done check if sort options have to be initialized and data
			// is to be inserted
			$.when(globalInitDfd.promise()).done(this._selfProxy(function() {
				if (this.options.generateSortOptions || this.options.generateFilterOptions) {
					this._$element.prepend('<section class="' + this.cssClasses.options + '" class="' + this.cssClasses.clearfix + '"></section>');
					this._checkSortGeneration();
					this._checkFilterGeneration();
				}
				if (!this._checkInsertion()) {
					if (this.options.sparqlData === undefined) {
						this._updateView(this._queries.initQueries);
					} else {
						this._isotopeAddBatches(this.options.sparqlData);
					}
				}
			}));
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
				that._rdfStoreInsertData(data, dataFormat, function() {
					$(that._$outerContainer).trigger(EVENT_TYPES.storeModified.insert, that);
				});
			});
		},

		/**
		 * Insert rdf-data of given location in the store.
		 * 
		 * @arguments
		 * @param data
		 *            URL of the data
		 * @param dataFormat
		 *            Format of the data
		 */
		insertDataFile : function(dataURL, dataFormat) {
			var that = this;
			$.when(globalInitDfd.promise()).done(function() {
				that._ajaxLoadData(dataURL, dataFormat, that._selfProxy(that.insertData));
			});
		},

		insertRemoteData : function(url) {
			var that = this;
			$.when(globalInitDfd.promise()).done(function() {
				that.insertRemoteDataQuery(url, that._queries.remoteQuery);
			});
		},

		insertRemoteDataQuery : function(url, query) {

			if (query === undefined || query === "") {
				insertRemoteData(url);
			} else {
				this._requestCrossDomain(url, query, this._selfProxy(function(data) {

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
						this._rdfStoreExecuteQuery(insertionQuery, this._selfProxy(function() {
							$(this._$outerContainer).trigger(EVENT_TYPES.storeModified.insert, this);
						}));
					}
				}));
			}
		},

		clearStore : function() {
			this._rdfStoreExecuteQuery("CLEAR ALL", this._selfProxy(function() {
				var that = this;
				that._$isotopeContainer.isotope('remove', $(".element"), function() {
					that._itemHistory = {
						length : 0
					};
					that._literalHistory = {};
					console.log("store cleared");
				});
			}));
		},

		/**
		 * Clean up after plugin (destroy bindings..)
		 */
		destroy : function() {
			var that = this;
			$.each(that._evHandlerHistory, function(eventType, binding) {
				$.each(binding, function(i, val) {
					val.object.off(eventType, val.handler);
				});
			});
			that._evHandlerHistory = undefined;
			pluginInstanceCount--;
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

// Zeile 391 rdf-store modifiziert
