angular
  .module('shout.inbox')
  .factory('InboxFactory', InboxFactory);

InboxFactory.$inject = ['$rootScope'];

function InboxFactory($rootScope) {
  console.log('InboxFactory');
  var services = {};
  services.photos = [];
  services.updateInbox = updateInbox;
  services.getPhotos = getPhotos;
  services.removeExpired = removeExpired;
  services.filterForNew = filterForNew;
  services.checkValidPhoto = checkValidPhoto;

  //for testing:
  // setTimeout(services.updateInbox, 10000, services.newInbox);

  return services;

  function updateInbox(data) {
    console.log('update inbox called');
    services.photos = data;
    $rootScope.$broadcast('updateInbox', services.photos);
  }

  function getPhotos(){
    return services.photos;
  }

  function removeExpired(oldInbox, newData){
    console.log('removeExpired called with oldInbox: ', oldInbox);
    var idArray = [];
    newData.forEach(function(item) {
      idArray.push(item.photoId);
    });
    console.log('removeExpired called!');
    var newInbox = _.filter(oldInbox, function(photo) {
      return _.contains(idArray, photo.photoId);
    });
    console.log('new inbox: ', newInbox);
    return newInbox;
  }

  function filterForNew(oldInbox, newData){
    var oldIdArray = [];
    console.log('filterForNew called with oldInbox: ', oldInbox);
    oldInbox.forEach(function(item) {
      oldIdArray.push(item.photoId);
    });
    console.log('oldIdArray: ', oldIdArray);
    var newPhotos = _.filter(newData, function(photo) {
      return !_.contains(oldIdArray, photo.photoId);
    });
    console.log('the new photos: ', newPhotos);
    return newPhotos;
  }

  function checkValidPhoto(photo){
    currIdArray = [];
    services.photos.forEach(function(item) {
      currIdArray.push(item.photoId);
    });
    return _.contains(currIdArray, photo.photoId);
  }

}

