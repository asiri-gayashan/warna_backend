import express from "express";


const router = express.Router();

// Example route
router.get("/", (req, res) => {
  res.json({ message: "Hellow world" });
});

router.post("/", (req, res) => {
    res.json({ message: "User created" });
});


router.put("/", (req, res) => {
    res.json({ message: "User updated" });
});

router.delete("/", (req, res) => {
    res.json({ message: "User deleted" });
});




export default router;




