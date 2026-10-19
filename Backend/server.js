require("dotenv").config()
const app = require("./src/app")
// connectToDB is already handled during app initialization


// run server
app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})