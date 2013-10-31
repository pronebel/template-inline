define([
	'jquery',
	'underscore',
	'backbone',
	'collections/todos',
	'views/todos',
	"tplin!%3Cspan%20id%3D%22todo-count%22%3E%3Cstrong%3E%3C%25%3D%20remaining%20%25%3E%3C%2Fstrong%3E%20%3C%25%3D%20remaining%20%3D%3D%201%20%3F%20'item'%20%3A%20'items'%20%25%3E%20left%3C%2Fspan%3E%0A%3Cul%20id%3D%22filters%22%3E%0A%09%3Cli%3E%0A%09%09%3Ca%20class%3D%22selected%22%20href%3D%22%23%2F%22%3EAll%3C%2Fa%3E%0A%09%3C%2Fli%3E%0A%09%3Cli%3E%0A%09%09%3Ca%20href%3D%22%23%2Factive%22%3EActive%3C%2Fa%3E%0A%09%3C%2Fli%3E%0A%09%3Cli%3E%0A%09%09%3Ca%20href%3D%22%23%2Fcompleted%22%3ECompleted%3C%2Fa%3E%0A%09%3C%2Fli%3E%0A%3C%2Ful%3E%0A%3C%25%20if%20(%20completed%20)%20%7B%20%25%3E%0A%3Cbutton%20id%3D%22clear-completed%22%3EClear%20completed%20(%3C%25%3D%20completed%20%25%3E)%3C%2Fbutton%3E%0A%3C%25%20%7D%20%25%3E%0A",
	'common'
], function( $, _, Backbone, Todos, TodoView, statsTemplate, Common ) {

	var AppView = Backbone.View.extend({

		// Instead of generating a new element, bind to the existing skeleton of
		// the App already present in the HTML.
		el: '#todoapp',

		// Compile our stats template
		template: _.template( statsTemplate ),

		// Delegated events for creating new items, and clearing completed ones.
		events: {
			'keypress #new-todo':		'createOnEnter',
			'click #clear-completed':	'clearCompleted',
			'click #toggle-all':		'toggleAllComplete'
		},

		// At initialization we bind to the relevant events on the `Todos`
		// collection, when items are added or changed. Kick things off by
		// loading any preexisting todos that might be saved in *localStorage*.
		initialize: function() {
			this.allCheckbox = this.$('#toggle-all')[0];
			this.$input = this.$('#new-todo');
			this.$footer = this.$('#footer');
			this.$main = this.$('#main');

			this.listenTo(Todos, 'add', this.addOne);
			this.listenTo(Todos, 'reset', this.addAll);
			this.listenTo(Todos, 'change:completed', this.filterOne);
			this.listenTo(Todos, 'filter', this.filterAll);
			this.listenTo(Todos, 'all', this.render);

			Todos.fetch();
		},

		// Re-rendering the App just means refreshing the statistics -- the rest
		// of the app doesn't change.
		render: function() {
			var completed = Todos.completed().length;
			var remaining = Todos.remaining().length;

			if ( Todos.length ) {
				this.$main.show();
				this.$footer.show();

				this.$footer.html(this.template({
					completed: completed,
					remaining: remaining
				}));

				this.$('#filters li a')
					.removeClass('selected')
					.filter( '[href="#/' + ( Common.TodoFilter || '' ) + '"]' )
					.addClass('selected');
			} else {
				this.$main.hide();
				this.$footer.hide();
			}

			this.allCheckbox.checked = !remaining;
		},

		// Add a single todo item to the list by creating a view for it, and
		// appending its element to the `<ul>`.
		addOne: function( todo ) {
			var view = new TodoView({ model: todo });
			$('#todo-list').append( view.render().el );
		},

		// Add all items in the **Todos** collection at once.
		addAll: function() {
			this.$('#todo-list').html('');
			Todos.each(this.addOne, this);
		},

		filterOne: function( todo ) {
			todo.trigger("visible");
		},

		filterAll: function() {
			Todos.each(this.filterOne, this);
		},

		// Generate the attributes for a new Todo item.
		newAttributes: function() {
			return {
				title: this.$input.val().trim(),
				order: Todos.nextOrder(),
				completed: false
			};
		},

		// If you hit return in the main input field, create new **Todo** model,
		// persisting it to *localStorage*.
		createOnEnter: function( e ) {
			if ( e.which !== Common.ENTER_KEY || !this.$input.val().trim() ) {
				return;
			}

			Todos.create( this.newAttributes() );
			this.$input.val('');
		},

		// Clear all completed todo items, destroying their models.
		clearCompleted: function() {
			_.invoke(Todos.completed(), 'destroy');
			return false;
		},

		toggleAllComplete: function() {
			var completed = this.allCheckbox.checked;

			Todos.each(function( todo ) {
				todo.save({
					'completed': completed
				});
			});
		}
	});

	return AppView;
});
