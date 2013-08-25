$(function(){
	$('.item-sortable').sortable({ 
		connectWith: '.item-sortable',
		start:function(event,ui){
			ui.item.addClass('item-dragging');
		},
		stop:function(event,ui){
			ui.item.removeClass('item-dragging');
			refreshItemOrder($(this));
		}
	});

	$('.list-sortable').sortable({ 
		connectWith: '.list-sortable',
		start:function(event,ui){
			ui.item.addClass('list-dragging');
		},
		stop:function(event,ui){
			ui.item.removeClass('list-dragging');
			refreshListOrder($(this));
		}
	});

	listAddContact($('.list').eq(1),'',1);
	listAddContact($('.list').eq(2),'',1);
	listAddContact($('.list').eq(2),'',3);

	function contactDragStart(e){
		contactDragged=$(this);
	}
	//--------------------defining functions for item--------------------
	function checkItem(targetItem){
		targetItem.addClass('item-checked');
		updateItemSync('item','check',targetItem.data('id'),'','','');
	}
	function uncheckItem(targetItem){
		targetItem.removeClass('item-checked');
		updateItemSync('item','uncheck',targetItem.data('id'),'','','');
	}
	function removeItem(targetItem){
		updateItemSync('item','delete',targetItem.data('id'),'','','');
		targetItem.animate({
			opacity:'0',
			left:'-100%'
		},400,function(){
			$(this).animate({
				height:0
			},200,function(){
				$(this).remove();
			});
		});
	}
	function bindItemEvents(targetItem){
		targetItem.on('dragenter',itemContactDragEnter);
		targetItem.on('dragover',itemContactDragOver);
		targetItem.on('dragleave',itemContactDragLeave);
		targetItem.on('drop',itemContactDrop);
		targetItem.siblings('.item-template').children('.item-funcs').clone(true).appendTo(targetItem);
	}
	function unbindItemEvents(targetItem){
		targetItem.unbind('dragenter');
		targetItem.unbind('dragover');
		targetItem.unbind('dragleave');
		targetItem.unbind('drop');
		targetItem.children('span').remove();
		targetItem.children('.item-funcs').remove();
		targetItem.children('.item-co-contacts').hide(200);
	}
	function insertNewItem(newItem){
		if(newItem.children('textarea').val()!=""){
			var newItemContent=$('<span></span>');
			TextToUpdate=newItem.children('textarea').val();
			newItemContent.append(newItem.children('textarea').val());
			newItem.children('textarea').remove();
			newItem.append(newItemContent);
			bindItemEvents(newItem);
			newItem.append(newItem.children('.item-co-contacts'));
			newItem.children('.item-co-contacts').show(200);
			newItem.removeClass('item-checked').removeClass('item-editing');
			updateItemSync('item','updateText',newItem.data('id'),TextToUpdate,'','');
		}else{
			updateItemSync('item','delete',newItem.data('id'),'','','');
			newItem.remove();
		}
		newItem.parent().removeClass('items-wrapper-editing');
	}
	function itemContactDragEnter(e){
		if(e.stopPropagation){
			e.preventDefault();
			e.stopPropagation();
		}
	}
	function itemContactDragOver(e){
		if(e.stopPropagation){
			e.preventDefault();
			e.stopPropagation();
		}
		$(this).addClass('itemContactDragOver');
	}
	function itemContactDragLeave(e){
		if(e.stopPropagation){
			e.preventDefault();
			e.stopPropagation();
		}
		$(this).removeClass('itemContactDragOver');
	}
	function itemContactDrop(e){
		if(e.stopPropagation){
			e.stopPropagation();
		}
		/*$(this).removeClass('itemContactDragOver');
		itemAddContact($(this),contactDragged.data('name'),contactDragged.data('uid'));*/
		if($(this).find(".item-co-contact").filterByData('uid',contactDragged.data('uid')).length==0 ){
			itemAddContact($(this),contactDragged.data('name'),contactDragged.data('uid'));
			assignUser('item','link',$(this).data('id'),contactDragged.data('uid'));
		}
	}
	function itemAddContact(targetItem,name,uid){
		if(targetItem.children('.item-co-contacts').length==0){
			targetItem.append('<ul class="item-co-contacts"></ul>');
		}
		var newCoContact=$('<li class="item-co-contact"><i></i></li>');
		targetItem.children('.item-co-contacts').append(newCoContact);
		newCoContact.data('name',name);
		newCoContact.data('uid',uid);
		newCoContact.css('background-image','url(avatar/avatar'+uid+'.jpg)');
		newCoContact.children('i').on('click',{targetItem:targetItem,targetContact:newCoContact},itemDeleteContact);
	}
	function itemDeleteContact(event){
		var targetContact=event.data.targetContact;
		var targetItem=event.data.targetItem;
		assignUser('item','unlink',targetItem.data('id'),targetContact.data('uid'));
		event.data.targetContact.remove();
	}
	function editItem(targetItemTextbox,content){
		isTyping=1;
		targetItemTextbox.focus().on('');
		targetItemTextbox.text(content);
		targetItemTextbox.bind('input onchange', function() {
			if(targetItemTextbox.scrollTop()>0){
				targetItemTextbox.css('height',targetItemTextbox.innerHeight()+18+'px');
			}
		});
		targetItemTextbox.bind('blur',function(){
			isTyping=0;
			insertNewItem($(this).parent());
		});
		targetItemTextbox.keydown(function(e){
			if(e.keyCode==13){
				e.preventDefault();
				e.stopPropagation();
				isTyping=0;
				insertNewItem($(this).parent());
			}
		});
		targetItemTextbox.parent().addClass('item-editing');
		targetItemTextbox.parent().parent().addClass('items-wrapper-editing');
	}




	//--------------------defining functions for list--------------------
	function checkList(targetList){
		targetList.addClass('list-checked');
		updateListSync('list','check',targetList.data('id'),'','');
	}
	function uncheckList(targetList){
		targetList.removeClass('list-checked');
		updateListSync('list','uncheck',targetList.data('id'),'','');
	}
	function removeList(targetList){
		updateListSync('list','delete',targetList.data('id'),'','');
		targetList.animate({
			opacity:'0',
			left:'-100%'
		},400,function(){
			$(this).animate({
				height:0
			},200,function(){
				$(this).remove();
			});
		});
	}
	function bindListEvents(targetList){
		targetList.on('dragenter',listContactDragEnter);
		targetList.on('dragover',listContactDragOver);
		targetList.on('dragleave',listContactDragLeave);
		targetList.on('drop',listContactDrop);
		targetList.siblings('.list-template').children('.list-funcs').clone(true).appendTo(targetList);
	}
	function unbindListEvents(targetList){
		targetList.unbind('dragenter');
		targetList.unbind('dragover');
		targetList.unbind('dragleave');
		targetList.unbind('drop');
		targetList.children('span').remove();
		targetList.children('.list-funcs').remove();
		targetList.children('.list-co-contacts').hide(200);
	}
	function insertNewList(newList){
		if(newList.children('textarea').val()!=""){
			var newListContent=$('<span></span>');
			TextToUpdate=newList.children('textarea').val();
			newListContent.append(newList.children('textarea').val());
			newList.children('textarea').remove();
			newList.append(newListContent);
			bindListEvents(newList);
			newList.append(newList.children('.list-co-contacts'));
			newList.children('.list-co-contacts').show(200);
			newList.removeClass('list-checked').removeClass('list-editing');
			updateListSync('list','updateText',newList.data('id'),TextToUpdate,'');
			newList.parent().removeClass('lists-wrapper-editing');
		}else{
			updateListSync('list','delete',newList.data('id'),'','');
			newList.parent().removeClass('lists-wrapper-editing');
			newList.remove();
		}
	}
	function listContactDragEnter(e){
		if(e.stopPropagation){
			e.preventDefault();
			e.stopPropagation();
		}
	}
	function listContactDragOver(e){
		if(e.stopPropagation){
			e.preventDefault();
			e.stopPropagation();
		}
		$(this).addClass('listContactDragOver');
	}
	function listContactDragLeave(e){
		if(e.stopPropagation){
			e.preventDefault();
			e.stopPropagation();
		}
		$(this).removeClass('listContactDragOver');
	}
	function listContactDrop(e){
		if(e.stopPropagation){
			e.stopPropagation();
		}
		$(this).removeClass('listContactDragOver');

		if($(this).find(".list-co-contact").filterByData('uid',contactDragged.data('uid')).length==0 ){
			listAddContact($(this),contactDragged.data('name'),contactDragged.data('uid'));
			assignUser('list','link',$(this).data('id'),contactDragged.data('uid'));
		}
	}
	function listAddContact(targetList,name,uid){
		if(targetList.children('.list-co-contacts').length==0){
			targetList.append('<ul class="list-co-contacts"></ul>');
		}
		var newCoContact=$('<li class="list-co-contact"><i></i></li>');
		targetList.children('.list-co-contacts').append(newCoContact);
		newCoContact.data('name',name);
		newCoContact.data('uid',uid);
		newCoContact.css('background-image','url(avatar/avatar'+uid+'.jpg)');
		newCoContact.children('i').on('click',{targetList:targetList,targetContact:newCoContact},listDeleteContact);
	}
	function listDeleteContact(event){
		var targetContact=event.data.targetContact;
		var targetList=event.data.targetList;
		assignUser('list','unlink',targetList.data('id'),targetContact.data('uid'));
		targetContact.remove();
	}
	function editList(targetListTextbox,content){
		isTyping=1;
		targetListTextbox.focus().on('');
		targetListTextbox.text(content);
		targetListTextbox.bind('input onchange', function() {
			if(targetListTextbox.scrollTop()>0){
				targetListTextbox.css('height',targetListTextbox.innerHeight()+18+'px');
			}
		});
		targetListTextbox.bind('blur',function(){
			isTyping=0;
			insertNewList($(this).parent());
		});
		targetListTextbox.keydown(function(e){
			if(e.keyCode==13){
				e.preventDefault();
				e.stopPropagation();
				isTyping=0;
				insertNewList($(this).parent());
			}
		});
		targetListTextbox.parent().addClass('list-editing');
		targetListTextbox.parent().parent().addClass('lists-wrapper-editing');
	}


	var isTyping=0;
	var contactDragged;
	$(".contacts-tn").each(function(){
		$(this).on('dragstart',contactDragStart);
	});


	//initailizing item
	$(".panel").children('ul').children('li.item').not('.item-template').each(function(){
		bindItemEvents($(this));
	});
	$('.item-func-check').on('click',function(){
		checkItem($(this).parent().parent());
	});
	$('.item-func-uncheck').on('click',function(){
		uncheckItem($(this).parent().parent());
	});
	$('.item-func-detail').on('click',function(){
	});
	$('.item-func-edit').on('click',function(){
		if(isTyping==1){
			$(':focus').blur();
		}
		var itemText=$("<textarea></textarea>");
		var targetItem=$(this).parent().parent();
		targetItem.append(itemText);
		editItem(itemText,$(this).parent().siblings('span').text());
		unbindItemEvents(targetItem);
	});
	$('.item-func-delete').on('click',function(){
		removeItem($(this).parent().parent());
	});
	$('.item-func-clean').on('click',function(){
		$(this).parent().parent().siblings('.item-checked').each(function(){
			removeItem($(this));
		})
		removeItem($(this).parent().parent());
	});


	//--------------------initailizing list--------------------
	$(".panel").children('ul').children('li.list').not('.list-template').each(function(){
		bindListEvents($(this));
	});
	$('.list-func-check').on('click',function(){
		checkList($(this).parent().parent());
	});
	$('.list-func-uncheck').on('click',function(){
		uncheckList($(this).parent().parent());
	});
	$('.list-func-detail').on('click',function(){
	});
	$('.list-func-edit').on('click',function(){
		if(isTyping==1){
			$(':focus').blur();
		}
		var listText=$("<textarea></textarea>");
		var targetList=$(this).parent().parent();
		targetList.append(listText);
		editList(listText,$(this).parent().siblings('span').text());
		unbindListEvents(targetList);
	});
	$('.list-func-delete').on('click',function(){
		removeList($(this).parent().parent());
	});
	$('.list-func-clean').on('click',function(){
		$(this).parent().parent().siblings('.list-checked').each(function(){
			removeList($(this));
		})
		removeList($(this).parent().parent());
	});




	//--------------------start working--------------------
	$("body").keydown(function(e) {
		if(isTyping==0){
			if(e.keyCode==13){
				e.preventDefault();
			}
			if(e.metaKey!=1 && e.keyCode!=17 && e.keyCode!=18 && e.keyCode!=27 && e.keyCode!=9 && e.keyCode!=20){
				updateListSync('list','new','','','');
				var newList=$('<li class="list idNotassigned"></li>');
				$(".panel-target").children('ul').append(newList);
				var newListText=$("<textarea></textarea>");
				newList.prepend(newListText);
				editList(newListText,'');
			}
		}
	});
	loadLists();
	loadItems(1);



	function loadLists(){
	}
	function addLoadedList(listData){
	    var newList=$('<li class="list"></li>');
	    $(".panel-root").children('ul').append(newList);
	    newList.data('id',listData.id);
		var newListContent=$('<span></span>');
		newListContent.append(listData.listText);
		newList.append(newListContent);
		bindListEvents(newList);
		newList.append(newList.children('.list-co-contacts'));
		newList.children('.list-co-contacts').show(200);
		$.each(listData.users,function(index,item){
			listAddContact(newList,item.username,item.uid);
		})
		if(listData.listStatus==2){
			newList.addClass('list-checked');
		}
	}
	function loadItems(pid){
	}
	function addLoadedItem(itemData){
	    var newItem=$('<li class="item"></li>');
	    $(".panel-list-selected").children('ul').append(newItem);
	    newItem.data('id',itemData.id);
		var newItemContent=$('<span></span>');
		newItemContent.append(itemData.itemText);
		newItem.append(newItemContent);
		bindItemEvents(newItem);
		newItem.append(newItem.children('.item-co-contacts'));
		newItem.children('.item-co-contacts').show(200);
		$.each(itemData.users,function(index,item){
			itemAddContact(newItem,item.username,item.uid);
		});
		if(itemData.itemStatus==2){
			newItem.addClass('item-checked');
		}
	}
	function updateListSync(type,action,id,content,order){
	}
	function updateItemSync(type,action,id,content,order,pid){
	}
	function assignUser(type,action,lid,uid){
	}
	function assignNewId(new_id){
		$('.idNotassigned').data('id',new_id).removeClass('idNotassigned');
	}
	function refreshListOrder(targetLists){
		$.each(targetLists.children('li').not('.list-template'),function(index,item){
			updateListSync('list','reorder',$(item).data('id'),'',index+1);
		});
	}
	function refreshItemOrder(targetLists){
		$.each(targetLists.children('li').not('.item-template'),function(index,item){
			updateItemSync('item','reorder',$(item).data('id'),'',index+1,'');
		});
	}

	$.fn.filterByData = function(prop, val) {
    	return this.filter(
        	function() { return $(this).data(prop)==val; }
    	);
	}
	function syncFail(msg){
		console.log('http://localhost/Lists/'+msg)
	}


});

