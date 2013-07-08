"use strict";

const NUM_ARTICLES = 20;
const NOW = Date.now();
const MS_PER_DAY = 86400000;
const FEEDS = [
    "http://rss.cnn.com/rss/cnn_topstories.rss",
    "http://feeds.bbci.co.uk/news/rss.xml",
    "http://feeds.feedburner.com/caranddriver/blog",
    "http://www.topspeed.com/rss.xml",
    "http://blog.caranddriver.com/feed/",
    "http://feeds.feedburner.com/TheCarConnection",
    "http://www.economist.com/rss/united_states_rss.xml",
    "http://www.economist.com/feeds/print-sections/80/science-and-technology.xml",
    "http://www.economist.com/feeds/print-sections/79/finance-and-economics.xml",
    "http://www.techmeme.com/feed.xml",
    "http://feeds.feedburner.com/TechCrunch/",
    "http://sports-ak.espn.go.com/espn/rss/news",
    "http://rssfeeds.webmd.com/rss/rss.aspx?RSSSource=RSS_PUBLIC",
    "http://www.polygon.com/rss/index.xml",
    "http://www.joystiq.com//rss.xml",
    "http://feeds.gawker.com/kotaku/full",
    "http://modernistcuisine.com/feed/",
    "http://feeds.feedburner.com/ThePickyEaterBlog",
];
const PROFILES = {
  finance : {
    title : "Business Mogul",
    visits : [
      ["finance", {visitTime: (NOW - MS_PER_DAY*0), visitCount: 2}],
      ["finance", {visitTime: (NOW - MS_PER_DAY*8), visitCount: 8}],
      ["finance", {visitTime: (NOW - MS_PER_DAY*16), visitCount: 24}],
      ["politics", {visitTime: (NOW - MS_PER_DAY*0), visitCount: 1}],
      ["politics", {visitTime: (NOW - MS_PER_DAY*8), visitCount: 5}],
      ["politics", {visitTime: (NOW - MS_PER_DAY*16), visitCount: 16}],
      ["health", {visitTime: (NOW - MS_PER_DAY*8), visitCount: 5}],
      ["health", {visitTime: (NOW - MS_PER_DAY*16), visitCount: 6}],
      ["cars", {visitTime: (NOW - MS_PER_DAY*8), visitCount: 3}],
      ["cars", {visitTime: (NOW - MS_PER_DAY*16), visitCount: 13}],
      ["sports", {visitTime: (NOW - MS_PER_DAY*8), visitCount: 1}],
      ["sports", {visitTime: (NOW - MS_PER_DAY*16), visitCount: 2}],
    ],
  },

  technology : {
    title : "Tech Guru",
    visits : [
      ["technology", {visitTime: (NOW - MS_PER_DAY*0), visitCount: 4}],
      ["technology", {visitTime: (NOW - MS_PER_DAY*8), visitCount: 13}],
      ["technology", {visitTime: (NOW - MS_PER_DAY*16), visitCount: 34}],
      ["video-games", {visitTime: (NOW - MS_PER_DAY*0), visitCount: 2}],
      ["video-games", {visitTime: (NOW - MS_PER_DAY*8), visitCount: 8}],
      ["video-games", {visitTime: (NOW - MS_PER_DAY*16), visitCount: 16}],
      ["consumer-electronics", {visitTime: (NOW - MS_PER_DAY*8), visitCount: 5}],
      ["consumer-electronics", {visitTime: (NOW - MS_PER_DAY*16), visitCount: 17}],
      ["science", {visitTime: (NOW - MS_PER_DAY*8), visitCount: 6}],
      ["science", {visitTime: (NOW - MS_PER_DAY*16), visitCount: 13}],
      ["society", {visitTime: (NOW - MS_PER_DAY*8), visitCount: 4}],
      ["society", {visitTime: (NOW - MS_PER_DAY*16), visitCount: 5}],
    ],
  },

  cars : {
    title : "Car Lover",
    visits : [
      ["cars", {visitTime: (NOW - MS_PER_DAY*0), visitCount: 1}],
      ["cars", {visitTime: (NOW - MS_PER_DAY*8), visitCount: 10}],
      ["cars", {visitTime: (NOW - MS_PER_DAY*16), visitCount: 25}],
      ["society", {visitTime: (NOW - MS_PER_DAY*0), visitCount: 2}],
      ["society", {visitTime: (NOW - MS_PER_DAY*8), visitCount: 4}],
      ["society", {visitTime: (NOW - MS_PER_DAY*16), visitCount: 12}],
      ["consumer-electronics", {visitTime: (NOW - MS_PER_DAY*8), visitCount: 3}],
      ["consumer-electronics", {visitTime: (NOW - MS_PER_DAY*16), visitCount: 5}],
      ["politics", {visitTime: (NOW - MS_PER_DAY*8), visitCount: 4}],
      ["politics", {visitTime: (NOW - MS_PER_DAY*16), visitCount: 2}],
      ["sports", {visitTime: (NOW - MS_PER_DAY*8), visitCount: 2}],
      ["sports", {visitTime: (NOW - MS_PER_DAY*16), visitCount: 1}],
    ],
  },

  sports : {
    title : "Sports Addict",
    visits : [
      ["sports", {visitTime: (NOW - MS_PER_DAY*0), visitCount: 5}],
      ["sports", {visitTime: (NOW - MS_PER_DAY*8), visitCount: 13}],
      ["sports", {visitTime: (NOW - MS_PER_DAY*16), visitCount: 40}],
      ["video-games", {visitTime: (NOW - MS_PER_DAY*0), visitCount: 1}],
      ["video-games", {visitTime: (NOW - MS_PER_DAY*8), visitCount: 4}],
      ["video-games", {visitTime: (NOW - MS_PER_DAY*16), visitCount: 10}],
      ["games", {visitTime: (NOW - MS_PER_DAY*8), visitCount: 2}],
      ["games", {visitTime: (NOW - MS_PER_DAY*16), visitCount: 5}],
      ["society", {visitTime: (NOW - MS_PER_DAY*8), visitCount: 6}],
      ["society", {visitTime: (NOW - MS_PER_DAY*16), visitCount: 4}],
      ["tv", {visitTime: (NOW - MS_PER_DAY*8), visitCount: 5}],
      ["tv", {visitTime: (NOW - MS_PER_DAY*16), visitCount: 7}],
    ],
  },

  health : {
    title : "Health Nut",
    visits : [
      ["health", {visitTime: (NOW - MS_PER_DAY*0), visitCount: 3}],
      ["health", {visitTime: (NOW - MS_PER_DAY*8), visitCount: 7}],
      ["health", {visitTime: (NOW - MS_PER_DAY*16), visitCount: 15}],
      ["food", {visitTime: (NOW - MS_PER_DAY*0), visitCount: 2}],
      ["food", {visitTime: (NOW - MS_PER_DAY*8), visitCount: 5}],
      ["food", {visitTime: (NOW - MS_PER_DAY*16), visitCount: 3}],
      ["cuisine", {visitTime: (NOW - MS_PER_DAY*8), visitCount: 5}],
      ["cuisine", {visitTime: (NOW - MS_PER_DAY*16), visitCount: 2}],
      ["news", {visitTime: (NOW - MS_PER_DAY*8), visitCount: 5}],
      ["news", {visitTime: (NOW - MS_PER_DAY*16), visitCount: 8}],
      ["shopping", {visitTime: (NOW - MS_PER_DAY*8), visitCount: 2}],
      ["shopping", {visitTime: (NOW - MS_PER_DAY*16), visitCount: 1}],
    ],
  },
};

