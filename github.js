var _ = require('underscore');
var https = require('https');

/*************************************************************
Underscore Mixin
**************************************************************/

_.mixin({
    'sortKeysBy': function (obj, comparator) {
        var keys = _.sortBy(_.keys(obj), function (key) {
            return comparator ? comparator(obj[key], key) : key;
        });
    
        return _.object(keys, _.map(keys, function (key) {
            return obj[key];
        }));
    }
});

var getLanguageRank = function(arr) {

  var languages = {};

  _.each(arr, function(item) {
    if (item.language === null) {
      if (languages["No Language"]) {
        //++languages["No Language"];
      } else {
        // languages["No Language"] = 1;
      }
    } else if (languages[item.language]) {
      ++languages[item.language];
    } else {
      languages[item.language] = 1;
    }
  });

 return _.sortKeysBy(languages, function (value, key) {
  //changes from ascending to descending sort
    return -(value);
  });
}

/*************************************************************
Github Repo Data
**************************************************************/

exports.getRepoData = function(username, callback) {

  var options = {
    "method": "GET",
    "hostname": "api.github.com",
    "path": "/users/"+username+"/repos?per_page=100",
    "headers": {
      "User-Agent": "polinadotio"
    }
  };

  var repo_data;

  var req = https.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function () {
      var body = Buffer.concat(chunks);
      repo_data = JSON.parse(body.toString());
      // console.log("languages\n", languageRank(repo_data));
      var result = getLanguageRank(repo_data);
      callback(result);
    });
  });

  req.end();
}



// getRepoData(function(result) {
//   console.log("languages\n", result);
// });





