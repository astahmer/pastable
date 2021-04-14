import path from "path";

import { openFileInBrowser } from "./openFileInBrowser";

const packagesRootPath = path.resolve("../");
const coverageReportPath = "./coverage/lcov-report/index.html";
const lastPart = process.env.INIT_CWD.split("/").slice(-1)[0];
const currentPackage = ["packages", "pastable"].includes(lastPart) ? "" : lastPart;
const rootPath = lastPart === "pastable" ? process.env.INIT_CWD : packagesRootPath;
const filePath = path.resolve(rootPath, currentPackage, coverageReportPath);

if (currentPackage || lastPart === "pastable") {
    openFileInBrowser(filePath);
} else {
    console.log("Package not found", { lastPart, currentPackage, filePath });
}
