/* GUIEasy  Copyright (C) 2019-2020  Jimmy "Grovkillen" Westberg */
//HERE WE ADD THINGS THAT WILL HAPPEN
guiEasy.popper = function (processID, processType) {
    //to make sure we don't spam the event listener...
    setInterval(guiEasy.popper.tryCallEvent.counter, 5);
    //add event listeners...
    guiEasy.popper.events();
    guiEasy.popper.rules();
    guiEasy.popper.favicon();
    helpEasy.addToLogDOM("pageSize", 1);
    helpEasy.processDone(processID, processType);
};

guiEasy.popper.events = function() {
    //generic events that will be captured
    document.addEventListener(guiEasy.geekName(), guiEasy.popper.guiEvent, false);
    document.addEventListener('keydown', guiEasy.popper.keyboard, false);
    document.addEventListener('input', guiEasy.popper.input, false);
    document.addEventListener('keyup', guiEasy.popper.keyboard, false);
    document.addEventListener('click', guiEasy.popper.click, true);
    document.addEventListener('change', guiEasy.popper.change, true);
    document.addEventListener('focusout', guiEasy.popper.focus, true);
};

//BELOW IS FUNCTION TO INTERCEPT AND TRANSLATE THE EVENT INTO A ESP EASY EVENT//
guiEasy.popper.focus = function (event) {
    //focus is currently only used to close the action menu ...
    if (event.target.dataset["focus"] === undefined) {
        return;
    }
    let args = event.target.dataset["focus"].split("-");
    if (args !== undefined) {
        let eventDetails = {
            "type": args[0],
            "args": args,
            "x": event.x,
            "y": event.y
        };
        setTimeout(function () {
            guiEasy.popper.tryCallEvent(eventDetails)
        }, 250);
    }
};

guiEasy.popper.input = function (event) {
    let x = event.target.dataset;
    let eventDetails = {
        "type": "update",
        "newValue": event.target.value,
        "newState": event.target.checked,
        "placeholder": event.target.placeholder,
        "args": x
    };
    if (eventDetails.type !== undefined) {
        guiEasy.popper.tryCallEvent(eventDetails);
    }
};

guiEasy.popper.change = function (event) {
    let x = event.target.dataset;
    let eventDetails = {
        "type": "update",
        "newValue": event.target.value,
        "newState": event.target.checked,
        "placeholder": event.target.placeholder,
        "index": event.target.selectedIndex,
        "args": x
    };
    if (eventDetails.type !== undefined) {
        guiEasy.popper.tryCallEvent(eventDetails);
    }
};

guiEasy.popper.keyboard = function (event) {
    let eventDetails = {
           "type": "shortcut",
           "object": event.key,
           "state": event.type,
           "key": event.code,
           "ctrl": event.ctrlKey,
           "alt": event.altKey,
           "event": event
        };
    if (eventDetails.type !== undefined) {
        guiEasy.popper.tryCallEvent(eventDetails);
    }
};

guiEasy.popper.click = function (event) {
    if (event.target.dataset["click"] === undefined) {
        return;
    }
    let args = event.target.dataset["click"].split("-");
    let x = event.target.dataset;
    if (args !== undefined) {
        let eventDetails = {
            "type": args[0],
            "args": args,
            "dataset": x,
            "x": event.x,
            "y": event.y,
            "element": event.target
        };
        guiEasy.popper.tryCallEvent(eventDetails);
    }
};
//ABOVE IS FUNCTION TO INTERCEPT AND TRANSLATE THE EVENT INTO A ESP EASY EVENT//
//BELOW IS THE FUNCTION TO TRIGGER ESP EASY EVENT + FIND WHAT WAS FOCUSED//
guiEasy.popper.guiEvent = function (event) {
    helpEasy.addToLogDOM(JSON.stringify(event.detail), 2);
    let x = event.detail;
    guiEasy.popper[x.type](x);
};

