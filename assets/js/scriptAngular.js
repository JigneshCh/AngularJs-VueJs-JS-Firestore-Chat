var app = angular.module('angularTable', []);
app.controller('listgroups', function($scope, $http) {
    $scope.myinput = "";
    $scope.loderitems = [1, 2];
    $scope.groupList = []; //declare an empty array
    $scope.chatList = []; //declare an empty array
    $scope.selectedGroup = {title:'...',id:0}; //declare an empty object
	
	$scope.user = JSON.parse( localStorage.getItem('frontend-demo-angular') );
	
	$scope.login = function() {
		let username = $("#username").val();
		let name = $("#name").val();
		if(username =="" || name==""){
			alert("Please enter valid username and name");
		}else{
			localStorage.setItem( 'frontend-demo-angular', JSON.stringify( {username: username, name: name } ) );
			$scope.user = JSON.parse( localStorage.getItem('frontend-demo-angular') );
			$('#myModal').modal('hide');
		}
	}
	
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
	$scope.myDataRef = firebase.firestore().collection('myreoom');
	$scope.myDataRef.onSnapshot((snapshot) => {
		groupList = snapshot.docs.map((doc) => ({
		  ...doc.data(),
		}));
		$scope.setGroupList(groupList);
	});
	$scope.setGroupList = function(groupList) {
		$scope.loderitems = [];
		if(groupList.length){
			$scope.groupList = groupList;
			$scope.loadGroup(groupList[0]);
		}
		$scope.$apply();
	}
	
	$scope.loadGroup = function(group) {
		$scope.selectedGroup = group;
		var mygroup = firebase.firestore().collection('mygroup_'+group.id);
		$scope.chatList = [];
		mygroup.limit(51).orderBy('createdAt').onSnapshot((snapshot) => {
			var chatData = snapshot.docs.map((doc) => ({
			  ...doc.data(),
			}));
			for(var i = 0; i < chatData.length; i++){
				var d = new Date(chatData[i].createdAt);
				var hm = d.getHours()+":"+d.getMinutes();
				chatData[i].hm = hm;
			}
			$scope.chatList = chatData;
			$scope.$apply();
		});
	}
	$scope.sendMessage = function(myinput) {
		if(myinput == ""){
			
		}else{
			$('#my_input').val('');
			var mgroup = 'mygroup_'+$scope.selectedGroup.id;
			var mygroupSend = firebase.firestore().collection(mgroup);
			var ts = new Date().getTime();
			var saurce ='AngularJs';
			
			mygroupSend.add({
			  name: $scope.user.name,
			  text: myinput,
			  createdAt: ts,
			  mygroup: mgroup,
			  uid:$scope.user.username,
			  saurce:saurce
			}).then((ref) => { 
				console.log("Added doc with ID: ", ref.id);
			});
		}
	}
});