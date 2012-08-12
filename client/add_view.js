var as = Template.addSong,
    ls = Template.listSongs;

as.events = {
  'click #back': function() {
    clearTemp();
    
    $('#add_view').hide();
    $('#playlist_view').show();
  },

  'click #search': function(e) {
  	e.preventDefault();
  	e.stopPropagation();

  	clearTemp();
  	newTemp();

    var $spinner = $('.spinner'),
        searchResult = $('#search_box').val();

    $spinner.show();

    var playlistId = Session.get('addId'),
        songs = Songs.find({playlistId: playlistId});
        
    songs.observe({
      added: function() {
        if ($spinner.css("display") !== "none") {
          $spinner.hide();
        }
      }
    });

  	Meteor.apply('searchMusic', [searchResult, playlistId]);
    Session.set('searchResult', searchResult);
  },

  'click .add': function(e) {
  	e.preventDefault();
  	e.stopPropagation();

    var $target = $(e.target), 
        $tr = $target.parents('tr'),
        playlistId = Session.get("playlistId"),
        url = playable($tr.children('.url').html());

    if ($target.hasClass('remove')) {
      var song = Songs.findOne({playlistId: playlistId, url: url});

      Songs.update({_id: song.prev}, {$set: {next: song.next}});
      Songs.update({_id: song.next}, {$set: {prev: song.prev}});
      Songs.remove({_id: song._id});

    } else {
      var currentSong = Songs.findOne({playlistId: playlistId, current: true}),
          current, lastSongId;

      current = (currentSong !== undefined ? false : true);

      lastSongId = Songs.insert({song: $tr.children('.song').html(),
        artist: $tr.children('.artist').html(),
        url: url,
        playlistId: playlistId,
        current: current
      });

      if (!current) {
        var prevId = Songs.findOne({playlistId: playlistId, next: currentSong._id})._id,
            nextId = currentSong._id;

        Songs.update({_id: nextId}, {$set: {prev: lastSongId}});
        Songs.update({_id: prevId}, {$set: {next: lastSongId}});
        Songs.update({_id: lastSongId}, {$set: {prev: prevId, next: nextId}});
      } else {
        Songs.update({_id: lastSongId}, {$set: {prev: lastSongId, next: lastSongId}})
      }
    }

    $target.toggleClass('remove');
  },

  'click #more': function() {
    var start = $('#add_list').children().children('tr').length;

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