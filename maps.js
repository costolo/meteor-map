Markers = new Mongo.Collection('markers');

if (Meteor.isClient) {
  Meteor.startup(function() {
    GoogleMaps.load();
  });

  var this_marker = null;

  Template.map.onCreated(function() {
    GoogleMaps.ready('map', function(map) {

      google.maps.event.addListener(map.instance, 'click', function(event) {
        Markers.insert({ lat: event.latLng.lat(), lng: event.latLng.lng(), shoutouts: []});
      });

      markers = {};

      Markers.find().observe({
        added: function(document) {
          var marker = new google.maps.Marker({
            draggable: true,
            animation: google.maps.Animation.DROP,
            position: new google.maps.LatLng(document.lat, document.lng),
            map: map.instance,
            id: document._id
          });

          this_marker = Markers.findOne({_id: marker.id});

          google.maps.event.addListener(marker, 'dragend', function(event){
            Markers.update(marker.id, {$set: { lat: event.latLng.lat(), lng: event.latLng.lng() }});
          });

          google.maps.event.addListener(marker, 'rightclick', function(event) {
            Markers.remove(marker.id);
          });

          google.maps.event.addListener(marker, 'click', function(event){
            this_marker = Markers.findOne({_id: marker.id}); 
            var text = prompt("text here");
            if(text !== null) {
              Markers.update({_id: marker.id}, {$push: {shoutouts: text}});
            }
            Template.array.__helpers.get('shoutouts').call();
            console.log(this_marker.shoutouts);
          });

          markers[document._id] = marker;
        },

        changed: function(newDocument, oldDocument) {
          markers[newDocument._id].setPosition({ lat: newDocument.lat, lng: newDocument.lng });
        },

        removed: function(oldDocument) {
          markers[oldDocument._id].setMap(null);
          google.maps.event.clearInstanceListeners(markers[oldDocument._id]);
          delete markers[oldDocument._id];
        }
      });
    });
  });

  Template.map.helpers({
    mapOptions: function() {
      if (GoogleMaps.loaded()) {
        return {
          center: new google.maps.LatLng(35.7889382, -78.6539485),
          zoom: 17
        };
      }
    }
  });

  Template.array.helpers({
    shoutouts: function() {
      if (this_marker !== null) {
        return this_marker.shoutouts;
      } else {
        return ["No marker selected", "you nerd"];
      }
    }
  });
}



