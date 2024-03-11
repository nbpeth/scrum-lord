const file = require("fs");

const open = (path) =>
  file
    .readdirSync(path, { withFileTypes: true })
    .filter((i) => ! [".git", "node_modules", ".DS_Store"].includes(i.name));
const validFile = (i) =>
  ["jsx", "js", "sql", "yaml"].includes(i.name.split(".").pop()) ||
  i.isDirectory();
const run = () => {
  const count = (item, results) => {
    if (!item) return results;
    if (Array.isArray(item)) {
      item.filter(validFile).forEach((i) => count(i, results));
    } else if (item.isDirectory()) {
      open(item.path + "/" + item.name).forEach((i) => count(i, results));
    } else if (validFile(item)) {
      const lineCount = file
        .readFileSync(item.path + "/" + item.name)
        .toString()
        .split("\n").length;
      count(null, results.push({ name: item.name, lineCount }));
    }
    return results;
  };
  const result = count(open("./"), []).reduce((res, next) => (res += next.lineCount),0);
  console.log(result);
};

module.exports = { run };
