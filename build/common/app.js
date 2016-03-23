angular.module('app', [
	'ngMaterial',
	'ui.router',
	'ngMdIcons'
]);

angular.module('app')
.directive('myCurrentTime', ['$interval', 'dateFilter', function($interval, dateFilter) {

  function link(scope, element, attrs) {
    var format,
        timeoutId;

    function updateTime() {
      element.text(dateFilter(new Date(), format));
    }

    scope.$watch(attrs.myCurrentTime, function(value) {
      format = value;
      updateTime();
    });

    element.on('$destroy', function() {
      $interval.cancel(timeoutId);
    });

    timeoutId = $interval(function() {
      updateTime(); 
    }, 1000);
  }

  return {
    link: link
  };
}]);

angular.module('app')
	.config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default').foregroundPalette[3] = "rgba(0,0,0,0.67)";
	});