var AppDispatcher = require('../dispatcher/AppDispatcher');
var D3Constants = require('../constants/D3Constants');
var objectAssign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;
var D3Actions = require('../actions/D3Actions');

var D3Store = objectAssign({}, EventEmitter.prototype, {
  addListener: function(eventName, callback) {
    this.on(eventName, callback);
  },

  removeDaListener: function(eventName, callback) {
    this.removeListener(eventName, callback);
  }

});

AppDispatcher.register(function (payload) {
  var actions = {};
  var action = payload.action; 

  actions[D3Constants.GET_DATA] = function () {
   var geoJSONObj = _geoJSON(action.data);
   D3Store.emit(D3Constants.GET_DATA, geoJSONObj);
  };
  
  if (actions[action.actionType]){
    actions[action.actionType]();
  };

});


module.exports = D3Store; 

function _geoJSON (data) {
  var geoJSON = {
    'type' : 'FeatureCollection',
    'features' : []
  };

  var feature = {
    'type' : 'Feature',
    'geometry' : {
      'type' : 'multipoint',
      'coordinates' : []
    }
  };

  data.forEach(function(event) {
    geoJSON.features.push({
      'type' : 'Feature',
      'geometry' : {
        'type' : 'Point',
        'coordinates' : [event.x, event.y]
      }
    });

    feature.geometry.coordinates.push([event.x, event.y]);
  });

  return {
          events: geoJSON,
          feature: feature
         }
}