guiEasy.popper.tryCallEvent = function (eventDetails) {
    let x = guiEasy.guiStats.eventCalls;
    if (x < 10) {
        guiEasy.guiStats.eventCalls++;
        helpEasy.addToLogDOM("Calling custom event: " + JSON.stringify(eventDetails), 2);
        document.dispatchEvent(new CustomEvent(guiEasy.geekName(), {'detail': eventDetails}));
    }
};

guiEasy.popper.tryCallEvent.counter = function() {
    if (guiEasy.guiStats.eventCalls > 0) {
        guiEasy.guiStats.eventCalls--;
    }
};
//ABOVE IS THE FUNCTION TO TRIGGER ESP EASY EVENT + FIND WHAT WAS FOCUSED//
//BELOW IS THE "TO EXEC" FUNCTIONS//
guiEasy.popper.clipboard = function (clipboard) {
    let id = clipboard.args[1];
    let element = document.getElementById(id);
    let syntax = defaultSettings.userSettings.clipboardSyntax;
    helpEasy.copyToClipboard(guiEasy.popper.clipboard[syntax](element.innerHTML));
    let eventDetails = {
        "type": "wave",
        "text": "info copied",
        "color": "success"
    };
    guiEasy.popper.tryCallEvent(eventDetails);
};

guiEasy.popper.clipboard.Default = function (rawHTML) {
    let text = "";
    helpEasy.addToLogDOM("Converting (generic): " + rawHTML, 1);
    let data = guiEasy.popper.clipboard.regexTable(rawHTML);

    helpEasy.addToLogDOM("RESULTS (generic): " + text, 1);

    return text;
};

