Shortly.createSignupView = Backbone.View.extend({
  className: 'creator',

  template: Templates['signup'],

  events: {
  },

  render: function () {
    this.$el.html( this.template() );
    return this;
  }

});
