// Adapter from https://github.com/chakra-ui/chakra-ui/blob/main/scripts/plopfile.ts

module.exports = function (plop) {
    plop.setGenerator("package", {
        description: "Package template",
        prompts: [{ type: "input", name: "packageName", message: "Package name" }],
        actions(answers) {
            const actions = [];
            if (!answers) return actions;

            const { packageName } = answers;

            actions.push({
                type: "addMany",
                templateFiles: "template/**",
                destination: "packages/{{dashCase packageName}}",
                base: "template/",
                data: { packageName },
                abortOnFail: true,
            });

            return actions;
        },
    });
};
