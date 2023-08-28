(function () {
'use strict';

angular
  .module('MenuCategoriesApp', [])
  .controller('MenuCategoriesController', MenuCategoriesController)
  .service('MenuCategoriesService', MenuCategoriesService)
  .directive('foundItems', FoundItems)
  .constant('ApiBasePath', 'https://jsonplaceholder.typicode.com');

function FoundItems() {
  var ddo = {
    templateUrl: 'templ.html',
    scope: {
      list: '<',
      title: '@',
      onRemove : '&'
    },
    controller: ShoppingListDirectiveController,
    controllerAs: 'listd', 
    bindToController: true
  };

  return ddo;
}

function ShoppingListDirectiveController() {
  
}

MenuCategoriesController.$inject = ['MenuCategoriesService'];
function MenuCategoriesController(MenuCategoriesService) {
  var menu = this;
  menu.val = '';

  menu.removeItem = function (itemIndex) {
    MenuCategoriesService.removeItem(itemIndex);
  };

  menu.search = function () {
    menu.error =''
    var promise = MenuCategoriesService.getMenuCategories();

    promise
      .then(function (response) {
        // menu.val = "here";
        var cat = response.data;
        cat  = MenuCategoriesService.filer(cat, menu.val);
        menu.categories = cat.arr ;
        menu.error =cat.error ;
      })
      .catch(function (error) {
        menu.error = error.message;
      });
  };

  menu.removeItem = function (itemIndex) {
    var items = menu.categories;
    MenuCategoriesService.removeItem(items, itemIndex);
  };
}

MenuCategoriesService.$inject = ['$http', 'ApiBasePath'];
function MenuCategoriesService($http, ApiBasePath) {
  var service = this;

  service.removeItem = function (items, itemIndex) {
    items.splice(itemIndex, 1);
  };

  service.getMenuCategories = function () {
    var response = $http({
      method: 'GET',
      url: ApiBasePath + '/users',
    });

    return response;
  };

  service.getMenuForCategory = function (shortName) {
    var response = $http({
      method: 'GET',
      url: ApiBasePath + '/users',
      params: {
        category: shortName,
      },
    });

    return response;
  };

  service.filer = function (list, val) {
    var obj = {};
    var newlist = [];
    if (val == '') {
      obj.error = 'Nothing found';
      obj.arr = newlist ; 
      return  obj;
      throw new Error('Nothing found');
    }

    for (var i = 0; i < list.length; i++) {
      if (list[i].email.indexOf(val) != -1) newlist.push(list[i]);
    }
    if (newlist.length == 0) {
      obj.error = 'Nothing found';
      obj.arr = newlist ; 
      return  obj;
      throw new Error('Nothing found');
    }
    obj.arr = newlist ; 
    return obj;
  };
}
})();
