	
	// Initialize Firebase

	var config = {
	    apiKey: "AIzaSyD_j_pEKl0uM0TBgit0e3DVSa4gFPWXFp4",
	    authDomain: "project-simple-serve.firebaseapp.com",
	    databaseURL: "https://project-simple-serve.firebaseio.com",
	    projectId: "project-simple-serve",
	    storageBucket: "project-simple-serve.appspot.com",
	    messagingSenderId: "570523217168"
	};

	firebase.initializeApp(config);

	// variable references the database.
	var database = firebase.database();

	// initial values for variables
	// var trainName = "";
	// var destination = "";
	// var minutesAway = "00:00";
	// var frequency = 0; 

	// set the on click function for the submit button to work.
	var trainCounter = 0;
	$("#add-train-btn").on("click", function() {

	    // prevents the form default 
	    event.preventDefault();
	    // alert("submit button clicked");
	    
	    // Grabbed the values from the text boxes.
	    trainName = $("#trainName-input").val().trim();
	    destination = $("#destination-input").val().trim();
	    frequency = $("#frequency-input").val().trim();
	    firstTrain = $("#firstTrain-input").val().trim();

	    // logs everything.
	    // console.log("trainName =" + trainName);
	    // console.log("destination =" + destination);
	    // console.log("frequency =" + frequency);
	    // console.log("firstTrain =" + firstTrain);

	    // "Pushing values in the database"
	    database.ref().push({
	        trainName: trainName,
	        destination: destination,
	        frequency: frequency,
	        firstTrain: firstTrain,
	        dateAdded: firebase.database.ServerValue.TIMESTAMP
	    });

	    // Clear the input form.
	    $("#trainName-input").val("");
	    $("#destination-input").val("");
	   	$("#frequency-input").val("");
	    $("#firstTrain-input").val("");

	});



	// Firebase watcher + initial loader like the .on("value") function.(What Franklin explained.)
	database.ref().on("child_added", function(childSnapshot) {

	    console.log(childSnapshot.val().trainName);
	    console.log(childSnapshot.val().destination);
   	    console.log(childSnapshot.val().frequency);
	    console.log(childSnapshot.val().firstTrain);
	    console.log(childSnapshot.val().dateAdded);

	    trainName = childSnapshot.val().trainName;
	    destination = childSnapshot.val().destination;
   	    frequency = childSnapshot.val().frequency;
	    firstTrain = childSnapshot.val().firstTrain;

	    var firstTimeConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
	    console.log("TIME CONVERTED: " + firstTimeConverted);

	    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
	    console.log("DIFFERENCE IN TIME: " + diffTime);

	    var currentTime = moment();
	    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

	    var timeRemaining = diffTime % frequency;
	    console.log("TIME REMAINING " + timeRemaining);

	    var minAway = frequency - timeRemaining;
	    console.log("MINUTES TILL TRAIN: " + minAway);

	    // var nextTrain = moment().add(nextTrain, "minutes");
	    var nextTrain = moment().add(minAway, "minutes");
	    var nextArrival = moment(nextTrain).format("hh:mm");

	    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));




	    $("tbody").append("<tr>" +
	    						"<td>" + trainName + "</td>" +
	    						"<td>" + destination + "</td>" +
	    						"<td>" + frequency + "</td>" +
	    						"<td>" + firstTrain + "</td>" +
	    						"<td>" + nextArrival + "</td>" +
	    						"<td>" + minAway + "</td>" +

	    				 "</tr>");
    

	    // Change the HTML to reflect new divs added on page.

	    var added = $("<tr>");

	    var nameTrain = $("<td>");
	    nameTrain.text(trainName);
	    added.append(nameTrain);

	    var nameDest = $("<td>");
	    nameDest.text(destination);
	    added.append(nameDest);

	    var trainFreq = $("<td>");
	    trainFreq.text(frequency);
	    added.append(trainFreq);

	    var trainTime = $("<td>");
	    trainTime.text(moment(nextTrain).format("hh:mm"));
	    trainTime.text(nextTrain);
	    added.append(trainTime);

	    var awayMin = $("<td>");
	    awayMin.text(minAway);
	    added.append(awayMin);

	    $("#trainTable").append(added);
	    trainCounter++;

	    return false;

	    // Handle the errors

	}, function(errorObject) {
	    console.log("Errors handled: " + errorObject.code);
	})