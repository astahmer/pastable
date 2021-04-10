import { exec } from "child_process";

export const openFileInBrowser = (filePath: string) => {
    const start = process.platform == "darwin" ? "open" : process.platform == "win32" ? "start" : "xdg-open";

    console.log({ start, filePath });
    exec(`${start} ${filePath}`);
};

const isCLI = require.main === module || !module.parent;
if (isCLI) {
    openFileInBrowser(process.argv[3]);
}
