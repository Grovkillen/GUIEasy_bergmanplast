/* GUIEasy  Copyright (C) 2019-2020  Jimmy "Grovkillen" Westberg */
// HERE WE PUT CURLY MAIN FUNCTION, CURLY IS STRICTLY HTML STRUCTURE, SEMI-EVENT-STUFF IS PUT IN SCRUBBER!
guiEasy.curly = function (processID, processType) {
    //the RegExp will find 64 chars long curlys only!
    guiEasy.syntax.curlyLC++;
    const regExp = /(?:{{)([^}]{1,64})(?:}})/g;
    let documentHTML = document.documentElement.innerHTML.toString();
    let curlyMatches = [];
    let match;
    while (match = regExp.exec(documentHTML)) {
        curlyMatches.push([match[1], match[0]]);  // [0] is always the full match..;
    }
    for (let i = 0; i < curlyMatches.length; i++) {
        let curly = guiEasy.curly.compileArgs(curlyMatches[i][0].split("-"));
        let curlyReplace = curlyMatches[i][1].replace(/}/g, "\\}");
        curlyReplace = curlyReplace.replace(/{/g, "\\{");
        curlyReplace = RegExp(curlyReplace);
        curlyMatches[i] = [curly[0], curlyReplace, curly[1], curly[2]];
    }
    for (let i = 0; i < curlyMatches.length; i++) {
        let x = curlyMatches[i][0];
        let y = document.documentElement.innerHTML.toString();
        let s = curlyMatches[i][1];
        let a = curlyMatches[i][2];      //number of arguments
        let args = curlyMatches[i][3];
        let r = "";  //This will delete non-correct curly.
        let v = helpEasy.findInArray(x, guiEasy.syntax.curly);
        v = v > -1;
        helpEasy.addToLogDOM(("x: '" + x + "' args: '" + args + "' found: " + v), 3);
        if (v === true) { r = guiEasy.curly[x](args); }
        //this one will remove curly where first is met but next one is undefined
        if (r === undefined) { r = ""; }
        helpEasy.addToLogDOM("pageSize", 1);
        helpEasy.addToLogDOM(("replaced: " + s + "with: " + r), 2);
        document.documentElement.innerHTML = y.replace(s, r);
        //re-run to fetch new curlys
        let found = helpEasy.numberOfFound(r.toString(), regExp);
        if (found > 0) { return guiEasy.curly(processID, processType); }
    }
    helpEasy.processDone(processID, processType);
    helpEasy.addToLogDOM(processID + " loop count: " + guiEasy.syntax.curlyLC, 1);
};

// This one is used to make a little blob for the function to parse
guiEasy.curly.compileArgs = function(arg) {
    let returnArray = [];
    let x = [];
    returnArray.push(arg[0].toLowerCase());
    returnArray.push(arg.length - 1);
    for (let i=1; i<arg.length; i++) {
        x.push(arg[i].toLowerCase());
    }
    returnArray.push(x);
    return returnArray;
};

guiEasy.curly.version = function(arg){
    let what = arg[0];
    if (what === "gui") {
        if (arg[1] === "text") {
            return guiEasy.geekNameFull();
        } else {
            return "<div data-gui-easy='version'>" + guiEasy.geekNameFull() + "</div>";
        }
    }
};

