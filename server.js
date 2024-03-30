const app = require("./src/app");
const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
    console.log(`WSV eCommit start with ${PORT}`);
});
// command C
// process.on("SIGINT", () => {
//     server.close(() => console.log(`\nExit server express`));
//     // app.notify.send(....)
// })