/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const {Class} = require("sdk/core/heritage");
const {Request} = require("sdk/request");
const {data} = require("self");
const {Factory, Unknown} = require("api-utils/xpcom");
const {PageMod} = require("page-mod");
const tabs = require("tabs");
const Promise = require('sdk/core/promise');
const gatherPromises = Promise.promised(Array);
const {setTimeout} = require('timers');

const {Cc, Ci,Cu, ChromeWorker} = require("chrome");
Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource://gre/modules/PlacesInterestsStorage.jsm");
Cu.import("resource://gre/modules/NetUtil.jsm");

const INTEREST_ENABLED_PREF = "interests.enabled";
const scriptLoader = Cc["@mozilla.org/moz/jssubscript-loader;1"].
        getService(Ci.mozIJSSubScriptLoader);

let clientIP = "";
let workerRef = null;

Request({
  url: "https://json-ip.paas.allizom.org/",
  onComplete: function (response) {
    clientIP = response.json.ip;
    workerRef.port.emit("ipaddress", clientIP);
  }
}).get();

exports.main = function(options, callbacks) {
  let iService;
  try {
    iService = Cc["@mozilla.org/interests;1"].
      getService(Ci.nsISupports).wrappedJSObject;
  }
  catch (e) {
    iService = Cc["@mozilla.org/places/interests;1"].
      getService(Ci.nsISupports).wrappedJSObject;
  }

  let workerDeferred;
  let currentTopic;
  let interestsClassifier = {
    handleEvent: function(aEvent) {
      if (aEvent.type == "message") {
        let msgData = aEvent.data;
        if (msgData.message == "InterestsForDocumentText") {
          let host = msgData.host;
          let interests = msgData.interests;
          workerDeferred.resolve(interests);
        }
      }
    },

    classifyText: function(url, text, topic) {

      function blockOnDeferred() {
        // function to block until the previous classification is done
        done = Promise.defer();
        function isWorkerCleared() {
          if (workerDeferred == null) {
            this.promise.resolve(this.topic)
          }
          else {
            setTimeout(isWorkerCleared.bind({topic: this.topic, promise:this.promise}), 10);
          }
        }
        setTimeout(isWorkerCleared.bind({topic: topic, promise:done}), 10);
        return done.promise;
      }

      let promise = blockOnDeferred().then(x => {
        workerDeferred = Promise.defer();
        let uri = NetUtil.newURI(url);
        let host = uri.host;
        let path = uri.path;
        let tld = Services.eTLD.getBaseDomainFromHost(host);
        interestWorker.postMessage({
          message: "getInterestsForDocumentText",
          host: host,
          path: path,
          title: text,
          url: url,
          tld: tld
        });
        return workerDeferred.promise;
      });

      return promise;
    }
  }
  let interestWorker = new ChromeWorker("chrome://global/content/interestsWorker.js");
  interestWorker.addEventListener("message", interestsClassifier, false);

  let model = scriptLoader.loadSubScript("chrome://global/content/interestsClassifierModel.js");
  let stopwords = scriptLoader.loadSubScript("chrome://global/content/interestsUrlStopwords.js");
  interestWorker.postMessage({
    message: "bootstrap",
    interestsDataType: "dfr",
    interestsData: {},
    interestsClassifierModel: interestsClassifierModel,
    interestsUrlStopwords: interestsUrlStopwords
  });

  // Handle about:profile-demo requests
  Factory({
    contract: "@mozilla.org/network/protocol/about;1?what=profile-demo",

    Component: Class({
      extends: Unknown,
      interfaces: ["nsIAboutModule"],

      newChannel: function(uri) {
        let chan = Services.io.newChannel(data.url("index.html"), null, null);
        chan.originalURI = uri;
        return chan;
      },

      getURIFlags: function(uri) {
        return Ci.nsIAboutModule.URI_SAFE_FOR_UNTRUSTED_CONTENT;
      }
    })
  });

  // Add functionality into about:profile-demo page loads
  PageMod({
    contentScriptFile: [
      data.url("js/vendor/jquery-2.0.3.min.js"),
      data.url("js/vendor/angular.min.js"),
      data.url("js/vendor/angular-sanitize.min.js"),
      data.url("js/vendor/moment.min.js"),
      data.url("js/vendor/d3.v3.min.js"),
      //data.url("js/vendor/nv.d3.min.js"),
      data.url("js/vendor/nv.d3.min.js"),
      data.url("js/app.js"),
    ],

    contentScript:  "let assets = {" +
                    " footerUrl: '" + data.url("img/mozilla-logo.png") + "',"+
                    " loadingUrl: '" + data.url("img/loading.gif") + "',"+
                    "}",

    include: ["about:profile-demo"],

    onAttach: function(worker) {
      workerRef = worker;
      worker.port.emit("style", data.url("css/bootstrap.min.css"));
      worker.port.emit("style", data.url("css/bootstrap-responsive.min.css"));
      worker.port.emit("style", data.url("css/nv.d3.css"));
      worker.port.emit("style", data.url("css/main.css"));

      // Bridge to the interest service and PlacesInterestStorage component
      worker.port.on("message", details => {
        if (details.command == "service") {
          iService[details.data.method].apply(iService, details.data.args).then(result => {
            let message = {
              type: "service",
              content: {
                topic: details.data.topic,
                data: result,
              }
            }
            worker.port.emit("message", message);
          });
        }
        else if (details.command == "storage") {
          PlacesInterestsStorage[details.data.method].apply(PlacesInterestsStorage, details.data.args).then(result => {
            let message = {
              type: "storage",
              content: {
                topic: details.data.topic,
                data: result,
              }
            }
            worker.port.emit("message", message);
          });
        }
        else if (details.command == "visits") {
          let promises = [];
          details.data.args.forEach(args => {
            promises.push(PlacesInterestsStorage[details.data.method].apply(PlacesInterestsStorage, args));
          });
          gatherPromises(promises).then(_ => {
            let message = {
              type: "visits",
              content: {
                topic: details.data.topic,
                data: [],
              }
            }
            worker.port.emit("message", message);
          });
        }
        else if (details.command == "feed") {
          let url = "https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num="+ details.data.num +"&q=" + details.data.url + "&userip=" + clientIP;
          let feedData = Request({
            url: url,
            headers: {"Referer": "https://mozilla.org"},
            onComplete: function (response) {
              let message = {
                type: "feed",
                content: {
                  topic: details.data.topic,
                  data: response.json,
                }
              }
              worker.port.emit("message", message);
            }
          }).get();
        }
        else if (details.command == "classify") {
          let url = details.data.url;
          let text = details.data.text;
          interestsClassifier.classifyText(url, text, details.data.topic).then(interests => {
            workerDeferred = null;
            let message = {
              type: "classify",
              content: {
                topic: details.data.topic,
                data: interests,
              }
            }
            worker.port.emit("message", message);
          });
        }
      });
    }
  });

  // Automatically open a tab unless it's a regular firefox restart
  if (options.loadReason != "startup") {
    tabs.open("about:profile-demo");
  }

  // Turn on the interest service when activating the add-on
  Services.prefs.getDefaultBranch("").setBoolPref(INTEREST_ENABLED_PREF, true);
};

exports.onUnload = function(reason) {
  // Turn off the interest service when deactivating the add-on
  Services.prefs.getDefaultBranch("").setBoolPref(INTEREST_ENABLED_PREF, false);
};
