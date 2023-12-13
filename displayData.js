// Import statements for Firebase and necessary functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getFirestore, collection, getDocs, deleteDoc, doc, query, where } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4mxtvbmVphOENTioDTKZeX_eAvGvKwM8",
  authDomain: "studentactivitymanager.firebaseapp.com",
  projectId: "studentactivitymanager",
  storageBucket: "studentactivitymanager.appspot.com",
  messagingSenderId: "767731082866",
  appId: "1:767731082866:web:303ab0668833944c5344eb",
  measurementId: "G-FSHZX6SQFD"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to populate the data in the respective columns based on the selected class
async function populateData(selectedClass) {
  const fileList = document.getElementById('filesList');
  const eventList = document.getElementById('eventsList');
  const gradesList = document.getElementById('gradesList');

  clearElement(fileList);
  clearElement(eventList);
  clearElement(gradesList);

  let filesQuery;
  let eventsQuery;
  let gradesQuery;

  if (selectedClass === 'all') {
    // Fetch all files data from Firestore
    filesQuery = collection(db, 'files');
    // Fetch all events data from Firestore
    eventsQuery = collection(db, 'events');
    // Fetch all grades data from Firestore
    gradesQuery = collection(db, 'grades');
  } else {
    // Fetch files data from Firestore based on the selected class
    filesQuery = query(collection(db, 'files'), where('class', '==', selectedClass));
    // Fetch events data from Firestore based on the selected class
    eventsQuery = query(collection(db, 'events'), where('class', '==', selectedClass));
    // Fetch grades data from Firestore based on the selected class
    gradesQuery = query(collection(db, 'grades'), where('class', '==', selectedClass));
  }

  // Fetch and display files data
  await displayData(filesQuery, fileList, 'files');

  // Fetch and display events data
  await displayData(eventsQuery, eventList, 'events');

  // Fetch and display grades data
  await displayData(gradesQuery, gradesList, 'grades');
}

// Function to display data for a specific query
async function displayData(dataQuery, targetElement, collectionName) {
  const dataSnapshot = await getDocs(dataQuery);
  dataSnapshot.forEach((doc) => {
    const data = doc.data();
    const listItem = createListItem(
      `${data.fileName || data.eventName || data.studentName} (${data.class})`,
      `${data.timestamp || data.eventDate || `Roll Number: ${data.rollNumber}, Grade: ${data.gradeMarks}`}`,
      data.downloadURL,
      collectionName,
      doc.id // Document ID for deletion
    );
    targetElement.appendChild(listItem);
  });
}

// Helper function to create list items
function createListItem(title, details, linkURL = null, collectionName, docId) {
  const listItem = document.createElement('li');

  // Add a checkbox for selection
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.dataset.collection = collectionName;
  checkbox.dataset.docId = docId;
  listItem.appendChild(checkbox);

  const titleElement = document.createElement('strong');
  titleElement.textContent = title;

  const detailsElement = document.createElement('p');
  detailsElement.textContent = details;

  listItem.appendChild(titleElement);
  listItem.appendChild(detailsElement);

  if (linkURL) {
    const link = document.createElement('a');
    link.href = linkURL;
    link.textContent = 'Download';
    listItem.appendChild(link);
  }

  return listItem;
}

// Function to handle deletion of selected documents
async function handleDeleteSelected() {
  const selectedItems = document.querySelectorAll('input[type="checkbox"]:checked');
  const promises = [];

  selectedItems.forEach((item) => {
    const collectionName = item.dataset.collection;
    const docId = item.dataset.docId;
    promises.push(deleteDoc(doc(db, collectionName, docId)));
  });

  try {
    await Promise.all(promises);
    console.log('Selected documents deleted successfully');
    // Refresh data after deletion
    const selectedClass = document.getElementById('classFilter').value;
    await populateData(selectedClass);
  } catch (error) {
    console.error('Error deleting selected documents:', error);
  }
}

// Function to filter data based on the selected class
async function filterData() {
  const selectedClass = document.getElementById('classFilter').value;

  try {
    // Use await to ensure that populateData completes before proceeding
    await populateData(selectedClass);
    console.log("Data filtered and loaded successfully");
  } catch (error) {
    console.error("Error filtering and loading data:", error);
  }
}

// Helper function to clear child elements of an element
function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

// Populate the data when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('classFilter').addEventListener('change', filterData);

  // Add a "Delete Selected" button
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete Selected';
  deleteButton.addEventListener('click', handleDeleteSelected);
  document.body.appendChild(deleteButton);

  populateData('all') // Assuming 'all' is the default value
    .then(() => {
      console.log("Data loaded successfully");
    })
    .catch((error) => {
      console.error("Error loading data:", error);
    });
});
