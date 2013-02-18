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
		templatesPath : "templates/templates.html",
		batchSize : 25,
		generateSortOptions : true,
		generateFilterOptions : false,
		filterBy : [ {
			value : "*",
			label : "showAll"
		} ],
		sparqlData : undefined,
		elementStyle : {
			dimension : {
				width : 200,
				height : 100
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
			masonry : {
				columnWidth : 200
			},
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

	// Defered to inform if the plugin was already initialized once
	globalInitDfd = undefined,

	// Counter for plugin instances
	pluginInstanceCount = 0,

	// currentLevel
	currentLevel = 0,

	CSS_CLASSES = {
		container : "outerContainer",
		isotopeContainer : "container",
		options : "options",
		clearfix : "clearfix",
		loader : "loading",
		toSelector : function(id) {
			return "." + CSS_CLASSES[id];
		}
	},

	// Placeholder in query strings
	REPLACE_ME = "#replaceMe#",

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
			ajax : "Error on loading data."
		}
	};

	// <---- class private utility functions ---->
	function _isUndefinedOrNull(a) {
		return ((typeof a === "undefined") || (a === null));
	}
	;

	function getWindowSize() {
		var w = null, h = null;
		if (that._$body.hasClass('noscroll')) {
			w = $window.width(), h = $window.height();
		} else {
			that._$body.addClass('noscroll');
			w = $window.width(), h = $window.height();
			that._$body.removeClass('noscroll');
		}
		return {
			width : w,
			height : h
		};
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

		this._$body = $('BODY'), this._$element = $(element);
		this._$container = $('<div class="' + CSS_CLASSES.container + '"></div>');
		this._$isotopeContainer = $('<div class="' + CSS_CLASSES.isotopeContainer + '"></div>');
		this._$element.append(this._$container);
		this._$container.append(this._$isotopeContainer);

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

		// List of added items. Holds only uri and index of an item.
		this._itemHistory = {
			length : 0
		};

		// Prefixes for SPARQL queries variable
		this._prefixes = "";

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
							case 'uri':
								var currentUri = context[i].subject.value;

								// If element isn't already created, create it
								if (!(currentUri in context.plugin._itemHistory)) {
									if (context[i].label) {
										if (context[i].label.lang === undefined || context[i].label.lang === "en") {

											// increment index and give it back
											// to
											// the template
											if (data) {
												context[i].index = data.index = context.plugin._itemHistory.length++;
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
									$.each(context[i], function(i, val) {
										if (val !== null) {
											if (context.plugin._itemHistory[currentUri][i] === null) {
												context.plugin._itemHistory[currentUri][i] = val;
												update = true;
											} else if (i === "type" && context.plugin._itemHistory[currentUri][i] !== context[i]) {

												// An element can have more than
												// one
												// type
												context.plugin._itemHistory[currentUri][i].value += " " + val.value;
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
										ret = $tempDiv.contents();

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
							case 'literal':
								// increment index and give it back
								// to
								// the template
								if (data) {
									context[i].index = data.index = context.plugin._itemHistory.length++;
								}
								ret = ret + fn(context[i], {
									data : data
								});
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

			// Get external template file
			$.get(that.options.templatesPath, function(data) {
				$('HEAD').append(data);

				// <--- extract templates --->
				templates.isoEle = Handlebars.compile($("#visaRDF-isotope-elements").html());
				Handlebars.registerPartial("visaRDF-isotope-element", $("#visaRDF-isotope-element").html());
				templates.overlayEle = Handlebars.compile($("#visaRDF-overlay-element").html());
				templates.overlayCon = Handlebars.compile($("#visaRDF-overlay-content").html());
				templates.sortOptions = Handlebars.compile($("#visaRDF-sort-options").html());
				templates.filterOptions = Handlebars.compile($("#visaRDF-filter-options").html());
				// <!-- extract templates --->

				templateInitDfd.resolve();
			}, "html");
			return templateInitDfd.promise();
		});

		// History of event handler bindings
		this._evHandlerHistory = {};

		this._addEventHandler = this._selfProxy(function(eventType, handler, object) {
			var that = this;
			if (object === undefined) {
				object = that._$element.children(CSS_CLASSES.toSelector('container'));
			}
			if (that._evHandlerHistory[eventType] === undefined) {
				that._evHandlerHistory[eventType] = [];
			}
			that._evHandlerHistory[eventType].push({
				"object" : object,
				"handler" : handler
			});
			object.on(eventType, handler);
		});

		// Modified code from: Mary Lou@Codrops -
		// http://tympanus.net/Tutorials/ExpandingOverlayEffect/
		this._initOverlays = this._selfProxy(function($items) {
			var that = this, transData = getTransData(),
			// transition end event name
			transEndEventName = transData.transEndEventName,
			// transitions support available?
			supportTransitions = transData.transSupport,
			// window width and height
			winsize = getWindowSize();

			$items.each(function() {
				var $item = $(this);
				that
						._addEventHandler('click',
								function() {
									$item.index = parseInt($item.find('.number').html());
									if (!$item.data('isExpanded')) {
										$item.data('isExpanded', true);
										var $overlay = that._$element.find('> .overlay_' + $item.index);

										// increment overall level
										if (that._instanceLevel === currentLevel) {
											currentLevel++;
										}
										that._expandedOverlaysCount++;

										// If overlay isn't added already add
										// it<
										if ($overlay.length < 1) {
											var overlay = templates.overlayEle({
												"index" : $item.index
											});
											that._$element.append(overlay);
											var $overlay = that._$element.find('> .overlay_' + $item.index), $overlayContent = $overlay
													.find('> .overlayContent'), $close = $overlay.find('span.close');

											that._addEventHandler('click', function() {

												that._expandedOverlaysCount--;
												if (that._expandedOverlaysCount === 0) {
													if (--currentLevel === 0) {
														that._$body.removeClass('noscroll');
													}
												}

												var layoutProp = getItemLayoutProp($item), clipPropFirst = 'rect(' + layoutProp.top + 'px '
														+ (layoutProp.left + layoutProp.width) + 'px ' + (layoutProp.top + layoutProp.height) + 'px '
														+ layoutProp.left + 'px)', clipPropLast = 'auto';

												// clear old data
												$overlayContent.find('> .innerScroll > div').data('plugin_visaRDF').destroy();
												$overlayContent.children().remove('');

												$overlay.css({
													clip : clipPropFirst,
													opacity : 1,
													pointerEvents : 'none'
												});
												if (supportTransitions) {
													$overlay.on(transEndEventName, function() {

														$overlay.off(transEndEventName);
														setTimeout(function() {
															$overlay.css('opacity', 0).on(transEndEventName, function() {
																$overlay.off(transEndEventName).css({
																	clip : clipPropLast,
																	zIndex : -1
																});
																$item.data('isExpanded', false);
															});
														}, 25);

													});
												} else {
													$overlay.css('z-index', -1);
												}

											}, $close);
										}

										that._initOverlayContent($item, function() {
											var layoutProp = getItemLayoutProp($item), clipPropFirst = 'rect(' + layoutProp.top + 'px '
													+ (layoutProp.left + layoutProp.width) + 'px ' + (layoutProp.top + layoutProp.height) + 'px '
													+ layoutProp.left + 'px)', clipPropLast = 'rect(0px ' + winsize.width + 'px ' + winsize.height + 'px 0px)';

											// Make overlay visible
											$overlay.css({
												clip : supportTransitions ? clipPropFirst : clipPropLast,
												opacity : 1,
												zIndex : 9999,
												pointerEvents : 'auto'
											});

											if (supportTransitions) {
												$overlay.on(transEndEventName, function() {

													$overlay.off(transEndEventName);

													setTimeout(function() {
														$overlay.css('clip', clipPropLast).on(transEndEventName, function() {
															$overlay.off(transEndEventName);
															that._$body.addClass('noscroll');
														});
													}, 25);

												});
											} else {
												that._$body.addClass('noscroll');
											}
										});
									}
								}, $item);
			});
		});

		this._initOverlayContent = this
				._selfProxy(function($item, callback) {
					var that = this, $overlay = that._$element.find('> .overlay_' + $item.index), $overlayContent = $overlay.find('> .overlayContent');

					// Get elements who are in a relation to
					// current item
					var reg = new RegExp(REPLACE_ME, "g"), subjectOfQuery = that._queries.selectSubjectOf.replace(reg, $item.find('.showUri').html()), objectOfQuery = that._queries.selectObjectOf
							.replace(reg, $item.find('.showUri').html());

					that._rdfStoreExecuteQuery(subjectOfQuery, function(subjectOf) {
						that._rdfStoreExecuteQuery(objectOfQuery, function(objectOf) {

							// console.log(subjectOf);

							// Input for the handlebar
							// template
							var input = {};
							if (subjectOf[0] && subjectOf[0].origin) {
								input.label = subjectOf[0].origin.value;
							} else if (objectOf[0] && objectOf[0].origin) {
								input.label = objectOf[0].origin.value;
							}

							// Add types for filtering
							for ( var i = 0; i < subjectOf.length; i++) {
								subjectOf[i].type = {
									value : "subjectOfItem"
								};
							}
							for ( var i = 0; i < objectOf.length; i++) {
								objectOf[i].type = {
									value : "objectOfItem"
								};
							}

							// write new data
							$overlayContent.append($(templates.overlayCon(input)));

							var resultSet = $.merge($.merge([], subjectOf), objectOf);
							$overlayContent.find('> .innerScroll > div').visaRDF($.extend({}, that.options, {
								dataLoc : null,
								dataFormat : null,
								sparqlData : resultSet,
								generateFilterOptions : true,
								filterBy : [ {
									value : "*",
									label : "showAll"
								}, {
									value : "objectOfItem",
									label : "in"
								}, {
									value : "subjectOfItem",
									label : "out"
								} ],
							}));
						});
					});
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
			if (_isUndefinedOrNull(rdfStore)) {
				new rdfstore.Store(that.options.rdfstoreOptions, that._selfProxy(function(store) {
					rdfStore = store;
					rdfStoreInitDfd.resolve();
				}));
			}
			return rdfStoreInitDfd.promise();
		});

		this._initQueries = this
				._selfProxy(function() {
					var that = this;
					// Generate prefixes for SPARQL queries by using namesspaces
					// given in
					// options
					$.each(this.options.ns, this._selfProxy(function(i, val) {
						that._prefixes += "PREFIX " + i + ": <" + val + "> ";
					}));

					// Generate SPARQL queries
					this._queries = {
						initQuery : that._prefixes
								+ " SELECT ?subject ?label ?description ?type WHERE { ?subject rdfs:label ?label . OPTIONAL { ?subject rdfs:description ?description } . OPTIONAL { ?subject rdfs:comment ?description }. OPTIONAL {?subject rdfs:type ?type}}",
						selectSubjectOf : that._prefixes
								+ " SELECT ?subject ?label ?description ?origin WHERE {<"
								+ REPLACE_ME
								+ "> ?x ?subject. <"
								+ REPLACE_ME
								+ "> rdfs:label ?origin. OPTIONAL { ?subject rdfs:label ?label}. OPTIONAL { ?subject rdfs:description ?description } . OPTIONAL { ?subject rdfs:comment ?description }}",
						selectObjectOf : that._prefixes
								+ " SELECT ?subject ?label ?description ?origin WHERE {?subject ?x <"
								+ REPLACE_ME
								+ ">. <"
								+ REPLACE_ME
								+ "> rdfs:label ?origin. OPTIONAL { ?subject rdfs:label ?label}. OPTIONAL { ?subject rdfs:description ?description } . OPTIONAL { ?subject rdfs:comment ?description }}"
					};
				});

		this._isotopeAddBatches = this._selfProxy(function(items) {
			var length = items.length, that = this, batchSize = ((length < that.options.batchSize) ? length : that.options.batchSize);

			this._$container.find('> .loading').text(parseInt(batchSize / length * 100) + "% -");

			// current batch
			var batch = items.slice(0, batchSize);

			// isoEle / HistoryAwareEach needs plugincontext
			batch.plugin = that;

			$.each(batch, function(i, val) {
				// use literal value as label on literals
				if (val.subject.token === "literal") {
					val.label = val.subject;
				}
			});
			// console.log(batch)

			var $elements = $(templates.isoEle(batch));
			// console.log($elements)
			$.each($elements, function(i, val) {
				$(val).css("background-color", "rgba(125, 125, 125 ,0.2)");
			});

			if (!_isUndefinedOrNull($elements.html())) {

				// Use given width/height
				$elements.css({
					width : this.options.elementStyle.dimension.width,
					height : this.options.elementStyle.dimension.height
				});

				that._$isotopeContainer.isotope('insert', $elements, function() {
					$elements.find('.ellipsis').ellipsis();
					$nodes = $elements.filter('.uri');
					$literals = $elements.filter('.literal');

					// Init overlays on new elements
					that._initOverlays($nodes);
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
				that._$container.find('> .loading').text("");
				$(that._$container).trigger(EVENT_TYPES.loading.loadingDone, that);
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
			if (!_isUndefinedOrNull(that.options.dataFormat)) {
				// console.log(this);
				if (!_isUndefinedOrNull(that.options.dataLoc)) {
					inserted = true;
					that._ajaxLoadData(that.options.dataLoc, that.options.dataFormat, function(rdfData, dataFormat) {
						that._rdfStoreInsertData(rdfData, dataFormat, function() {
							$(that._$container).trigger(EVENT_TYPES.storeModified.insert, that);
						});
					});
				} else if (!_isUndefinedOrNull(that.options.data)) {
					inserted = true;
					that._rdfStoreInsertData(that.options.data, that.options.dataFormat, function() {
						$(that._$container).trigger(EVENT_TYPES.storeModified.insert, that);
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
			that = this;
			if (that.options.generateSortOptions) {
				// Add options
				var $element = that._$element;
				var sortOptions = templates.sortOptions(that.options.isotopeOptions.getSortData);
				var $options = $element.find(".options");
				$options.prepend(sortOptions);
				$sorter = $options.find(' > .sorter');

				// Set selected on view
				$sorter.find('.' + that.options.isotopeOptions.sortBy).addClass("selected");
				$sortLinks = $options.find('a');

				// Add onClick
				$sortLinks.click(function() {
					// get href attribute, minus the '#'
					var sortName = $(this).attr('data-sort-value');
					$element.find('.sorter > > > .selected').removeClass("selected");
					$(this).addClass("selected");
					$($element.find('.container')).isotope({
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
			that = this;
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
						selector = "." + selector;
					}
					// console.log(selector);
					$element.find('.filter > > > .selected').removeClass('selected');
					$(this).addClass('selected');
					$($element.find('.container')).isotope({
						filter : selector
					});
					return false;
				});
			}
		});

		this._rdfStoreExecuteQuery = this._selfProxy(function(query, callback) {
			rdfStore.execute(query, function(success, results) {
				if (success) {
					callback(results);
				} else {
					$(that._$container).trigger(EVENT_TYPES.loading.loadingDone, that);
					// console.log("Error on executing: " + query);
				}
			});
		});

		/*
		 * Inserts given data in store.
		 */
		this._rdfStoreInsertData = this._selfProxy(function(data, dataFormat, callback) {
			$(that._$container).trigger(EVENT_TYPES.loading.loadingStart, that);
			// console.log("_rdfStoreInsertData");
			rdfStore.load(dataFormat, data, function(store) {
				// console.log(data);
				callback();
			});
		});

		/*
		 * Loads file at dataURL and invokes callback with loaded data
		 */
		this._ajaxLoadData = this._selfProxy(function(dataURL, dataFormat, callback) {
			var that = this;
			$(that._$container).trigger(EVENT_TYPES.loading.loadingStart, that);
			// console.log("_ajaxLoadData");
			$.ajax({
				url : dataURL,
				dataType : "text",
				success : function(rdfData) {
					// console.log(dataURL);
					callback(rdfData, dataFormat);
				}
			}).fail(function() {
				$(that._$container).trigger(EVENT_TYPES.loading.loadingDone, that);
				alert(MESSAGES.error.ajax);
			});
		});

		this._updateView = this._selfProxy(function(query) {
			var that = this;
			$(that._$container).trigger(EVENT_TYPES.loading.loadingStart, that);
			// console.log("_updateView");
			that._rdfStoreExecuteQuery(query, function(results) {
				if (results.length !== 0) {
					that._isotopeAddBatches(results);
				} else {
					$(that._$container).trigger(EVENT_TYPES.loading.loadingDone, that);
				}
			});
		});
		// <!--- instance private functions ---->

		this.init();
	}

	Plugin.prototype = {

		init : function() {

			// Init Isotope
			this._$isotopeContainer.isotope(this.options.isotopeOptions);

			// Generate SPARQL Queries
			this._initQueries();

			// <---- loading img ---->
			this._$container.prepend('<div class="' + CSS_CLASSES.loader + '">');
			this._$container.append('<div class="' + CSS_CLASSES.loader + '">');

			// Add loading start listener

			this._addEventHandler(EVENT_TYPES.loading.loadingStart, this._selfProxy(function(ev, $invoker) {
				// console.log(this);
				if ($invoker === this) {
					if (this._$container.css("height") < 120) {
						this._$container.css("height", "20px");
					}
					this._$container.find('> .loading').css("visibility", "visible");
				}
			}));

			// Add loading done listener
			this._addEventHandler(EVENT_TYPES.loading.loadingDone, this._selfProxy(function(ev, $invoker) {
				if ($invoker === this) {
					this._$container.find('> .loading').css("visibility", "hidden");
				}
			}));
			// <!--- loading img ---->

			// Add insertion listener
			this._addEventHandler(EVENT_TYPES.storeModified.insert, this._selfProxy(function(ev, $invoker) {

				// Only update the base plugin //TODO Add update support for
				// higher levels
				if (this._instanceLevel === 0) {
					this._updateView(this._queries.initQuery);
				}
			}));

			// Add a smartresize listener (smartresize to be found in
			// jQuery.isotope)
			this._addEventHandler('smartresize', this._selfProxy(function(ev, $invoker) {
				var winsize = getWindowSize(), $overlays = this._$element.children(".overlay");
				$overlays.css('clip', 'rect(0px ' + winsize.width + 'px ' + winsize.height + 'px 0px)');
				var innerScrolls = $overlays.find('.innerScroll');
				innerScrolls.css("width", ($window.width() - parseInt($overlays.css("padding-left")) - parseInt($overlays.css("padding-right"))) + "px");
				innerScrolls.css("height", $window.height() * 0.95 + "px");
			}), $window);

			// Init templating and RdfStore if needed
			if (globalInitDfd === undefined) {
				globalInitDfd = $.Deferred();
				$.when(this._initRdfStore(), this._initTemplating()).done(function() {
					globalInitDfd.resolve();
				});
			}

			// when done check if sort options have to be initialized and data
			// is to be inserted
			$.when(globalInitDfd.promise()).done(this._selfProxy(function() {
				if (this.options.generateSortOptions || this.options.generateFilterOptions) {
					this._$element.prepend('<section class="' + CSS_CLASSES.options + '" class="' + CSS_CLASSES.clearfix + '"></section>');
					this._checkSortGeneration();
					this._checkFilterGeneration();
				}
				if (!this._checkInsertion()) {
					if (this.options.sparqlData === undefined) {
						this._updateView(this._queries.initQuery);
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
			this._rdfStoreInsertData(data, dataFormat, function() {
				$(that._$container).trigger(EVENT_TYPES.storeModified.insert, that);
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
		insertDataURL : function(dataURL, dataFormat) {
			this._ajaxLoadData(dataURL, dataFormat, this._selfProxy(this.insertData));
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
			that._$element[pluginName] = null
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