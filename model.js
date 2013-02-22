Songs = new Meteor.Collection("songs");

Songs.allow({
	insert: function() { return true },
	update: function() { return true },
	remove: function() { return true }
});

Playlists = new Meteor.Collection("playlists");

Playlists.allow({
	insert: function() { return true },
	update: function() { return true },
	remove: function() { return true }
});

Users = new Meteor.Collection("users");

Users.allow({
	insert: function() { return true },
	update: function() { return true },
	remove: function() { return true }
});