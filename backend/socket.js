let io;

function init(serverIo) {
    io = serverIo;
}

function getIo() {
    return io;
}

module.exports = {
    init,
    getIo
};