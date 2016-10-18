/**
 * Singleton store local
 **/

var rdfstore = require("rdfstore"), $ = require("jquery"), log = require("./../logger.js")("Remote");

/**
 * Remote loading for rdf data via describe queries.
 *
 * @param url Triple of parts of the service url. The join of the complete array should map to a query execution on the service. Consists of a tupel of strings where the query is to be inserted in between. Used for CORS.
 * @constructor
 * @param url
 */
var Remote = function (url) {
    if (url.length != 3) {
        throw Error("Url must be split in 3 parts. I) The service url ex: 'http://dbpedia.org/sparql' II) + III) The rest of the url where the query can be placed in between.");
    }
    this._service = url[0];
    this._exec_url = [url[1], url[2]];
};

/**
 * Creates the cors request object
 *
 * @param method
 * @param url
 * @returns {XMLHttpRequest}
 * @private
 */
Remote.prototype._createCORSRequest = function (method, url) {
    var xhr = new XMLHttpRequest();
    if (typeof xhr.withCredentials !== "undefined") {

        // XMLHTTPRequest2 objects
        xhr.open(method, url, true);

    } else if (typeof XDomainRequest !== 'undefined') {

        // IE workaround
        xhr = new XDomainRequest();
        xhr.open(method, url);

    } else {
        xhr = null;
    }
    return xhr;
};

Remote.prototype.get_service_name = function () {
    return this._service;
};

/**
 * Execute given query on sparql service via cors.
 *
 * @param query
 * @param cb
 * @param fail
 * @param flag
 */
Remote.prototype.execute = function (query, cb, fail, flag) {
    var xhr = this._createCORSRequest('GET', this._service + this._exec_url[0] + encodeURIComponent(query) + this._exec_url[1]), that = this;
    xhr.setRequestHeader("accept", "application/json");
    if (flag) {
        flag.on("interrupt", function() {
            log("Aborted remote query.");
            xhr.abort();
            flag.off("interrupt", this);
        });
    }
    xhr.onload = function () {
        if (this.status == 200 && this.readyState == 4 && this.responseText != "") {
            cb(JSON.parse(xhr.responseText));
        } else {
            log("There was an service error for query: " + query + " on backend: " + that._service, xhr);
            fail();
        }
    };
    xhr.onerror = function () {
        log("There was an transport error for query: " + query + " on backend: " + that._service, xhr);
        fail();
    };
    xhr.send();
};

var counter = 0;


/**
 * Execute given query on sparql service via yql. Fix YQL.
 * @param query
 * @param cb
 * @param fail
 */
//Remote.prototype.execute_yql = function (query, cb, fail) {
//    var success = false, cnt = counter++;
//    // Use cnt to stop callbackoverwriting on simultan calls
//    window["cbFunc" + cnt] = function (data, textStatus, jqXHR) {
//        // If we have something to work with...
//        if (data && data.query && data.query.results) {
//            success = true;
//            cb(data.query.results);
//        }
//
//        // Else, Maybe we requested a site that doesn't exist, and
//        // nothing returned.
//        else {
//            log('Nothing returned from getJSON.');
//            fail();
//
//            // Delete old callbackfunction
//            window["cbFunc" + cnt] = undefined;
//        }
//    };
//
//    // If no query was passed, exit.
//    if (!query) {
//        alert('No query was passed.');
//    }
//
//    // Take the provided url, and add it to a YQL query. Make sure you
//    // encode it!
//    var yql = 'http://query.yahooapis.com/v1/public/yql?q='
//        + encodeURIComponent('use "http://triplr.org/sparyql/sparql.xml" as sparql; select * from sparql where query="'
//        + query + '" and service="' + this._service) + '"&format=json';
//
//    // Request that YSQL string, and run a callback function.
//    // Pass a defined function to prevent cache-busting.
//    $.ajax({
//        type: 'post',
//        dataType: 'json',
//        url: yql,
//        success: window["cbFunc" + cnt],
//        error: function (jqXHR, textStatus, errorThrown) {
//            fail();
//        }
//    });
//};

module.exports = Remote;