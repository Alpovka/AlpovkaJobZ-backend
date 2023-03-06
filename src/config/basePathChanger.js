const basePathChanger = () => {
    if (process.env.NODE_ENV === "production") {
        return "https://alpovka.github.io"
    } else {
        return "http://localhost:3000"
    }
}

module.exports = basePathChanger
