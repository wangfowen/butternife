Meteor.startup(function () {
  var u_id = Users.insert({dj: false}),
    p_id,
    PlaylistRouter = Backbone.Router.extend({
      routes: {
        ":playlist_id": "index",
        "/": "generate_playlist",
        "": "generate_playlist"
      },
      index: function (playlist_id) {
        Session.set("playlist_id", playlist_id);

        Meteor.subscribe('playlists', playlist_id);

        Meteor.autosubscribe(function() {
          Meteor.subscribe('songs', playlist_id, function() {
            Session.set("order", Songs.findOne({playlist_id: Session.get("playlist_id")}, {sort: {order: -1}}).order);
          });
        });
      },
      generate_playlist: function() {
        p_id = Playlists.insert({temp: false});
        Users.update({_id: u_id}, {dj: true});
        this.setPlaylist(p_id);
      },
      setPlaylist: function (playlist_id) {
        this.navigate(playlist_id, true);
      }
    });

  var Router = new PlaylistRouter;

  Backbone.history.start({pushState: true});

  Session.set('user_id', u_id);
});