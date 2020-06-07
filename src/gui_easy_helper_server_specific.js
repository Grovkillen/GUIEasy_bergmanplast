/* GUIEasy  Copyright (C) 2019-2020  Jimmy "Grovkillen" Westberg */

helpEasy.getDataFromNode = function (array, index, endpoint, ttl_fallback) {
    array[index]["scheduler"].shift();
    let timeStart = Date.now();
    let path = "http://" + array[index].ip + endpoint + "?callback=" + timeStart;
    let nextRun = Date.now() + array[index].stats[endpoint].TTL_fallback;
    fetch(path)
        .then(res => res.arrayBuffer())
        .then((arrayBuffer) => {
            return String.fromCharCode.apply(null, new Uint8Array(arrayBuffer))  //this part is done to allow for parsing ANSI files holding non-ANSI characters
        })
        .then((dataFromFile) => {
            array[index]["live"][endpoint] = {};
            array[index]["live"][endpoint].raw = dataFromFile;
            array[index]["live"][endpoint].data = helpEasy.iniFileToObject(dataFromFile, true);
            array[index]["live"][endpoint].timestamp = Date.now();
                if (array[index]["live"][endpoint].data.info.TTL !== undefined) {
                    array[index]["live"][endpoint].TTL = array[index]["live"][endpoint].data.info.TTL;
                } else {
                    array[index]["live"][endpoint].TTL = ttl_fallback;
                }
                array[index]["live"][endpoint].TTL_fallback = ttl_fallback;
                nextRun = Date.now() + array[index]["live"][endpoint].TTL;
                array[index].stats.error = 0;
            }
        )
        .catch(error => {
            helpEasy.addToLogDOM('Error fetching (' + endpoint + '): ' + error, 0, "error");
            array[index].stats.error++;
            guiEasy.fetchCount.error++;
        });
    array[index]["scheduler"].push([nextRun, endpoint]);
    array[index]["scheduler"].sort();
    array[index].stats["lastRun"] = Date.now();
    array[index].stats[endpoint].run = Date.now() - timeStart;
    array[index].stats[endpoint].timestamp = Date.now();
    guiEasy.fetchCount.current++;
    if (guiEasy.fetchCount.current === guiEasy.fetchCount.max) {
        guiEasy.current.live = index;
    }
};

helpEasy.updateGraphics = function () {
    guiEasy.current.gui = helpEasy.getCurrentIndex();
    let object = guiEasy.nodes[helpEasy.getCurrentIndex()]["live"];
    let keys = Object.keys(object);
    keys.map(key => {
        if (key.includes(".ini")) {
            object[key].data = helpEasy.iniFileToObject(object[key].raw, true);
            //update with new jobs
            let type = key.replace(/^.*[\\\/]/, '');
            helpEasy.updateGraphics[type](object[key].data);
        }
    });
    //update now in planners
    let style = document.documentElement.style;
    let midnight1 = new Date();
    let midnight2 = new Date();
    midnight1.setHours(0,0,0,0);
    midnight2.setHours(24,0,0,0);
    let partOfDay = Math.round((Date.now() - midnight1) / (midnight2 - midnight1)*100)/100;
    style.setProperty("--now-width", partOfDay.toString());
    //update clock
    helpEasy.updateGraphics.clock("digital");
};

helpEasy.updateGraphics.clock = function(type) {
    let date = new Date();

    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let hour, minute, second;

    if (type === "analog") {
        hours = ((hours + 11) % 12 + 1);
        hour = hours * 30;
        minute = minutes * 6;
        second = seconds * 6;

        document.querySelector('.analog-clock.hour').innerText = `rotate(${hour}deg)`;
        document.querySelector('.analog-clock.minute').style.transform = `rotate(${minute}deg)`;
        document.querySelector('.analog-clock.second').style.transform = `rotate(${second}deg)`;
    }
    if (type === "digital") {
        let month = '' + (date.getMonth() + 1);
        let day = '' + date.getDate();
        let year = date.getFullYear();
        month = ("0" + month).substr(-2,2);
        day = ("0" + day).substr(-2,2);

        hour = ("0" + hours).substr(-2,2);
        minute = ("0" + minutes).substr(-2,2);
        second = ("0" + seconds).substr(-2,2);

        document.querySelector('.digital-clock.hour').innerText = hour;
        document.querySelector('.digital-clock.minute').innerText = minute;
        document.querySelector('.digital-clock.second').innerText = second;
        document.querySelector('.digital-clock.date').innerText = [year, month, day].join('-');
    }
};

