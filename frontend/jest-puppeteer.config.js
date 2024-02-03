module.exports = {
    launch: {
        defaultViewport: {
            width: 1680,
            height: 1000,
        },
        headless: "new",
        // chrome sandbox does not work inside container
        args: ["--no-sandbox"],
    },
};
