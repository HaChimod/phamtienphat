const express = require("express");
const app = express();
const cors = require("cors");
const dbConnect = require("./db/dbConnect");
const path = require("path");

dbConnect();

const requireLogin = require("./routes/requireLogin");
const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");
const adminRoute = require("./routes/admin");
const UploadPhotoRouter = require("./routes/UploadPhotoRouter");

app.use("/images", express.static(path.join(__dirname, "images")));

app.use(
  cors({
    origin: "https://6zj2pc-3000.csb.app",
    credentials: true, // vẫn để true, không ảnh hưởng
  })
);

app.use(express.json());

app.use("/admin", adminRoute);
// app.use(requireLogin);
app.use("/user", UserRouter);
app.use("/photo", PhotoRouter);
app.use("/photos", UploadPhotoRouter);
app.get("/", (request, response) => {
  response.send({ message: "Hello from photo-sharing app API!" });
});

app.listen(8081, () => {
  console.log("server listening on port 8081");
});
