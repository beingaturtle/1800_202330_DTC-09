var parkingLotDocID = localStorage.getItem("parkingLotDocID"); //visible to all functions on this page

// Select Time
function generateHoursOptions() {
  const selectElement = document.getElementById("hoursSelect");

  const startTime = new Date();
  startTime.setHours(0, 0, 0, 0); // Set to midnight

  for (let i = 0; i < 96; i++) {
    // 96 intervals for 24 hours
    const currentTime = new Date(startTime.getTime() + i * 15 * 60 * 1000);
    const hours = currentTime.getHours().toString().padStart(2, "0");
    const minutes = currentTime.getMinutes().toString().padStart(2, "0");
    const timeValue = `${hours}:${minutes}`;
    const displayValue = `${hours}:${minutes}`;

    const optionElement = document.createElement("option");
    optionElement.value = timeValue;
    optionElement.textContent = displayValue;

    selectElement.appendChild(optionElement);
  }
}

// Call the function to generate time options
generateHoursOptions();

function displayParkingName() {
    let params = new URL(window.location.href); //get URL of search bar
    let ID = params.searchParams.get("docID"); //get value for key "id"
    console.log(ID);

    db.collection("parkingLots")        // This looks at parkingLots database to pull parking lot name
        .doc(ID)
        .get()
        .then(doc => {      // Assign variables to collection data
            thisLot = doc.data();
            parkingCode = thisLot.code;
            parkingLotName = doc.data().name;

            // Populate Title, image, and other details
            document.getElementById("parkingLotName").innerHTML = parkingLotName;
        });
}

displayParkingName();

function provideReserveDetails() {
  console.log("inside fill out reserve details");
  let dateSelect = document.getElementById("dateInput").value;
  let reserveStartTime = document.getElementById("startTime").value;
  let duration = document.getElementById("hoursSelect").value;

  console.log(dateSelect, reserveStartTime, duration);

  var user = firebase.auth().currentUser;
  if (user) {
    var currentUser = db.collection("users").doc(user.uid);
    var userID = user.uid;

    // Get the document for the current user.
    db.collection("reserve_details")
      .add({
        parkingLotDocID: parkingLotDocID,
        userID: userID,
        date: dateSelect,
        start: reserveStartTime,
        duration: duration,

        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        window.location.href = "thanks.html"; // Redirect to the thanks page
      });
  } else {
    console.log("No user is signed in");
    window.location.href = "reserve.html";
  }
}


