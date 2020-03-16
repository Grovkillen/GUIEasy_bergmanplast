/* GUIEasy  Copyright (C) 2019-2020  Jimmy "Grovkillen" Westberg */
// HERE WE PUT ALL OUR "PAGE" FUNCTIONS
guiEasy.curly.page = function (arg) {
    let type = arg[0];
    if (
        type === "start" ||
        type === "info"
    ) {
        return guiEasy.curly.page[type];
    }
};

guiEasy.curly.page.start = function () {
    return `
        {{START-WELCOMETEXT}}
        <br class="got-margin">
    `;
};