helpEasy.updateGraphics["jobb.ini"] = function (object) {
    if (object["jobb"] !== undefined) {
        let jobContainer = document.getElementById(object["maskin"]["id"]);
        if (object["maskin"]["id"] === null || jobContainer === undefined) {
            jobContainer = document.getElementById("unplanned-jobs");
        }
        let job = object["info"]["order"] + "-" + object["info"]["artikel"];
        helpEasy.createJobDivs(job, jobContainer);
        return;
    }
    if (object["ej planerade"]["antal"] > 0) {
        let jobContainer = document.getElementById("unplanned-jobs");
        let jobs = object["ej planerade"]["jobb"];
        jobs.map(job => {
            helpEasy.createJobDivs(job, jobContainer);
        });
    }
    if (object["planerade"]["antal"] > 0) {
        let jobContainer = document.body;
        let jobs = object["planerade"]["jobb"];
        jobs.map(job => {
            helpEasy.createJobDivs(job, jobContainer);
        });
    }
};

helpEasy.createJobDivs = function(job, jobContainer) {
        let jobLength = 0.1; //2.4 hour as fall back
        let jobLengthBefore = 0.042; //1 hour as fall back
        let jobLengthAfter = 0.042; //1 hour hour as fall back
        let element = document.getElementById(job);
        let jobData = guiEasy.nodes[helpEasy.getCurrentIndex()]["live"]["jobb/" + job + "/jobb.ini"];
        if (helpEasy.findInArray(job, guiEasy.tender.ids) === -1) {
            guiEasy.tender.ids.push(job);
            helpEasy.scheduleFetch(guiEasy.nodes, helpEasy.getCurrentIndex(), "jobb/" + job + "/jobb.ini");
        } else if (jobData !== undefined && element === null && helpEasy.findInArray(job, guiEasy.tender.ids) > -1) {
            //no element exist, create it
            element = document.createElement("div");
            element.id = job;
            element.dataset["machine"] = jobData.data.maskin.id;
            element.innerHTML = `
                        <div class="job" id="job-` + job + `">` + job + `</div>
                        <button class="approve main-info" onclick="helpEasy.approveForManufacturing(event)" data-job="` + job + `"` + ` data-machine="` + jobData.data.maskin.id + `"></button>
                        <div class="beskrivning" id="job-beskrivning-` + job + `">` + jobData.data.info.beskrivning + `</div>
                        <div class="antal" id="job-antal-` + job + `">` + jobData.data.jobb.antal + ` ` + jobData.data.jobb.enhet + `</div>
                        <div class="antal" id="job-tid-` + job + `">` + Math.round((jobLengthBefore+jobLength+jobLengthAfter)*240)/10 + ` timmar</div>
                    `;
            element.style.cssText = "--width-job: " + jobLength + "; --width-before: " + jobLengthBefore + "; --width-after: " + jobLengthAfter + ";";
            element.className = "post-it";
            element.draggable = false;
            element.setAttribute("ondragstart", "helpEasy.drag(event)");
            jobContainer.appendChild(element);
        } else if (typeof(element) !== "undefined" && element !== null) {
                let artikelData = guiEasy.nodes[helpEasy.getCurrentIndex()]["live"]["artikel/" + jobData.data.info.artikelnummer + "/artikel.ini"];
                if (artikelData !== undefined && jobData.data.jobb.enhet === "m" && typeof parseFloat((artikelData.data.info["m per timme"])) === "number") {
                    jobLength =  (jobData.data.jobb.antal / artikelData.data.info["m per timme"])/24;
                }
                if (artikelData !== undefined && jobData.data.jobb.enhet === "st") {
                    jobLength = 1;
                }
            if (artikelData === undefined) {
                console.log(jobData.data.info.artikelnummer);
            }
                let elementStyle = "--width-job: " + jobLength + "; --width-before: " + jobLengthBefore + "; --width-after: " + jobLengthAfter + ";";
                if (element.style.cssText !== elementStyle) {
                    element.style.cssText = elementStyle;
                }
                let lookup = [
                    ["job-", job],
                    ["job-beskrivning-", jobData.data.info.beskrivning],
                    ["job-antal-", jobData.data.jobb.antal + " " + jobData.data.jobb.enhet],
                    ["job-tid-", Math.round((jobLengthBefore+jobLength+jobLengthAfter)*240)/10 + " timmar"]
                ]
                for (let i = 0; i < lookup.length; i++) {
                    let subElement = document.getElementById(lookup[i][0] + job);
                    if (subElement.innerText !== lookup[i][1]) {
                        subElement.innerText = lookup[i][1];
                    }
                }
            }
};

