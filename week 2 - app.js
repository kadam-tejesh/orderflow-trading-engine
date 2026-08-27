/* ============================================================
   LOGSTREAM
   WEEK 2 FRONTEND
   Search Results Rendering + Pagination

   Developer:
   Shaik Khaja Moinuddin

   Responsibility:
   Search result rendering
   Pagination
   Result states
   Frontend integration with query interface
============================================================ */


/* ============================================================
   CONFIGURATION
============================================================ */

/*
   Set this to false when Namratha's real Search API
   is available.

   true  = local mock data
   false = real API
*/

const USE_MOCK_DATA = true;


/*
   Replace this URL with the Search API endpoint
   provided by the backend / Namratha.
*/

const SEARCH_API_URL =
    "http://localhost:8080/api/search";


/* ============================================================
   APPLICATION STATE
============================================================ */

let allResults = [];

let filteredResults = [];

let currentPage = 1;

let pageSize = 10;


/* ============================================================
   DOM ELEMENTS
============================================================ */

const searchInput =
    document.getElementById(
        "searchInput"
    );

const serviceFilter =
    document.getElementById(
        "serviceFilter"
    );

const levelFilter =
    document.getElementById(
        "levelFilter"
    );

const searchButton =
    document.getElementById(
        "searchButton"
    );

const clearSearch =
    document.getElementById(
        "clearSearch"
    );

const pageSizeSelect =
    document.getElementById(
        "pageSize"
    );

const resultsBody =
    document.getElementById(
        "resultsBody"
    );

const pagination =
    document.getElementById(
        "pagination"
    );

const resultSummary =
    document.getElementById(
        "resultSummary"
    );

const resultsContainer =
    document.getElementById(
        "resultsContainer"
    );

const loading =
    document.getElementById(
        "loading"
    );

const emptyState =
    document.getElementById(
        "emptyState"
    );

const errorState =
    document.getElementById(
        "errorState"
    );

const errorMessage =
    document.getElementById(
        "errorMessage"
    );

const retryButton =
    document.getElementById(
        "retryButton"
    );


/* ============================================================
   MOCK DATA
============================================================ */

const services = [
    "billing-api",
    "auth-service",
    "payment-service",
    "user-service",
    "order-service"
];


const levels = [
    "INFO",
    "WARN",
    "ERROR",
    "DEBUG"
];


const messages = {

    INFO: [
        "Request completed successfully",
        "User authenticated successfully",
        "Database connection established",
        "Request processed successfully"
    ],

    WARN: [
        "Response time exceeded threshold",
        "Retry attempt initiated",
        "High memory usage detected",
        "Slow database query detected"
    ],

    ERROR: [
        "Database connection failed",
        "Internal server error",
        "Payment processing failed",
        "Request timeout"
    ],

    DEBUG: [
        "Processing request",
        "Fetching user information",
        "Executing database query",
        "Validating request parameters"
    ]

};


/* ============================================================
   GENERATE MOCK LOGS
============================================================ */

function generateMockLogs() {

    const logs = [];

    for (
        let index = 1;
        index <= 500;
        index++
    ) {

        const level =
            levels[
                (index - 1) %
                levels.length
            ];


        const service =
            services[
                (index - 1) %
                services.length
            ];


        const messageList =
            messages[level];


        const message =
            messageList[
                (index - 1) %
                messageList.length
            ];


        const timestamp =
            new Date(
                Date.now() -
                index * 60000
            ).toISOString();


        const responseTime =
            Math.floor(
                30 +
                Math.random() * 2000
            );


        logs.push({

            id: index,

            timestamp: timestamp,

            level: level,

            service: service,

            message: message,

            response_time:
                responseTime

        });

    }


    return logs;

}


/* ============================================================
   MOCK SEARCH API
============================================================ */

function mockSearchAPI(params) {

    return new Promise(
        function(resolve) {

            setTimeout(
                function() {

                    let results =
                        generateMockLogs();


                    if (
                        params.service !==
                        "ALL"
                    ) {

                        results =
                            results.filter(
                                function(log) {

                                    return (
                                        log.service ===
                                        params.service
                                    );

                                }
                            );

                    }


                    if (
                        params.level !==
                        "ALL"
                    ) {

                        results =
                            results.filter(
                                function(log) {

                                    return (
                                        log.level ===
                                        params.level
                                    );

                                }
                            );

                    }


                    if (
                        params.query
                    ) {

                        const query =
                            params.query
                                .toLowerCase();


                        results =
                            results.filter(
                                function(log) {

                                    return (

                                        log.message
                                            .toLowerCase()
                                            .includes(
                                                query
                                            )

                                        ||

                                        log.service
                                            .toLowerCase()
                                            .includes(
                                                query
                                            )

                                    );

                                }
                            );

                    }


                    resolve({

                        results: results,

                        total:
                            results.length

                    });

                },

                350
            );

        }
    );

}


