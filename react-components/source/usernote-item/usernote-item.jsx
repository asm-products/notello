
var React = require('react');
var ReactAddons = require('react-addons');
var cx = ReactAddons.classSet;
var DragDropMixin = require('react-dnd').DragDropMixin;
var bookshelfStore = require('../../../stores/bookshelfStore');
var updateUserNotesAction = require('../../../actions/updateUserNotes');
var getUserNotesAction = require('../../../actions/getUserNotes');
var _ = require('underscore');

var usernoteItemComponent = React.createClass({

    mixins: [DragDropMixin],

    statics: {

    	configureDragDrop: function(register) {

    		register('BOXES', {

    			dragSource: {

    				beginDrag: function(component) {
    					return {
    						item: {
    							id: component.props.id
    						}
    					};
    				}
    			},

    			dropTarget: {

    				acceptDrop: function(component, note) {

    					var noteDragged = _.findWhere(bookshelfStore.userNotes, { noteId: note.id }),
    						boxDropped = _.findWhere(bookshelfStore.userNotes, { boxId: component.props.id }),
    					    newUserNotes = _.without(bookshelfStore.userNotes, noteDragged);

    					boxDropped.items.push(noteDragged);

    					updateUserNotesAction(newUserNotes);
    					getUserNotesAction();
    					
    				}
    			}
    		});
    	}
    },

	render: function () {

		var self = this,
			id = self.props.id,
			itemTitle = self.props.itemTitle,
			itemType = self.props.itemType,
			selectedNoteId = self.props.selectedNoteId,
			selectedBoxId = self.props.selectedBoxId,
			clickHandler = self.props.clickHandler,
			handleCloseBox = self.props.onCloseBox;

		var usernoteTitleClasses = cx({
			'usernote-title': true,
			'usernote-title-selected': id === selectedNoteId
		});

		var boxTitleClasses = cx({
			'box-title': true,
			'box-title-selected': id === selectedBoxId
		}),
			boxItemClasses = cx({
			'archive-box': true,
			'box-item-selected': id === selectedBoxId
		})
			boxContainerClasses = cx({
			'generic-transition usernote-item': true,
			'box-item-container-selected': id === selectedBoxId
		});

		if (itemType === 'note') {

			return  <span {...this.dragSourceFor('BOXES')} className="generic-transition usernote-item" onClick={clickHandler} onTouchEnd={clickHandler}>
						<img src="dist/images/paper.png" className="paper" />
						<span className={usernoteTitleClasses}>{itemTitle || 'New Note'}</span>
					</span>;

		} else if (itemType === 'notebook' && !selectedBoxId) {

			return <img src="dist/images/notebook.png" className="notebook usernote-item" />;

		} else if (itemType === 'box' && (!selectedBoxId || selectedBoxId === id)) {

			return <span {...this.dropTargetFor('BOXES')} title="You can drag and drop notes and notebooks here" className={boxContainerClasses} onClick={clickHandler} onTouchEnd={clickHandler}>
						<img src="dist/images/archivebox.png" className={boxItemClasses} />
						<span className={boxTitleClasses}>{itemTitle || 'New Box'}</span>
						<span title="Close this box" className="ion-close-circled close-box-button" onClick={handleCloseBox} onTouchEnd={handleCloseBox}></span>
					</span>;
		}
	}

});

module.exports = usernoteItemComponent;