helpEasy.updateGraphics["artikel.ini"] = function (object) {
    if (object["info"]["antal"] === undefined) {
        //return;
    }
    if (object["info"]["antal"] > 0) {
        for (let i = 0; i < object["info"]["artiklar"].length; i++) {
            if (helpEasy.findInArray(object["info"]["artiklar"][i].toLowerCase(), guiEasy.tender.ids) === -1) {
                guiEasy.tender.ids.push(object["info"]["artiklar"][i]);
                let endpoint = "artikel/" + object["info"]["artiklar"][i] + "/artikel.ini";
                helpEasy.scheduleFetch(guiEasy.nodes, helpEasy.getCurrentIndex(), endpoint);
            }
        }
    }
};

helpEasy.updateGraphics["maskin.ini"] = function (object) {
    if (object["info"]["antal maskiner"] === undefined) {
        //return;
    }
    if (object["info"]["antal maskiner"] > 0) {
        let machineContainer = document.getElementById("planering-container");
        if (guiEasy.nodes[helpEasy.getCurrentIndex()]["machines"] === undefined) {
            guiEasy.nodes[helpEasy.getCurrentIndex()]["machines"] = {};
        }
        for (let i = 1; i < (object["info"]["antal maskiner"] + 1); i++) {
            let machine = object["maskin " + i];
            let element = document.getElementById("machine-" + i);
            if (helpEasy.findInArray(machine.extruder.toLowerCase(), guiEasy.tender.ids) === -1) {
                guiEasy.tender.ids.push(machine.extruder.toLowerCase());
                let endpoint;
                if (machine.grupp === null) {
                    endpoint = "maskin/" + machine.extruder + "/maskin.ini";
                } else {
                    endpoint = "maskin/" + machine.grupp + "/" + machine.extruder + "/maskin.ini";
                }
                helpEasy.scheduleFetch(guiEasy.nodes, helpEasy.getCurrentIndex(), endpoint);
                if (typeof (element) !== "undefined" && element !== null) {
                    //we should update the existing element if needed
                    document.getElementById("planner-" + i).innerHTML = helpEasy.generateLabelsOfDates();
                } else {
                    //no element exist, create it
                    element = document.createElement("div");
                    element.id = machine.extruder;
                    element.setAttribute("data-machine", machine.extruder);
                    element.setAttribute("data-unique", "machine-" + i);
                    element.setAttribute("data-group", machine.grupp);
                    element.innerHTML = `
                                    <div class="name" id="machine-place-` + machine.extruder + `">` + machine.extruder + `: <div id="machine-` + machine.extruder + `-current-job"> </div> 
                                      <button class="que" onclick="helpEasy.reSchedule(event)" data-machine="` + machine.extruder + `"` + ` data-group="` + machine.grupp + `" > 
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px"><path d="M 3 4.5 A 1.5 1.5 0 0 0 1.5 6 A 1.5 1.5 0 0 0 3 7.5 A 1.5 1.5 0 0 0 4.5 6 A 1.5 1.5 0 0 0 3 4.5 z M 8 5 A 1.0001 1.0001 0 1 0 8 7 L 21 7 A 1.0001 1.0001 0 1 0 21 5 L 8 5 z M 3 10.5 A 1.5 1.5 0 0 0 1.5 12 A 1.5 1.5 0 0 0 3 13.5 A 1.5 1.5 0 0 0 4.5 12 A 1.5 1.5 0 0 0 3 10.5 z M 8 11 A 1.0001 1.0001 0 1 0 8 13 L 21 13 A 1.0001 1.0001 0 1 0 21 11 L 8 11 z M 3 16.5 A 1.5 1.5 0 0 0 1.5 18 A 1.5 1.5 0 0 0 3 19.5 A 1.5 1.5 0 0 0 4.5 18 A 1.5 1.5 0 0 0 3 16.5 z M 8 17 A 1.0001 1.0001 0 1 0 8 19 L 21 19 A 1.0001 1.0001 0 1 0 21 17 L 8 17 z"/></svg>
                                      </button>
                                    </div>
                                    <div class="planner" id="planner-` + i + `"> ` + helpEasy.generateLabelsOfDates() + `</div>
                                    <div class="planner-now"></div>
                                    <div class="job-container" id="jobs-machine-` + machine.extruder + `"></div>
                                `;
                    element.className = "machine";
                    element.setAttribute("ondrop", "helpEasy.drop(event)");
                    element.setAttribute("ondragover", "helpEasy.allowDrop(event)");
                    if (machine.grupp !== null) {
                        let id = machine.grupp.replace("-", "_");
                        id = id.replace(" ", "-") + "-area";
                        let container = document.getElementById(id);
                        if (typeof (container) !== "undefined" && container !== null) {
                            //we already got the container
                            container.appendChild(element);
                        } else {
                            //
                            let group = document.createElement("div");
                            group.id = id;
                            group.className = "area";
                            group.innerHTML = `
                            <div class="area-title">` + machine.grupp
                                + `<button id="button-min-` + id + `" data-click="area-min-` + id + `">` + guiEasy.curly.icon(["minimize"]) + `</button>`
                                + `<button id="button-max-` + id + `" data-click="area-max-` + id + `"` + ` class="is-hidden">` + guiEasy.curly.icon(["maximize"]) + `</button>
                            </div>
                        `;
                            group.appendChild(element);
                            machineContainer.appendChild(group);
                        }
                    } else {
                        machineContainer.appendChild(element);
                    }
                    setInterval( function() {
                        // this one will look for new planned but not placed DOM objects for "jobb"
                        let plannedDangling = document.querySelectorAll('[data-machine="' + machine.extruder + '"].post-it');
                        if (plannedDangling.length > 0) {
                            [...plannedDangling].map(dangler => {
                                element.getElementsByClassName("job-container")[0].appendChild(dangler);
                                dangler.removeAttribute("data-machine");
                            })
                        }
                    }, 1000);
                    setInterval( function() {
                        //this one will fix the order in the que
                        let currentList = element.getElementsByClassName("job-container")[0].childNodes;
                        let currentListIds = [];
                        for (let i = 0; i < currentList.length; i++) {
                            currentListIds.push(currentList[i].id);
                        }
                        let serverList = guiEasy.nodes[helpEasy.getCurrentIndex()]["live"]["maskin/" + machine.grupp + "/" + machine.extruder + "/maskin.ini"];
                        if (currentList.length > 1 && serverList.data !== undefined) {
                            //we have a list to sort...
                            serverList = serverList.data.planering.jobb;
                            for (let i = 0; i < serverList.length; i++) {
                                if (serverList[i].length > 0) {
                                    let jobToMove = document.getElementById(serverList[i]);
                                    let currentIndex = helpEasy.findInArray(serverList[i], currentListIds);
                                    if (i !== currentIndex) {
                                        element.getElementsByClassName("job-container")[0].appendChild(jobToMove);
                                    }
                                }
                            }
                        }
                    }, 1000);
                }
            }
        }
    }
};

