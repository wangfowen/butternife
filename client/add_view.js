var as = Template.addSong;

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

    var $spinner = $('.spinner');

    $spinner.show();

    var playlistId = Session.get('addId'),
        songs = Songs.find({playlistId: playlistId});
        
    songs.observe({
      added: function() {
        $spinner.hide();
      }
    });

  	Meteor.apply('searchMusic', [$('#search_box').val(), playlistId]);
  },

  'click .add': function(e) {
  	e.preventDefault();
  	e.stopPropagation();

  	var $tr = $(e.target).parents('tr'),
      playlistId = Session.get("playlistId"),
      currentSong = Songs.findOne({playlistId: playlistId, current: true}),
      current, url, lastSongId;

    current = (currentSong !== undefined ? false : true);

    url = $tr.children('.url').html();

    if (url.indexOf('soundcloud') !== -1) {
      url += (url.indexOf("?") === -1 ? "?" : "&") + "client_id=439f9fd050fe1989287ec13937c89894";
    }

  	lastSongId = Songs.insert({song: $tr.children('.song').html(),
  		artist: $tr.children('.artist').html(),
  		url: url,
  		playlistId: playlistId,
      current: current
  	});

    if (!current) {
      var prevId = Songs.findOne({playlistId: playlistId, next: currentSong._id})._id,
          nextId = currentSong._id;

      Songs.update({_id: nextId}, {$set : {prev: lastSongId}});
      Songs.update({_id: prevId}, {$set : {next: lastSongId}});
      Songs.update({_id: lastSongId}, {$set : {prev: prevId, next: nextId}});
    } else {
      Songs.update({_id: lastSongId}, {$set : {prev: lastSongId, next: lastSongId}})
    }
  }
};

as.list_songs = function() {
	return Songs.find({playlistId: Session.get("addId")}).fetch();
};