guiEasy.curly.modal = function (arg) {
    let type = arg[0];
    let info = "";
    let tables = "";
    let setup = "";
    let inputs = "";
    let buttons = "";
    if (type === "message") {
        inputs = "{{INPUT-ALL}}";
        buttons = "{{BUTTON-ALL}}";
    } else {
        return guiEasy.curly[type];
    }
    return `
        <div class="` + type + ` main-inverted" id="modal">
            <div class="area" id="modal-click-area">
                <div class="area-title" id="modal-title">
                    <div id="modal-title-text"></div>
                    <button 
                        class="is-hidden main-inverted left"
                        id="modal-title-button-copy"
                    >{{ICON-COPY}}</button>
                    <button 
                        class="is-hidden main-inverted left"
                        id="modal-title-button-location"
                    >{{ICON-LOCATION}}</button>
                    <button 
                        class="is-hidden main-bg"
                        id="modal-title-button-close"
                    >{{ICON-CLOSE}}</button>
                </div>
                <div class="column" id="modal-view">
                    <div class="row is-hidden" id="modal-info">
                        ` + info + `
                    </div>
                    <div class="row is-hidden" id="modal-table">
                        ` + tables + `
                    </div>
                    <div class="row is-hidden" id="modal-setup">
                        ` + setup + `
                    </div>
                    <div class="row is-hidden" id="modal-input">
                        ` + inputs + `
                    </div>
                    <div class="row" id="modal-buttons">
                        ` + buttons + `
                    </div>
                </div>
            </div>
        </div>
     `;
};

guiEasy.curly.wave = function () {
    return `
        <div class="wave-background is-inactive" id="wave">
            <div class="wave-text" id="wave-text"></div>
        </div>
     `;
};

guiEasy.curly.input = function (arg) {
    let type = arg[0];
    let html = "";
    if (type === "string" || type === "all") {
        html += "<input class='is-hidden' type='text' id='modal-input-string'>";
    }
    if (type === "textarea" || type === "all") {
        html += `
            <textarea
                class='is-hidden'
                id='modal-input-textarea'
                spellcheck='false'
                wrap='soft'
            ></textarea>
        `;
    }
    if (type === "upload" || type === "all") {
        html += `
            <div
                class="text-tiny"
                id="modal-input-upload-storage-occupied"
            ></div>
            <div
                class="text-tiny"
                id="modal-input-upload-storage-free"
            ></div>
            <input
                class='is-hidden'
                type='file'
                id='modal-input-upload-file'
            >
            <label
                tabindex='0'
                id='label-modal-input-upload-file'
                for='modal-input-upload-file'
                class='is-hidden file modal-upload is-dashed'
            ></label>
        `;
    }
    return html;
};

guiEasy.curly.button = function (arg) {
    let type = arg[0];
    let html = "";
    if (type === "ok" || type === "all") {
        html += "<button class='is-hidden main-success' id='modal-button-ok'>Ok</button>";
    }
    if (type === "cancel" || type === "all") {
        html += "<button class='is-hidden main-info' id='modal-button-cancel'>Cancel</button>";
    }
    if (type === "rescan" || type === "all") {
        html += "<button class='is-hidden' id='modal-button-rescan'>Rescan</button>";
    }
    if (type === "custom" || type === "all") {
        html += "<button class='is-hidden' id='modal-button-custom'></button>";
    }
    return html;
};

guiEasy.curly.goto = function (arg) {
    let type = arg[0];
    let name = arg[1];
    if (type === "tab") {
        return "<button class='main-inverted' data-click='" + type + "-" + name + "'>Continue to " + helpEasy.capitalWord(name) + "</button>";
    }
};

guiEasy.curly.menu = function (arg) {
    let type = arg[0];
    if (type === "action") {
        let listItems = [
            {"name": "spara", "color": "success", "what": "settings-save"},
            {"name": "avbryt", "color": "sunny", "what": "settings-cancel"},
            {"name": "notis", "color": "inverted", "what": "menu-noification"},
            {"name": "ghost", "color": "bg", "what": "ghost-page"},
            {"name": "screenshot", "color": "bg-inverted", "what": "screenshot-page"}
        ];
        let html = "";
        for (let i = 0; i < listItems.length; i++) {
            html += `
                <button tabindex="-1" class="menu-` + listItems[i].name + ` main-` + listItems[i].color + ` got-tooltip" data-click="` + listItems[i].what + `-` + listItems[i].color + `">
                {{ICON-` + listItems[i].name.toUpperCase() + `}}
                    <div class="tooltip"><div class="text">` + helpEasy.capitalWord(listItems[i].name) + `</div></div>
                </button>
            `;
        }
        return `
        <div class="menu">
            <div class="menu-button">
                <button
                    class="icon-button is-inactive menu-action got-badge"
                    data-focus="menu-action-close"
                    data-click="menu-action-toggle"
                    id="menu-button"
                    data-badge-value=""
                >{{ICON-ACTION}}</button>
            </div>
            <div class="icon-button closed" id="menu-button-list">` + html + `</div>
        </div>
        `;
    }
};

