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

  $('.spinner').hide();
  $('#back').hide();
  $('#more').hide();

  var audio = document.getElementsByTagName('audio')[0];
  
  if (audio) {
    audio.addEventListener("ended", function() {
      changeSong("next");
    });

    isSong = Meteor.setInterval(function() {
      var currentUrl = $('#current .url');

      if (currentUrl) {
        if (!$('audio source').attr("src")) {
          putCurrentOnPlayer();
          $(audio).removeAttr('autoplay');
          audio.pause();
        }

        Meteor.clearInterval(isSong);
      }
    }, 500);
  }
});

  // window.onbeforeunload = function() {
  //   Users.remove({_id: Session.get("userId"), playlistId: Session.get("playlistId")});
  // };

  //set starting song on player

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

  $('#more').hide();
};

var playable = function(url) {
  if (url.indexOf('soundcloud') !== -1) {
    url += (url.indexOf("?") === -1 ? "?" : "&") + "client_id=439f9fd050fe1989287ec13937c89894";
  }

  return url;
};

var changeSong = function(direction) {
  var currentSong = Songs.findOne({playlistId: Session.get("playlistId"), current: true});

  //change new song to be the current
  Songs.update({_id: currentSong._id}, {$set: {current: false}});
  Songs.update({_id: currentSong[direction]}, {$set: {current: true}}, function() {
    putCurrentOnPlayer();
  }); 
};

var deleteSong = function(song) {
  var isCurrent = song.current;

  Songs.update({_id: song.prev}, {$set: {next: song.next}});
  Songs.update({_id: song.next}, {$set: {prev: song.prev}});

  if (isCurrent) {
    var queue = Songs.find({playlistId: Session.get("playlistId"), current: false}).fetch();
    if (queue.length > 0) {
      changeSong("next");
    } else {
      $('#player audio source').removeAttr('src');
    }
  }

  Songs.remove({_id: song._id});
};

var putCurrentOnPlayer = function() {
  var $current = $('#current .url'),
      $player = $('#player audio');

  $player.children('source').attr("src", $current.html());

  $player[0].pause();
  $player[0].load();
  $player[0].play()
};

var mergeSort = function(head, list) {
  return list;
}