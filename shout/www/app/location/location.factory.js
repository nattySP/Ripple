angular
  .module('shout.location')
  .factory('LocationFactory', LocationFactory);

LocationFactory.$inject = ['$ionicPlatform', '$http', 'InboxFactory', '$localstorage', 'API_HOST'];

function LocationFactory($ionicPlatform, $http, InboxFactory, $localstorage, API_HOST) {
  console.log('LocationFactory');
  var currentPosition, watchId, intervalId, userId;
  var services = {
    setPosition: setPosition,
    setWatch: setWatch,
    getCurrentPosition: getCurrentPosition,
    getSuccessCallback: getSuccessCallback,
    watchSuccessCallback: watchSuccessCallback,
    errorCallback: errorCallback,
    currentPosition: currentPosition,
    clearWatch: clearWatch,
    triggerPingInterval: triggerPingInterval,
    clearPingInterval: clearPingInterval,
    intervalId: intervalId,
    getUsersPosition: getUsersPosition
  };

  userId = $localstorage.get('userId');

  triggerPingInterval();

  return services;

  function getCurrentPosition(successCallback, errorCallback) {
    console.log('about to grab the initial position');
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  }

  function setWatch(successCallback, errorCallback) {
    console.log('setting watch on position');
    watchId = navigator.geolocation.watchPosition(successCallback, errorCallback);
  }

  function setPosition(position) {
    services.currentPosition = {
      userId: $localstorage.get('userId'),
      y: position.coords.latitude,
      x: position.coords.longitude,
      timestamp: new Date().getTime()
    };
    console.log(' currentPosition set! ', services.currentPosition);

  }

  function sendPosition() {
    if (services.currentPosition && services.currentPosition.userId && services.currentPosition.x && services.currentPosition.y) {
      $http.post(API_HOST + '/gps/position', services.currentPosition).success(function(data) {
        console.log('server got user position');
        InboxFactory.updateInbox(data);
      });
    } else {
      console.log('not sending incomplete position object to server');
    }
  }

  function errorCallback(error) {
    console.log('error getting position: ', error);
  }

  function getSuccessCallback(position) {
    setPosition(position);
    sendPosition();
  }

  function watchSuccessCallback(position) {
    setPosition(position);
  }

  function clearWatch() {
    navigator.geolocation.clearWatch(watchId);
  }

  function triggerPingInterval() {
    intervalId = setInterval(sendPosition, 60000);
  }

  function clearPingInterval() {
    console.log('clear ping interval called with id: ', intervalId);
    clearInterval(intervalId);
    intervalId = null;
  }

  function getUsersPosition(){
    return services.currentPosition;
  }

}
