#!/usr/bin/env zx

import path from "path";

import fs from "fs/promises";
import replaceInFile from "replace-in-file";

const docsRootDir = process.cwd();
const repoRootDir = path.join(process.cwd(), "../");
const packagesToCopy = ["react", "utils", "typings"];
const pagesDir = path.join(docsRootDir, "pages");

const reactDocs = await fs.readdir(path.join(repoRootDir, "./docs"));
await $`mkdir -p ${path.join(pagesDir, "react")}`;

await Promise.all(
    packagesToCopy
        .map(
            (pkg) =>
                $`cp ${path.join(repoRootDir, "packages", pkg, "README.md")} ${path.join(pagesDir, `${pkg}.page.mdx`)}`
        )
        .concat($`cp ${path.join(repoRootDir, "README.md")} ${path.join(pagesDir, `index.page.mdx`)}`)
        .concat(
            reactDocs.map(
                (doc) =>
                    $`cp ${path.join(repoRootDir, "docs", doc)} ${path.join(
                        pagesDir,
                        "react",
                        doc.replace("md", "") + `page.mdx`
                    )}`
            )
        )
);

// Remove .md from links
await replaceInFile({
    files: pagesDir + "/**",
    from: /\.md/g,
    to: "",
});

await replaceInFile({
    files: [path.join(pagesDir, `react.page.mdx`)],
    from: new RegExp(escapeRegex("../../docs"), "g"),
    to: "/react",
});

/** Escape a string to be used for a RegExp
 * @see https://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript/3561711#3561711 */
export function escapeRegex(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}
