var as = Template.addSong,
    ls = Template.listSongs;

as.events = {
  'click #search': function(e) {
  	e.preventDefault();
  	e.stopPropagation();

  	clearTemp();
  	newTemp();

    var $spinner = $('form .spinner'),
        searchResult = $('#search_box').val();

    if (searchResult) {
      $spinner.show();

      var playlistId = Session.get('addId'),
          songs = Songs.find({playlistId: playlistId});
          
      songs.observe({
        added: function() {
          if ($spinner.css("display") !== "none") {
            $spinner.hide();
            $('#more').show();
          }
        }
      });

    	Meteor.apply('searchMusic', [searchResult, playlistId]);
      Session.set('searchResult', searchResult);
    }
  },

  'click .add': function(e) {
  	e.preventDefault();
  	e.stopPropagation();

    var $target = $(e.target), 
        $row = $target.parents('.row'),
        playlistId = Session.get("playlistId"),
        url = playable($row.children('.url').html());

    //remove song from playlist if click one already on playlist
    if ($target.hasClass('remove')) {
      var song = Songs.findOne({playlistId: playlistId, url: url});

      deleteSong(song);

    //add the song
    } else {
      var currentSong = Songs.findOne({playlistId: playlistId, current: true}),
          current, lastSongId;

      current = (currentSong !== undefined ? false : true);

      if (!current) {
        var prevId = Songs.findOne({playlistId: playlistId, next: currentSong._id})._id,
            nextId = currentSong._id;

        lastSongId = Songs.insert({song: $row.children('.song').html(),
          artist: $row.children('.artist').html(),
          url: url,
          playlistId: playlistId,
          current: current,
          prev: prevId, 
          next: nextId
        });

        Songs.update({_id: nextId}, {$set: {prev: lastSongId}});
        Songs.update({_id: prevId}, {$set: {next: lastSongId}});
      } else {
        console.log("here");
        lastSongId = Songs.insert({song: $row.children('.song').html(),
          artist: $row.children('.artist').html(),
          url: url,
          playlistId: playlistId,
          current: current
        }, function() {
            putCurrentOnPlayer();
        });
      }
    }

    $target.toggleClass('remove');
  },

  'click #more': function() {
    var start = $('#add_list .row').length;

    if (start > 0) {
      Meteor.apply('searchMusic', [Session.get('searchResult'), Session.get('addId'), start]);
    }
  }
};

ls.list_songs = function() {
	return Songs.find({playlistId: Session.get("addId")}).fetch();
};

ls.inPlaylist = function() {
  var song = Songs.find({playlistId: Session.get("playlistId"), url: playable(this.url)}).fetch();

  return (song.length > 0);
};