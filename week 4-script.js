/* =========================================
   ALERT CONFIGURATION
========================================= */

const service = document.getElementById("service");
const level = document.getElementById("level");
const threshold = document.getElementById("threshold");
const timeWindow = document.getElementById("timeWindow");
const alertEnabled = document.getElementById("alertEnabled");
const preview = document.getElementById("preview");

function updatePreview() {

    preview.innerHTML = `
        Alert will trigger when
        <strong>${threshold.value} ${level.value}</strong>
        logs are detected from
        <strong>${service.value}</strong>
        within
        <strong>${timeWindow.options[timeWindow.selectedIndex].text}</strong>.
    `;
}

service.addEventListener("change", updatePreview);
level.addEventListener("change", updatePreview);
threshold.addEventListener("input", updatePreview);
timeWindow.addEventListener("change", updatePreview);


/* SAVE ALERT */

document.getElementById("alertForm").addEventListener("submit", function(event) {

    event.preventDefault();

    const alertList = document.getElementById("alertList");

    const item = document.createElement("div");

    item.className = "alert-item";

    item.innerHTML = `
        <div>
            <strong>${service.value}</strong>

            <span>
                ${level.value} •
                ${threshold.value} logs •
                ${timeWindow.options[timeWindow.selectedIndex].text}
            </span>
        </div>

        <b class="active">
            ${alertEnabled.checked ? "ACTIVE" : "DISABLED"}
        </b>
    `;

    alertList.prepend(item);

    alert("Alert configuration saved successfully.");
});


/* RESET */

document.getElementById("resetBtn").addEventListener("click", function() {

    service.selectedIndex = 0;
    level.value = "ERROR";
    threshold.value = 10;
    timeWindow.value = 5;
    alertEnabled.checked = true;

    updatePreview();
});


/* =========================================
   LIVE TAIL
========================================= */

const terminal = document.getElementById("terminal");

const logCount = document.getElementById("logCount");

const searchInput = document.getElementById("searchInput");

const tailStatus = document.getElementById("tailStatus");

let logs = [];

let liveRunning = true;


const services = [
    "auth-service",
    "payment-service",
    "user-service",
    "api-gateway",
    "notification-service"
];


const levels = [
    "INFO",
    "INFO",
    "INFO",
    "WARN",
    "ERROR",
    "DEBUG"
];


const messages = {

    INFO: [
        "Request processed successfully",
        "User session validated",
        "Database connection established",
        "API request completed",
        "Background job completed"
    ],

    WARN: [
        "High response time detected",
        "Connection pool nearing limit",
        "Retry attempt initiated",
        "Memory usage above threshold",
        "Slow database query detected"
    ],

    ERROR: [
        "Failed to connect to database",
        "Authentication request failed",
        "Internal server error",
        "API request timeout",
        "Unable to process payment"
    ],

    DEBUG: [
        "Processing request payload",
        "Checking authentication token",
        "Executing database query",
        "Parsing response object",
        "Cache lookup initiated"
    ]

};


/* GET CURRENT TIME */

function getTime() {

    const now = new Date();

    return now.toLocaleTimeString("en-US", {
        hour12: false
    });
}


/* GENERATE RANDOM LOG */

function generateLog() {

    if (!liveRunning) {
        return;
    }

    const serviceName =
        services[Math.floor(Math.random() * services.length)];

    const logLevel =
        levels[Math.floor(Math.random() * levels.length)];

    const messageArray = messages[logLevel];

    const message =
        messageArray[
            Math.floor(Math.random() * messageArray.length)
        ];

    logs.push({
        time: getTime(),
        service: serviceName,
        level: logLevel,
        message: message
    });


    /* Keep maximum 500 logs */

    if (logs.length > 500) {
        logs.shift();
    }

    renderLogs();
}


/* RENDER LOGS */

function renderLogs() {

    const search =
        searchInput.value.toLowerCase();

    const filteredLogs = logs.filter(log => {

        const text = `
            ${log.time}
            ${log.service}
            ${log.level}
            ${log.message}
        `.toLowerCase();

        return text.includes(search);
    });


    terminal.innerHTML = filteredLogs.map(log => {

        const levelClass =
            `log-${log.level.toLowerCase()}`;

        return `
            <div class="log-line">

                <span class="timestamp">
                    [${log.time}]
                </span>

                <span class="service">
                    ${log.service}
                </span>

                <span class="${levelClass}">
                    [${log.level}]
                </span>

                <span>
                    ${log.message}
                </span>

            </div>
        `;

    }).join("");


    logCount.textContent =
        filteredLogs.length;


    /* AUTO SCROLL */

    if (liveRunning) {

        terminal.scrollTop =
            terminal.scrollHeight;
    }
}


/* SEARCH */

searchInput.addEventListener("input", function() {

    renderLogs();

});


/* =========================================
   PAUSE / RESUME
========================================= */

document.getElementById("pauseBtn").addEventListener("click", function() {

    liveRunning = !liveRunning;

    if (liveRunning) {

        this.textContent = "Pause";

        tailStatus.textContent =
            "● Auto-scrolling";

        tailStatus.style.color = "#4ade80";

        renderLogs();

    } else {

        this.textContent = "Resume";

        tailStatus.textContent =
            "● Live tail paused";

        tailStatus.style.color = "#facc15";
    }
});


/* CLEAR LOGS */

document.getElementById("clearBtn").addEventListener("click", function() {

    logs = [];

    terminal.innerHTML = "";

    logCount.textContent = "0";
});


/* =========================================
   EXPORT LOGS
========================================= */

document.getElementById("exportBtn").addEventListener("click", function() {

    if (logs.length === 0) {

        alert("No logs available.");

        return;
    }


    const logText = logs.map(log => {

        return `[${log.time}] ${log.service} [${log.level}] ${log.message}`;

    }).join("\n");


    const blob = new Blob(
        [logText],
        { type: "text/plain" }
    );


    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        "live-tail-logs.txt";

    link.click();

    URL.revokeObjectURL(url);
});


/* =========================================
   START LIVE LOG GENERATOR
========================================= */

for (let i = 0; i < 20; i++) {
    generateLog();
}


setInterval(function() {
    generateLog();
}, 1000);


/* INITIAL PREVIEW */

updatePreview();
