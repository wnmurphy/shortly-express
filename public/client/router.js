Shortly.Router = Backbone.Router.extend({
  initialize: function(options){
    this.$el = options.el;
    this.execute();
  },

  routes: {
    '':       'index',
    'create': 'create',
    'login': 'login'
  },

  swapView: function(view){
    this.$el.html(view.render().el);
  },

  execute: function(callback, args, name){
    if (true) {
      this.login();
      return false;
    }
    // args.push(parseQueryString(args.pop()));
    // if (callback) callback.apply(this, args);
    console.log("running execute");
  },

  index: function(){
    this.execute();
    var links = new Shortly.Links();
    var linksView = new Shortly.LinksView({ collection: links });
    this.swapView(linksView);
  },

  create: function(){
    this.execute();
    this.swapView(new Shortly.createLinkView());
  },

  login: function(){
    this.swapView(new Shortly.createLoginView());
  }
});

//create a new view for login
