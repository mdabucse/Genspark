const apiUrl = "https://sampleapi20260706g3-bvdacte9b0dvhudv.canadacentral-01.azurewebsites.net/Weatherforecast";

const button = document.getElementById("loadBtn");
const tableBody = document.getElementById("weatherBody");
const loader = document.getElementById("loader");
const errorContainer = document.getElementById("errorContainer");
const errorMessage = document.getElementById("errorMessage");
const forecastCount = document.getElementById("forecastCount");
const weatherTable = document.getElementById("weatherTable");

button.addEventListener("click", loadWeather);
window.addEventListener("DOMContentLoaded", loadWeather);

async function loadWeather() {
    // Show loader, hide error and table
    loader.classList.remove("hidden");
    errorContainer.classList.add("hidden");
    weatherTable.classList.add("hidden");
    button.disabled = true;
    
    // Add spinning animation class to the button icon
    const btnIcon = button.querySelector(".btn-icon");
    if (btnIcon) btnIcon.classList.add("spin");

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch meteorological data (Status: ${response.status})`);
        }

        const weatherData = await response.json();

        // Clear existing rows
        tableBody.innerHTML = "";

        if (!Array.isArray(weatherData) || weatherData.length === 0) {
            throw new Error("No weather forecast records found.");
        }

        // Render records
        weatherData.forEach(item => {
            const dateObj = new Date(item.date);
            const formattedDate = isNaN(dateObj.getTime()) 
                ? item.date 
                : dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

            const isHot = item.temperatureC > 30;
            const rowClass = isHot ? 'class="hot-row"' : '';

            tableBody.innerHTML += `
                <tr ${rowClass}>
                    <td class="date-cell">${formattedDate}</td>
                    <td class="temp-c">${item.temperatureC}°C ${isHot ? '🔥' : ''}</td>
                    <td class="temp-f">${item.temperatureF}°F</td>
                    <td class="summary-cell"><span class="summary-badge">${item.summary}</span></td>
                </tr>
            `;
        });

        // Set forecast count
        forecastCount.textContent = weatherData.length;
        
        // Show table
        weatherTable.classList.remove("hidden");
    } catch (error) {
        // Show user-friendly error message
        errorMessage.textContent = error.message || "An unexpected error occurred while loading weather data.";
        errorContainer.classList.remove("hidden");
        forecastCount.textContent = "0";
    } finally {
        // Hide loader
        loader.classList.add("hidden");
        button.disabled = false;
        if (btnIcon) btnIcon.classList.remove("spin");
    }
}