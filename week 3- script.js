/*
========================================================
LOGSTREAM WEEK 3
ECHARTS HISTOGRAM + DASHBOARD PANELS
========================================================
*/


/* ============================
   MAIN VOLUME CHART
============================ */

const volumeChart = echarts.init(
    document.getElementById("volumeChart")
);


/* Generate hourly log data */

function generateVolumeData(hours) {

    const data = [];

    const now = new Date();

    for (let i = hours - 1; i >= 0; i--) {

        const time = new Date(
            now.getTime() -
            i * 60 * 60 * 1000
        );

        const hour =
            String(time.getHours())
                .padStart(2, "0");

        const volume =
            Math.floor(
                250 +
                Math.random() * 900
            );

        data.push({
            time: `${hour}:00`,
            volume: volume
        });
    }

    return data;
}


/* Render histogram */

function renderVolumeChart(hours) {

    const data =
        generateVolumeData(hours);


    const times =
        data.map(item => item.time);


    const volumes =
        data.map(item => item.volume);


    const option = {

        tooltip: {
            trigger: "axis",

            formatter: function(params) {

                const item =
                    params[0];

                return `
                    <strong>
                        ${item.axisValue}
                    </strong>
                    <br>
                    Log Volume:
                    ${item.value}
                `;
            }
        },


        grid: {
            left: "5%",
            right: "4%",
            top: "10%",
            bottom: "12%",
            containLabel: true
        },


        xAxis: {

            type: "category",

            data: times,

            axisLabel: {
                color: "#64748b"
            },

            axisLine: {
                lineStyle: {
                    color: "#cbd5e1"
                }
            }

        },


        yAxis: {

            type: "value",

            name: "Log Count",

            nameTextStyle: {
                color: "#64748b"
            },

            axisLabel: {
                color: "#64748b"
            },

            splitLine: {

                lineStyle: {
                    color: "#e5e7eb"
                }

            }

        },


        series: [

            {

                name: "Log Volume",

                type: "bar",

                data: volumes,

                barMaxWidth: 32,

                itemStyle: {

                    borderRadius: [
                        4,
                        4,
                        0,
                        0
                    ]

                },

                emphasis: {

                    focus: "series"

                }

            }

        ]

    };


    volumeChart.setOption(option);
}


/* Initial chart */

renderVolumeChart(24);


/* Time range */

document
    .getElementById("timeRange")
    .addEventListener(
        "change",
        function() {

            renderVolumeChart(
                Number(this.value)
            );

        }
    );


/* ============================
   LOG LEVEL CHART
============================ */

const levelChart = echarts.init(
    document.getElementById("levelChart")
);


const levelOption = {

    tooltip: {
        trigger: "item"
    },


    legend: {
        bottom: "5%",
        left: "center"
    },


    series: [

        {

            name: "Log Levels",

            type: "pie",

            radius: [
                "45%",
                "70%"
            ],

            data: [

                {
                    value: 5200,
                    name: "INFO"
                },

                {
                    value: 2100,
                    name: "DEBUG"
                },

                {
                    value: 1500,
                    name: "WARN"
                },

                {
                    value: 1200,
                    name: "ERROR"
                }

            ],

            label: {
                show: false
            }

        }

    ]

};


levelChart.setOption(
    levelOption
);


/* ============================
   SERVICE CHART
============================ */

const serviceChart = echarts.init(
    document.getElementById("serviceChart")
);


const serviceOption = {

    tooltip: {

        trigger: "axis",

        axisPointer: {
            type: "shadow"
        }

    },


    grid: {

        left: "5%",

        right: "5%",

        bottom: "10%",

        containLabel: true

    },


    xAxis: {

        type: "category",

        data: [
            "Auth",
            "Payment",
            "Users",
            "Orders",
            "Notify"
        ],

        axisLabel: {
            color: "#64748b"
        }

    },


    yAxis: {

        type: "value",

        axisLabel: {
            color: "#64748b"
        },

        splitLine: {

            lineStyle: {
                color: "#e5e7eb"
            }

        }

    },


    series: [

        {

            name: "Logs",

            type: "bar",

            data: [
                2400,
                1900,
                1600,
                2800,
                1300
            ],

            barMaxWidth: 35,

            itemStyle: {

                borderRadius: [
                    4,
                    4,
                    0,
                    0
                ]

            }

        }

    ]

};


serviceChart.setOption(
    serviceOption
);


/* ============================
   RECENT LOGS
============================ */

const recentLogs = [

    {
        time: "11:20:32",
        service: "auth-service",
        level: "INFO",
        message:
            "User authentication completed"
    },

    {
        time: "11:18:45",
        service: "payment-service",
        level: "INFO",
        message:
            "Payment transaction processed"
    },

    {
        time: "11:17:21",
        service: "order-service",
        level: "WARN",
        message:
            "Order processing latency increased"
    },

    {
        time: "11:16:08",
        service: "user-service",
        level: "DEBUG",
        message:
            "User profile cache refreshed"
    },

    {
        time: "11:15:54",
        service: "payment-service",
        level: "ERROR",
        message:
            "Payment gateway timeout"
    },

    {
        time: "11:14:31",
        service: "notification-service",
        level: "INFO",
        message:
            "Notification successfully delivered"
    }

];


function renderRecentLogs() {

    const table =
        document.getElementById(
            "logTable"
        );


    table.innerHTML = "";


    recentLogs.forEach(
        log => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${log.time}
                </td>

                <td>
                    ${log.service}
                </td>

                <td>
                    <span class="
                        level-${log.level.toLowerCase()}
                    ">
                        ${log.level}
                    </span>
                </td>

                <td>
                    ${log.message}
                </td>

            `;


            table.appendChild(row);

        }
    );

}


renderRecentLogs();


/* ============================
   REFRESH
============================ */

document
    .getElementById("refreshButton")
    .addEventListener(
        "click",
        function() {

            renderVolumeChart(
                Number(
                    document.getElementById(
                        "timeRange"
                    ).value
                )
            );


            document.getElementById(
                "totalLogs"
            ).textContent =
                (
                    10000 +
                    Math.floor(
                        Math.random() * 500
                    )
                ).toLocaleString();

        }
    );


/* ============================
   RESPONSIVE CHARTS
============================ */

window.addEventListener(
    "resize",
    function() {

        volumeChart.resize();

        levelChart.resize();

        serviceChart.resize();

    }
);
