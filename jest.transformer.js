function process(src, path, config, transformOptions) {
    src = src.replace(/(@[A-Z]\w+)/g, "//$1");
    return {code:src};
}
exports.process = process;