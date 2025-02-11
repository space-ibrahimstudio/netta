const shell = require("shelljs");
shell.mkdir("-p", "backup");
shell.cp("-R", "build/*", "backup/");
