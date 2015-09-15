_Markers = new Mongo.Collection('markers');

Markers = {
  get: function(id) {
    return _Markers.findOne({_id: id});
  }, 

  add: function(lat, lng, shoutouts) {
    _Markers.insert({ lat: lat, lng: lng, shoutouts: []});
  },

  edit_pos: function(id, lat, lng){
    _Markers.update(id, {$set: { lat: lat, lng: lng }});
  },

  edit_text: function(id, text) {
    _Markers.update({_id: id}, {$push: {shoutouts: text}});
  },

  delete: function(id) {
    _Markers.remove(id);
  }
};