/////     Chart initialization     /////

nv.dev = false;

let interestsChart = nv.models.discreteBarChart()
  .x(function(d) { return d.label })
  .y(function(d) { return d.value })
  .tooltips(false)
  .showValues(true);


nv.addGraph(function() {
  d3.select('#interestsChart svg')
    .transition().duration(500)
    .call(interestsChart);
  nv.utils.windowResize(interestsChart.update);
  return interestsChart;
});

/////     Application code     /////

function compareArticle(a,b){b.publishedDate-a.publishedDate};

let categorizedArticles = {};
let numEntries = 0;
let numArticles = 0;
let numFeeds = 0;

let DataService = function($window, $rootScope, $http) {

  this.window = $window;
  this.rootScope = $rootScope;
  this.http = $http;

  // relay messages from the addon to the page
  self.port.on("message", message => {
    this.rootScope.$apply(_ => {
      this.rootScope.$broadcast(message.content.topic, message.content.data);
    });
  });
}

DataService.prototype = {

  getTopInterests: function getTopInterests(topic, aNumber) {
    this.callService(topic, "getInterestsByNamespace", ["", {
      checkSharable: true,
      excludeMeta: true,
      interestLimit: aNumber,
      roundDiversity: true,
      roundRecency: true,
      roundScore: true,
    }]);
  },

  storeVisits: function storeVisits(topic, args) {
    this._callFunction("visits", topic, "addInterestVisit", args)
  },

  clearVisits: function clearVisits(topic) {
    this._callFunction("storage", topic, "_execute", ["DELETE FROM moz_interests_visits"]);
  },

  callService: function callService(topic, method, args) {
    this._callFunction("service", topic, method, args)
  },

  callStorage: function callStorage(topic, method, args) {
    this._callFunction("storage", topic, method, args)
  },

  _callFunction: function callFunction(type, topic, method, args) {
    let details = {
      command: type,
      data: {
        topic: topic,
        method: method,
        args: args,
      },
    }
    self.port.emit("message", details);
  },

  getFeed: function getFeed(topic, url, num) {
    num = num || 100;
    let details = {
      command: "feed",
      data: {
        topic: topic,
        url: url,
        num: num,
      },
    }
    self.port.emit("message", details);
  },

  classify: function classify(topic, url, text) {
    let details = {
      command: "classify",
      data: {
        topic: topic,
        url: url,
        text: text,
      },
    }
    self.port.emit("message", details);
  },
}

