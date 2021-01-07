import { Template } from 'meteor/templating';
import { Tasks } from '../api/tasks.js';
import './body.html';
import './task.js';
import { ReactiveDict } from 'meteor/reactive-dict';
 

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('tasks');
});


Template.body.helpers({
    tasks() {
      const instance = Template.instance();
      if (instance.state.get('hideCompleted')) {
        // If hide completed is checked, filter tasks
        return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
      }
      // Otherwise, return all of the tasks
        return Tasks.find({}, { sort: { createdAt: -1 } });
      },
      //Return count of incomplete tasks.
      incompleteCount() {
        return Tasks.find({ checked: { $ne: true } }).count();
      },
});


Template.body.events({
  'submit .new-task'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;

    // Insert a task into the collection
    Tasks.insert({
      text,
      createdAt: new Date(), // current time
      owner: Meteor.userId(),  //Owner unique id
      username: Meteor.user().username,  //username of owner
    });
    
    // Insert a task into the collection
     Meteor.call('tasks.insert', text);
   
     // Clear form
    target.text.value = '';
  },
  // Hide completed event
  'change .hide-completed input'(event, instance) {
    instance.state.set('hideCompleted', event.target.checked);
  },

});