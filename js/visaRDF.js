// das Semikolon vor dem Funktions-Aufruf ist ein Sicherheitsnetz für verkettete
// Scripte und/oder andere Plugins die möglicherweise nicht ordnungsgemäß geschlossen wurden.
;
(function($, window, document, undefined) {

	// Erstellt einmalig die Standardeinstellungen
	var pluginName = "visaRDF", rdfStore, defaults = {
		data : undefined,
		dataLoc : undefined,
		dataFormat : undefined,
		templatesPath : "templates/templates.html",
		batchSize : 25,
		colors : [ '#3399CC', '#33CCCC', '#996699', '#C24747', '#e2674a', '#FFCC66', '#99CC99', '#669999', '#CC6699', '#339966', '#666699' ],
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
				columnWidth : 120
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

	//Topics for Pub/Sub system	
	TOPICS = {
		storeModified : {
			insert : "Data inserted!"
		},
		loading : {
			loadingDone : "Loading done!",
			loadingStart : "Start loading!"
		}
	};

	// <---- Observer, Pub/Sub system using only callback lists ---->
	topics = {};

	jQuery.Topic = function(id) {
		var callbacks, topic = id && topics[id];
		if (!topic) {
			callbacks = jQuery.Callbacks();
			topic = {
				publish : callbacks.fire,
				subscribe : callbacks.add,
				unsubscribe : callbacks.remove
			};
			if (id) {
				topics[id] = topic;
			}
		}
		return topic;
	};
	// <!--- Observer, Pub/Sub system using only callback lists ---->

	// <---- utility functions ---->
	_isUndefinedOrNull = function(a) {
		return ((typeof a === "undefined") || (a === null));
	};

	_publishFunction = function(topic) {
		return function() {
			$.Topic(topic).publish();
		};
	};
	// <!--- utility functions ---->

	// Plugin constructor
	function Plugin(element, options) {
		this.element = element;

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

		//Use $.extend to merge the plugin options element with the defaults
		this.options = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;

		//List of added items. Holds only uri and index of an item.
		this._itemHistory = {
			length : 0
		};

		//Generate prefixes for SPARQL queries by using namesspaces given in options
		this._prefixes = "";
		$.each(this.options.ns, this._selfProxy(function(i, val) {
			this._prefixes += "PREFIX " + i + ": <" + val + "> ";
		}));

		//Generate SPARQL queries
		this._queries = {
			initQuery : this._prefixes
					+ " SELECT ?subject ?label ?description WHERE { ?subject rdfs:label ?label . OPTIONAL { ?subject rdfs:description ?description } . OPTIONAL { ?subject rdfs:comment ?description }}",
			selectSubjectOf : this._prefixes + " SELECT ?object WHERE {<#replaceMe#> ?x ?object}",
			selectObjectOf : this._prefixes + " SELECT ?subject WHERE {?subject ?x <#replaceMe#>}"
		};

		// <---- private functions ---->
		this._initTemplating = this._selfProxy(function() {
			var that = this;
			Handlebars.registerHelper('eachHistory', that._selfProxy(function(context, options) {
				var fn = options.fn;
				var i = 0, ret = "", data;

				if (options.data) {
					data = Handlebars.createFrame(options.data);
				}

				if (context && typeof context === 'object') {
					if (context instanceof Array) {
						for ( var j = context.length; i < j; i++) {
							if (!(context[i].subject.value in that._itemHistory)) {
								if (context[i].label) {
									if (context[i].label.lang === undefined || context[i].label.lang === "en") {
										if (data) {
											context[i].index = data.index = that._itemHistory.length++;
										}
										ret = ret + fn(context[i], {
											data : data
										});
										that._itemHistory[context[i].subject.value] = context[i];
										var overlay = that.overlayEleTemplate(context[i]);
										$("BODY").append(overlay);
									}
								}
							} else {
								// TODO update?
							}
						}
					}
				}
				return ret;
			}));

			Handlebars.registerHelper('ifLang', function(context, options) {
				if ((context.lang === undefined || context.lang === "en")) {
					return options.fn(this);
				}
			});

			//Get external template file
			$.get(that.options.templatesPath, function(data) {
				$('HEAD').append(data);

				// <--- extract templates --->
				that.isoEleTemplate = Handlebars.compile($("#iso-element").html());
				that.overlayEleTemplate = Handlebars.compile($("#overlay-element").html());
				that.overlayConTemplate = Handlebars.compile($("#overlay-content").html());
				// <!-- extract templates --->

			}, "html");
		});

		//Modified code from: Mary Lou@Codrops - http://tympanus.net/Tutorials/ExpandingOverlayEffect/
		this._initOverlays = this._selfProxy(function($items) {
			var that = this;
			transEndEventNames = {
				'WebkitTransition' : 'webkitTransitionEnd',
				'MozTransition' : 'transitionend',
				'OTransition' : 'oTransitionEnd',
				'msTransition' : 'MSTransitionEnd',
				'transition' : 'transitionend'
			},
			// transition end event name
			transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
			// window and body elements
			$window = $(window), $body = $('BODY'),
			// transitions support
			supportTransitions = Modernizr.csstransitions,
			// current item's index
			current = -1,
			// window width and height
			winsize = getWindowSize();

			function getWindowSize() {
				$body.css('overflow-y', 'hidden');
				var w = $window.width(), h = $window.height();
				if (current === -1) {
					$body.css('overflow-y', 'auto');
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

			$items.each(function() {
				var $item = $(this), $overlay = $('BODY').find('div#overlay_' + $item.find('.number').html()), $close = $overlay.find('span.close');

				$item.on('click', function() {

					if ($item.data('isExpanded')) {
						return false;
					}
					$item.data('isExpanded', true);
					// save current expanded item's index
					current = $item.find('.number').html();

					var layoutProp = getItemLayoutProp($item), clipPropFirst = 'rect(' + layoutProp.top + 'px ' + (layoutProp.left + layoutProp.width) + 'px '
							+ (layoutProp.top + layoutProp.height) + 'px ' + layoutProp.left + 'px)', clipPropLast = 'rect(0px ' + winsize.width + 'px '
							+ winsize.height + 'px 0px)';

					that._rdfStoreExecuteQuery(that._queries.selectSubjectOf.replace(/#replaceMe#/g, $item.find('.showUri').html()), function(subjectOf) {
						that._rdfStoreExecuteQuery(that._queries.selectObjectOf.replace(/#replaceMe#/g, $item.find('.showUri').html()), function(objectOf) {
							var input = {
								"label" : $item.find('.labelEn').html(),
								"subjectOf" : subjectOf,
								"objectOf" : objectOf
							};
							console.log(input);
							$overlay.find('.overlayContent').children().remove('');
							$overlay.find('.overlayContent').append($(that.overlayConTemplate(input)));
						});
					});

					// Set contet color and width
					var color = new RGBColor($item.css("background-color"));
					var count = 0;
					$overlay.css("background-color", color.toRGB());
					$.each($overlay.find('.overlayContent').children('div'), function(i, val) {
						count++;
						color.r -= 10 * (count);
						color.b -= 10 * (count);
						color.g -= 10 * (count);
						$(val).css("background-color", color.toRGB());
					});

					// Set content width
					$overlay.find('.overlayContent').children('div').css("width", 100 / count + "%");

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
									$body.css('overflow-y', 'hidden');
								});
							}, 25);

						});
					} else {
						$body.css('overflow-y', 'hidden');
					}

				});

				$close.on('click', function() {

					$body.css('overflow-y', 'auto');

					var layoutProp = getItemLayoutProp($item), clipPropFirst = 'rect(' + layoutProp.top + 'px ' + (layoutProp.left + layoutProp.width) + 'px '
							+ (layoutProp.top + layoutProp.height) + 'px ' + layoutProp.left + 'px)', clipPropLast = 'auto';

					// reset current
					current = -1;

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
						$item.data('isExpanded', false);
					}

					return false;

				});
			});

			$(window).on('debouncedresize', function() {
				winsize = getWindowSize();
				// todo : cache the current item
				if (current !== -1) {
					$items.eq(current).children('div.rb-overlay').css('clip', 'rect(0px ' + winsize.width + 'px ' + winsize.height + 'px 0px)');
				}
			});

		});

		this._initRdfStore = this._selfProxy(function() {
			var that = this, dfd = $.Deferred();
			// console.log("Init RDFSTORE");
			if (_isUndefinedOrNull(that.rdfStore)) {
				new rdfstore.Store(that.options.rdfstoreOptions, that._selfProxy(function(store) {
					rdfStore = store;
					dfd.resolve();
				}));
			} else {
				dfd.resolve();
			}
			return dfd.promise();
		});

		this._isotopeAddBatches = this._selfProxy(function(items) {
			var length = items.length, that = this, batchSize = length < batchSize ? length : that.options.batchSize;

			// current batch
			var batch = items.slice(0, batchSize);
			var elements = $(that.isoEleTemplate(batch));
			$.each(elements, function(i, val) {
				$(val).css("background", that.options.colors[i % that.options.colors.length]);
			});

			if (!_isUndefinedOrNull(elements.html())) {
				$(element).isotope('insert', elements, function() {
					that._isotopeAddBatchesHelp(items, batchSize);
				});
			} else {
				that._isotopeAddBatchesHelp(items, batchSize);
			}
		});

		this._isotopeAddBatchesHelp = this._selfProxy(function(items, batchSize) {
			var rest = items.slice(batchSize);
			if (rest.length > 0) {
				this._isotopeAddBatches(rest);
			} else {
				$('.ellipsis').ellipsis();

				this._initOverlays($('.element'));
				$.Topic(TOPICS.loading.loadingDone).publish();
			}
		});

		/*
		 * Check whether the plugin is initialized with insertion options and
		 * call insertion methods if needed.
		 */
		this._checkInsertion = this._selfProxy(function() {
			var that = this;
			if (!_isUndefinedOrNull(that.options.dataFormat)) {
				if (!_isUndefinedOrNull(that.options.dataLoc)) {
					that._ajaxLoadData(that.options.dataLoc, that.options.dataFormat, function(rdfData, dataFormat) {
						that._rdfStoreInsertData(rdfData, dataFormat, _publishFunction(TOPICS.storeModified.insert));
					});
				} else if (!_isUndefinedOrNull(that.options.data)) {
					that._rdfStoreInsertData(that.options.data, that.options.dataFormat, _publishFunction(TOPICS.storeModified.insert));
				}
			}
		});

		this._rdfStoreExecuteQuery = function(query, callback) {
			rdfStore.execute(query, function(success, results) {
				if (success) {
					callback(results);
				} else {
					console.log("Error on executing: " + query);
				}
			});
		};

		/*
		 * Inserts given data in store.
		 */
		this._rdfStoreInsertData = function(data, dataFormat, callback) {
			$.Topic(TOPICS.loading.loadingStart).publish();
			rdfStore.load(dataFormat, data, function(store) {
				// console.log(data);
				callback();
			});
		};

		/*
		 * Loads file at dataURL and invokes callback with loaded data
		 */
		this._ajaxLoadData = function(dataURL, dataFormat, callback) {
			$.Topic(TOPICS.loading.loadingStart).publish();
			$.ajax({
				url : dataURL,
				dataType : "text",
				success : function(rdfData) {
					// console.log(dataURL);
					callback(rdfData, dataFormat);
				}
			});
		};

		this._updateView = this._selfProxy(function(query) {
			var that = this;
			$.Topic(TOPICS.loading.loadingStart).publish();
			that._rdfStoreExecuteQuery(query, function(results) {
				that._isotopeAddBatches(results);
			});
		});
		// <!--- private functions ---->

		this.init();
	}

	Plugin.prototype = {

		init : function() {

			// Init templating
			this._initTemplating();

			// Init Isotope
			$(this.element).isotope(this.options.isotopeOptions);

			//<---- loader img ---->
			$(this.element).append('<div class="loading"></div>');

			// Add loading start observer
			$.Topic(TOPICS.loading.loadingStart).subscribe(this._selfProxy(function(message) {
				if ($(this.element).css("height") < 120) {
					$(this.element).css("height", "120px");
				}
				$('div.loading').css("display", "block");
			}));

			// Add loading done observer
			$.Topic(TOPICS.loading.loadingDone).subscribe(function(message) {
				$('div.loading').css("display", "none");
			});
			//<!--- loader img ---->

			// Add insertion observer
			$.Topic(TOPICS.storeModified.insert).subscribe(this._selfProxy(function(message) {
				this._updateView(this._queries.initQuery);
			}));

			// Init RdfStore, when done check if data is to be inserted
			$.when(this._initRdfStore()).then(this._checkInsertion());
		},

		/**
		 * Insert given rdf-data in the store.
		 * 
		 * @arguments
		 * @param data 			Rdf-data to be inserted
		 * @param dataFormat 	Format of the data
		 */
		insertData : function(data, dataFormat) {
			this._rdfStoreInsertData(data, dataFormat, _publishFunction(TOPICS.storeModified.insert));
		},

		/**
		 * Insert rdf-data of given location in the store.
		 * 
		 * @arguments
		 * @param data			URL of the data
		 * @param dataFormat	Format of the data
		 */
		insertDataURL : function(dataURL, dataFormat) {
			this._ajaxLoadData(dataURL, dataFormat, this._selfProxy(this.insertData));
		},

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