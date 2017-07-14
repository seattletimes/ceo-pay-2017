//Use CommonJS style via browserify to load other modules
// require("./lib/social");
// require("./lib/ads");
require("angular/angular.min");
require("component-responsive-frame/child");

var app = angular.module("ceos", []);

// ceoData.forEach(function(row) {
//   // var percentCash = Math.round(row.cash/row.total*100);
//   // var percentEquity = Math.round(row.equity/row.total*100);
//   // var percentOther = Math.round(row.other/row.total*100);
//   var percentBonus = Math.floor(row.bonus/row.total*10000)/100;
//   var percentSalary = Math.floor(row.salary/row.total*10000)/100;
//   var percentNEIP = Math.floor(row.neip/row.total*10000)/100;
//   var percentCash = Math.floor(row.cash/row.total*10000)/100;
//   var percentEquity = Math.floor(row.equity/row.total*10000)/100;
//   var percentOther = Math.floor(row.other/row.total*10000)/100;
//   row.percentBonus = percentBonus;
//   row.percentSalary = percentSalary;
//   row.percentNEIP = percentNEIP;
//   row.percentCash = percentCash;
//   row.percentEquity = percentEquity;
//   row.percentOther = percentOther;
// });

ceoData.forEach(function(row) {
  var lastname = row.name.replace(/,.*$/, "").split(' ').slice(-1).join(' ');
  var firstname = row.name.split(' ').slice(0,-1).join(' ');
  row.lastname = lastname;
  row.firstname = firstname;
});

app.controller("CEOPayController", ["$scope", "$filter", function($scope, $filter) {
  var ceoDataShort = $scope.ceoDataShort = ceoData.slice(0,10);
  var ceoDataLong = $scope.ceoDataLong = ceoData;
  $scope.ceoData = ceoDataShort;
  $scope.filterBy = "short";

  var ceoFilter = $filter("ceoFilter");
  var count = by => ceoFilter(ceoData, by).length;

  $scope.counts = {
    all: ceoData.length,
    under40: count("under40"),
    over40: count("over40"),
    men: count("men"),
    women: count("women")
  }

  $scope.headers = [
    { title: "Name", short: "lastname", className: "name" },
    { title: "Age", short: "age", className: "age" },
    { title: "Company", short: "company", className: "company" },
    { title: "Cash*", short: "cash", className: "cash"},
    { title: "Equity**", short: "equity", className: "equity"},
    { title: "Total Compensation***", alternate: "Total Pay", short: "total", className: "pay" }, 
    { title: "Vs 2016", short: "change", className: "change"}
  ];

  $scope.lastSort = $scope.headers[5];
  $scope.sortOrder = -1;

  $scope.switchData = function(column, useLong) {
    $scope.filterBy = column;
    $scope.ceoData = useLong ? ceoDataLong : ceoDataShort;
  }

  $scope.sortTable = function(header) {
    if ($scope.lastSort == header) {
      $scope.sortOrder *= -1;
    } else {
      $scope.lastSort = header;
      $scope.sortOrder = 1;
    }

    $scope.ceoData.sort(function(a, b) {
      if (typeof a[header.short] == "number" || a[header.short] == "n/a") {
        a = a[header.short] == "n/a" ? -Infinity : a[header.short];
      } else {
        a = a[header.short].toLowerCase();
      }
      if (typeof b[header.short] == "number" || b[header.short] == "n/a") {
        b = b[header.short] == "n/a" ? -Infinity : b[header.short];
      } else {
        b = b[header.short].toLowerCase();
      }

      if (a < b) {
        return -1 * $scope.sortOrder;
      } else if (a > b) {
        return 1 * $scope.sortOrder;
      } else if (a == b) {
        return 0;
      }
    });
  };

  }]);

  app.filter("ceoFilter", function() {
    return function(input, by) {
      return input.filter(function(value) {
        if (by == "short") {
          return true;
        } else if (by == "all") {
          return true;
        } else if (by == "under40") {
          return value.age < 40;
        } else if (by == "over40"){
          return value.age >= 40;
        } else if (by == "men"){
          return value.gender == "M";
        } else if (by == "women"){
          return value.gender == "F";
        }
      });
    }
  });

  app.filter("percentage", function() {
    return function(input) {
      if (typeof input == "number") {
        return (input * 100).toFixed(0) + "%"; 
      }
      return input;
    }
  })

  app.directive("activeTouch", function() {
    return {
      restrict: "A",
      link: function(scope, element, attrs) {
        element.on("touchstart", function() {
          var actives = document.querySelectorAll(".ceo-table .active");
          for (var i = 0; i < actives.length; i++) {
            actives[i].classList.remove("active");
          }
          element.addClass("active");
        });
      }
    }
  })
