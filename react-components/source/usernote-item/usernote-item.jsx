
var React = require('react');
var ReactAddons = require('react-addons');
var cx = ReactAddons.classSet;
var DragDropMixin = require('react-dnd').DragDropMixin;
var bookshelfStore = require('../../../stores/bookshelfStore');
var updateUserNotesAction = require('../../../actions/updateUserNotes');
var getUserNotesAction = require('../../../actions/getUserNotes');
var _ = require('underscore');
var sounds = require('../../../common/sounds');
var $ = require('jquery');
var deleteNoteAction = require('../../../actions/deleteNote');

var usernoteItemComponent = React.createClass({

    mixins: [DragDropMixin],

    statics: {

    	configureDragDrop: function(register) {

    		register('BOXES', {

    			dragSource: {

    				beginDrag: function(component) {
    					return {
    						item: {
    							id: component.props.id,
    							itemType: component.props.itemType,
    							selectedBoxId: component.props.selectedBoxId
    						}
    					};
    				}
    			},

    			dropTarget: {

    				acceptDrop: function(component, item) {

    					var itemDragged,
    						selectedBox,
    						boxDropped,
    						idType = item.itemType + 'Id',
    						idFilter = {},
    						newBoxNotes,
    						boxIndex,
    						newUserNotes;

    					idFilter[idType] = item.id;

    					if (item.selectedBoxId) {

    						selectedBox = _.findWhere(bookshelfStore.userNotes, { boxId: item.selectedBoxId });
    						itemDragged = _.findWhere(selectedBox.items, idFilter);

    					} else {

    						itemDragged = _.findWhere(bookshelfStore.userNotes, idFilter);
    					}

    					// Trash can dragged
    					if (component.props.id === 'trashCan') {

    						if (item.selectedBoxId) {

    							newBoxNotes = _.without(selectedBox.items, itemDragged);

    							boxIndex = _.findIndex(bookshelfStore.userNotes, {
    								boxId: item.selectedBoxId
    							});

    							bookshelfStore.userNotes[boxIndex].items = newBoxNotes;

    							newUserNotes = bookshelfStore.userNotes;

    						} else {

	    						newUserNotes = _.without(bookshelfStore.userNotes, itemDragged);
    						}

    						$('#spanTrashcan').addClass('stir');
    						setTimeout(function () {
    							$('#spanTrashcan').removeClass('stir');
    						}, 1000);

    						sounds.play('trash');

		    				if (item.itemType === 'note') {

		    					deleteNoteAction(item.id);
		    				}

    					} else {

    						if (item.itemType === 'box') {
    							return false;
    						}

	    					boxDropped = _.findWhere(bookshelfStore.userNotes, { boxId: component.props.id });
                            if (!boxDropped.items) {
                                boxDropped.items = [];
                            }
	    					boxDropped.items.push(itemDragged);

	    					newUserNotes = _.without(bookshelfStore.userNotes, itemDragged);
    					}
	    				
	    				// Updated and delete notes and usernotes
	    				updateUserNotesAction(newUserNotes);
    					
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
		}),
			boxContainerClasses = cx({
			'generic-transition usernote-item': true,
			'box-item-container-selected': id === selectedBoxId
		});

		if (itemType === 'note') {

			return  <span {...this.dragSourceFor('BOXES')} className="generic-transition usernote-item" onClick={clickHandler} onTouchEnd={clickHandler}>
						<img src="//s3-us-west-2.amazonaws.com/notello/images/paper.png" className="paper" />
						<span className={usernoteTitleClasses}>{itemTitle || 'New Note'}</span>
					</span>;

		} else if (itemType === 'notebook' && !selectedBoxId) {

			return <img src="dist/images/notebook.png" className="notebook usernote-item" />;

		} else if (itemType === 'box' && (!selectedBoxId || selectedBoxId === id)) {

			return <span {...this.dropTargetFor('BOXES')} {...this.dragSourceFor('BOXES')} title="You can drag and drop notes and notebooks here" className={boxContainerClasses} onClick={clickHandler} onTouchEnd={clickHandler}>
						<img src={selectedBoxId === id ? '//s3-us-west-2.amazonaws.com/notello/images/archivebox-opened.png' :'//s3-us-west-2.amazonaws.com/notello/images/archivebox.png'} className={boxItemClasses} />
						<span className={boxTitleClasses}>{itemTitle || 'New Box'}</span>
						<span title="Back to your bookshelf" className="ion-android-arrow-dropleft-circle close-box-button" onClick={handleCloseBox} onTouchEnd={handleCloseBox}></span>
					</span>;

		} else if (itemType === 'trash') {

			return <span {...this.dropTargetFor('BOXES')} selectedBoxId={selectedBoxId} title="You can delete stuff permanently by dragging it here" className={boxContainerClasses + ' trash-icon'} style={{ marginLeft: '60px' }}>
						<img src="//s3-us-west-2.amazonaws.com/notello/images/trashcan.png" className={boxItemClasses} id="spanTrashcan" />
						<span className="usernote-title">Trash</span>
					</span>;

		}
	}

});

module.exports = usernoteItemComponent;