/* ============================================================
   SEARCH API
============================================================ */

async function searchAPI(params) {

    /*
       Local frontend demonstration
    */

    if (
        USE_MOCK_DATA
    ) {

        return await mockSearchAPI(
            params
        );

    }


    /*
       Real Search API integration

       Expected request:

       GET /api/search?
       query=error&
       service=billing-api&
       level=ERROR
    */

    const queryParams =
        new URLSearchParams();


    if (
        params.query
    ) {

        queryParams.append(
            "query",
            params.query
        );

    }


    if (
        params.service !==
        "ALL"
    ) {

        queryParams.append(
            "service",
            params.service
        );

    }


    if (
        params.level !==
        "ALL"
    ) {

        queryParams.append(
            "level",
            params.level
        );

    }


    const response =
        await fetch(
            `${SEARCH_API_URL}?${queryParams.toString()}`
        );


    if (
        !response.ok
    ) {

        throw new Error(
            "Search API request failed."
        );

    }


    return await response.json();

}


/* ============================================================
   GET QUERY
============================================================ */

function getQuery() {

    return {

        query:
            searchInput
                .value
                .trim(),

        service:
            serviceFilter.value,

        level:
            levelFilter.value

    };

}


/* ============================================================
   LOAD SEARCH RESULTS
============================================================ */

async function loadResults() {

    showLoading();

    hideError();

    try {

        const query =
            getQuery();


        const response =
            await searchAPI(
                query
            );


        allResults =
            response.results || [];


        filteredResults =
            allResults;


        currentPage = 1;


        render();

    }

    catch (error) {

        showError(
            error.message
        );

    }

}


/* ============================================================
   FILTER RESULTS
============================================================ */

function applyFilters() {

    const query =
        getQuery();


    filteredResults =
        allResults.filter(
            function(log) {


                const matchesService =
                    query.service ===
                    "ALL"
                    ||
                    log.service ===
                    query.service;


                const matchesLevel =
                    query.level ===
                    "ALL"
                    ||
                    log.level ===
                    query.level;


                const searchText =
                    query.query
                        .toLowerCase();


                const matchesSearch =
                    searchText === ""
                    ||
                    log.message
                        .toLowerCase()
                        .includes(
                            searchText
                        )
                    ||
                    log.service
                        .toLowerCase()
                        .includes(
                            searchText
                        );


                return (

                    matchesService
                    &&
                    matchesLevel
                    &&
                    matchesSearch

                );

            }
        );


    currentPage = 1;


    render();

}


/* ============================================================
   RENDER APPLICATION
============================================================ */

function render() {

    hideLoading();

    hideError();


    if (
        filteredResults.length ===
        0
    ) {

        showEmpty();

        return;

    }


    hideEmpty();

    resultsContainer.style.display =
        "block";


    renderTable();

    renderPagination();

    updateSummary();

}


/* ============================================================
   RENDER TABLE
============================================================ */

function renderTable() {

    resultsBody.innerHTML = "";


    const start =
        (
            currentPage -
            1
        ) *
        pageSize;


    const end =
        Math.min(
            start +
            pageSize,
            filteredResults.length
        );


    const pageResults =
        filteredResults.slice(
            start,
            end
        );


    pageResults.forEach(
        function(log) {


            const row =
                document.createElement(
                    "tr"
                );


            const levelClass =
                `level-${log.level.toLowerCase()}`;


            const responseClass =
                log.response_time >
                1000
                    ? "slow"
                    : "fast";


            row.innerHTML = `

                <td class="log-id">
                    #${log.id}
                </td>

                <td class="timestamp">
                    ${formatTimestamp(
                        log.timestamp
                    )}
                </td>

                <td>
                    <span
                        class="level ${levelClass}"
                    >
                        ${log.level}
                    </span>
                </td>

                <td class="service">
                    ${escapeHTML(
                        log.service
                    )}
                </td>

                <td class="message">
                    ${escapeHTML(
                        log.message
                    )}
                </td>

                <td>
                    <span
                        class="${responseClass}"
                    >
                        ${log.response_time} ms
                    </span>
                </td>

            `;


            resultsBody.appendChild(
                row
            );

        }
    );

}


