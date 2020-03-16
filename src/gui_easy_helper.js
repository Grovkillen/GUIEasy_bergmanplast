/* GUIEasy  Copyright (C) 2019-2020  Jimmy "Grovkillen" Westberg */
// HERE WE PUT ALL OUR "THIS&THAT" FUNCTIONS
const helpEasy = {
    'copyToClipboard': function (str) {
        const el = document.createElement('textarea');
        el.value = str;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        const selected =
                document.getSelection().rangeCount > 0
                ? document.getSelection().getRangeAt(0)
                : false;
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        if (selected) {
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(selected);
        }
    },
    'swapKey2Value': function (json) {
        let ret = {};
        for(let key in json){
            ret[json[key]] = key;
        }
        return ret;
    },
    'rgb2hex': function (rgb) {
        rgb = rgb.split(",");
        let hex = "#";
        for (let i=0; i < rgb.length; i++) {
            hex += ( "0" + parseInt(rgb[i]).toString(16) ).substr(-2,2);
        }
        return hex;
    },
    'hex2rgb': function (hex) {
        return hex.match(/[A-Za-z0-9]{2}/g).map(function(v) { return parseInt(v, 16) }).join(",");
    },
    'invertHex': function (hex) {
        const hexCode = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
        let invertedHex = '#';
        hex.replace('#','').split('').forEach(i => {
            const index = hexCode.indexOf(i);
            invertedHex += hexCode.reverse()[index];
        });
        return invertedHex;
    },
    'int32binaryBool': function (obj, int, names, base, emptyString = "_emptyBit", length = 32) {
        let string = (int >>> 0).toString(2);
        //pad with zeros to make sure you got the correct number of 1/0 (MAX 64 int supported by the function
        string = ("0000000000000000000000000000000000000000000000000000000000000000" + string).slice(-length);
        let array = string.split("");
        for (let i = (array.length - 1); i > -1; i--) {
            let path = emptyString + i;
            if (names[i] !== undefined) {
                path = names[i];
            }
            set(obj, base + path, parseInt(array[i]));
        }
    },
    'cleanupWord' : function (word, commas = false) {
        word = word.replace(/_/g, " ");
        if (commas === true) {
            word = word.replace(/,/g, "<br>");
        }
        return word;
    },
    'capitalWord': function (str) {
        let allCaps = [
            "ac","ap",
            "bin","bssid",
            "cpu",
            "dc","dhcp","dns","dst",
            "esp",
            "gui","gw","gpio","gps",
            "http","https",
            "ip","id","i2c","io","ir",
            "json",
            "led","l/r","lcd",
            "md5","mqtt","mp3",
            "ntp",
            "ok","oled",
            "p2p",
            "rssi","ram","rfid",
            "ssid","spi","sda","scl","sta","ssl","smtp","sd",
            "ttn",
            "udp","uuid",
            "wpa"
        ];
        let reformat = [
            "AM2320","APDS9960","ADS1115",
            "BMP085/180","BMP280","BMx280","BH1750",
            "CO2","CSE7766",
            "DS18b20","DHT11/12/22","DMX512","DHT12",
            "FHEM",
            "GitHub","GP2Y10","GY-63",
            "HC-SR04","HT16K33","HLW8012/BL0937","HDC1080","HX711",
            "iButton","INA219","ID12LA/RDM6300",
            "LCD2004","LM75A","LoRa",
            "MCP23017","MCP3221","MH-Z19","MLX90614","MS5611","MPU6050","MPR121",
            "OpenHAB",
            "PCF8591","PCF8574","PCF8574/MCP23017","phpBB","PMSx003","POW","PCA9685","PN532",
            "RCW-0001","RN2483/RN2903",
            "SHT1x","SHT30/31/35","SGP30","SI7021/HTU21D","SSD1306","SSD1306/SH1106","SDS011/018/198","SMD120C/220T/230/630",
            "TSL2561","TSL2591","TCS32725","TCS34725","TSOP4838","TTP229",
            "VEML6040","VEML6070"
        ];
        let reformatCheck = [[],[],[],[],[]];
        for (let i = 0; i < reformat.length; i++) {
            reformatCheck[0].push(reformat[i].toLowerCase());
            reformatCheck[1].push("(" + reformat[i].toLowerCase());
            reformatCheck[2].push(reformat[i].toLowerCase() + ")");
            reformatCheck[3].push("(" + reformat[i].toLowerCase() + ")");
            reformatCheck[4].push(reformat[i].toLowerCase() + ",");
        }
        let allCapsCheck = [[],[],[],[],[]];
        for (let i = 0; i < allCaps.length; i++) {
            allCapsCheck[0].push(allCaps[i].toLowerCase());
            allCapsCheck[1].push("(" + allCaps[i].toLowerCase());
            allCapsCheck[2].push(allCaps[i].toLowerCase() + ")");
            allCapsCheck[3].push("(" + allCaps[i].toLowerCase() + ")");
            allCapsCheck[4].push(allCaps[i].toLowerCase() + ",");
        }
        let words = str.toLowerCase().split(" ");
        for (let i = 0; i < words.length; i++) {
            let index = helpEasy.findInArray(words[i], reformatCheck[0]);
            if (index > -1) {
                words[i] = reformat[index];
                continue;
            }
            index = helpEasy.findInArray(words[i], reformatCheck[3]);
            if (index > -1) {
                words[i] = "(" + reformat[index] + ")";
                continue;
            }
            index = helpEasy.findInArray(words[i], reformatCheck[1]);
            if (index > -1) {
                words[i] = "(" + reformat[index];
                continue;
            }
            index = helpEasy.findInArray(words[i], reformatCheck[2]);
            if (index > -1) {
                words[i] = reformat[index] + ")";
                continue;
            }
            index = helpEasy.findInArray(words[i], reformatCheck[4]);
            if (index > -1) {
                words[i] = reformat[index] + ",";
                continue;
            }
            //all caps
            index = helpEasy.findInArray(words[i], allCapsCheck[0]);
            if (index > -1) {
                words[i] = allCaps[index].toUpperCase();
                continue;
            }
            index = helpEasy.findInArray(words[i], allCapsCheck[3]);
            if (index > -1) {
                words[i] = "(" + allCaps[index].toUpperCase() + ")";
                continue;
            }
            index = helpEasy.findInArray(words[i], allCapsCheck[1]);
            if (index > -1) {
                words[i] = "(" + allCaps[index].toUpperCase();
                continue;
            }
            index = helpEasy.findInArray(words[i], allCapsCheck[2]);
            if (index > -1) {
                words[i] = allCaps[index].toUpperCase() + ")";
                continue;
            }
            index = helpEasy.findInArray(words[i], allCapsCheck[4]);
            if (index > -1) {
                words[i] = allCaps[index].toUpperCase() + ",";
                continue;
            }
            //if not found in any of the arrays.. camel case
            if (words[i].charAt(0) === "(") {
                words[i] = "(" + words[i].charAt(1).toUpperCase() + words[i].substring(2);
            } else {
                words[i] = words[i].charAt(0).toUpperCase() + words[i].substring(1);
            }
        }
        return words.join(" ");
    },
    'epochToHHMMSS': function(epoch = Date.now()) {
        let time = new Date(epoch);
        let timeHH = ("0" + time.getHours()).substr(-2,2);
        let timeMM = ("0" + time.getMinutes()).substr(-2,2);
        let timeSS = ("0" + time.getSeconds()).substr(-2,2);
        return timeHH + ":" + timeMM + ":" + timeSS;
    },
    'pingIP': async function (ipArray, isUpFunction, isDownFunction) {
        for (let i = 0; i < ipArray.length; i++) {
            let ip = ipArray[i].ip;
            let startPing = Date.now();
            let ws = await new WebSocket("ws://" + ip);
            ws.onclose = async () => {
                helpEasy.addToLogDOM("The above error is intentional. We do this to 'ping' the unit.", 0,"info");
            };
            ws.onerror = function() {
                ws.close();
                ws = null;
                isUpFunction(ipArray, i, (Date.now() - startPing));
            };
            setTimeout(function() {
                if(ws != null) {
                    ws.close();
                    ws = null;
                    isDownFunction(ipArray, i);
                }
            },2000);
        }
    },
    'handlePingResults': function (array, index, ping = null) {
        array[index].ping = {};
        //This is just a pointer, not a real ping. We divide the results in 3 to get a "close to real" value
        if (ping === null) {
            array[index].ping.result = -1;
        } else {
            array[index].ping.result = Math.round(ping / 3);
        }

        array[index].ping.timestamp = Date.now();
    },
    'bumpScheduler': function (array, index, endpoint) {
        let nextRun = Date.now() + 10;
        let x = array[index]["scheduler"];
        for (let i = 0; i < x.length; i++) {
            if (x[i][1] === endpoint) {
                x.splice(i, 1);
                x.push([nextRun, endpoint]);
                x.sort();
            }
        }
    },
    'schedulerBump': function (array, endpoint) {
        let index = 0;
        for (let i = 0; i < array.length; i++) {
            if (array[i][1] === endpoint) {
                index = i;
            }
        }
        array[index][0] = Date.now();
        array.sort();
    },
    'schedulerDelay': function (array, index, delay) {
        for (let i = 0; i < array[index]["scheduler"].length; i++) {
            array[index]["scheduler"][i][0] += delay;
        }
        array[index].stats.error = 0;
    },
    'getGuiInFields': function () {
        if (guiEasy.jsonPathsIN === undefined) {
            guiEasy.jsonPathsIN = [];
        }
        let z = guiEasy.jsonPathsIN;
        let x = document.querySelectorAll("[data-json-path]");
        for (let i = 0; i < x.length; i++) {
            let y = x[i].dataset.jsonPath;
            if (helpEasy.findInArray(y,z) === -1) {
                z.push(y);
            }
        }
        //jsonPathsIN is already set so we can reuse "z"
        if (guiEasy.jsonPathsSettings === undefined) {
            guiEasy.jsonPathsSettings = [];
        }
        z = guiEasy.jsonPathsSettings;
        x = document.querySelectorAll("[data-settings]");
        for (let i = 0; i < x.length; i++) {
            let y = x[i].dataset.settings;
            if (helpEasy.findInArray(y,z) === -1) {
                z.push(y);
            }
        }
        return z;
    },
    'ifStringContains': function (string, arrayOfWords) {
        let value = 0;
        arrayOfWords.forEach(function(word){
            value = value + string.includes(word);
        });
        return (value === arrayOfWords.length)
    },
    'twoLevelJsonToList': function (endpoint, index) {
        let x = guiEasy.nodes[index].live[endpoint];
        let html = "<div data-modal-table='" + endpoint + "' class='container modal-table' id='" + endpoint + "'>";
        let keysLevel1 = Object.keys(x);
        for (let i = 0; i < keysLevel1.length; i++) {
            let keysLevel2 = Object.keys(x[keysLevel1[i]]);
            if (keysLevel2.length < 1) {
                continue;
            }
            html += "<div class='is-left'>" + helpEasy.capitalWord(helpEasy.cleanupWord(keysLevel1[i])) + "</div>";
            html += "<table>";
            for (let j = 0; j < keysLevel2.length; j++) {
                let valueName = helpEasy.cleanupWord(keysLevel2[j]);
                let value = helpEasy.cleanupWord(x[keysLevel1[i]][keysLevel2[j]], true);
                if (value === "ThisIsTheDummyPlaceHolderForTheBinaryFilename64ByteLongFilenames") {
                    value = "...";
                }
                html += "<tr><td>" + helpEasy.capitalWord(valueName) + "</td><td>" + value + "</td></tr>";
            }
            html += "</table>";
        }
        html += `
                <div class='text-tiny is-left'>Fetched: ` + helpEasy.epochToHHMMSS(x.timestamp) + `</div>
                <div class='text-tiny is-left'>Scheduled: ` + helpEasy.epochToHHMMSS(x.timestamp + x.TTL) + `</div>
                </div>
                `;
        set(guiEasy.nodes[index], "modal.table." + endpoint , html);
        return html;
    },
    'guiUpdater': function () {
        let timeStart = Date.now();
        let index = helpEasy.getCurrentIndex();
        let x = guiEasy.nodes[index];
        if (guiEasy.jsonPathsIN === undefined) {
            guiEasy.jsonPathsIN = [];
        }
        let y = guiEasy.jsonPathsIN;
        for (let i = 0; i < y.length; i++) {
            let z = document.querySelectorAll("[data-json-path='" + y[i] + "']");
            for (let k = 0; k < z.length; k++) {
                let path = y[i].split("--");
                for (let u = 0; u < path.length; u++) {
                    if (z[k].innerHTML !== helpEasy.getjsonPathData(path, x)) {
                        z[k].innerHTML = helpEasy.getjsonPathData(path, x);
                    }
                }
            }
        }
        //update tab text
        //TODO: make it possible to have live data feed on tab
        let path = ("live--json--System--Unit Name").split("--");
        document.title = helpEasy.getjsonPathData(path, x);
        //update wifi icon(s)
        path = ("live--json--WiFi--RSSI").split("--");
        let bars = helpEasy.rssiToBars(helpEasy.getjsonPathData(path, x));
        let z = document.querySelectorAll("[name=unit-wifi-rssi-icon]");
        for (let i = 0; i < z.length; i++) {
            z[i].classList.remove("level-1","level-2","level-3","level-4","level-5");
            z[i].classList.add(bars);
        }
        //update system gauges
        z = document.querySelectorAll("[data-json-path-gauge]");
        for (let i = 0; i < z.length; i++) {
            helpEasy.gaugeLevel(z[i], x);
        }
        //update wifi modal path                                //TODO: consolidate these since they are essentially equal
        if (x.live.wifiscanner_json !== undefined) {
            helpEasy.wifilist(x.live.wifiscanner_json, index);
        } else {
            let pendingText = "<div data-modal-table='wifi' class='container modal-table'>" + guiEasy.fetchingWait + "</div>";
            set(guiEasy.nodes[index], "modal.table.wifi", pendingText);
        }
        //update files modal path
        if (x.live.filelist_json !== undefined) {
            helpEasy.filelist(x.live.filelist_json, index);
        } else {
            let pendingText = "<div data-modal-table='files' class='container modal-table'>" + guiEasy.fetchingWait + "</div>";
            set(guiEasy.nodes[index], "modal.table.files", pendingText);
        }
        //update sysinfo modal path
        if (x.live.sysinfo_json !== undefined) {
            helpEasy.twoLevelJsonToList("sysinfo_json", index);
        } else {
            let pendingText = "<div data-modal-table='sysinfo_json' class='container modal-table'>" + guiEasy.fetchingWait + "</div>";
            set(guiEasy.nodes[index], "modal.table.sysinfo_json", pendingText);
        }
        //update timingstats modal path
        if (x.live.timingstats_json !== undefined) {
            helpEasy.timingstatsList(x.live.timingstats_json, index);
        } else {
            let pendingText = "<div data-modal-table='timingstats_json' class='container modal-table'>" + guiEasy.fetchingWait + "</div>";
            set(guiEasy.nodes[index], "modal.table.timingstats_json", pendingText);
        }
        //update tables
        z = document.querySelectorAll("[data-modal-table]");
        for (let i = 0; i < z.length; i++) {
            let type = z[i].dataset.modalTable;
            let data = guiEasy.nodes[index].modal.table[type];
            let newInnerHTML = helpEasy.parseHTMLstring(data, "query", '[data-modal-table="' + type + '"]');
            if (z[i].innerHTML !== newInnerHTML) {
                z[i].innerHTML = newInnerHTML
            }
        }
        //task values update, and we need to clean up the non-live once if there's any
        let t = guiEasy.maxTasks();
        let v = guiEasy.maxValuesPerTask();
        x = guiEasy.nodes[index].live.json.Sensors;
        let valueMatrix = [...Array(t)].map(x =>Array(v).fill(""));
        let taskMatrix = [...Array(t)].fill("");
        for (let i = 0; i < x.length; i++) {
            let values = x[i].TaskValues;
            let controllers = x[i].DataAcquisition;
            let taskNumber = x[i].TaskNumber;
            let taskName = x[i].TaskName;
            let taskEnabled = x[i].TaskEnabled;
            let plugin = x[i].Type;
            let pluginNumber = "P" + ("000" + x[i]["taskNumber"]).slice(-3);
            let gpio = guiEasy.nodes[helpEasy.getCurrentIndex()].settings;
            if (gpio === undefined) {
                gpio = ""
            } else {
                gpio = gpio.tasks[(taskNumber-1)];
            }
            let gpios = [];
            for (let k = 1; k < 100; k++) {
                if (gpio["gpio"+k] === undefined) {
                    continue;
                }
                if (gpio["gpio"+k] !== 0 && gpio["gpio"+k] !== 255) {
                    gpios.push(gpio["gpio"+k]);
                }
            }
            if (gpios.length > 0) {
                gpio = gpios.join(", ");
            } else {
                gpio = "";
            }
            let arrayControllers = [];
            for (let k = 0; k < controllers.length; k++) {
                if (controllers[k].Enabled === "true") {
                    if (controllers[k].IDX > 0) {
                        arrayControllers.push(controllers[k].Controller + " (" + controllers[k].IDX + ")");
                    } else {
                        arrayControllers.push(controllers[k].Controller);
                    }
                }
            }
            if (arrayControllers.length > 0) {
                controllers = arrayControllers.join(", ");
            } else {
                controllers = "";
            }
            taskMatrix[(taskNumber - 1)] = {
                "plugin": plugin,
                "port": "",
                "controller": controllers,
                "gpio": gpio,
                "enabled": taskEnabled,
                "name": taskName
            };
            for (let j = 0; j < values.length; j++) {
                let valueName = values[j].Name;
                let value = values[j].Value;
                let valueNumber = values[j].ValueNumber;
                let valueDecimals = values[j].NrDecimals;
                valueMatrix[(taskNumber - 1)][(valueNumber - 1)] = {
                    "name": valueName,
                    "value": value.toFixed(valueDecimals)
                }
            }
        }
        for (let i = 0; i < t; i++) {
            if (taskMatrix[i].name === undefined) {
                helpEasy.clearTaskValues(i);
                continue;
            }
            let pathT = "task-" + (i + 1) + "-";
            let keys = ["plugin", "port", "controller", "gpio"];
            for (let k = 0; k < keys.length; k++) {
                let keyPath = keys[k];
                if (taskMatrix[i][keyPath] !== "") {
                    if (document.getElementById(pathT + keyPath).innerText !== taskMatrix[i][keyPath]) {
                        document.getElementById(pathT + keyPath).innerText = taskMatrix[i][keyPath];
                    }
                    document.getElementById(pathT + keyPath + "-row").classList.remove("is-hidden");
                }
            }
            //the name is on the values column
            if (document.getElementById(pathT + "name").innerText !== taskMatrix[i].name) {
                document.getElementById(pathT + "name").innerText = taskMatrix[i].name;
            }
            for (let j = 0; j < v; j++) {
                if (valueMatrix[i][j] === "" || valueMatrix[i][j].name === "") {
                    helpEasy.clearTaskValues(i, j);
                    continue;
                }
                let pathV = pathT + "value-" + (j + 1) + "-";
                document.getElementById(pathV + "row").classList.remove("is-hidden");
                if (taskMatrix[i].enabled === "true") {
                    document.getElementById(pathV + "row").classList.remove("not-enabled");
                } else {
                    document.getElementById(pathV + "row").classList.add("not-enabled");
                }
                if (j > 0) {
                    document.getElementById(pathV + "hr").classList.remove("is-hidden");
                }
                if (document.getElementById(pathV + "name").innerText !== valueMatrix[i][j].name) {
                    document.getElementById(pathV + "name").innerText = valueMatrix[i][j].name;
                }
                if (document.getElementById(pathV + "value").innerText !== valueMatrix[i][j].value) {
                    document.getElementById(pathV + "value").innerText = valueMatrix[i][j].value;
                }
            }
        }
        //controller update

        //populate the stats
        guiEasy.current.gui = index;
        if (guiEasy.nodes[index].stats["gui"] === undefined) {
            guiEasy.nodes[index].stats["gui"] = {};
        }
        guiEasy.nodes[index].stats["gui"].run = Date.now() - timeStart;
        guiEasy.nodes[index].stats["gui"].timestamp = timeStart;
    },
    'downloadFile': function (url, fileName) {
        //TODO: catch error!
        fetch(url).then(function(t) {
            return t.blob().then((b)=>{
                    let a = document.createElement("a");
                    a.href = URL.createObjectURL(b);
                    a.download = fileName;
                    a.click();
                }
            );
        });
    },
    'uploadBinaryAsFile': function (what, file, elementID) {
        let uploadSpeed;  //This is a bogus value just to get the upload percentage until fetch have this natively!
        let maxSize;
        let endpoint;
        let label = document.getElementById("label-" + elementID);
        let labelText = label.innerText;
        if (what === "generic") {
            uploadSpeed = 35;  //this is an average speed for generic files
            endpoint = "/upload";
            maxSize = guiEasy.nodes[helpEasy.getCurrentIndex()].live.sysinfo_json.storage.spiffs_free;
        }
        if (what === "firmware") {
            helpEasy.schedulerDelay(guiEasy.nodes, helpEasy.getCurrentIndex(), 60 * 1000);
            uploadSpeed = 25;  //since the firmware is also written and not only uploaded the speed is a bit lower compared to the generic upload...
            endpoint = "/update";
            maxSize = guiEasy.nodes[helpEasy.getCurrentIndex()].live.sysinfo_json.storage.sketch_free;
        }
        maxSize = maxSize * 1000;
        if (maxSize < file.size) {
            label.innerText = helpEasy.capitalWord("file size too big!");
            helpEasy.blinkElement(label.id, "warning");
            setTimeout(function () {
                helpEasy.blinkElement(label.id, "warning");
            }, 500);
            setTimeout(function () {
                label.innerText = labelText;
            }, 750);
        } else {
            label.innerText = file.name;
            let timeout = 100;
            let fullUpload = file.size / uploadSpeed / timeout;
            let i = 0;
            let timer = setInterval(function () {
                i++;
                let percentage = Math.floor(i / fullUpload * 100);
                if (percentage > 100) {
                    percentage = 100;
                }
                label.innerText = file.name + " (" + percentage + "%)";
            }, timeout);
            let formData = new FormData();
            formData.append("file", file);
            formData.append("name", what);
            formData.append("enctype", "multipart/form-data");
            let url = "http://" + guiEasy.nodes[helpEasy.getCurrentIndex()].ip + endpoint;
            fetch(url, {
                method : "POST",
                body: formData
            }).then(
                response => response.text()
            ).then(
                html => {
                    clearInterval(timer);
                    label.innerText = file.name + " (100%)";
                    helpEasy.addToLogDOM(html, 3);
                    setTimeout(function () {
                        helpEasy.blinkElement(label.id, "success");
                    }, 500);
                    if (what === "generic") {
                        setTimeout(function () {
                            helpEasy.schedulerBump(guiEasy.nodes[helpEasy.getCurrentIndex()].scheduler, "sysinfo_json");
                            helpEasy.schedulerBump(guiEasy.nodes[helpEasy.getCurrentIndex()].scheduler, "filelist_json");
                            label.innerText = labelText;
                            helpEasy.updateIndicator();
                        }, 900);
                    }
                    if (what === "firmware") {
                        helpEasy.schedulerBump(guiEasy.nodes[helpEasy.getCurrentIndex()].scheduler, "sysinfo_json");
                        let count = 30;
                        let countdown = setInterval(function () {
                            label.innerText = "Will reboot in " + count;
                            count--;
                            if (count < 1) {
                                clearInterval(countdown);
                                location.reload();
                            }
                        }, 1000);
                    }
                }
            );
        }
    },
    'updateIndicator': async function () {
        setTimeout(function () {
            let storage = guiEasy.nodes[helpEasy.getCurrentIndex()].live.sysinfo_json.storage;
            let availablePercentage = Math.floor(parseInt(storage.spiffs_free) / parseInt(storage.spiffs_size) * 100);
            let free = document.getElementById("modal-input-upload-storage-free");
            let occupied = document.getElementById("modal-input-upload-storage-occupied");
            free.style.width = availablePercentage + "%";
            free.innerText = parseInt(storage.spiffs_free) + "kB";
            occupied.style.width = (100 - availablePercentage) + "%";
            occupied.innerText = (parseInt(storage.spiffs_size) - parseInt(storage.spiffs_free)).toString() + "kB";
        }, 5000);
    },
    'parseHTMLstring': function (string, parse, query) {
        //Will only return first object's inner html
        let temp = document.createElement( 'html' );
        temp.innerHTML = string;
        let results = "";
        if (parse === "tag") {
            results = temp.getElementsByTagName(query)[0].innerHTML.toString();
        }
        if (parse === "name") {
            results = temp.getElementsByName(query)[0].innerHTML.toString();
        }
        if (parse === "class") {
            results = temp.getElementsByClassName(query)[0].innerHTML.toString();
        }
        if (parse === "id") {
            results = temp.getElementById(query).innerHTML.toString();
        }
        if (parse === "query") {
            results = temp.querySelectorAll(query)[0].innerHTML.toString();
        }
        temp.remove();
        return results;
    },
    'guiUpdaterSettings': function (type) {
        let x = guiEasy.nodes[helpEasy.getCurrentIndex()];
        let u = defaultSettings;
        let y = helpEasy.getGuiInFields();
        if (type === undefined) {
            type = "settings";
        } else {
            type = "settingsBrowser";
        }
        for (let i = 0; i < y.length; i++) {
            let z = document.querySelectorAll("[data-settings='" + y[i] + "']");
            for (let k = 0; k < z.length; k++) {
                let m = x;
                let path = (type + "--" + y[i]).split("--");
                if (y[i].split("--")[0] === "defaultSettings") {
                    path = y[i].split("--").slice(1);
                    m = u;
                }
                for (let u = 0; u < path.length; u++) {
                    let d = z[k].dataset;
                    //populate by type of setting
                    if (d.type === "string") {
                        z[k].value = helpEasy.getjsonPathData(path, m);
                        if (d.settingsIp === "true") {
                            z[k].value = helpEasy.getjsonPathData(path, m).join(".");
                        }
                        if (d.valueIfBlank === z[k].value) {
                            z[k].value = "";
                        }
                    }
                    if (d.type === "dropdown") {
                        if (d.list2value === "true") {
                            let optionList = [];
                            for (let i = 0; i < z[k].options.length; i++) {
                                optionList.push(parseInt(z[k].options[i].value));
                            }
                            z[k].options.selectedIndex = optionList.indexOf(helpEasy.getjsonPathData(path, m)) - parseInt(z[k].dataset.optionListOffset);
                        } else {
                            if (helpEasy.getjsonPathData(path, m) === 255) {
                                z[k].options.selectedIndex = 0;
                            } else {
                                z[k].options.selectedIndex = helpEasy.getjsonPathData(path, m) - parseInt(z[k].dataset.optionListOffset);
                            }
                        }
                    }
                    if (d.type === "password") {
                        z[k].value = helpEasy.getjsonPathData(path, m);
                        if (d.valueIfBlank === z[k].value) {
                            z[k].value = "";
                        }
                    }
                    if (d.type === "number") {
                        z[k].value = helpEasy.getjsonPathData(path, m);
                    }
                    if (d.type === "toggle") {
                        z[k].checked = d["change-" + helpEasy.getjsonPathData(path, m)] === "true";
                        let label = document.getElementById("label-" + d.id);
                        if (d.gotTooltip === "") {
                            label.innerHTML = "<div>" + helpEasy.capitalWord(d[z[k].checked + "Text"]) + "</div>";
                        } else {
                            label.innerHTML = "<div class=" + d.gotTooltip + ">" + helpEasy.capitalWord(d[z[k].checked + "Text"]) + d.tooltip + "</div>";
                        }
                    }
                }
            }
        }
    },
    'getjsonPathData': function (path, json) {
        //TODO: this can probably be made more elegant?
        if (path.length === 1) {
            return json[path[0]];
        }
        if (path.length === 2) {
            return json[path[0]][path[1]];
        }
        if (path.length === 3) {
            return json[path[0]][path[1]][path[2]];
        }
        if (path.length === 4) {
            return json[path[0]][path[1]][path[2]][path[3]];
        }
        if (path.length === 5) {
            return json[path[0]][path[1]][path[2]][path[3]][path[4]];
        }
        if (path.length === 6) {
            return json[path[0]][path[1]][path[2]][path[3]][path[4]][path[5]];
        }
        if (path.length === 7) {
            return json[path[0]][path[1]][path[2]][path[3]][path[4]][path[5]][path[6]];
        }
        if (path.length === 8) {
            return json[path[0]][path[1]][path[2]][path[3]][path[4]][path[5]][path[6]][path[7]];
        }
        if (path.length === 9) {
            return json[path[0]][path[1]][path[2]][path[3]][path[4]][path[5]][path[6]][path[7]][path[8]];
        }
        if (path.length === 10) {
            return json[path[0]][path[1]][path[2]][path[3]][path[4]][path[5]][path[6]][path[7]][path[8]][path[9]];
        }
    },
    'sortObjectArray': (propName) =>
        (a, b) => a[propName] === b[propName] ? 0 : a[propName] < b[propName] ? -1 : 1
    ,
    'addToLogDOM': function (str, level, type = "log") {
        if (str === "pageSize") {
            str = document.documentElement.innerHTML.toString().split("").length;
            let currentSize = guiEasy.guiStats.pageSize;
            if (currentSize === 0) {
                guiEasy.guiStats["startSize"] = str;
            }
            guiEasy.guiStats.pageSize += str;
            str = "total page size: " + Math.round(str/1024) + "kB";
        }
        if (guiEasy.logLevel >= level) {
            msg[type](str);
        }
    },
    'numberOfFound': function (str, pattern) {
        return ((str || '').match(pattern) || []).length;
    },
    'findInArray': function (needle, haystack) {
        let lowercaseHaystack = [];
        for (let i = 0; i < haystack.length; i++) {
            lowercaseHaystack.push(haystack[i].toLowerCase());
        }
        return lowercaseHaystack.indexOf(needle);
    },
    'listOfProcesses': function (processID, processText, timestamp, type) {
        let logElement = document.getElementById("modal-loading-log");
        let progressElement = document.getElementById("modal-loading-progress");
        let spinnerElement = document.getElementById("fallback-loading-animation");
        spinnerElement.classList.add("is-hidden");
        logElement.innerHTML += "<div class='" + type + "' id='log-entry-" + processID + "' data-timestart='" + timestamp + "'>" + processText + "</div>";
        progressElement.max = guiEasy[type].length;
        if (guiEasy.guiStats[type] === undefined) {
            guiEasy.guiStats[type] = {};
        }
        guiEasy.guiStats[type][processID] = "running";
    },
    'processDone': function (processID, type) {
        let progressElement = document.getElementById("modal-loading-progress");
        let logRow = document.getElementById("log-entry-" + processID);
        let runtime = Date.now() - logRow.dataset.timestart;
        guiEasy.guiStats.bootTime += runtime;
        logRow.innerHTML += " (" + runtime + "ms)";
        logRow.classList.add("loading-is-done");
        if (type === "startup") {
            if (progressElement.max === progressElement.value) {
                //lets close the loading page
                let modalBackground = document.getElementById("modal-container");
                let loadingPage = document.getElementById("modal-loading-screen");
                modalBackground.classList.remove("is-black");
                modalBackground.classList.add("is-hiding");
                loadingPage.classList.add("is-hidden");
                setTimeout(function () {
                    modalBackground.classList.add("is-hidden");
                    modalBackground.classList.remove("is-hiding");
                }, (500));
                helpEasy.addToLogDOM("total boot time: " + guiEasy.guiStats.bootTime + "ms", 1);
            }
            progressElement.value++;
        }
        guiEasy.guiStats[type][processID] = "done";
    },
    'internet': function () {
        let internet = false;
        if (window.navigator.onLine === true) {
            internet = true;
        }
        return internet;
    },
    'welcomePhrase': function () {
        let now = new Date;
        let hour = now.getHours();
        if (hour > 17) {
            return "God kväll!"
        }
        if (hour > 11) {
            return "God eftermiddag!"
        }
        if (hour > 5) {
            return "God morgon!"
        }
        return "Hej!"
    },
    'urlParams': function () {
        let params = {};
        window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            params[key.toLowerCase()] = value.toLowerCase();
        });
        return params;
    },
    'locationByIP': async function () {
        let timestamp = Date.now();
        let path = "https://ipapi.co/json" + "?at=" + timestamp + "&gui=" + guiEasy.geekNameFull();
        let response = await fetch(path);  //TODO: catch error!
        return await response.json();
    },
    'blinkElement': function (id, color) {
        let element;
        if (typeof id === "object") {
            element = id;
        } else {
            element = document.getElementById(id);
        }
        element.classList.add("main-" + color);
        setTimeout(function (){
            element.classList.remove("main-" + color);
        }, 250)
    },
    'dashGroupContainerOpen': function (title = "") {
        if (title === "") {
            return "<div class='group-container'>";
        } else {
            return "<div class='group-container'>" + helpEasy.capitalWord(title) + "<hr>";
        }
    },
    'dashBoxContainerOpen': function () {
        return "<div class='box-container'>";
    },
    'dashContainerClose': function () {
        return "</div>";
    },
    'addToolsButton': function (args) {
        let html = "";
        let type = args.type;
        let color = "";
        if (args.color !== undefined) {
            color = " main-" + args.color;
        }
        if (type === "command") {
            html += `
                <div class='dash-box'>
                    <button class='dash-button` + color + `' data-click="` + args.buttonAction + `" data-args="`
                        + JSON.stringify(args).replace(/"/g, "'")
                        + `">{{ICON-` + args.icon.toUpperCase() + `}}</button>
                    <div class="dash-text text-little">` + helpEasy.capitalWord(args.text) + `</div>
                </div>
            `;
        }
        if (type === "info") {
            html += `
                <div class='dash-box'>
                    <button data-click="` + args.buttonAction + `">` + helpEasy.capitalWord(args.button) + `</button>
                    <div class="dash-text text-little">` + helpEasy.capitalWord(args.text) + `</div>
                </div>
            `;
        }
        if (type === "scanner") {
            html += `
                <div class='dash-box'>
                    <button class='main-inverted' data-click="` + args.buttonAction + `">` + helpEasy.capitalWord(args.button) + `</button>
                    <div class="dash-text text-little">` + helpEasy.capitalWord(args.text) + `</div>
                </div>
            `;
        }
        if (type === "system") {
            html += `
                <div class='dash-box'>
                    <button class='main-font' data-click="` + args.buttonAction + `">` + helpEasy.capitalWord(args.button) + `</button>
                    <div class="dash-text text-little">` + helpEasy.capitalWord(args.text) + `</div>
                </div>
            `;
        }
        return html;
    },
    'addInput': function (args) {
        let type = args.type;
        let disabled = "";
        if (args.disabled !== undefined && args.disabled === true) {
            disabled = "disabled";
        }
        let id;
        if (args.settingsId === undefined) {
            id = args.title.split(" ").join("-");
        } else {
            id = args.settingsId;
        }
        let settingsIdPrefix = "generic-input--";
        let datasetBlob = "";
        let prefixHTML = "";
        let appendixHTML = "";
        if (args.toSettings === true) {
            settingsIdPrefix = "settings--input--";
            datasetBlob += 'data-settings="' + args.settingsId + '"';
        }
        if (args.settingsIP !== undefined) {
            datasetBlob += 'data-settings-ip="' + args.settingsIP + '"';
        }
        if (args.settingsRegEx !== undefined) {
            datasetBlob += 'data-settings-regex="' + args.settingsRegEx + '"';
        }
        if (args.valueIfBlank !== undefined) {
            datasetBlob += 'data-value-if-blank="' + args.valueIfBlank + '"';
        }
        if (args.allowedBlank !== undefined) {
            datasetBlob += 'data-allowed-blank="' + args.allowedBlank + '"';
        }
        if (args.optionListOffset !== undefined) {
            datasetBlob += 'data-option-list-offset="' + args.optionListOffset + '"';
        }
        if (args.list2value !== undefined) {
            datasetBlob += 'data-list2value="' + args.list2value + '"';
        }
        if (args.prefixHTML !== undefined) {
            prefixHTML = args.prefixHTML;
        }
        if (args.appendixHTML !== undefined) {
            appendixHTML = args.appendixHTML;
        }
        id = settingsIdPrefix + id;
        let tooltip = "";
        let gotTooltip = "";
        if (args.tooltip !== undefined) {
            tooltip = "<div class='tooltip'>" + args.tooltip + "</div>";
            gotTooltip = "got-tooltip";
        }
        let html = "<div class='row'>" + prefixHTML;
        if (type === "string") {
            html += "<span class='" + gotTooltip + "'>" + helpEasy.capitalWord(args.title) + tooltip + "</span>";
            html += `
                <input  spellcheck='false'
                        type='text'
                        id='` + id + `'
                        data-id='` + id + `'
                        data-type="string"
                        data-alt='` + args.alt + `'
                        data-settings="` + args.settingsId + `"
                        placeholder='` + args.placeholder + `'
                        value='` + args.default + `'
                        ` + datasetBlob + `
                        data-input-string="` + args.settingsMaxLength + `">
                `;
        }
        if (type === "password") {
            html += "<span class='" + gotTooltip + "'>" + helpEasy.capitalWord(args.title) + tooltip + "</span>";
            html += `
                <input  spellcheck='false'
                        type='password'
                        id='` + id + `'
                        data-id="` + id + `"
                        data-type="password"
                        data-alt='` + args.alt + `'
                        data-settings="` + args.settingsId + `"
                        placeholder='` + args.placeholder + `'
                        ` + datasetBlob + `
                        data-input-password="` + args.settingsMaxLength + `">
                `;
        }
        if (type === "dropdown") {
            let split = (args.settingsId).split("--");
            let guiDropdownValue = null;
            if (split[0] === "defaultSettings") {
                guiDropdownValue = defaultSettings[split[1]][split[2]];
            }
            html += "<span class='" + gotTooltip + "'>" + helpEasy.capitalWord(args.title) + tooltip + "</span>";
            html +=  `    
                    <select
                        id="` + id + `"
                        data-id="` + id + `"
                        data-type="dropdown"
                        data-alt="` + args.alt + `"
                        data-settings="` + args.settingsId + `"
                        data-default-index="` + args.default + `"
                        data-gui-dropdown-value="` + guiDropdownValue + `"
                        ` + disabled + `
                        ` + datasetBlob + `>
                `;
            let options = args.optionList;
            for (let i = 0; i < options.length; i++) {
                let value = options[i].value;
                let text = helpEasy.capitalWord(options[i].text);
                let disabled = "";
                if (options[i].disabled !== undefined && options[i].disabled === true) {
                    disabled = "disabled";
                }
                let note = "";
                if (options[i].note !== undefined) {
                    note = " " + helpEasy.capitalWord(options[i].note);
                }
                if (i === args.default) {
                    html += "<option value='" + value + "' selected='selected'>" + text + note + "</option>";
                } else {
                    html += "<option value='" + value + "' " + disabled + ">" + text + note + "</option>";
                }
            }
            html +=  `</select>
                    <label
                        class="select"
                        for="` + id + `"
                    ></label>
                `;
        }
        if (type === "toggle") {
            html += `
                <input type="checkbox"
                id="` + id + `"
                data-id="` + id + `"
                data-type="toggle"
                data-alt="` + args.alt + `"
                data-settings="` + args.settingsId + `"
                data-true-text="` + args.trueText + `"
                data-false-text="` + args.falseText + `"
                data-default-value="` + args.default + `"
                data-default-text="` + args[(args.default)+"Text"] + `"
                data-change="`+ settingsIdPrefix + `update"
                data-change-` + args.settingsTrue + `="true"
                data-change-` + args.settingsFalse + `="false"
                data-tooltip="`+ tooltip +`"
                data-got-tooltip="`+ gotTooltip +`"
                data-input-toggle="{'true':` + args.settingsTrue + `, 'false': `+ args.settingsFalse +`}"
                ` + datasetBlob + `>
                <label  class="checkbox"
                        id="label-` + id + `"
                        for="` + id + `"
                        tabindex="0">` +
                   `<div class="` + gotTooltip + `">` + helpEasy.capitalWord(args[(args.default+"Text")]) + tooltip + `</div>
                </label>
            `;
        }
        if (type === "number") {
            let placeholderText = "";
            if (args.placeholder !== "") {
                placeholderText = " [" + args.placeholder + "]";
            }
            let extraWidth = "";
            if (args.width !== undefined) {
                extraWidth = " " + args.width + "-width";
            }
            html += `
                <input  type="number"
                class="` + extraWidth  + `"
                id="` + id + `"
                min="` + args.min + `"
                max="` + args.max + `"
                step="` + args.step + `"
                data-alt="` + args.alt + `"
                placeholder="` + args.placeholder + `"
                data-default-value="` + args.default +  `"
                data-change="`+ settingsIdPrefix + `update"
                data-id="` + id + `"
                data-type="number"
                data-input-number="{'max': ` + args.max + `, 'min': ` + args.min + `}"
                value="` + args.default + `"
                ` + datasetBlob + `>
                <label class="number ` + gotTooltip + `"
                       for="` + id + `"
                       id="label-` + id + `">` +
                   helpEasy.capitalWord(args.title) + placeholderText + tooltip + `
                </label>
            `;
        }
        html += appendixHTML + "</div>";
        return html;
    },
    'addLine': function () {
        return "<hr>";
    },
    'openArea': function (title) {
        let id = title.replace(" ", "-") + "-area";
        if (defaultSettings.userSettings.areasMinimized) {
            return `
            <div class="area hide-contents" id="` + id + `">
                <div class="area-title">` + helpEasy.capitalWord(title)
                + `<button id="button-min-` + id + `" data-click="area-min-` + id + `"` + ` class="is-hidden">` + guiEasy.curly.icon(["minimize"]) + `</button>`
                + `<button id="button-max-` + id + `" data-click="area-max-` + id + `">` + guiEasy.curly.icon(["maximize"]) + `</button></div>
            `;
        } else {
            return `
            <div class="area" id="` + id + `">
                <div class="area-title">` + helpEasy.capitalWord(title)
                + `<button id="button-min-` + id + `" data-click="area-min-` + id + `">` + guiEasy.curly.icon(["minimize"]) + `</button>`
                + `<button id="button-max-` + id + `" data-click="area-max-` + id + `"` + ` class="is-hidden">` + guiEasy.curly.icon(["maximize"]) + `</button></div>
            `;
        }
    },
    'closeArea': function () {
        return "</div>"
    },
    'openColumn': function (id) {
        if (id === undefined) {
            return "<div class='column'>";
        } else {
            if (id.split("-")[0] === "data") {
                return "<div class='column' " + id + "=''>";
            } else {
                return "<div class='column' id='" + id + "'>";
            }
        }
    },
    'closeColumn': function () {
        return "</div>"
    },
    'checkIfIP': function (ipaddress) {
        return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress);
    },
    'screenshot': function () {
        let html2canvasVersion = "v1.0.0-rc.5";
        if (helpEasy.internet()) {
            let id = "screenshot-script";
            let eventDetails = {
                "type": "wave",
                "text": guiEasy.curly.icon(["screenshot"]),
                "color": "inverted"
            };
            let background = guiEasy.current.backgroundColor;
            if (background === undefined) {
                background = "#3492e2";
            }
            let inverted = guiEasy.current.invertedColor;
            if (inverted === undefined) {
                inverted = "#2F4252";
            }
            let fileName = helpEasy.capitalWord((guiEasy.current.tab.id).split("-")[0]);
            let element = guiEasy.current.modal;
            if (element === undefined) {
                element = guiEasy.current.tab;
            } else {
                background = inverted;
                fileName = fileName + "-" + document.getElementById("modal-title-text").innerText.replace(/ /g,"_");
            }
            fileName = guiEasy.nodes[helpEasy.getCurrentIndex()].live.json.System["Unit Name"] + "-" + fileName;
            guiEasy.popper.tryCallEvent(eventDetails);
            let script = document.createElement('script');
            script.id = id;
            script.onload = function () {
                html2canvas(element, {
                    backgroundColor: background
                }).then(function(canvas) {helpEasy.binaryDataToFile(canvas, "image/png", fileName + ".png")});
            };
            script.src = "https://github.com/niklasvh/html2canvas/releases/download/" + html2canvasVersion + "/html2canvas.min.js";
            document.head.appendChild(script);
            //TODO: there's left over elements or something when running the screen shots multiple times on different objects. Tabs will stop being rendered after a modal has been shot...
        } else {
            //flash the screen, since no internet we cannot use the external lib..
            let eventDetails = {
                "type": "wave",
                "text": "Inget internet!",
                "color": "warning"
            };
            guiEasy.popper.tryCallEvent(eventDetails);
        }
    },
    'binaryDataToFile': function (data, type, fileName) {
        let id = "temp-binary-blob-element";
        let check = document.getElementById(id);
        if (check !== null) {
            check.remove();
        }
        let a = document.createElement('a');
        a.id = id;
        document.body.appendChild(a);
        a.style.display = "none";
        a.href = data.toDataURL(type);
        a.download = fileName;
        a.click();
    },
    //These colors are just for backup, they should be set by the theme
    'favicon': function (color) {
        let canvas = document.createElement('canvas');
        let iconSide = 113;
        let iconRadius = 15;
        canvas.width = iconSide;
        canvas.height = iconSide;
        let ctx = canvas.getContext('2d');
        ctx.lineWidth = 8;
        //The background badge (with rounded corners)
        ctx.fillStyle = color.inverted;
        ctx.beginPath();
        ctx.moveTo(0,iconRadius);
        ctx.lineTo(0,iconSide-iconRadius);
        ctx.arc(iconRadius,iconSide-iconRadius, iconRadius, Math.PI, 0.5 * Math.PI, true);
        ctx.lineTo(iconRadius,iconSide);
        ctx.lineTo(iconSide-iconRadius,iconSide);
        ctx.arc(iconSide-iconRadius,iconSide-iconRadius, iconRadius, Math.PI, 1.5 * Math.PI, true);
        ctx.lineTo(iconSide,iconSide-iconRadius);
        ctx.lineTo(iconSide,iconRadius);
        ctx.arc(iconSide-iconRadius,iconRadius, iconRadius, 0, 1.5 * Math.PI, true);
        ctx.lineTo(iconSide-iconRadius,0);
        ctx.lineTo(iconRadius,0);
        ctx.arc(iconRadius,iconRadius, iconRadius, 0, 0.5 * Math.PI, true);
        ctx.lineTo(0,iconRadius);
        ctx.closePath();
        ctx.fill();
        //The dot
        ctx.fillStyle = color.font;
        ctx.beginPath();
        ctx.arc(90, 90, 10, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        //The warning line
        ctx.lineCap = "round";
        ctx.strokeStyle = color.warning;
        ctx.beginPath();
        ctx.moveTo(42,99);
        ctx.lineTo(99,42);
        ctx.closePath();
        ctx.stroke();
        //The info line
        ctx.strokeStyle = color.info;
        ctx.beginPath();
        ctx.moveTo(14,99);
        ctx.lineTo(99,14);
        ctx.closePath();
        ctx.stroke();
        //The sunny line
        ctx.strokeStyle = color.sunny;
        ctx.beginPath();
        ctx.moveTo(14,70);
        ctx.lineTo(70,14);
        ctx.closePath();
        ctx.stroke();
        //The success line
        ctx.strokeStyle = color.success;
        ctx.beginPath();
        ctx.moveTo(14,42);
        ctx.lineTo(42,14);
        ctx.closePath();
        ctx.stroke();
        let favicon = document.getElementById("favicon");
        if (favicon !== null) {
            favicon.remove();
        }
        favicon = document.createElement('link');
        favicon.id = "favicon";
        favicon.type = 'image/x-icon';
        favicon.rel = 'shortcut icon';
        favicon.href = canvas.toDataURL("image/x-icon");
        document.head.appendChild(favicon);
    },
    'hash': {
        encode: function (key, data) {
            data = this.xor_encrypt(key, data);
            return this.b64_encode(data);
        },
        decode: function (key, data) {
            data = this.b64_decode(data);
            return this.xor_decrypt(key, data);
        },
        b64_table: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        b64_encode: function (data) {
            let o1, o2, o3, h1, h2, h3, h4, bits, r, i = 0, enc = "";
            if (!data) { return data; }
            do {
                o1 = data[i++];
                o2 = data[i++];
                o3 = data[i++];
                bits = o1 << 16 | o2 << 8 | o3;
                h1 = bits >> 18 & 0x3f;
                h2 = bits >> 12 & 0x3f;
                h3 = bits >> 6 & 0x3f;
                h4 = bits & 0x3f;
                enc += this.b64_table.charAt(h1) + this.b64_table.charAt(h2) + this.b64_table.charAt(h3) + this.b64_table.charAt(h4);
            } while (i < data.length);
            r = data.length % 3;
            return (r ? enc.slice(0, r - 3) : enc) + "===".slice(r || 3);
        },
        b64_decode: function (data) {
            let o1, o2, o3, h1, h2, h3, h4, bits, i = 0, result = [];
            if (!data) { return data; }
            data += "";
            do {
                h1 = this.b64_table.indexOf(data.charAt(i++));
                h2 = this.b64_table.indexOf(data.charAt(i++));
                h3 = this.b64_table.indexOf(data.charAt(i++));
                h4 = this.b64_table.indexOf(data.charAt(i++));
                bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
                o1 = bits >> 16 & 0xff;
                o2 = bits >> 8 & 0xff;
                o3 = bits & 0xff;
                result.push(o1);
                if (h3 !== 64) {
                    result.push(o2);
                    if (h4 !== 64) {
                        result.push(o3);
                    }
                }
            } while (i < data.length);
            return result;
        },
        keyCharAt: function (key, i) {
            return key.charCodeAt(Math.floor(i % key.length));
        },
        xor_encrypt: function (key, data) {
            let rta = [];
            for (let i = 0; i < data.length; i++) {
                let c = data[i];
                rta.push(c.charCodeAt(0) ^ this.keyCharAt(key, i));
            }
            return rta;
        },
        xor_decrypt: function (key, data) {
            let rta = [];
            for (let i = 0; i < data.length; i++) {
                let c = data[i];
                rta.push(String.fromCharCode(c ^ this.keyCharAt(key, i)));
            }
            return  rta.join("");
        }
    }
};