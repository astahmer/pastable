const buildOrder = [
    // "test-utils",
    "typings",
    "utils",
    "use-is-mounted",
    "use-force-update",
    "use-update-effect",
    "use-event",
    "use-click-away",
    "use-selection",
    "use-query-params",
    "react",
    "core",
];
const runInWorkspace = (packageName: string) => `yarn workspace @pastable/${packageName} run build`;

runInSeries(
    buildOrder.map((pkg) => runInWorkspace(pkg)),
    function (err: Error) {
        if (err) {
            console.error(err);
            return;
        }

        console.log("Done building packages.");
    }
);

// TODO modernize this
/**
 * Execute a single shell command where "cmd" is a string
 * @see Taken from https://gist.github.com/millermedeiros/4724047
 */
function runCmd(cmd: string, cb: Function) {
    // this would be way easier on a shell/bash script :P
    var child_process = require("child_process");
    var parts = cmd.split(/\s+/g);

    var p = child_process.spawn(parts[0], parts.slice(1), { stdio: "inherit" });
    console.log(cmd);
    p.on("exit", function (code: any) {
        var err = code ?? new CommandError(cmd, code);
        if (cb) cb(err);
    });
}

// TODO use a generator
function runInSeries(cmds: string[], cb: Function) {
    var execNext = function () {
        runCmd(cmds.shift(), function (err: any) {
            if (err) {
                cb(err);
            } else {
                if (cmds.length) execNext();
                else cb(null);
            }
        });
    };
    execNext();
}

class CommandError extends Error {
    constructor(public cmd: string, public code: number) {
        super();
        this.message = 'command "' + cmd + '" exited with wrong status code "' + code + '"';
    }
}