helpEasy.updateGraphics["helgdagar.ini"] = function (object) {
    let year = new Date().getFullYear();
    let keys = Object.keys(object["årsdagar"]);
    keys.map(key => {
        let selector = ".date-" + year + "-" + key;
        let year2 = parseInt("" + year) + 1;
        selector += ", .date-" + year2 + "-" + key;
        let dates = document.querySelectorAll(selector);
        if (dates.length > 0) {
            for (let i = 0; i < dates.length; i++) {
                if (!dates[i].classList.contains("helgdag")) {
                    dates[i].classList.add("helgdag");
                    dates[i].innerText = object["årsdagar"][key];
                }
            }
        }
    });
    keys = Object.keys(object);
    keys.map(key => {
        if (!isNaN(parseInt(key))) {
            let subKeys = Object.keys(object[key]);
            if (subKeys.length > 0) {
                subKeys.map(subKey => {
                    let selector = ".date-" + key + "-" + subKey;
                    let dates = document.querySelectorAll(selector);
                    if (dates.length > 0) {
                        for (let i = 0; i < dates.length; i++) {
                            if (!dates[i].classList.contains("helgdag")) {
                                dates[i].classList.add("helgdag");
                                dates[i].innerText = object[key][subKey];
                            }
                        }
                    }
                })
            }
        }
    })
};

helpEasy.generateLabelsOfDates = function() {
    let d = new Date();
    let html = "";
    for (let i = 0; i < 91; i++) {
        let date = new Date(d.getTime() + 86400000 * i);
        let month = '' + (date.getMonth() + 1);
        let day = '' + date.getDate();
        let year = date.getFullYear();
        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day;
        }
        html += "<label class='date-" + [year, month, day].join('-') + "'>" + [year, month, day].join('-') + "</label>";
    }

    return html;
};

