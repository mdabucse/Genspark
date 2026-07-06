const apiUrl =
"https://sampleapi20260706g3-bvdacte9b0dvhudv.canadacentral-01.azurewebsites.net/Weatherforecast";

const button = document.getElementById("loadBtn");
const tableBody = document.getElementById("weatherBody");

button.addEventListener("click", loadWeather);

async function loadWeather(){

    tableBody.innerHTML =
    `<tr>
        <td colspan="4" class="loading">
            Loading...
        </td>
    </tr>`;

    try{

        const response = await fetch(apiUrl);

        if(!response.ok){
            throw new Error("Failed to fetch data");
        }

        const weather = await response.json();

        tableBody.innerHTML="";

        weather.forEach(item=>{

            tableBody.innerHTML += `
                <tr>
                    <td>${item.date}</td>
                    <td>${item.temperatureC} °C</td>
                    <td>${item.temperatureF} °F</td>
                    <td>${item.summary}</td>
                </tr>
            `;
        });

    }
    catch(error){

        tableBody.innerHTML=
        `<tr>
            <td colspan="4" class="error">
                ${error.message}
            </td>
        </tr>`;
    }

}