/* ============================================================
   PAGINATION
============================================================ */

function renderPagination() {

    pagination.innerHTML = "";


    const totalPages =
        Math.ceil(
            filteredResults.length /
            pageSize
        );


    if (
        totalPages <= 1
    ) {

        return;

    }


    /* Previous */

    const previous =
        document.createElement(
            "button"
        );


    previous.textContent =
        "← Previous";


    previous.disabled =
        currentPage === 1;


    previous.onclick =
        function() {

            if (
                currentPage >
                1
            ) {

                currentPage--;

                render();

            }

        };


    pagination.appendChild(
        previous
    );


    /* Page Numbers */

    const pageNumbers =
        document.createElement(
            "div"
        );


    pageNumbers.className =
        "page-numbers";


    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        const button =
            document.createElement(
                "button"
            );


        button.textContent =
            page;


        if (
            page ===
            currentPage
        ) {

            button.classList.add(
                "active"
            );

        }


        button.onclick =
            function() {

                currentPage =
                    page;

                render();

            };


        pageNumbers.appendChild(
            button
        );

    }


    pagination.appendChild(
        pageNumbers
    );


    /* Next */

    const next =
        document.createElement(
            "button"
        );


    next.textContent =
        "Next →";


    next.disabled =
        currentPage ===
        totalPages;


    next.onclick =
        function() {

            if (
                currentPage <
                totalPages
            ) {

                currentPage++;

                render();

            }

        };


    pagination.appendChild(
        next
    );

}


/* ============================================================
   RESULT SUMMARY
============================================================ */

function updateSummary() {

    const total =
        filteredResults.length;


    const start =
        (
            currentPage -
            1
        ) *
        pageSize +
        1;


    const end =
        Math.min(
            currentPage *
            pageSize,
            total
        );


    resultSummary.textContent =
        `Showing ${start}-${end} of ${total} results`;

}


/* ============================================================
   STATES
============================================================ */

function showLoading() {

    loading.classList.remove(
        "hidden"
    );

    resultsContainer.style.display =
        "none";

    emptyState.classList.add(
        "hidden"
    );

}


function hideLoading() {

    loading.classList.add(
        "hidden"
    );

}


function showEmpty() {

    resultsContainer.style.display =
        "none";

    emptyState.classList.remove(
        "hidden"
    );

    pagination.innerHTML = "";

    resultSummary.textContent =
        "Showing 0-0 of 0 results";

}


function hideEmpty() {

    emptyState.classList.add(
        "hidden"
    );

}


function showError(message) {

    loading.classList.add(
        "hidden"
    );

    resultsContainer.style.display =
        "none";

    emptyState.classList.add(
        "hidden"
    );

    errorState.classList.remove(
        "hidden"
    );

    errorMessage.textContent =
        message ||
        "Unable to connect to Search API.";

}


function hideError() {

    errorState.classList.add(
        "hidden"
    );

}


/* ============================================================
   FORMAT TIMESTAMP
============================================================ */

function formatTimestamp(timestamp) {

    return new Date(
        timestamp
    ).toLocaleString();

}


/* ============================================================
   SECURITY
============================================================ */

function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        value;

    return div.innerHTML;

}


/* ============================================================
   EVENT HANDLERS
============================================================ */

searchButton.addEventListener(
    "click",
    function() {

        loadResults();

    }
);


searchInput.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key ===
            "Enter"
        ) {

            loadResults();

        }

    }
);


clearSearch.addEventListener(
    "click",
    function() {

        searchInput.value = "";

        serviceFilter.value =
            "ALL";

        levelFilter.value =
            "ALL";

        loadResults();

    }
);


pageSizeSelect.addEventListener(
    "change",
    function(event) {

        pageSize =
            Number(
                event.target.value
            );

        currentPage = 1;

        render();

    }
);


retryButton.addEventListener(
    "click",
    function() {

        loadResults();

    }
);


/* ============================================================
   INITIALIZE
============================================================ */

loadResults();
