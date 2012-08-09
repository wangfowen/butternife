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

  	var $tr = $(e.target).parents('tr');

  	Songs.insert({song: $tr.children('.song').html(),
  		artist: $tr.children('.artist').html(),
  		url: $tr.children('.url').html(),
  		playlistId: Session.get('playlistId')
  	});
  }
};

as.list_songs = function() {
	return Songs.find({playlistId: Session.get("addId")}, {sort: {order: 1}}).fetch();
};