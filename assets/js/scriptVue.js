myObject = new Vue({
	el: '#listgroups',
	data: {
        myinput: '',
        groupList: [],
        chatList: [],
		loderitems : [1, 2],
		user : {},
		selectedGroup: {title:'...',id:0}
    },
	mounted: function () {
		this.user = JSON.parse( localStorage.getItem('frontend-demo-vue') );
		
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
		
		let myDataRef = firebase.firestore().collection('myreoom');
		myDataRef.onSnapshot((snapshot) => {
			groupList = snapshot.docs.map((doc) => ({
			  ...doc.data(),
			}));
			this.setGroupList(groupList);
		});
	},
	methods: {
		login() {
			let username = $("#username").val();
			let name = $("#name").val();
			if(username =="" || name==""){
				alert("Please enter valid username and name");
			}else{
				localStorage.setItem( 'frontend-demo-vue', JSON.stringify( {username: username, name: name } ) );
				this.user = JSON.parse( localStorage.getItem('frontend-demo-vue') );
				$('#myModal').modal('hide');
			}
		},
		setGroupList(groupList) {
			this.loderitems = [];
			if(groupList.length){
				this.groupList = groupList;
				this.loadGroup(groupList[0]);
			}
		},
		loadGroup(group) {
			this.selectedGroup = group;
			var mygroup = firebase.firestore().collection('mygroup_'+group.id);
			this.chatList = [];
			mygroup.limit(51).orderBy('createdAt').onSnapshot((snapshot) => {
				var chatData = snapshot.docs.map((doc) => ({
				  ...doc.data(),
				}));
				for(var i = 0; i < chatData.length; i++){
					var d = new Date(chatData[i].createdAt);
					var hm = d.getHours()+":"+d.getMinutes();
					chatData[i].hm = hm;
				}
				this.chatList = chatData;
			});
		},
		sendMessage(myinput) {
			if(this.myinput == ""){
				
			}else{
				var sendinput = this.myinput;
				this.myinput = "";
				var mgroup = 'mygroup_'+this.selectedGroup.id;
				var mygroupSend = firebase.firestore().collection(mgroup);
				var ts = new Date().getTime();
				var saurce ='VueJs';
				
				mygroupSend.add({
				  name: this.user.name,
				  text: sendinput,
				  createdAt: ts,
				  mygroup: mgroup,
				  uid:this.user.username,
				  saurce:saurce
				}).then((ref) => { 
					console.log("Added doc with ID: ", ref.id);
				});
			}
		}
	}
});