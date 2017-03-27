angular.module('brushfire', ['ngMaterial', 'toastr', 'compareTo', 'ngPatternRestrict'])
  .config(['$sceDelegateProvider', function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
      'self',
      '*://www.youtube.com/**'
    ]);
  }])