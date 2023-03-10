const basePathChangerForServer = () => {
    if (process.env.NODE_ENV === "production") {
        return `http://ec2-${process.env.PUBLIC_IP.replaceAll(".", "-")}.eu-north-1.compute.amazonaws.com`
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
