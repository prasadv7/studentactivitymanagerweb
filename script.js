// script.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-storage.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD4mxtvbmVphOENTioDTKZeX_eAvGvKwM8",
  authDomain: "studentactivitymanager.firebaseapp.com",
  projectId: "studentactivitymanager",
  storageBucket: "studentactivitymanager.appspot.com",
  messagingSenderId: "767731082866",
  appId: "1:767731082866:web:303ab0668833944c5344eb",
  measurementId: "G-FSHZX6SQFD"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

console.log("Initialized successfully");

document.addEventListener('DOMContentLoaded', () => {
  const uploadButton = document.getElementById('uploadButton');
  const eventForm = document.getElementById('eventForm');
  const gradesForm = document.getElementById('gradesForm');
  const eventMessage = document.getElementById('eventMessage');
  const gradesMessage = document.getElementById('gradesMessage');
  const fileMessage = document.getElementById('fileMessage');
  const selectedClassInput = document.getElementById('classSelector'); // Updated ID
  const selectedClassGradesInput = document.getElementById('classSelectorGrades');

  uploadButton.addEventListener('click', () => {
    const selectedClass = selectedClassInput.value;
    uploadFile(selectedClass)
      .then(() => {
        // Success
        fileMessage.textContent = "File uploaded successfully!";
        fileMessage.classList.remove('error');
        fileMessage.classList.add('success');
        setTimeout(() => {
          fileMessage.textContent = "";
          fileMessage.classList.remove('success');
        }, 3000);
      })
      .catch((error) => {
        // Error
        fileMessage.textContent = `Error: ${error.message}`;
        fileMessage.classList.remove('success');
        fileMessage.classList.add('error');
        setTimeout(() => {
          fileMessage.textContent = "";
          fileMessage.classList.remove('error');
        }, 3000);
      });
  });

  eventForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const selectedClass = selectedClassInput.value;
    submitEventForm(selectedClass)
      .then(() => {
        // Success
        eventMessage.textContent = "Event details added successfully!";
        eventMessage.classList.remove('error');
        eventMessage.classList.add('success');
        setTimeout(() => {
          eventMessage.textContent = "";
          eventMessage.classList.remove('success');
        }, 3000);
      })
      .catch((error) => {
        // Error
        eventMessage.textContent = `Error: ${error.message}`;
        eventMessage.classList.remove('success');
        eventMessage.classList.add('error');
        setTimeout(() => {
          eventMessage.textContent = "";
          eventMessage.classList.remove('error');
        }, 3000);
      });
  });

  gradesForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const selectedClass = selectedClassInput.value;
    submitGradesForm(selectedClass)
      .then(() => {
        // Success
        gradesMessage.textContent = "Grades added successfully!";
        gradesMessage.classList.remove('error');
        gradesMessage.classList.add('success');
        setTimeout(() => {
          gradesMessage.textContent = "";
          gradesMessage.classList.remove('success');
        }, 3000);
      })
      .catch((error) => {
        // Error
        gradesMessage.textContent = `Error: ${error.message}`;
        gradesMessage.classList.remove('success');
        gradesMessage.classList.add('error');
        setTimeout(() => {
          gradesMessage.textContent = "";
          gradesMessage.classList.remove('error');
        }, 3000);
      });
  });
});

function uploadFile(selectedClass) {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  if (file) {
    const storageRef = ref(storage, `uploads/${file.name}`);

    return uploadBytes(storageRef, file)
      .then(() => {
        console.log('File uploaded successfully!');
        return getDownloadURL(storageRef);
      })
      .then((downloadURL) => {
        console.log('File available at', downloadURL);
      })
      .catch((error) => {
        console.error('Error:', error);
        throw error;
      });
  } else {
    console.error('No file selected');
    return Promise.reject(new Error('No file selected'));
  }
}

function submitEventForm(selectedClass) {
  console.log("Selected Class:", selectedClass); // Add this line for debugging

  const eventName = document.getElementById('eventName').value;
  const eventDate = document.getElementById('eventDate').value;
  const eventDetails = document.getElementById('eventDetails').value;

  if (selectedClass) {
    return addDoc(collection(db, `events/`), {
      eventName: eventName,
      eventDate: eventDate,
      eventDetails: eventDetails,
      class: selectedClass
    })
      .then(() => {
        console.log("Event details added to Firestore");
      })
      .catch((error) => {
        console.error("Error adding event details document: ", error);
        throw error;
      });
  } else {
    console.error("Selected class is undefined or null");
    return Promise.reject(new Error("Selected class is undefined or null"));
  }
}

function submitGradesForm(selectedClass) {
  const studentName = document.getElementById('studentName').value;
  const rollNumber = document.getElementById('rollNumber').value;
  const gradeMarks = document.getElementById('gradeMarks').value;

  return addDoc(collection(db, `grades/`), {
    studentName: studentName,
    rollNumber: rollNumber,
    gradeMarks: gradeMarks,
    class: selectedClass
  })
    .then(() => {
      console.log("Grades added to Firestore");
    })
    .catch((error) => {
      console.error("Error adding grades document: ", error);
      throw error;
    });
}
