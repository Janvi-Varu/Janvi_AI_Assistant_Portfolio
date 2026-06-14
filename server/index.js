require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");
const resumeData = require("./resumeData");

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  express.static(
    path.join(__dirname, "../client/build")
  )
);

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

let questionsLog = [];

const detectCategory = (q) => {
  q = q.toLowerCase();

  if (q.includes("python")) return "Python";
  if (q.includes("project")) return "Projects";
  if (q.includes("skill")) return "Skills";
  if (q.includes("tool")) return "Tools";
  if (
  q.includes("salary") ||
  q.includes("ctc") ||
  q.includes("package") ||
  q.includes("expected salary") ||
  q.includes("salary expectation") ||
  q.includes("compensation")
)
  return "Salary";

  return "Other";
};

app.post("/ask", async (req, res) => {
  try {
    const question = req.body.question;

    const category = detectCategory(question);

    questionsLog.push({
      question,
      category,
      time: new Date(),
    });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "system",
          content: `
You are Janvi Varu's AI Portfolio Assistant.

Answer naturally, professionally, and conversationally.

Use the following information when relevant:

Name: ${resumeData.name}

Skills:
${resumeData.skills.join(", ")}

Projects:
${resumeData.projects.join(", ")}

Tools:
${resumeData.tools.join(", ")} 

Salary:
${resumeData.salary_expectation} 

Experience:
${resumeData.experience}

If the user asks something unrelated to Janvi's portfolio,
answer briefly and steer the conversation back to Janvi's profile.
`
        },

        {
          role: "user",
          content: question
        }
      ],

      temperature: 0.7,
      max_tokens: 500
    });

    const answer =
      completion.choices[0].message.content;

    res.json({
      answer
    });

  } catch (error) {

    console.error("Groq Error:");
    console.error(error);

    res.status(500).json({
      answer: "Error communicating with AI service."
    });
  }
});

app.get("/analytics/summary", (req, res) => {

  const summary = {};

  questionsLog.forEach((q) => {
    summary[q.category] =
      (summary[q.category] || 0) + 1;
  });

  res.json(summary);
});

app.use((req, res) => {
  res.sendFile(
    path.join(__dirname, "../client/build", "index.html")
  );
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});







// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");
// const Groq = require("groq-sdk");
// const resumeData = require("./resumeData");

// const app = express();

// app.use(cors());
// app.use(express.json());

// // Groq setup
// const groq = new Groq(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

// let questionsLog = [];

// // detect category
// const detectCategory = (q) => {
//   q = q.toLowerCase();

//   if (q.includes("python")) return "Python";
//   if (q.includes("project")) return "Projects";
//   if (q.includes("skill")) return "Skills";

//   return "Other";
// };

// // AI Chat Route
// app.post("/ask", async (req, res) => {
//   try {
//     const question = req.body.question.toLowerCase();
//     const category = detectCategory(question);

//     questionsLog.push({
//       question,
//       category,
//       time: new Date()
//     });

//     const prompt = 
//     `You are Janvi Varu's AI portfolio assistant.
//     Answer Professionaly and naturally.
//     Here is Janvi's information:
//     Name: ${resumeData.name}

//     Skills:
//     ${resumeData.skills.join(", ")}
    
//     Projects:
//     ${resumeData.projects.join(", ")}

//     Experience:
//     ${resumeData.experience}
    
//     User Question:
//     ${question}
//     `;

//       const result = await model.generateContent(prompt);
//       const response = result.response.text();
//       res.json({ answer: response });
//   }
//   catch(error){
//     console.log("FULL ERROR:");
//     console.log(error);

//     res.status(500).json({
//       answer: error.message
//     });
//   }
// });

// // analytics summary
// app.get("/analytics/summary", (req, res) => {
//   const summary = {};
//   questionsLog.forEach(q => {
//     summary[q.category] = (summary[q.category] || 0) + 1;
//   });
//   res.json(summary);
// });

// app.listen(5000, () => {
//   console.log("Server running on port 5000")
// });
    
//   // let answer = "Sorry, I didn't understand that.";

//   // if (question.includes("name")) {
//   //   answer = `My name is ${resumeData.name}`;
//   // } 
//   // else if (question.includes("skill")) {
//   //   answer = `My skills are: ${resumeData.skills.join(", ")}`;
//   // } 
//   // else if (question.includes("project")) {
//   //   answer = `My projects include: ${resumeData.projects.join(", ")}`;
//   // } 
//   // else if (question.includes("experience")) {
//   //   answer = `I have experience as: ${resumeData.experience}`;
//   // }

//   // res.json({ answer });
// // });

// // AI route
// // app.post("/ask", async (req, res) => {
// //   const question = req.body.question;

// //   const category = detectCategory(question);

// //   questionsLog.push({
// //     question,
// //     category,
// //     time: new Date()
// //   });

//   // const response = await client.chat.completions.create({
//   //   model: "gpt-4.1",
//   //   messages: [
//   //     {
//   //       role: "system",
//   //       content: `Answer as Janvi based on: ${JSON.stringify(resumeData)}`
//   //     },
//   //     {
//   //       role: "user",
//   //       content: question
//   //     }
//   //   ]
//   // });

// //   res.json({
// //     answer: response.choices[0].message.content
// //   });
// // });

// // analytics summary
// // app.get("/analytics/summary", (req, res) => {
// //   const summary = {};
// //   questionsLog.forEach(q => {
// //     summary[q.category] = (summary[q.category] || 0) + 1;
// //   });
// //   res.json(summary);
// // });

// // app.listen(5000, () => console.log("Server running on port 5000"));