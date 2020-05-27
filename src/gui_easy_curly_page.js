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

guiEasy.curly.page["planering"] = function () {
    return `
        <!-- empty -->
    `;
};

guiEasy.curly.page["körning"] = function () {
    return `
        <div class="area" id="körning-area">
        <div class="area-title">Linje
        <button id="button-min-körning-area" data-click="area-min-körning-area">
        <svg class="minimize" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path class="fill-main-font" d="M20.26,12.948l-7.15-4.766c-0.672-0.448-1.547-0.448-2.219,0l-7.15,4.766C3.278,13.257,3,13.777,3,14.333l0,0 c0,1.329,1.481,2.121,2.587,1.384L12,11.442l6.413,4.276C19.519,16.455,21,15.662,21,14.333l0,0 C21,13.776,20.722,13.257,20.26,12.948z"></path>
            </svg>
       </button>
       <button id="button-max-körning-area" data-click="area-max-körning-area" class="is-hidden">
           <svg class="maximize" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path class="fill-main-font" d="M21,11.109L21,11.109c0-1.329-1.481-2.122-2.587-1.385L12,14L5.587,9.725C4.481,8.988,3,9.78,3,11.109v0 c0,0.556,0.278,1.076,0.741,1.385l7.15,4.766c0.672,0.448,1.547,0.448,2.219,0l7.15-4.766C20.722,12.185,21,11.666,21,11.109z"></path>
            </svg>
       </button>
        </div>
            <div class="column">
                <div class="row">
                    <span>Vald linje</span>    
                    <select id="dropdown-option-vald-linje" data-click="option-vald-linje">
                        <option value="-1" selected="selected">- Ingen -</option>
                    </select>
                    <label class="select" for="dropdown-option-vald-linje"></label>
                </div>
            </div>
            <div class="column">
                <div class="row">
                    <span>Kö</span>
                </div>
                <div class="row" id="jobs-que"></div>
            </div>
            <div class="column">
                <div class="row">
                    <span>Pågående</span>
                </div>
                <div class="row" id="active-job"></div>
            </div>
        </div>
        
        
        <div class="area" id="order-area">
        <div class="area-title">Order
        <button id="button-min-order-area" data-click="area-min-order-area">
        <svg class="minimize" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path class="fill-main-font" d="M20.26,12.948l-7.15-4.766c-0.672-0.448-1.547-0.448-2.219,0l-7.15,4.766C3.278,13.257,3,13.777,3,14.333l0,0 c0,1.329,1.481,2.121,2.587,1.384L12,11.442l6.413,4.276C19.519,16.455,21,15.662,21,14.333l0,0 C21,13.776,20.722,13.257,20.26,12.948z"></path>
            </svg>
       </button>
       <button id="button-max-order-area" data-click="area-max-order-area" class="is-hidden">
           <svg class="maximize" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path class="fill-main-font" d="M21,11.109L21,11.109c0-1.329-1.481-2.122-2.587-1.385L12,14L5.587,9.725C4.481,8.988,3,9.78,3,11.109v0 c0,0.556,0.278,1.076,0.741,1.385l7.15,4.766c0.672,0.448,1.547,0.448,2.219,0l7.15-4.766C20.722,12.185,21,11.666,21,11.109z"></path>
            </svg>
       </button>
        </div>
            <div class="column">
            <!-- empty -->
            </div>
            <div class="column">
            <!-- empty -->
            </div>
            <div class="column">
            <!-- empty -->
            </div>
        </div>
        
        
        <div class="area" id="kördata-area">
        <div class="area-title">Kördata
        <button id="button-min-kördata-area" data-click="area-min-kördata-area">
        <svg class="minimize" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path class="fill-main-font" d="M20.26,12.948l-7.15-4.766c-0.672-0.448-1.547-0.448-2.219,0l-7.15,4.766C3.278,13.257,3,13.777,3,14.333l0,0 c0,1.329,1.481,2.121,2.587,1.384L12,11.442l6.413,4.276C19.519,16.455,21,15.662,21,14.333l0,0 C21,13.776,20.722,13.257,20.26,12.948z"></path>
            </svg>
       </button>
       <button id="button-max-kördata-area" data-click="area-max-kördata-area" class="is-hidden">
           <svg class="maximize" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path class="fill-main-font" d="M21,11.109L21,11.109c0-1.329-1.481-2.122-2.587-1.385L12,14L5.587,9.725C4.481,8.988,3,9.78,3,11.109v0 c0,0.556,0.278,1.076,0.741,1.385l7.15,4.766c0.672,0.448,1.547,0.448,2.219,0l7.15-4.766C20.722,12.185,21,11.666,21,11.109z"></path>
            </svg>
       </button>
        </div>
            <div class="column">
                <div class="row">
                    <img class="big" src="https://familyeyecaretimmins.com/wp-content/uploads/2016/04/depositphotos_8938809-Example-rubber-stamp.jpg">
                </div>
                <div class="row one-line">
                    <img class="small" src="https://familyeyecaretimmins.com/wp-content/uploads/2016/04/depositphotos_8938809-Example-rubber-stamp.jpg">
                    <img class="small" src="https://familyeyecaretimmins.com/wp-content/uploads/2016/04/depositphotos_8938809-Example-rubber-stamp.jpg">
                    <img class="small" src="https://familyeyecaretimmins.com/wp-content/uploads/2016/04/depositphotos_8938809-Example-rubber-stamp.jpg">
                    <img class="small" src="https://familyeyecaretimmins.com/wp-content/uploads/2016/04/depositphotos_8938809-Example-rubber-stamp.jpg">
                    <img class="small" src="https://familyeyecaretimmins.com/wp-content/uploads/2016/04/depositphotos_8938809-Example-rubber-stamp.jpg">
                    <img class="small" src="https://familyeyecaretimmins.com/wp-content/uploads/2016/04/depositphotos_8938809-Example-rubber-stamp.jpg">
                    <img class="small" src="https://familyeyecaretimmins.com/wp-content/uploads/2016/04/depositphotos_8938809-Example-rubber-stamp.jpg">
                    <img class="small" src="https://familyeyecaretimmins.com/wp-content/uploads/2016/04/depositphotos_8938809-Example-rubber-stamp.jpg">
                    <img class="small" src="https://familyeyecaretimmins.com/wp-content/uploads/2016/04/depositphotos_8938809-Example-rubber-stamp.jpg">
                    <img class="small" src="https://familyeyecaretimmins.com/wp-content/uploads/2016/04/depositphotos_8938809-Example-rubber-stamp.jpg">
                </div>
            </div>
            <div class="column">
                <div class="row">
                    <span>Artikel</span>
                </div>
                <div class="row meter-data">
                    <span style="font-weight: bold;">123123</span>
                </div>
                <div class="row">
                    <span>Material</span>
                </div>
                <div class="row meter-data">
                    <button id="material">PVC 100</button>
                </div>
                <div class="row">
                    <span>Färg</span>
                </div>
                <div class="row meter-data">
                    <input type="color" id="css-material-color" data-alt="css-material-color" data-default-value="0, 0, 0" data-change="material-color">
                    <label class="color material-color" for="css-material-color" tabindex="0"></label>
                </div>
            </div>
            <div class="column">
                <div class="row">
                    <span>Meter per timme</span>
                </div>
                <div class="row meter-data">
                    <button id="meter-per-hour">123 m/h</button>
                </div>
                <div class="row">
                    <span>Kg per meter</span>
                </div>
                <div class="row meter-data">
                    <button id="kg-per-meter">123 kg/m</button>
                </div>
                <div class="row">
                    <span>Kg per meter (inkl. tejp)</span>
                </div>
                <div class="row meter-data">
                    <button id="kg-per-meter-tejp">123 kg/m</button>
                </div>
                <div class="row">
                    <span>Historik</span>
                </div>
                <div class="row meter-data">
                    <button id="history">....</button>
                </div>
            </div>
        </div>
        
        
        <div class="area" id="protokoll-area">
        <div class="area-title">Protokoll
        <button id="button-min-protokoll-area" data-click="area-min-protokoll-area">
        <svg class="minimize" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path class="fill-main-font" d="M20.26,12.948l-7.15-4.766c-0.672-0.448-1.547-0.448-2.219,0l-7.15,4.766C3.278,13.257,3,13.777,3,14.333l0,0 c0,1.329,1.481,2.121,2.587,1.384L12,11.442l6.413,4.276C19.519,16.455,21,15.662,21,14.333l0,0 C21,13.776,20.722,13.257,20.26,12.948z"></path>
            </svg>
       </button>
       <button id="button-max-protokoll-area" data-click="area-max-protokoll-area" class="is-hidden">
           <svg class="maximize" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path class="fill-main-font" d="M21,11.109L21,11.109c0-1.329-1.481-2.122-2.587-1.385L12,14L5.587,9.725C4.481,8.988,3,9.78,3,11.109v0 c0,0.556,0.278,1.076,0.741,1.385l7.15,4.766c0.672,0.448,1.547,0.448,2.219,0l7.15-4.766C20.722,12.185,21,11.666,21,11.109z"></path>
            </svg>
       </button>
        </div>
            <div class="column">
            <!-- empty -->
            </div>
            <div class="column">
            <!-- empty -->
            </div>
            <div class="column">
            <!-- empty -->
            </div>
        </div>
    `;
};