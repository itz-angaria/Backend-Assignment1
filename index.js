const express = require('express');
const app = express();
const storage = require('node-persist');
const bodyParser = require('body-parser');

storage.init();
const jsonParser = bodyParser.json();


// Add new student in Database 
app.post('/newStudent', jsonParser, async (req, res) => {
  const { student_id, student_name, gpa } = req.body;
  await storage.setItem(student_id, { student_id, student_name, gpa });
  res.send("Added Student!");
});


// For retrieve all students data
app.get("/allStudents", async (req, res) => {
  const allStudents = await storage.values();
  let studentData = `<h1>All Students Data</h1>`;
  allStudents.forEach((student) => {
    studentData += `
      <h3>Student id: ${student.student_id}</h3>
      <h3>Name: ${student.student_name}</h3>
      <h3>GPA: ${student.gpa}</h3>
      <br>`;
  });
  res.send(studentData);
});


// For particular student data by id
app.get("/student/:student_id", async (req, res) => {
    const student_id = req.params.student_id;
    const student = await storage.getItem(student_id);
    if (student) {
      const { student_name, gpa } = student;
      res.send(`
        <h1>Student Detail</h1>
        <h3>Student ID: ${student_id}</h3>
        <h3>Name: ${student_name}</h3>
        <h3>GPA: ${gpa}</h3>
      `);
    } else {
      res.send(`<h1>Student Not Found!</h1>`);
    }
  });


  // For topper student data
  app.get("/topper", async (req, res) => {
    const allStudents = await storage.values();

    let topperStudent = null;
    let highestGPA = -1;

    allStudents.forEach((student) => {
        if (student.gpa > highestGPA) {
          highestGPA = student.gpa;
          topperStudent = student;
        }
    });

    if (topperStudent) {
        const { student_id, student_name, gpa } = topperStudent;
        res.send(`
          <h1>Topper student data</h1>
          <h3>Student ID: ${student_id}</h3>
          <h3>Name: ${student_name}</h3>
          <h3>GPA: ${gpa}</h3>
        `);
      } else {
        res.send("No students found");
      }
    });

app.listen(5000, () => {
  console.log("Server has started!");
});
