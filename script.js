// ==========================================
// STUDENT MANAGEMENT SYSTEM
// BOU DCSA PROJECT
// ==========================================


// Get saved database from Local Storage
let studentDatabase =
  JSON.parse(localStorage.getItem("studentDatabase")) || [
    {
      student_id: "2415082008",
      name: "Balay Karmaker",
      email: "balaykarmokar12@gmail.com",
      password: "123",
      program: "DCSA",
      gpa: "3.85"
    }
  ];


// ==========================================
// SAVE DATABASE
// ==========================================

function saveToDatabase() {
  localStorage.setItem(
    "studentDatabase",
    JSON.stringify(studentDatabase)
  );
}


// ==========================================
// RENDER STUDENT TABLE
// ==========================================

function renderTable(searchText = "") {

  const tbody = document.getElementById("studentTableBody");
  const emptyMessage = document.getElementById("emptyMessage");

  tbody.innerHTML = "";

  const search = searchText.toLowerCase().trim();

  const filteredStudents = studentDatabase.filter(student => {

    return (
      student.student_id.toLowerCase().includes(search) ||
      student.name.toLowerCase().includes(search) ||
      student.email.toLowerCase().includes(search) ||
      student.program.toLowerCase().includes(search)
    );

  });


  if (filteredStudents.length === 0) {

    emptyMessage.classList.remove("hidden");

    return;

  } else {

    emptyMessage.classList.add("hidden");

  }


  filteredStudents.forEach(student => {

    const row = document.createElement("tr");


    row.innerHTML = `
      <td class="font-mono">
        ${escapeHTML(student.student_id)}
      </td>

      <td class="font-bold">
        ${escapeHTML(student.name)}
      </td>

      <td>
        ${escapeHTML(student.email)}
      </td>

      <td>
        ${escapeHTML(student.program)}
      </td>

      <td>
        ${escapeHTML(student.gpa || "N/A")}
      </td>

      <td>
        <button
          class="delete-btn"
          type="button"
          onclick="deleteStudent('${encodeURIComponent(student.student_id)}')">
          Delete
        </button>
      </td>
    `;


    tbody.appendChild(row);

  });

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

  const div = document.createElement("div");

  div.textContent = value ?? "";

  return div.innerHTML;
}


// ==========================================
// TAB SWITCH
// ==========================================

function switchTab(tab) {

  const registerBtn =
    document.getElementById("tabRegisterBtn");

  const loginBtn =
    document.getElementById("tabLoginBtn");

  const registerSection =
    document.getElementById("registerSection");

  const loginSection =
    document.getElementById("loginSection");


  if (tab === "register") {

    registerBtn.classList.add("active");
    loginBtn.classList.remove("active");

    registerSection.classList.add("active-section");
    loginSection.classList.remove("active-section");

  } else {

    loginBtn.classList.add("active");
    registerBtn.classList.remove("active");

    loginSection.classList.add("active-section");
    registerSection.classList.remove("active-section");

  }

}


// ==========================================
// REGISTER STUDENT
// ==========================================

document
  .getElementById("studentForm")
  .addEventListener("submit", function (event) {

    event.preventDefault();


    const student_id =
      document.getElementById("student_id").value.trim();

    const name =
      document.getElementById("name").value.trim();

    const email =
      document.getElementById("email").value.trim().toLowerCase();

    const password =
      document.getElementById("password").value;

    const program =
      document.getElementById("program").value.trim();

    const gpa =
      document.getElementById("gpa").value.trim() || "N/A";


    // GPA validation
    if (gpa !== "N/A") {

      const numericGPA = Number(gpa);

      if (numericGPA < 0 || numericGPA > 4) {

        alert("GPA must be between 0.00 and 4.00.");

        return;
      }

    }


    // Duplicate check
    const exists = studentDatabase.some(student =>

      student.student_id.toLowerCase() ===
        student_id.toLowerCase()

      ||

      student.email.toLowerCase() ===
        email.toLowerCase()

    );


    if (exists) {

      alert(
        "Student ID or Email is already registered!"
      );

      return;

    }


    // Create new student
    const newStudent = {

      student_id: student_id,

      name: name,

      email: email,

      password: password,

      program: program,

      gpa: gpa

    };


    // Add student
    studentDatabase.unshift(newStudent);


    // Save
    saveToDatabase();


    // Update table
    renderTable();


    // Reset form
    document.getElementById("studentForm").reset();

    document.getElementById("program").value = "DCSA";


    alert(
      "Student registered successfully!"
    );

  });


// ==========================================
// STUDENT LOGIN
// ==========================================

document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {

    event.preventDefault();


    const loginId =
      document.getElementById("login_id").value.trim();

    const loginPassword =
      document.getElementById("login_password").value;


    const foundStudent = studentDatabase.find(student => {

      const idMatch =
        student.student_id.toLowerCase() ===
        loginId.toLowerCase();

      const emailMatch =
        student.email.toLowerCase() ===
        loginId.toLowerCase();

      return (
        (idMatch || emailMatch) &&
        student.password === loginPassword
      );

    });


    if (foundStudent) {

      // Show profile information
      document.getElementById("profId").textContent =
        foundStudent.student_id;

      document.getElementById("profName").textContent =
        foundStudent.name;

      document.getElementById("profEmail").textContent =
        foundStudent.email;

      document.getElementById("profProgram").textContent =
        foundStudent.program;

      document.getElementById("profGpa").textContent =
        foundStudent.gpa;


      // Hide login form
      document
        .getElementById("loginForm")
        .classList.add("hidden");


      // Show profile
      document
        .getElementById("loginProfileCard")
        .classList.remove("hidden");


      alert("Login Successful!");

    } else {

      alert(
        "Invalid Student ID / Email or Password!"
      );

    }

  });


// ==========================================
// LOGOUT
// ==========================================

function logoutStudent() {

  document
    .getElementById("loginForm")
    .reset();


  document
    .getElementById("loginForm")
    .classList.remove("hidden");


  document
    .getElementById("loginProfileCard")
    .classList.add("hidden");

}


// ==========================================
// DELETE STUDENT
// ==========================================

function deleteStudent(encodedId) {

  const studentId =
    decodeURIComponent(encodedId);


  const student =
    studentDatabase.find(
      s => s.student_id === studentId
    );


  if (!student) {

    alert("Student not found.");

    return;

  }


  const confirmDelete = confirm(
    "Are you sure you want to delete this student?"
  );


  if (!confirmDelete) {

    return;

  }


  studentDatabase =
    studentDatabase.filter(
      s => s.student_id !== studentId
    );


  saveToDatabase();

  renderTable();

  alert("Student deleted successfully!");

}


// ==========================================
// SEARCH STUDENT
// ==========================================

document
  .getElementById("searchInput")
  .addEventListener("input", function () {

    renderTable(this.value);

  });


// ==========================================
// INITIAL TABLE LOAD
// ==========================================

renderTable();
