Meteor.startup(function() {
  var uId = Users.insert({dj: false}),
    pId,
    PlaylistRouter = Backbone.Router.extend({
      routes: {
        ":playlistId": "index",
        "/": "generatePlaylist",
        "": "generatePlaylist"
      },
      index: function (playlistId) {
        Users.update({_id: uId}, {$set: {playlistId: playlistId}});

        Session.set("playlistId", playlistId);

        Meteor.subscribe('playlists', playlistId);
        Meteor.subscribe('users', playlistId);
        Meteor.autosubscribe(function() {
          Meteor.subscribe('songs', playlistId);
        });
      },
      generatePlaylist: function() {
        pId = Playlists.insert({temp: false, repeat: true, shuffle: false});
        Users.update({_id: uId}, {$set: {dj: true}});
        this.setPlaylist(pId);
      },
      setPlaylist: function (playlistId) {
        this.navigate(playlistId, true);
      }
    });

  var Router = new PlaylistRouter,
      testAudio;

  Backbone.history.start({pushState: true});

  Session.set('userId', uId);

  $('#add_view').hide();
  $('.spinner').hide();

  // window.onbeforeunload = function() {
  //   Users.remove({_id: Session.get("userId"), playlistId: Session.get("playlistId")});
  // };

  testAudio = Meteor.setInterval(function() {
    var audio = document.getElementsByTagName('audio')[0];

    if (audio) {
      $(audio).removeAttr('autoplay');
      audio.pause();

      // audio.addEventListener("ended", function() {
      //   changeSong("next");
      // });
      // breaks when is reset

      Meteor.clearInterval(testAudio);
    }
  }, 100);
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
  
  if (playlistId) {
    Playlists.remove({temp: true, playlistId: playlistId});
    Songs.remove({playlistId: playlistId});
  }
};

var playable = function(url) {
  if (url.indexOf('soundcloud') !== -1) {
    url += (url.indexOf("?") === -1 ? "?" : "&") + "client_id=439f9fd050fe1989287ec13937c89894";
  }

  return url;
};

var changeSong = function(direction) {
  var currentSong = Songs.findOne({playlistId: Session.get("playlistId"), current: true});

  Songs.update({_id: currentSong._id}, {$set: {current: false}});
  Songs.update({_id: currentSong[direction]}, {$set: {current: true}});
}