guiEasy.curly.notifier = function (arg) {
    let type = arg[0];
    if (type === "top") {
        return `
            <div class="top-notifier" id="top-notifier"></div>
        `;
    }
};

guiEasy.curly.navbar = function () {
    const tabs = guiEasy.tabs;
    const middle = "{{UNITNAME}}";
    let html = `
            <nav id="navbar">
                <div class="got-wallpaper"></div>
                <ul class="nav" name="nav-group">
        `;
    let x = tabs.left;
    for (let i=0; i < x.length; i++) {
        html += guiEasy.curly.navbar.tab(x[i]);
    }
    html += "</div></li></div>";
    //Area in between the tab groups...
    html += "<li class='nav-middle-area' id='nav-middle-area'>" + middle + "</li>";
    x = tabs.right;
    let rightHtml = "";
    for (let i=0; i < x.length; i++) {
        rightHtml += guiEasy.curly.navbar.tab(x[i]);
    }
    rightHtml += "</div></li>";
    html += "<div class='nav-group' id='nav-right-big-screen' name='nav-group'>" + rightHtml + "</div></ul>";
    html += "<ul class='nav-small-screen'><div class='nav-group' id='nav-right-small-screen' name='nav-group'>" + rightHtml + "</div></ul>";
    html += "</nav>";
    return html;
};

guiEasy.curly.navbar.tab = function (name) {
    return `
            <li class="nav" name="tab-` + name + `">
                <div class="nav icon text" data-click="tab-` + name + `" data-tab="` + name + `" data-highlight="true">
                    <div class="tab-icon" data-click="tab-` + name + `">{{ICON-` + name.toUpperCase() + `}}</div>
                    <div class="tab-text" data-click="tab-` + name + `">` + helpEasy.capitalWord(name) + `</div>
        `;
};

guiEasy.curly.drawer = function (arg) {
    let type = arg[0];
    let html = "";
    if (type === "orders") {
        let x = defaultSettings.css.variables;
        let columnRowsMax = Math.round((x.length + 1) / 3 + 1);
        //  data-open="is-full-size", "is-quarter-size", "is-half-size", "is-small-size" ... no size setting will make it auto height.
        html =  `
                    <div class="bottom-drawer is-inactive" data-open="is-half-size" id="drawer-orders" data-close="is-inactive">
                        <div class="bottom-tab" tabindex="0" data-click="drawer-orders">
                        <div id="custom-orders-settings"></div>
                        {{ICON-ORDERS}}
                        Ordrar
                        </div>
                        <div class="bottom-container">
                        <div class="area">
                     `;
        let rowCount = 0;
        html += '<div class="column">';
        for (let i = 0; i < x.length; i++) {
            rowCount++;
            if (rowCount === columnRowsMax) {
                html += '</div><div class="column">';
                rowCount = 1;
            }
            //html += guiEasy.curly.drawer.theme(x[i]);
        }
        html +=  `
            <hr>
            <div class="row">
                    
            </div>
            </div>
            `;
        html += "</div></div></div>";
    }
    return html;
};

guiEasy.curly.info = function (what) {
    if (what[0] === "message") {
        helpEasy.addToLogDOM("message", 0, "info");
    }
    if (what[0] === "footer") {
        helpEasy.addToLogDOM("footer", 0, "info");
    }
    if (what[0] === "patreon") {
        helpEasy.addToLogDOM("patreon", 0, "info");
    }
};

guiEasy.curly.gamepad = function () {
    let html = "<div id='template-gamepad'>{{ICON-GAMEPAD}}</div>";
    html += "<div id='active-gamepads' class='gamepads'></div>";
    return html;
};