<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8" />
    <link rel="tilled icon" type="image/x-icon" href="{{ asset('assets/favicon.ico') }}" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Balance Transactions Example</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="{{ asset('assets/tailwind.config.js') }}"></script>
    <link rel="stylesheet" href="{{ asset('assets/style.css') }}" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
</head>

<body class="bg-tilledBg flex overflow-x-scroll h-full justify-start" id="main">
    <div class="w-fit bg-slate-800 shadow min-h-screen flex-col" id="sidebar">
        <div class="mb-6 flex h-20 items-center pl-7 pr-6 p-6 pb-0">
            <img src="https://sandbox-app.tilled.com/assets/images/logos/tilled.svg" alt="Tilled Logo" class="w-32" />
        </div>
        <div class="flex-col justify-start items-start gap-2 inline-flex px-4">
            @php
                $links = [
                    '' => [
                        'label' => 'Home',
                        'd' => 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
                    ],
                    'balance-transactions' => [
                        'label' => 'Balance Transactions',
                        'd' => 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
                    ],
                    'payouts' => [
                        'label' => 'Payouts',
                        'd' => 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z',
                    ],
                    'payment-intents' => [
                        'label' => 'Payment Intents',
                        'd' => 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
                    ],
                    'disputes' => [
                        'label' => 'Disputes',
                        'd' => 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
                    ],
                ];
            @endphp
            @foreach ($links as $link => $data)
                <a href="/{{ $link }}"
                    class="w-60 h-11 rounded-lg relative hover:bg-slate-500 active:bg-slate-500 flex items-center px-4">
                    <div class="icon w-7 h-6 mr-2 text-zinc-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            fit="" height="100%" width="100%" preserveAspectRatio="xMidYMid meet"
                            focusable="false">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="{{ $data['d'] }}">
                            </path>
                        </svg>
                    </div>
                    <div class="text-zinc-200 text-xs">{{ $data['label'] }}</div>
                </a>
            @endforeach
        </div>
    </div>
    <div class="m-4 flex lg:justify-center h-fit w-full">
        <div class="bg-white rounded-lg shadow-sm shadow-slate-300 px-2 pb-4 w-[72rem] flex flex-col">
            <h1 class="text-3xl font-bold mb-6 my-4 mx-6 text-tilledTableBody">Balance Transactions</h1>
            <table id="transaction-table"
                class="divide-y divide-neutral-100 overflow-hidden mx-6 border-b border-neutral-200">
                <thead>
                    <tr class="bg-slate-50">
                        @foreach (['Created', 'Description', 'Type', 'Amount', 'Status', 'Source ID'] as $label)
                            <th
                                class="px-6 py-3 text-left text-xs font-bold text-tilledTableHead uppercase tracking-wider">
                                {{ $label }}
                            </th>
                        @endforeach
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <!-- Table rows will be populated dynamically using the Script below -->
                </tbody>
            </table>
            <div class="flex justify-center mt-4 space-x-8">
                <button id="prev-btn" type="button"
                    class="bg-tilledBg enabled:border-tilledActiveBorder border px-6 py-1 rounded-md disabled:bg-tilledBg hover:bg-tilledButtonText hover:shadow-sm"
                    disabled>
                    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
                        class="fill-tilledTableBody">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M12.7071 5.29289C13.0976 5.68342 13.0976 6.31658 12.7071 6.70711
                            L9.41421 10L12.7071 13.2929C13.0976 13.6834 13.0976 14.3166 12.7071 14.7071
                            C12.3166 15.0976 11.6834 15.0976 11.2929 14.7071 L7.29289 10.7071C6.90237
                            10.3166 6.90237 9.68342 7.29289 9.29289L11.2929 5.29289C11.6834 4.90237
                            12.3166 4.90237 12.7071 5.29289Z" />
                    </svg>
                </button>
                <button id="next-btn" type="button"
                    class="bg-tilledBg border-tilledActiveBorder border px-6 py-1 rounded-md hover:bg-tilledButtonText hover:shadow-sm">
                    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
                        class="fill-tilledTableBody">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M7.29289 14.7071C6.90237 14.3166 6.90237 13.6834 7.29289 13.2929
                            L10.5858 10L7.29289 6.70711C6.90237 6.31658 6.90237 5.68342 7.29289 5.29289
                            C7.68342 4.90237 8.31658 4.90237 8.70711 5.29289 L12.7071 9.29289C13.0976
                            9.68342 13.0976 10.3166 12.7071 10.7071 L8.70711 14.7071C8.31658 15.0976
                            7.68342 15.0976 7.29289 14.7071Z" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
    <!-- Included here for simplicity of example -->
    <script>
        const accountId = "{{ env('TILLED_ACCOUNT_ID') }}" || "acct_...";
        const cachedResults = {}; // Initialize an object to store cached results

        let offset = 0;

        function fetchData(offset) {
            if (cachedResults[offset]) {
                // If results are cached, use them directly
                renderData(cachedResults[offset]);
            } else {
                fetch(`/listBalanceTransactions?offset=${offset}`, {
                        headers: {
                            "tilled-account": accountId,
                        },
                    })
                    .then((response) => response.json())
                    .then((data) => {
                        // Cache the fetched data
                        cachedResults[offset] = data;
                        renderData(data);
                    })
                    .catch((error) => {
                        console.error("Error fetching data:", error);
                    });
            }
        }

        function renderData(data) {
            const tableBody = document.querySelector("#transaction-table tbody");
            tableBody.innerHTML = ""; // Clear existing rows
            // Loop through the data and create table rows
            data.items.forEach((item) => {
                const row = document.createElement("tr");
                row.classList.add("even:shadow-sm", "hover:bg-neutral-50");
                const formattedCreatedDate = new Date(item.created_at)
                    .toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric",
                    })
                    .replace(" at", ",");
                const formattedAmount = () => {
                    if (item.amount.toString().startsWith("0")) {
                        return "$" + (item.amount / 100)
                    } else {
                        return new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: item.currency,
                        }).format(item.amount / 100);
                    }
                };
                row.innerHTML = `
            <td class="px-6 py-3 text-xs text-tilledTableBody whitespace-nowrap">${formattedCreatedDate}</td>
            <td class="px-6 py-3 text-xs text-tilledTableBody whitespace-nowrap">${item.description}</td>
            <td class="px-6 py-3 text-xs text-tilledTableBody whitespace-nowrap">
              ${item.type[0].toUpperCase() + item.type.slice(1)}
            </td>
            <td class="px-6 py-3 text-xs text-tilledTableBody whitespace-nowrap">${formattedAmount()}</td>
            <td class="px-6 py-3 text-xs text-tilledTableBody whitespace-nowrap">
              ${item.status[0].toUpperCase() + item.status.slice(1)}
              </td>
            <td class="px-6 py-3 text-xs text-tilledTableBody whitespace-nowrap">${item.source_id}</td>
        `;
                tableBody.appendChild(row);
            });
            // Enable/disable buttons based on offset
            document.querySelector("#prev-btn").disabled = offset === 0;
            document.querySelector("#next-btn").disabled = data.has_more === false;
        }

        document.querySelector("#prev-btn").addEventListener("click", () => {
            offset -= 15;
            fetchData(offset);
        });

        document.querySelector("#next-btn").addEventListener("click", () => {
            offset += 15;
            fetchData(offset);
        });

        fetchData(offset);
        // Get the current URL base path
        const currentPath = window.location.pathname.replace(/\/$/, "");

        // Get all the links that you want to modify
        const links = document.querySelectorAll("#sidebar div a");
        const icon = document.querySelector(".icon");
        // Loop through the links and check if their href matches the current path
        links.forEach((link) => {
            const href = link.getAttribute("href");
            link.classList.toggle("bg-slate-500", href === currentPath);
        });
    </script>
</body>

</html>
