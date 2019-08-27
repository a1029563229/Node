class App {
    listen(port) {
        console.log(`server is listen in ${port}`);
    }
}

const app = new App();
app.listen(3000);