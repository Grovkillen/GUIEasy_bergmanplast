/* GUIEasy  Copyright (C) 2019-2020  Jimmy "Grovkillen" Westberg */
// HERE WE PUT ALL OUR "PAGE" FUNCTIONS
guiEasy.curly.page = function (arg) {
    let type = arg[0];
    if (
        type === "start" ||
        type === "planering" ||
        type === "körning" ||
        type === "historik" ||
        type === "info" ||
        type === "kvalitét"
    ) {
        return guiEasy.curly.page[type];
    }
};

guiEasy.curly.page.start = function () {
    return `
        <canvas id="digital-twin"></canvas>
    `;
};