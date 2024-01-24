const express = require("express");
const app = express();
const path = require("path");
const { name } = require("ejs");
const { v4: uuid } = require("uuid");
const methodOverride = require("method-override");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"))

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"))

// Improvised database
let comments = [
    {
        id: uuid(),
        username: "Todd",
        comment: "Bruh kek"
    },
    {
        id: uuid(),
        username: "Skyler",
        comment: "YO YO YO Yo"
    },
    {
        id: uuid(),
        username: "Heizenberg",
        comment: "I'M THE DANGER!"
    },
    {
        id: uuid(),
        username: "Pinkman",
        comment: "YEah Bit*h"
    }
];

app.get("/comments", (req, res) => {
    res.render("comments/index", { comments })
});

app.get("/comments/new", (req, res) => {
    res.render("comments/new")
});

app.post("/comments", (req, res) => {
    const { username, comment } = req.body;
    comments.push({ username, comment, id: uuid() });
    res.redirect("/comments")
});

app.get("/comments/:id", (req, res) => {
    const { id } = req.params;
    const foundComment = comments.find(x => x.id === id);

    if (foundComment) {
        res.render("comments/show", { foundComment });
    } else {
        res.status(404).send("Comment not found");
    }
});

app.get("/comments/:id/edit", (req, res)=>{
    const { id } = req.params;
    const foundComment = comments.find(x => x.id === id);
    if (foundComment) {
        res.render("comments/edit", {foundComment})
    } else {
        res.status(404).send("Comment not found");
    }
});

app.patch("/comments/:id", (req, res) => {
    const { id } = req.params;
    const newCommentTest = req.body.comment;
    const foundComment = comments.find(x => x.id === id);

    if (foundComment) {
        foundComment.comment = newCommentTest;
        res.redirect("/comments")
    } else {
        res.status(404).send("Comment not found");
    }
});

app.delete("/comments/:id", (req, res)=>{
    const { id } = req.params;
    const filteredComment = comments.filter(x => x.id !== id);
    if (filteredComment) {
        comments = filteredComment;
        res.redirect("/comments");
    } else {
        res.status(404).send("Comment not found");
    }
})

app.listen(3000, () => {
    console.log("server started, port: 3000");
});

// name      path              verb      purpose
// Index    /commnets           Get     Display all comments
// New      /commnets/new       Get     Form to create new comment
// Creat    /commnets           POST    Create new comment on server
// Show     /commnets/:id       Get     Details for one specific comment
// Edit     /commnets/:id/edit  Get     Form to edit specific comment
// Update   /commnets/:id       PATCH   Updates specific comment on server
// Destroy  /commnets/:id       DELETE  Deletes specific item on server
