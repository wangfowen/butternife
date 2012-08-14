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
    //auto play next song at end of current song
    audio.addEventListener("ended", function() {
      changeSong("next");
    });

    //hacky way to set initial src without it autoplaying
    //yet have autoplay on every other instance
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

//allow soundcloud songs to play
var playable = function(url) {
  if (url.indexOf('soundcloud') !== -1) {
    url += (url.indexOf("?") === -1 ? "?" : "&") + "client_id=439f9fd050fe1989287ec13937c89894";
  }

  return url;
};

var changeSong = function(direction, callback) {
  var currentSong = Songs.findOne({playlistId: Session.get("playlistId"), current: true});

  callback = callback || undefined;

  //change new song to be the current
  if (currentSong) {
    Songs.update({_id: currentSong._id}, {$set: {current: false}});
    Songs.update({_id: currentSong[direction]}, {$set: {current: true}}, function() {
      putCurrentOnPlayer();
      if (callback) {
        callback();
      }
    }); 
  }
};

var deleteSong = function(song) {
  var isCurrent = song.current;

  Songs.update({_id: song.prev}, {$set: {next: song.next}});
  Songs.update({_id: song.next}, {$set: {prev: song.prev}}, function() {
    if (isCurrent) {
      var queue = Songs.find({playlistId: Session.get("playlistId"), current: false}).fetch();
      if (queue.length > 0) {
        changeSong("next", function() {
          Songs.remove({_id: song._id});
        });
      } else {
        var $player = $('#player audio');

        $player[0].pause();
        $player.children('source').removeAttr('src');
        $player[0].load();

        Songs.remove({_id: song._id});
      }
    } else {
      Songs.remove({_id: song._id});
    }
  });
};

var putCurrentOnPlayer = function() {
  var $current = $('#current .url'),
      $player = $('#player audio');

  $player.children('source').attr("src", $current.html());

  $player[0].pause();
  $player[0].load();
  $player[0].play()
};

var sortSongs = function(head, list) {
  var sortedList = [],
      current = head;
  try {
    if (head && list.length > 0) {
      for (var j = 0; j < list.length; j++) {
        for (var i = 0; i < list.length; i++) {
          if (list[i]._id === current) {
            sortedList.push(list[i]);
          }
        }

        current = sortedList[sortedList.length - 1].next;
      }
    }
  } catch(err) {
  }

  return sortedList;
}