helpEasy.approveForManufacturing = function(event) {
    let eventDetails = {
        "type": "modal",
        "args": ["", "change", "job"]
    };
    guiEasy.popper.tryCallEvent(eventDetails);
    let machine = event.target.dataset.machine;
    let job = event.target.dataset.job;
    let jobContainer = document.getElementById("modal-view");
    jobContainer.innerHTML = `
            <div class="row">
                <input type="checkbox" id="id-cb" data-type="toggle" data-true-text="ej släppt för produktion" data-false-text="släppt för produktion" data-default-value="true">
                <label class="checkbox" id="label-id-ch" for="id-cb" tabindex="0">
                    <div class="">ej släppt för produktion</div>
                </label>
            </div>
    `;
};

helpEasy.reSchedule = function(event) {
    let eventDetails = {
        "type": "modal",
        "args": ["", "change", "order"]
    };
    guiEasy.popper.tryCallEvent(eventDetails);
    let machine = event.target.dataset.machine;
    let group = event.target.dataset.group;
    let jobs = document.getElementById("jobs-machine-" + machine).childNodes;
    let jobContainer = document.getElementById("modal-view");
    if (jobs.length === 0) {
        jobContainer.innerText = ("- tomt -").toUpperCase();
    } else {
        jobContainer.innerText = "";
        for (let i = 0; i < jobs.length; i++) {
            let job = document.createElement("div");
            job.classList.add("re-arrange-row");
            job.classList.add("post-it");
            job.draggable = true;
            job.setAttribute("data-machine", ' ' + machine + ' ');
            job.setAttribute("data-group", ' ' + group + ' ');
            job.setAttribute("data-id", ' ' + jobs[i].id + ' ');
            let description = document.getElementById("job-beskrivning-" + jobs[i].id).innerText;
            job.innerHTML = "<div class='job'>" + jobs[i].id + "</div>" + "<div class='beskrivning'>" + description + "</div>";
            jobContainer.appendChild(job);
        }
        const draggables = document.querySelectorAll(".re-arrange-row");
        let draggingElement = null;

        draggables.forEach(draggable => {
            draggable.addEventListener('dragstart', () => {
                draggable.classList.add('dragging');
                draggingElement = draggable;
            })

            draggable.addEventListener('dragend', () => {
                draggable.classList.remove('dragging');
                draggingElement = null;
            })

            draggable.addEventListener('dragover', e => {
                e.preventDefault();
                let targetElement = e.target;
                if (targetElement.className === "beskrivning" || targetElement.className === "job") {
                    targetElement = e.path[1];
                }
                if (targetElement.className === "re-arrange-row post-it dragging") {
                    return;  // we don't need to change anything
                }
                let cursorPosition = e.y;
                let elementPosition = targetElement.getBoundingClientRect();
                if (cursorPosition < (elementPosition.y + elementPosition.height / 2 )) {
                    draggingElement.before(targetElement);
                }
                if (cursorPosition > (elementPosition.y + elementPosition.height / 2 )) {
                    draggingElement.after(targetElement);
                }
                let index = Array.from(draggingElement.parentNode.children).indexOf(draggingElement);
                let args = `updatePlanner|
                            [job=` + draggingElement.getAttribute("data-id").trim() + `]
                            [addedTo=` + draggingElement.getAttribute("data-machine").trim() + `]
                            [addedToGroup=` + draggingElement.getAttribute("data-group").trim() + `]
                            [jobQueIndex=` + index + `]
                            `;
                helpEasy.webhook(args);
            })
        })
    }
    document.getElementById("modal-title-text").innerText = document.getElementById("modal-title-text").innerText.toUpperCase();
};

helpEasy.allowDrop = function(event) {
    event.preventDefault();
};

helpEasy.drop = function(event) {
    console.log(event);
    let id = event.dataTransfer.getData("text");
    let child = document.getElementById(id);
    let container = document.getElementById("jobs-machine-" + event.target.id);
    container.appendChild(child);
    let index = Array.from(container.children).indexOf(child);
    let args = `updatePlanner|
        [job=` + id + `]
        [addedTo=` + event.target.getAttribute("data-machine") + `]
        [addedToGroup=` + event.target.getAttribute("data-group") + `]
        [jobQueIndex=` + index + `]
    `;
    helpEasy.webhook(args);
};

helpEasy.drag = function(event) {
    event.dataTransfer.setData("text", event.target.id);
};

helpEasy.webhook = function (args) {
    args = args.replace(/[\n\r]/gm,"");
    args = args.replace(/\s/g,"");
    let formData = new FormData();
    formData.append("enctype", "application/x-www-form-urlencoded");
    let url = "/webhook?" + args;
    fetch(url, {
        method : "POST",
        body: formData
    }).then(
        response => response.text()
    );
};