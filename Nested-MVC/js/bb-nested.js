var app = app || {};
$(function(){
//	Models and Collections
	app.Subalbum = Backbone.Model.extend({
		initialize : function(){
			this.subId = this.get('id');
			this.subTitle = this.get('title');
			this.subImg = this.get('image');
			this.subCanvas = this.get('canvas');
			this.subSize = this.get('size');
		}
	});
	app.Subalbums = Backbone.Collection.extend({ model : app.Subalbum });
	app.Album = Backbone.Model.extend({
		initialize : function(){
			this.subs = new app.Subalbums(this.get('subalbum'));
			this.subs.parent = this;
			this.albumId = this.get('id');
			this.albumTitle = this.get('title');
			this.albumImg = this.get('image');
		}
	});
	app.Albums = Backbone.Collection.extend({
		model : app.Album,
		url : 'data/data.json',
		parse : function(data){
			return data;
		}
	});
// ============================= Views ===================

app.AlbumCollectionView = Backbone.View.extend({
    el : $("#categories"),

    initialize : function(){
      _.bindAll(this, 'render');
      this.model.on('reset', function(){ this.render(); }, this);
    },

    render:function (event) {
        _.each(this.model.models, function (album) {
        	//console.log(album.subs);
            $(this.el).append(new app.AlbumView({model:album}).render().el);
        }, this);
        return this;
    }
});

app.AlbumView = Backbone.View.extend({
	template : _.template($("#albumTemplate").html()),
	initialize : function(){
      _.bindAll(this, 'render');
      // Subalbum View should be instantiated and called from inside the initialize function of the Parent View
      this.subView = new app.SubalbumView({model : this.model.subs});
      this.subView.parentView = this;	// this assignment connects the child view to the parent view
      $("#sub-cat").append(this.subView.render().el);	// subView should "return this" from child render() function
    },
    render : function(){
    	//console.log(this.model.subs);
      //$(this.el).html("<p>" + this.model.get("title") + "</p>");
      $(this.el).append(this.template(this.model.toJSON()));
      return this;
    }
});

app.SubalbumView = Backbone.View.extend({
	template : _.template($("#subalbumTemplate").html()),
	initialize : function(){
      _.bindAll(this, 'render');
      this.model.on('reset', function(){ this.render(); }, this);
    },

    render:function (event) {
        _.each(this.model.models, function (subalbum) {
        	$(this.el).append("<p>" + subalbum.get("title") + "</p>");
        	//$(this.el).html(this.template(subalbum.toJSON()));
        }, this);
        return this;
    }
});

//	start the app AlbumRouter ==============================
	app.AlbumRouter = Backbone.Router.extend({
    		routes : {
        		"" : "indexRoute"
    		},
    	indexRoute : function(){
        	this.albumList = new app.Albums();
        	this.albumList.fetch();
        	this.albumAppView = new app.AlbumCollectionView({model : this.albumList});
    }
});

var albumRoute = new app.AlbumRouter();
Backbone.history.start();
});