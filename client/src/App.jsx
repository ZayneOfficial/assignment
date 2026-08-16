import React, { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API
});

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const [mode, setMode] = useState("login");
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const [form, setForm] = useState({
    name: "",
    grade: "8",
    password: ""
  });

  const [title, setTitle] = useState("");
  const [grade, setGrade] = useState("8");

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correct, setCorrect] = useState("A");
  const [questions, setQuestions] = useState([]);

  const auth = () => ({
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  // Load assignments
  const loadAssignments = async () => {
    try {
      const response = await api.get("/assignments", auth());
      setAssignments(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Load student submissions for admin
  const loadSubmissions = async () => {
    try {
      const response = await api.get("/submissions/all", auth());
      setSubmissions(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (token) {
      loadAssignments();

      if (user?.role === "admin") {
        loadSubmissions();
      }
    }
  }, [token]);

  // Login / Register
  const submitAuth = async (e) => {
    e.preventDefault();

    try {
      if (mode === "register") {
        await api.post("/auth/register", {
          ...form,
          grade: Number(form.grade)
        });

        alert("Registration successful. Please login.");
        setMode("login");
      } else {
        const response = await api.post("/auth/login", form);

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        setToken(response.data.token);
        setUser(response.data.user);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  // Logout
  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  // Add question
  const addQuestion = () => {
    if (!question.trim()) {
      alert("Enter a question.");
      return;
    }

    if (options.some((option) => !option.trim())) {
      alert("Please enter all four options.");
      return;
    }

    setQuestions([
      ...questions,
      {
        text: question,
        options: options,
        correctAnswer: correct
      }
    ]);

    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrect("A");
  };

  // Create assignment
  const createAssignment = async (publish = false) => {
    if (!title.trim()) {
      alert("Enter an assignment title.");
      return;
    }

    if (questions.length === 0) {
      alert("Add at least one question.");
      return;
    }

    try {
      await api.post(
        "/assignments",
        {
          title,
          grade: Number(grade),
          questions,
          published: publish,
          timeLimit: 30
        },
        auth()
      );

      alert(publish ? "Assignment published!" : "Assignment saved!");

      setTitle("");
      setQuestions([]);

      loadAssignments();
    } catch (error) {
      alert(error.response?.data?.message || "Could not create assignment");
    }
  };

  // Start assignment
  const takeAssignment = async (id) => {
    try {
      const response = await api.get(`/assignments/${id}`, auth());

      setSelected(response.data);
      setAnswers({});
      setResult(null);
    } catch (error) {
      alert(error.response?.data?.message || "Could not open assignment");
    }
  };

  // Submit assignment
  const submitAssignment = async () => {
    if (!selected) return;

    try {
      const response = await api.post(
        `/submissions/${selected._id}`,
        {
          answers
        },
        auth()
      );

      setResult(response.data);
    } catch (error) {
      alert(error.response?.data?.message || "Could not submit assignment");
    }
  };

  // Login page
  if (!token) {
    return (
      <main className="card">
        <h1>ZayneTutor Maths</h1>

        <p>Simple Assignment Management System</p>

        <form onSubmit={submitAuth}>
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value
              })
            }
          />

          {mode === "register" && (
            <input
              placeholder="Grade"
              value={form.grade}
              onChange={(e) =>
                setForm({
                  ...form,
                  grade: e.target.value
                })
              }
            />
          )}

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value
              })
            }
          />

          <button>
            {mode === "login" ? "Login" : "Register"}
          </button>
        </form>

        <button
          className="link"
          onClick={() =>
            setMode(mode === "login" ? "register" : "login")
          }
        >
          {mode === "login"
            ? "Create student account"
            : "Back to login"}
        </button>
      </main>
    );
  }

  // Quiz page
  if (selected) {
    return (
      <main>
        <button onClick={() => setSelected(null)}>
          ← Back
        </button>

        <div className="card">
          <h1>{selected.title}</h1>

          <p>{selected.description}</p>

          {result ? (
            <div className="result">
              <h2>Assignment Submitted</h2>

              <h1>
                {result.score} / {result.total}
              </h1>

              <h2>{result.percentage}%</h2>

              <button onClick={() => setSelected(null)}>
                Back to Assignments
              </button>
            </div>
          ) : (
            <>
              {selected.questions.map((q, index) => (
                <div className="question" key={index}>
                  <h3>
                    {index + 1}. {q.text}
                  </h3>

                  {q.options.map((option, optionIndex) => {
                    const letter = "ABCD"[optionIndex];

                    return (
                      <label key={letter}>
                        <input
                          type="radio"
                          name={`question-${index}`}
                          onChange={() =>
                            setAnswers({
                              ...answers,
                              [index]: letter
                            })
                          }
                        />

                        {letter}. {option}
                      </label>
                    );
                  })}
                </div>
              ))}

              <button onClick={submitAssignment}>
                Submit Assignment
              </button>
            </>
          )}
        </div>
      </main>
    );
  }

  // Main dashboard
  return (
    <main>
      <header>
        <div>
          <h1>ZayneTutor Maths</h1>

          <span>
            {user.name} • Grade {user.grade} • {user.role}
          </span>
        </div>

        <button onClick={logout}>Logout</button>
      </header>

      {/* ADMIN */}
      {user.role === "admin" ? (
        <>
          <div className="card">
            <h2>Create Assignment</h2>

            <input
              placeholder="Assignment title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              placeholder="Grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
            />

            <h3>Add Question</h3>

            <textarea
              placeholder="Question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />

            {options.map((option, index) => (
              <input
                key={index}
                placeholder={`Option ${"ABCD"[index]}`}
                value={option}
                onChange={(e) => {
                  const newOptions = [...options];

                  newOptions[index] = e.target.value;

                  setOptions(newOptions);
                }}
              />
            ))}

            <select
              value={correct}
              onChange={(e) => setCorrect(e.target.value)}
            >
              <option value="A">Correct answer: A</option>
              <option value="B">Correct answer: B</option>
              <option value="C">Correct answer: C</option>
              <option value="D">Correct answer: D</option>
            </select>

            <button onClick={addQuestion}>
              Add Question
            </button>

            <p>
              Questions added: <b>{questions.length}</b>
            </p>

            {questions.map((q, index) => (
              <div className="preview" key={index}>
                <b>
                  {index + 1}. {q.text}
                </b>

                <p>
                  A. {q.options[0]}
                  <br />
                  B. {q.options[1]}
                  <br />
                  C. {q.options[2]}
                  <br />
                  D. {q.options[3]}
                </p>

                <small>
                  Correct answer: {q.correctAnswer}
                </small>
              </div>
            ))}

            <button onClick={() => createAssignment(true)}>
              Publish Assignment
            </button>

            <button onClick={() => createAssignment(false)}>
              Save Draft
            </button>
          </div>

          {/* ASSIGNMENTS */}
          <div className="card">
            <h2>Assignments</h2>

            {assignments.length === 0 ? (
              <p>No assignments yet.</p>
            ) : (
              assignments.map((assignment) => (
                <div className="item" key={assignment._id}>
                  <div>
                    <b>{assignment.title}</b>

                    <br />

                    Grade {assignment.grade}

                    <br />

                    Status:{" "}
                    {assignment.published
                      ? "Published"
                      : "Draft"}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* SUBMISSIONS */}
          <div className="card">
            <div className="section-header">
              <h2>Student Submissions</h2>

              <button onClick={loadSubmissions}>
                Refresh
              </button>
            </div>

            {submissions.length === 0 ? (
              <p>
                No student submissions yet.
              </p>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Grade</th>
                      <th>Assignment</th>
                      <th>Score</th>
                      <th>Percentage</th>
                      <th>Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {submissions.map((submission) => (
                      <tr key={submission._id}>
                        <td>
                          {submission.student?.name ||
                            "Unknown"}
                        </td>

                        <td>
                          {submission.student?.grade ||
                            "-"}
                        </td>

                        <td>
                          {submission.assignment?.title ||
                            "Unknown"}
                        </td>

                        <td>
                          {submission.score}/
                          {submission.total}
                        </td>

                        <td>
                          <b>
                            {submission.percentage}%
                          </b>
                        </td>

                        <td>
                          {new Date(
                            submission.createdAt
                          ).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        /* STUDENT */
        <>
          <h2>Available Assignments</h2>

          {assignments.length === 0 ? (
            <p>No assignments available.</p>
          ) : (
            assignments.map((assignment) => (
              <div
                className="item"
                key={assignment._id}
              >
                <div>
                  <b>{assignment.title}</b>

                  <br />

                  Grade {assignment.grade}
                </div>

                <button
                  onClick={() =>
                    takeAssignment(assignment._id)
                  }
                >
                  Start
                </button>
              </div>
            ))
          )}
        </>
      )}
    </main>
  );
}

export default App;