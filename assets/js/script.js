(function () {
	
	var groupList = [];
	var selectedGroup = {};
	
	var user = JSON.parse( localStorage.getItem('frontend-demo-js') );
	if(user && user.username){
		$(".input_message").show();
		$(".input_login").hide();
	}else{
		$(".input_message").hide();
		$(".input_login").show();
	}
	$('body').on('click', '#login', function() {
		let username = $("#username").val();
		let name = $("#name").val();
		if(username =="" || name==""){
			alert("Please enter valid username and name");
		}else{
			localStorage.setItem( 'frontend-demo-js', JSON.stringify( {username: username, name: name } ) );
			user = JSON.parse( localStorage.getItem('frontend-demo-js') );
			$('#myModal').modal('hide');
			$(".input_message").show();
			$(".input_login").hide();
		}
	});
	    
    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: 'AIzaSyB-BV9CfuFMcFSXRF3M74FqGTXMM4lSjCs',
		authDomain: 'jignesh-demo.firebaseapp.com',
		projectId: 'jignesh-demo',
		storageBucket: 'jignesh-demo.appspot.com',
		messagingSenderId: '826083086352',
		appId: '1:826083086352:web:14fdc0c2c0bba0f7ddfa95',
		measurementId: 'G-CVWNCFHX51'
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
	
	var myDataRef = firebase.firestore().collection('myreoom');
	myDataRef.onSnapshot((snapshot) => {
		groupList = snapshot.docs.map((doc) => ({
		  ...doc.data(),
		}));
		listGroup(groupList);
		//console.log("All data in 'books' collection", data); 
	});
	
	function listGroup(data){
		$("#chat_list").html("");
		for(var i = 0; i < data.length; i++){
			var groupImg = '<div class="img-box"><img class="img-cover" src="assets/img/team.png" alt=""></div>';
			var groupDetail = '<div class="chat-details"><div class="text-head"><h4>'+data[i].title+'</h4><p class="time unread">'+data[i].last_log+'</p></div></div>';
			$("#chat_list").append('<div class="chat-box group_'+data[i].id+'" data-id="'+data[i].id+'">'+groupImg+groupDetail+"</div>");
		}
		if(data.length && data[0]){
			selectGroup(data[0]);
		}
	}
	function selectGroup(data){
		$(".chat-box").removeClass('active');
		$("#chat_list").find('.group_'+data.id).addClass('active');
		$(".selected_group_title").html(data.title); 
		loadGroup(data);
	}
	$('body').on('click', '.chat-box', function() {
		let dataid = $(this).data("id");
		let sgroup = groupList.find((o) => { return o.id == dataid });
		if(sgroup){
			selectGroup(sgroup)
		}
	});
	
	function loadGroup(group){
		selectedGroup = group;
		$("#chat_container").html("");
		var mygroup = firebase.firestore().collection('mygroup_'+group.id);
		var chatList = [];
		mygroup.limit(51).orderBy('createdAt').onSnapshot((snapshot) => {
			chatList = snapshot.docs.map((doc) => ({
			  ...doc.data(),
			}));
			console.log("collection", chatList); 
			$("#chat_container").html("");
			var mgroup = 'mygroup_'+selectedGroup.id;
			for(var i = 0; i < chatList.length; i++){
				if(chatList[i].mygroup == mgroup){
					var d = new Date(chatList[i].createdAt);
					var hm = d.getHours()+":"+d.getMinutes();
					
					let saurce ='JS - ';
					if(chatList[i].saurce){
						saurce = chatList[i].saurce+' - ';
					}
					var myclass = "message-box friend-message";
					if(chatList[i].uid == user.username){
						myclass = "message-box my-message";
					}
					var chat = '<div class="message '+myclass+'"><p class="text messageBubble"><b class="nameTag">'+saurce+chatList[i].name+'</b><br /> '+chatList[i].text+'<br><span>'+hm+'</span> </p></div>';
					$("#chat_container").append(chat);
				}
			}
		});
	}
	
	function sendMessage(){
		let my_input = $("#my_input").val();
		if(username =="" || !selectedGroup || !user){
			
		}else{
			var mgroup = 'mygroup_'+selectedGroup.id;
			var mygroupSend = firebase.firestore().collection(mgroup);
			var ts = new Date().getTime();
			var saurce ='JS';
			
			mygroupSend.add({
			  name: user.name,
			  text: my_input,
			  createdAt: ts,
			  mygroup: mgroup,
			  uid:user.username,
			  saurce:saurce
			}).then((ref) => { 
				$("#my_input").val('');
				console.log("Added doc with ID: ", ref.id);
			});
		}
	}
	$('#my_input').on('keypress', function (e) {
         if(e.which === 13){
			 sendMessage();
		 }
    });
	$('body').on('click', '#send', function() {
		sendMessage();
	});
}());