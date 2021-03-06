if (Meteor.isClient) {
  Meteor.startup(function() {
    GoogleMaps.load();
  });

  Session.set("this_marker", null);

  Template.map.onCreated(function() {
    GoogleMaps.ready('map', function(map) {

      google.maps.event.addListener(map.instance, 'click', function(event) {
        Markers.add(event.latLng.lat(), event.latLng.lng(), []);
      });

      markers = {};

      _Markers.find().observe({
        added: function(document) {
          var marker = new google.maps.Marker({
            draggable: true,
            animation: google.maps.Animation.DROP,
            position: new google.maps.LatLng(document.lat, document.lng),
            map: map.instance,
            id: document._id
          });

          google.maps.event.addListener(marker, 'dragend', function(event){
            Markers.edit_pos(marker.id, event.latLng.lat(), event.latLng.lng());
          });

          google.maps.event.addListener(marker, 'rightclick', function(event) {
            Markers.delete(marker.id);
          });

          google.maps.event.addListener(marker, 'click', function(event){
            Session.set("this_marker", Markers.get(marker.id)); 
            var text = prompt("text here");
            if(text !== null) {
              Markers.edit_text(marker.id, text);
            }
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
          center: new google.maps.LatLng(35.7806, -78.6389),
          zoom: 17
        };
      }
    }
  });

  Template.array.helpers({
    markerText: function() {
      if (Session.get("this_marker") !== null) {
        return Session.get("this_marker").text;
      } else {
        return ["No marker selected"];
      }
    }
  });

  Template.flag.helpers({
    flagText: function() {
      console.log("success????");
      return userSession.getUserSessionString();
    }
  });

  Template.buttontrue.events({
    'click': function() {
      userSession.setUserSession();
      Template.flag.__helpers.get("flagText").call();
    }
  });

  Template.buttonfalse.events({
    'click': function() {
      userSession.removeUserSession();
      Template.flag.__helpers.get("flagText").call();
    }
  });
}








