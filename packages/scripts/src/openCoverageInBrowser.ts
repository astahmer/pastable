import path from "path";

import { openFileInBrowser } from "./openFileInBrowser";

const packagesRootPath = path.resolve("../");
const coverageReportPath = "./coverage/lcov-report/index.html";
const lastPart = process.env.INIT_CWD.split("/").slice(-1)[0];
const currentPackage = ["packages", "pastable"].includes(lastPart) ? "" : lastPart;
const filePath = path.resolve(packagesRootPath, currentPackage, coverageReportPath);

if (currentPackage) {
    openFileInBrowser(filePath);
} else {
    console.log("Package not found", { lastPart, currentPackage, filePath });
}
