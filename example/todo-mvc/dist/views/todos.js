define([
	'jquery',
	'underscore',
	'backbone',
	"tplin!%3Cdiv%20class%3D%22view%22%3E%0A%09%3Cinput%20class%3D%22toggle%22%20type%3D%22checkbox%22%20%3C%25%3D%20completed%20%3F%20'checked'%20%3A%20''%20%25%3E%3E%0A%09%3Clabel%3E%3C%25-%20title%20%25%3E%3C%2Flabel%3E%0A%09%3Cbutton%20class%3D%22destroy%22%3E%3C%2Fbutton%3E%0A%3C%2Fdiv%3E%0A%3Cinput%20class%3D%22edit%22%20value%3D%22%3C%25-%20title%20%25%3E%22%3E%0A",
	'common'
], function( $, _, Backbone, todosTemplate, Common ) {

	var TodoView = Backbone.View.extend({

		tagName:  'li',

		template: _.template( todosTemplate ),

		// The DOM events specific to an item.
		events: {
			'click .toggle':	'toggleCompleted',
			'dblclick label':	'edit',
			'click .destroy':	'clear',
			'keypress .edit':	'updateOnEnter',
			'blur .edit':		'close'
		},

		// The TodoView listens for changes to its model, re-rendering. Since there's
		// a one-to-one correspondence between a **Todo** and a **TodoView** in this
		// app, we set a direct reference on the model for convenience.
		initialize: function() {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
			this.listenTo(this.model, 'visible', this.toggleVisible);
		},

		// Re-render the titles of the todo item.
		render: function() {
			this.$el.html( this.template( this.model.toJSON() ) );
			this.$el.toggleClass( 'completed', this.model.get('completed') );

			this.toggleVisible();
			this.$input = this.$('.edit');
			return this;
		},

		toggleVisible: function() {
			this.$el.toggleClass( 'hidden',  this.isHidden());
		},

		isHidden: function() {
			var isCompleted = this.model.get('completed');
			return ( // hidden cases only
				(!isCompleted && Common.TodoFilter === 'completed')
				|| (isCompleted && Common.TodoFilter === 'active')
			);
		},

		// Toggle the `"completed"` state of the model.
		toggleCompleted: function() {
			this.model.toggle();
		},

		// Switch this view into `"editing"` mode, displaying the input field.
		edit: function() {
			this.$el.addClass('editing');
			this.$input.focus();
		},

		// Close the `"editing"` mode, saving changes to the todo.
		close: function() {
			var value = this.$input.val().trim();

			if ( value ){
				this.model.save({ title: value });
			} else {
				this.clear();
			}

			this.$el.removeClass('editing');
		},

		// If you hit `enter`, we're through editing the item.
		updateOnEnter: function( e ) {
			if ( e.keyCode === Common.ENTER_KEY ) {
				this.close();
			}
		},

		// Remove the item, destroy the model from *localStorage* and delete its view.
		clear: function() {
			this.model.destroy();
		}
	});

	return TodoView;
});