guiEasy.popper.gui = function (event) {
    let browserUserSettings = {
        "preventDefaults": {}
    };
    let inputs = document.querySelectorAll("[data-settings^='defaultSettings--userSettings']");
    for (let i = 0; i < inputs.length; i++) {
        let settingsPath = inputs[i].dataset.settings.split("--");
        let value = "";
        if (inputs[i].dataset.type === "toggle") {
            value = JSON.parse(inputs[i].dataset.inputToggle.replace(/'/g, '"'));
            value = value[inputs[i].checked];
        }
        if (inputs[i].dataset.type === "dropdown") {
            value = inputs[i].selectedOptions[0].value;
        }
        if (settingsPath[2] === "preventDefaults") {
            browserUserSettings.preventDefaults[settingsPath[3]] = value;
        } else {
            browserUserSettings[settingsPath[2]] = value;
        }
    }
    defaultSettings.userSettings = browserUserSettings;
    if (document.getElementById("label-temp") !== null) {
        document.getElementById("label-temp").remove();
    }
    let l = document.createElement("label");
    l.id = "label-temp";
    l.style.display = "none";
    document.body.appendChild(l);
    let file = new File(
        [JSON.stringify(defaultSettings.userSettings, null, 2)],
        "gui.txt",
        {
            type: "text/plain"
        }
    );
    helpEasy.uploadBinaryAsFile("generic", file, "temp");
    let eventDetails = {
        "type": "wave",
        "text": "gui settings saved",
        "color": "inverted"
    };
    guiEasy.popper.tryCallEvent(eventDetails);
    eventDetails = {
        "type": "modal",
        "args": ["", "close"]
    };
    guiEasy.popper.tryCallEvent(eventDetails);
};

guiEasy.popper.command = function (x) {
    let waveStuff = JSON.parse(x.dataset.args.replace(/'/g, '"'));
    let url = "http://" + guiEasy.nodes[helpEasy.getCurrentIndex()].ip + "/?cmd=";
    let cmd = x.args[1];
    let waveText = waveStuff.waveText;
    let waveColor = waveStuff.color;
    fetch(url + cmd).then( results => {
            helpEasy.addToLogDOM(("response: " + results), 2);
            let eventDetails = {
                "type": "wave",
                "text": waveText,
                "color": waveColor
            };
            guiEasy.popper.tryCallEvent(eventDetails);
        }
    );

};

guiEasy.popper.topNotifier = function (id, string, color, countdown) {
    let x = guiEasy.nodes[helpEasy.getCurrentIndex()].notifierID;
    if (x !== id) {
        guiEasy.nodes[helpEasy.getCurrentIndex()].notifierID = id;
        let notifier = document.getElementById("top-notifier");
        if (notifier.innerHTML !== "") {
            //if it already got something open, replace that one.
            notifier.click();
        }
        notifier.innerHTML = string;
        notifier.classList.add("main-" + color);
        notifier.addEventListener("click", function () {
            notifier.classList.add("is-hidden");
            notifier.innerHTML = "";
            notifier.classList.remove("no-click");
            notifier.classList.remove("internet-down");
            notifier.classList.remove("main-" + color);
            setTimeout(function () {
                //make the notify not pop up for another 30 seconds
                guiEasy.nodes[helpEasy.getCurrentIndex()].notifierID = "";
            }, 30 * 1000);
        });
        if (id === "internetDown") {
            //No click away
            notifier.classList.add("no-click");
            notifier.classList.add("internet-down");
        }
        if (countdown > 0) {
            notifier.innerHTML = "<div id='countdown-bar'></div>" + notifier.innerHTML;
            let bar = document.getElementById("countdown-bar");
            let z = 1;
            bar.setAttribute("style", "width: 0.1%");
            let y = setInterval(function () {
                z++;
                bar.setAttribute("style", "width:" + Math.round( z / countdown * 100 ) + "%");
                if (z === countdown) {
                    clearInterval(y);
                }
            }, 1000);
            setTimeout(function () {
                guiEasy.nodes[helpEasy.getCurrentIndex()].notifierID = "";
                notifier.click();
            }, countdown * 1001)
        }
        notifier.classList.remove("is-hidden")
    }
};

guiEasy.popper.tab = function (tabToOpen) {
    let tab = tabToOpen.args[1];
    if (tab === undefined) {
        tab = "main";
    }
    let tabNumber = parseInt(tab);
    if (tabNumber > -1) {
        tab = guiEasy["tabNumber"][tabNumber];
    }
    tabNumber = guiEasy["tabNumber"].indexOf(tab);
    guiEasy.current.tabNumber = tabNumber;
    guiEasy.current.tab = document.getElementById(tab + "-container");
    //first hide the containers, plus un-hide the wanted container
    let x = document.getElementsByClassName("container");
    for (let i = 0; i < x.length; i++) {
        let y = x[i].id.split("-")[0];
        x[i].classList.add("is-hidden");
        if (y === tab) {
            x[i].classList.remove("is-hidden");
            window.scrollTo(0, 0);
        }
    }
    //now remove the highlight, plus add to the wanted tab
    x = document.getElementsByClassName("nav");
    for (let i = 0; i < x.length; i++) {
        let y = x[i].dataset;
        if (y.highlight === "true") {
            x[i].classList.remove("nav-selected");
        }
        if (y.tab === tab) {
            x[i].classList.add("nav-selected");
        }
    }
    helpEasy.addToLogDOM("tab open: " + tab, 1);
};

guiEasy.popper.menu = function (menuToOpen) {
    let x = menuToOpen.args[1];
    let y = menuToOpen.args[2];
    let posY = menuToOpen.y;
    if (x === "action") {
        let menu = document.getElementById("menu-button-list");
        let menuHeight = parseFloat(window.getComputedStyle(menu).height.slice(0, -2));
        let menuButton = document.getElementById("menu-button");
        if (y === "close") {
            menu.classList.add("closed");
            menuButton.classList.add("is-inactive");
            setTimeout(function () {
                menu.classList.remove("horizontal");
            }, 750)
        }
        if (y === "toggle") {
            menu.classList.toggle("closed");
            menuButton.classList.toggle("is-inactive");
        }
        if (posY < (menuHeight + 50)) {
            menu.classList.add("horizontal");
        }
    }
    helpEasy.addToLogDOM("menu: " + x, 1);
};

guiEasy.popper.modal = function (modalToOpen) {
    let x = modalToOpen.args[1];
    let y = modalToOpen.args[2];
    let index = helpEasy.getCurrentIndex();
    let logic = {"nah": "add", "yep": "remove"};
    // nah = add "is-hidden"... yep = remove "is-hidden"
    let z = {
        "modal": "nah",
        "input": {
            "string": "nah",
            "textarea": "nah",
            "upload": "nah"
        },
        "button": {
            "ok": "nah",
            "cancel": "nah",
            "close": "nah",
            "rescan": "nah",
            "copy": "nah",
            "location": "nah",
            "custom": "nah"
        },
        //Defaults, can be override in the ifs further down.
        "action": {
            "ok": null,
            "cancel": "modal-close",
            "close": "modal-close",
            "rescan": null,
            "copy": "modal-clipboard",
            "upload": null,
            "location": "update-location",
            "custom": null
        },
        "countdown": 0,
        "info": null,
        "table": null,
        "setup": null,
        "title": null,
        "upload": {
            "max": null,
            "free": null,
            "title": null,
            "types": null
        },
        "custom": null
    };
    //What part of the modal should be screenshot:ed?
    if (guiEasy.current.modal === undefined) {
        guiEasy.current.modal = document.getElementById("modal-view");
    }
    if (x === "close") {
        if (guiEasy.current.modal !== undefined) {
            guiEasy.current.modal.remove();
        }
        document.getElementById("modal").innerHTML = document.getElementById("modal").dataset.defaultView;
        document.body.classList.remove("modal");
    } else {
        document.body.classList.add("modal");
    }
    //Countdown...
    if (z.countdown > 0) {
        let countdownElement = document.getElementById("modal-title-button-close");
        let messageElement = document.getElementById("modal-click-area");
        //make click on message close it (not just the button in the top right corner)
        messageElement.addEventListener("click", function () {
            clearInterval(timer);
            countdownElement.click();
        });
        countdownElement.innerText = z.countdown;
        countdownElement.classList.add("countdown");
        countdownElement.classList.remove("is-hidden");
        let timer = setInterval( function() {
            let currentValue = parseInt(countdownElement.innerText);
            if (currentValue > 1) {
                countdownElement.innerText = (currentValue - 1).toString();
            } else {
                clearInterval(timer);
                countdownElement.click();
            }
        }, 1000);
    }
};

guiEasy.popper.filter = function (what) {
    if (what.args[1] === "remove") {
        what.element.remove();
        let eventDetails = {
            "type": "filter",
            "args": [
                "filter",
                "updated"
            ]
        };
        guiEasy.popper.tryCallEvent(eventDetails);
    }
    if (what.args[1] === "updated") {
        let filters = document.getElementById("weblog-filters");
        let c = filters.children;
        guiEasy.loops.weblogPattern = [];
        if (c.length > 0) {
            for (let i = 0; i < c.length; i++) {
                let p = c[i].innerText.split(" ");
                for (let k = 0; k < p.length; k++) {
                    guiEasy.loops.weblogPattern.push(p[k].toLowerCase());
                }
            }
        }
        let container = document.getElementById("weblog-container");
        //remove all "is-hidden"
        let html = container.innerHTML.toString();
        container.innerHTML = html.replace(/is-hidden/g, "");
        container.lastChild.scrollIntoView();
        if (guiEasy.loops.weblogPattern.length > 0) {
            //start filtering
            let entries = container.children;
            for (let k = 0; k < entries.length; k++) {
                let check = helpEasy.ifStringContains(entries[k].innerText.toLowerCase(), guiEasy.loops.weblogPattern);
                if (check === false) {
                    //hide it
                    entries[k].classList.add("is-hidden");
                }
            }
            if (container.innerText.length === 0) {
                    let html =  "<div id='nothing-here'>Nothing found...</div>";
                    container.insertAdjacentHTML("afterbegin", html);
                    setTimeout(function () {
                        document.getElementById("nothing-here").remove();
                    }, 3000)
            }
        }
    }
};

guiEasy.popper.stop = function (what) {
    if (what.args[1] === "log") {
        // close the modal
        let eventDetails = {
            "type": "modal",
            "args": ["modal", "close"]
        };
        guiEasy.popper.tryCallEvent(eventDetails);
        // stop the log list ...
        clearInterval(guiEasy.loops.weblog);
    }
};

guiEasy.popper.modal.settings = function (type) {
    let html = "";
    html += helpEasy.openColumn("data-modal-settings-table");
    if (type === "gui") {
        html += helpEasy.addInput(
            {
                "type": "toggle",
                "toSettings": true,
                "alt": "settings-change",
                "title": "escape key",
                "settingsId": "defaultSettings--userSettings--preventDefaults--escape",
                "settingsTrue": 0,
                "settingsFalse": 1,
                "falseText": "esc = close modals",
                "trueText": "esc = not used",
                "default":true
            }
        );
        html += helpEasy.addInput(
            {
                "type": "toggle",
                "toSettings": true,
                "alt": "settings-change",
                "title": "ctrl space key",
                "settingsId": "defaultSettings--userSettings--preventDefaults--ctrl+space",
                "settingsTrue": 0,
                "settingsFalse": 1,
                "falseText": "ctrl + space = open swarm",
                "trueText": "ctrl + space = not used",
                "default":true
            }
        );
        html += helpEasy.addInput(
            {
                "type": "toggle",
                "toSettings": true,
                "alt": "settings-change",
                "title": "ctrl enter key",
                "settingsId": "defaultSettings--userSettings--preventDefaults--ctrl+enter",
                "settingsTrue": 0,
                "settingsFalse": 1,
                "falseText": "ctrl + enter = take screenshot",
                "trueText": "ctrl + enter = not used",
                "default":true
            }
        );
        html += helpEasy.addInput(
            {
                "type": "toggle",
                "toSettings": true,
                "alt": "settings-change",
                "title": "ctrl keys key",
                "settingsId": "defaultSettings--userSettings--preventDefaults--ctrl+keys",
                "settingsTrue": 0,
                "settingsFalse": 1,
                "falseText": "ctrl + s = save settings",
                "trueText": "ctrl + s = not used",
                "default":true
            }
        );
        html += helpEasy.addInput(
            {
                "type": "toggle",
                "toSettings": true,
                "alt": "settings-change",
                "title": "ctrl keyz key",
                "settingsId": "defaultSettings--userSettings--preventDefaults--ctrl+keyz",
                "settingsTrue": 0,
                "settingsFalse": 1,
                "falseText": "ctrl + z = dismiss changes",
                "trueText": "ctrl + z = not used",
                "default":true
            }
        );
        html += helpEasy.addInput(
            {
                "type": "toggle",
                "toSettings": true,
                "alt": "settings-change",
                "title": "alt digit key",
                "settingsId": "defaultSettings--userSettings--preventDefaults--alt+digit",
                "settingsTrue": 0,
                "settingsFalse": 1,
                "falseText": "alt + digit = jump to tab",
                "trueText": "alt + digit = not used",
                "default":true
            }
        );
        html += helpEasy.addInput(
            {
                "type": "toggle",
                "toSettings": true,
                "alt": "settings-change",
                "title": "alt arrow key",
                "settingsId": "defaultSettings--userSettings--preventDefaults--alt+arrows",
                "settingsTrue": 0,
                "settingsFalse": 1,
                "falseText": "alt + l/r arrow = jump to tab",
                "trueText": "alt + l/r arrow = not used",
                "default": true
            }
        );
        html += helpEasy.addLine();
        html += helpEasy.addInput(
            {
                "type": "toggle",
                "toSettings": true,
                "alt": "settings-change",
                "title": "wait for theme",
                "settingsId": "defaultSettings--userSettings--fastBoot",
                "settingsTrue": 1,
                "settingsFalse": 0,
                "trueText": "fast boot (no wait for theme)",
                "falseText": "wait for theme & gui settings",
                "default": false
            }
        );
        html += helpEasy.addInput(
            {
                "type": "toggle",
                "toSettings": true,
                "alt": "settings-change",
                "title": "minimize areas",
                "settingsId": "defaultSettings--userSettings--areasMinimized",
                "settingsTrue": 0,
                "settingsFalse": 1,
                "falseText": "areas collapsed by default",
                "trueText": "areas expanded by default",
                "default":false
            }
        );
        html += helpEasy.addInput(
            {
                "type": "toggle",
                "toSettings": true,
                "alt": "settings-change",
                "title": "show help links",
                "settingsId": "defaultSettings--userSettings--helpLinks",
                "settingsTrue": 0,
                "settingsFalse": 1,
                "falseText": "help links = show",
                "trueText": "help links &ne; show",
                "default":true
            }
        );
        html += helpEasy.addInput(
            {
                "type": "toggle",
                "toSettings": true,
                "alt": "settings-change",
                "title": "warn if internet lost",
                "settingsId": "defaultSettings--userSettings--internetLostShow",
                "settingsTrue": 0,
                "settingsFalse": 1,
                "falseText": "notify on internet lost",
                "trueText": "internet lost, don't care",
                "default":true
            }
        );
        html += helpEasy.addLine();
        html += helpEasy.addInput(
            {
                "type": "dropdown",
                "toSettings": true,
                "alt": "settings-change",
                "title": "syntax of copy to clipboard",
                "settingsId": "defaultSettings--userSettings--clipboardSyntax",
                "placeholder": "",
                "list2value": true,
                "optionListOffset": -1,
                "optionList": [
                    {"text": "default", "value": "default", "disabled":false, "note":""},
                    {"text": "github", "value": "github", "disabled":false, "note":""},
                    {"text": "phpbb", "value": "phpbb", "disabled":false, "note":""}
                ]
            }
        );
        html += helpEasy.addInput(
            {
                "type": "dropdown",
                "toSettings": true,
                "alt": "settings-change",
                "title": "plugin, controller, and notify dropdown",
                "settingsId": "defaultSettings--userSettings--dropdownList",
                "placeholder": "",
                "list2value": true,
                "optionListOffset": -1,
                "optionList": [
                    {"text": "default", "value": "default", "disabled":false, "note":""},
                    {"text": "no state", "value": "nostate", "disabled":false, "note":""},
                    {"text": "stripped", "value": "stripped", "disabled":false, "note":""}
                ]
            }
        );
    }
    html += helpEasy.openColumn();
    return html;
};

guiEasy.popper.delete = function (whatToDo) {
    let type = whatToDo.args[1];
    if (type === "file") {
        let z = document.getElementById(whatToDo.dataset.filename);
        z.classList.add("is-inactive");
        guiEasy.nodes[helpEasy.getCurrentIndex()].deleteFile = whatToDo.dataset.filename;
        let url = "http://" + guiEasy.nodes[helpEasy.getCurrentIndex()].ip + "/filelist?delete=" + whatToDo.dataset.filename;
        fetch(url).then( results => {
            helpEasy.addToLogDOM(("response: " + results), 2);
            helpEasy.schedulerBump(guiEasy.nodes[helpEasy.getCurrentIndex()].scheduler, "filelist_json");
            helpEasy.schedulerBump(guiEasy.nodes[helpEasy.getCurrentIndex()].scheduler, "sysinfo_json");
            helpEasy.updateIndicator();
            }
        );
    }
};

guiEasy.popper.ghost = function (whatToDo) {
    console.log(whatToDo);
};

guiEasy.popper.screenshot = function () {
    helpEasy.screenshot();
};

guiEasy.popper.area = function (whatToDo) {
    let newState = whatToDo.args[1];
    let id = whatToDo.args.slice(2).join("-");
    let area = document.getElementById(id);
    let buttonMin = document.getElementById("button-min-" + id);
    let buttonMax = document.getElementById("button-max-" + id);
    if (newState === "min") {
        area.classList.add("hide-contents");
        buttonMax.classList.remove("is-hidden");
        buttonMin.classList.add("is-hidden");
    } else {
        area.classList.remove("hide-contents");
        buttonMax.classList.add("is-hidden");
        buttonMin.classList.remove("is-hidden");
    }
};

guiEasy.popper.update = async function (whatToDo) {
    if (whatToDo.args[1] === "location") {
        if (helpEasy.internet() === true) {
            if (defaultSettings.location === undefined) {
                defaultSettings.location = await helpEasy.locationByIP();
            }
            let longEl = document.getElementById("settings--input--config--location--long");
            let latEl = document.getElementById("settings--input--config--location--lat");
            longEl.value = defaultSettings.location.longitude;
            latEl.value = defaultSettings.location.latitude;
            helpEasy.blinkElement(longEl, "inverted");
            helpEasy.blinkElement(latEl, "inverted");
        } else {
            //flash the screen, since no internet we cannot use the external data..
            let eventDetails = {
                "type": "wave",
                "text": "No internet!",
                "color": "warning"
            };
            guiEasy.popper.tryCallEvent(eventDetails);
        }
    }
    //these can be skipped if the alt isn't populate
    if (whatToDo.args.alt === undefined) {
        return;
    }
    if (whatToDo.args.alt === "settings-change") {
        guiEasy.popper.settingsDiff(whatToDo);
    }
    let type = whatToDo.args.alt.split("-")[0];
    if (type === "css") {
        guiEasy.popper.css(whatToDo);
    }
    if (type === "editor") {
        //TODO: send to syntax highlighter...
        console.log(whatToDo);
    }
};

guiEasy.popper.edit = function (whatToDo) {
        let number = parseInt(whatToDo.args[2]);
        let presetNumber = 0;
        if (whatToDo.args[1] === "task") {
            presetNumber = guiEasy.nodes[helpEasy.getCurrentIndex()].settings.tasks[(number-1)].device;
        }
        if (whatToDo.args[1] === "controller") {
            presetNumber = guiEasy.nodes[helpEasy.getCurrentIndex()].settings.controllers[(number-1)].protocol;
        }
        if (whatToDo.args[1] === "notification") {
            presetNumber = guiEasy.nodes[helpEasy.getCurrentIndex()].settings.notifications[(number-1)].type;
        }
        if (presetNumber === 0) {
            //no plugin is setup
        }
        if (presetNumber) {
            //a plugin is set up but not part of firmware = cannot run
        }
        let options = helpEasy.setupDropdownList(whatToDo.args[1]);
        guiEasy.popper.modal({"args":[number,whatToDo.args[1],"edit", options]});
        helpEasy.sortOptionsInSelect(whatToDo.args[1] + "-dropdown-list");
        document.getElementById(whatToDo.args[1] + "-dropdown-list").value = presetNumber;
};

guiEasy.popper.settings = function (whatToDo) {
    if (whatToDo.args[2] === undefined) {
        whatToDo.args[2] = "inverted";
    }
    let eventDetails = {
        "type": "wave",
        "text": whatToDo.args[1],
        "color": whatToDo.args[2]
    };
    guiEasy.popper.tryCallEvent(eventDetails);
};

guiEasy.popper.wave = function (args) {
    let waveElement = document.getElementById("wave");
    let textElement = document.getElementById("wave-text");
    waveElement.classList.add("main-" + args.color);
    textElement.innerHTML = helpEasy.capitalWord(args.text);
    waveElement.classList.remove("is-inactive");
    setTimeout( function () {
        waveElement.classList.add("is-inactive");
        waveElement.classList.remove("main-" + args.color);
        document.body.classList.remove("modal");
    }, 800);
};

guiEasy.popper.shortcut = function (keyboard) {
    let keyCombo = "";
    let pd = defaultSettings.userSettings.preventDefaults;
    if (keyboard.alt === true) {
        keyCombo += "alt "
    }
    if (keyboard.ctrl === true) {
        keyCombo += "ctrl ";
    }
    keyCombo += keyboard.key;
    keyCombo = keyCombo.trim().replace(/ /g, "+").toLowerCase();
    // "key" and the letter...
    if (keyCombo === "ctrl+keys" && keyboard.state === "keydown") {
        //Save settings...
        if (pd[keyCombo] === 1) {
            keyboard.event.preventDefault();
            let details = {};
            details.args = ("settings-save-success").split("-");
            guiEasy.popper.settings(details);
        }
    }
    if (keyCombo === "ctrl+keyz" && keyboard.state === "keydown") {
        //Cancel settings...
        if (pd[keyCombo] === 1) {
            keyboard.event.preventDefault();
            let details = {};
            details.args = ("settings-cancel-sunny").split("-");
            guiEasy.popper.settings(details);
            helpEasy.guiUpdaterSettings();
        }
    }
    if (keyCombo === "alt+altleft" && keyboard.state === "keydown") {
        //Show alt keys
        if (pd["alt+digit"] === 1) {
            keyboard.event.preventDefault();
            let alts = document.querySelectorAll(".alt-popup");
            for (let i = 0; i < alts.length; i++) {
                alts[i].classList.remove("is-hidden");
            }
        }
    }
    if (keyCombo === "ctrl+enter" && keyboard.state === "keydown") {
        //Screenshot
        if (pd[keyCombo] === 1) {
            keyboard.event.preventDefault();
            helpEasy.screenshot();
        }
    }
    if (keyCombo === "altleft" && keyboard.state === "keyup") {
        //Hide alt keys
        let alts = document.querySelectorAll(".alt-popup");
        for (let i = 0; i < alts.length; i++) {
            alts[i].classList.add("is-hidden");
        }
    }
    if (keyCombo === "escape" && keyboard.state === "keydown") {
        //close open modal
        if (pd[keyCombo] === 1) {
            keyboard.event.preventDefault();
            guiEasy.popper.modal({"args": ["modal", "close"]});
        }
    }
    if (keyCombo === "ctrl+space" && keyboard.state === "keydown") {
        //Show swarm
        if (pd[keyCombo] === 1) {
            keyboard.event.preventDefault();

        }
    }
    //ALT + DIGIT 0...9
    let number = keyCombo.replace( /^\D+/g, "");
    if (keyCombo === ("alt+digit" + number) && keyboard.state === "keydown") {
        //Goto tab..
        if (pd["alt+digit"] === 1) {
            keyboard.event.preventDefault();
            guiEasy.popper.tab({"args": ["tab", number]});
        }
        //guiEasy.popper.tab({"args":["tab", guiEasy.tabNumber[number]]}); <---- keep as reference now that numerical value is accepted
    }
    //APT + ARROW left/right, skip tabs
    if (
        (keyCombo === "alt+arrowleft"  && keyboard.state === "keydown") ||
        (keyCombo === "alt+arrowright" && keyboard.state === "keydown")
    ) {
        if (pd["alt+arrows"] === 1) {
            keyboard.event.preventDefault();
            let tabNumber = guiEasy.current.tabNumber;
            if (keyCombo === "alt+arrowleft") {tabNumber = tabNumber - 1} else {tabNumber = tabNumber + 1}
            while (guiEasy.tabNumber[tabNumber] === undefined) {
                if (keyCombo === "alt+arrowleft") {tabNumber = tabNumber - 1} else {tabNumber = tabNumber + 1}
                if (tabNumber < 0) {tabNumber = 9}
                if (tabNumber > 9) {tabNumber = 0}
            }
            guiEasy.popper.tab({"args":["tab", tabNumber]});
        }
    }
    helpEasy.addToLogDOM("key combo: " + keyCombo + " (" + keyboard.state + ")", 2);
};

guiEasy.popper.favicon = function () {
    let colors = {
        "inverted": "#2F4252",
        "sunny": "#FFD100",
        "info": "#FF8F12",
        "warning": "#EF483D",
        "success": "#00AE41",
        "font": "#FFFFFF"
    };
    let themeSetting = document.getElementById("custom-theme-settings").dataset;
    if (Object.keys(themeSetting).length > 0) {
        for (let i = 0; i < Object.keys(themeSetting).length; i++) {
            let x = Object.keys(themeSetting)[i].toString();
            let color = x.split(/(?=[A-Z])/).map(s => s.toLowerCase());
            colors[color[1]] = helpEasy.rgb2hex(themeSetting[x].split("|")[1]);
        }
    }
  helpEasy.favicon(colors);
};