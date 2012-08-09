Meteor.startup(function () {
  var uId = Users.insert({dj: false}),
    pId,
    PlaylistRouter = Backbone.Router.extend({
      routes: {
        ":playlistId": "index",
        "/": "generatePlaylist",
        "": "generatePlaylist"
      },
      index: function (playlistId) {
        Session.set("playlistId", playlistId);

        Meteor.subscribe('playlists', playlistId);

        Meteor.autosubscribe(function() {
          Meteor.subscribe('songs', playlistId);
        });
      },
      generatePlaylist: function() {
        pId = Playlists.insert({temp: false, repeat: true, shuffle: false});
        Users.update({_id: uId}, {dj: true});
        this.setPlaylist(pId);
      },
      setPlaylist: function (playlistId) {
        this.navigate(playlistId, true);
      }
    });

  var Router = new PlaylistRouter;

  Backbone.history.start({pushState: true});

  Session.set('userId', uId);

  $('#add_view').hide();
  $('.spinner').hide();
});

var newTemp = function() {
  var tempPlaylistId = Playlists.insert({temp: true});

  Session.set('addId', tempPlaylistId);

  Meteor.autosubscribe(function() {
    Meteor.subscribe('songs', tempPlaylistId);
  });
};

var clearTemp = function() {
  var playlistId = Session.get("addId");
  
  Playlists.remove({temp: true, playlistId: playlistId});
  Songs.remove({playlistId: playlistId});
};