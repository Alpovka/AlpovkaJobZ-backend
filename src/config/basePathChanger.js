const basePathChangerForServer = () => {
    if (process.env.NODE_ENV === "production") {
        return process.env.LIVE_URL
    } else {
        return "http://localhost:8000"
    }
}



const basePathChangerForFront = () => {
    if (process.env.NODE_ENV === "production") {
        return "https://alpovka.github.io"
    } else {
        return "http://localhost:3000"
    }
}

module.exports = {
    basePathChangerForServer,
    basePathChangerForFront
}