let demo = angular.module("profileDemo", ["ngSanitize"]);
demo.filter('fromNow', function() {
  return function(dateObj) {
    return moment(new Date(dateObj)).fromNow()
  }
});
demo.filter('truncate', function() {
  return function (text, length, end) {
    if (isNaN(length))
      length = 10;
 
    if (end === undefined)
      end = "...";
 
    if (text.length <= length || text.length - end.length <= length) {
      return text;
    }
    else {
      return String(text).substring(0, length-end.length) + end;
    }
  };
});
demo.service("dataService", DataService);
demo.config(['$httpProvider', $httpProvider => {
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common["X-Requested-With"];
}]);
demo.run(function(dataService) {
  for (let i=0; i < FEEDS.length; i++) {
    dataService.getFeed("collectFeed", FEEDS[i], 50);
  }
});

demo.controller("profileCtrl", function($scope, dataService) {
  $scope.profiles = PROFILES;
  $scope.chronological = [];
  $scope.personalized = [];
  $scope.articles = [];
  $scope.articleCategories = {};
  $scope.loadingUrl = assets.loadingUrl;
  $scope.chartStatus = {
    "#personalizedChart svg": false,
    "#chronologicalChart svg": false,
  };

  $scope.currentProfile = {
    type: "finance",
    title: PROFILES["finance"].title,
    interests: null,
  }

  /** Graph redraw **/

  $scope.redrawChart = function(elementSelector, chart, data) {
    let dataPoints = [];
    for (let i=0; i <  data.length; i++) {
      dataPoints.push({
        label: data[i].name,
        value: data[i].score,
      });
    }
    let chartData = {
      key: "interests",
      values: dataPoints,
    }

    d3.select(elementSelector)
      .datum([chartData]);
    chart.update();
  }

  $scope.updateArticleChart = function(elementSelector, data) {
    let interestCounts = {};
    let dataPoints = [];
    data.forEach(article => {
      $scope.articleCategories[article.link].forEach(interestName => {
        if(interestCounts.hasOwnProperty(interestName)) {
          interestCounts[interestName] += 1;
        }
        else {
          interestCounts[interestName] = 1;
        }
      });
    });
    Object.keys(interestCounts).forEach(interestName => {
      dataPoints.push({label: interestName, value: interestCounts[interestName]});
    });

    let chartData = {
      key: "interests",
      values: dataPoints,
    }

    if ($scope.chartStatus[elementSelector]) {
      d3.select(elementSelector).datum([chartData]);
      $scope.chartStatus[elementSelector].update();
    }
    else {
      let pieChart = nv.models.pieChart()
        .x(function(d) { return d.label })
        .y(function(d) { return d.value })
        .showLabels(true);

      nv.addGraph(function() {
        d3.select(elementSelector)
          .transition().duration(500)
          .call(pieChart);
        nv.utils.windowResize(pieChart.update);
        return pieChart;
      });
      d3.select(elementSelector).datum([chartData]);
      $scope.chartStatus[elementSelector] = pieChart;
    }
  }

  /** data update **/

  $scope.switchProfile = function(type) {
    let oldType = $scope.currentProfile.type;
    $scope.currentProfile = {
      type: type,
      title: PROFILES[type].title,
    };
    dataService.clearVisits(oldType+"clearFor"+type);
    let deRegisterClear = $scope.$on(oldType+"clearFor"+type, function() {
      dataService.storeVisits("visitsFor"+type, PROFILES[type].visits);
      let deRegisterUpdate = $scope.$on("visitsFor"+type, function() {
        $scope.updateInterests();
        deRegisterUpdate();
      });
      deRegisterClear();
    });
  }

  $scope.updateInterests = function() {
    dataService.getTopInterests("updateInterests", 5);
  }
  $scope.$on("updateInterests", function(event, data){
      $scope.currentProfile.interests = data;
      $scope.redrawChart("#interestsChart svg", interestsChart, $scope.currentProfile.interests);
      $scope.personalize();
  });

  $scope.personalize = function() {
    let categoryNumbers = {};
    let total = 0;
    $scope.currentProfile.interests.forEach(interest => {
      total += interest.score;
    });

    let personalized = [];
    $scope.currentProfile.interests.forEach(interest => {
      let number = Math.round(interest.score/total*NUM_ARTICLES);
      if (categorizedArticles.hasOwnProperty(interest.name)) {
        personalized = personalized.concat(categorizedArticles[interest.name].slice(0, number));
      }
    });
    personalized.sort(compareArticle);
    $scope.personalized = personalized.slice(0, NUM_ARTICLES);
    $scope.updateArticleChart("#personalizedChart svg", $scope.personalized);
    $scope.updateArticleChart("#chronologicalChart svg", $scope.chronological);
  }

  $scope.$on("collectFeed", function(event, data) {
    numFeeds += 1
    let entries = data.responseData.feed.entries;
    for (let i=0; i < entries.length; i++) {
      let article = entries[i];
      let index = i;

      if (!$scope.articleCategories.hasOwnProperty(article.link)) {
        article.publishedDate = Date(article.publishedDate);
        $scope.articleCategories[article.link] = true;
        numEntries += 1;

        dataService.classify(article.link+i, article.link, article.title + " " + article.contentSnippet);
        let deRegisterClassify = $scope.$on(article.link+i, function(event, interests) {
          $scope.articleCategories[article.link] = interests;
          numArticles += 1;
          interests.forEach(interest => {
            if (!categorizedArticles.hasOwnProperty(interest)) {
              categorizedArticles[interest] = [article];
            } else {
              categorizedArticles[interest].push(article);
            }
          });
          $scope.articles.push(article);

          // we're done loading all articles
          if(numFeeds == FEEDS.length && numEntries == numArticles) {
            $scope.$broadcast("doneFeeds");
          }
          deRegisterClassify();
        });
      }
    }
  });

  $scope.$on("doneFeeds", function() {
    numFeeds = 0;
    numArticles = 0;
    numEntries = 0;
    $scope.articles.sort(compareArticle);
    $scope.chronological = $scope.articles.slice(0,NUM_ARTICLES);

    for (let interest in categorizedArticles) {
      categorizedArticles[interest].sort(compareArticle);
    }
    $scope.switchProfile($scope.currentProfile.type);
  });
});

demo.controller("footerCtrl", function($scope, dataService) {
  $scope.footerUrl = assets.footerUrl;
});

/////     Low-level data injection     /////

self.port.on("style", function(file) {
  let link = document.createElement("link");
  link.setAttribute("href", file);
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("type", "text/css");
  document.head.appendChild(link);
});
self.port.on("ipaddress", function(data) {
  assets.ip = data;
});
