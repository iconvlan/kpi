// =================================================================
const realGoogleFormID = "1FAIpQLSf_uo7kvr-S1t45_jLGcOr7ST5SQWURnXwbfWvlp-QQQe5hbQ";
const entryFullname = "2013590127"  // entry nama lengkap
const entryShift = "116997613"  // entry shift
const entryAnalisa = "1151382872"  // entry analisa
const entryEvidence = "893076951"  // entry evidence
// =================================================================


let setName = "";
let setShift = "";
let splitData = [];

function generateListPreview(val) {
  const tableBodyTiket = document.querySelector("#table-container-1 tbody");
  const tableBodyCust = document.querySelector("#table-container-2 tbody");
  let ctrTiket = 0;
  let ctrCust = 0;
  
  tableBodyTiket.innerHTML = "";
  tableBodyCust.innerHTML = "";
  val.forEach(element => {
      if (isIDCustomer(element)) {
        ctrCust++
        const row = tableBodyCust.insertRow();
        const cell = row.insertCell();
        cell.textContent = element;
        row.className = "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted";
        cell.className = "p-4 align-middle [&amp;:has([role=checkbox])]:pr-0";
      } else {
        ctrTiket++
        const row = tableBodyTiket.insertRow();
        const cell = row.insertCell();
        cell.textContent = element;
        row.className = "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted";
        cell.className = "p-4 align-middle [&amp;:has([role=checkbox])]:pr-0";
      }
  });
  document.querySelector("#ctr-tiket").textContent = `(${ctrTiket})`;
  document.querySelector("#ctr-cust").textContent = `(${ctrCust})`;
}

function readFile() {
  const fileInput = document.getElementById("file-input");
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = function (event) {
    const text = event.target.result;
    setName = file.name.replace(".txt", "").split("-")[0];
    setShift = file.name.replace(".txt", "").split("-")[1];
    splitData = text
      .replace(/\n/g, "")
      .replace(/\r/g, "")
      .split(",")
      .filter((value) => value.trim() !== "");
    generateListPreview(splitData)
    document.querySelector("button").disabled = false;
  };
  reader.readAsText(file);
}

function isIDCustomer(str) {
  const regex = /^[0-9]+$/;
  return regex.test(str);
}

function sendData() {
  document.querySelector("button").disabled = true;
  let percentage = 0;
  const incremental = 100 / splitData.length
  const fullName = `entry.${entryFullname}=${setName
    .toUpperCase()
    .replace(/ /g, "+")}`;
  const timeShift = `entry.${entryShift}=${setShift.toUpperCase()}`;
  const promises = splitData.map((data) => {
    const analisa = isIDCustomer(data)
      ? `entry.${entryAnalisa}=GROUP WAG`
      : `entry.${entryAnalisa}=TICKET`;
    const evidence = `entry.${entryEvidence}=${data}`;

    return fetch(
      `https://docs.google.com/forms/d/e/${realGoogleFormID}/formResponse?usp=pp_url&${fullName}&${timeShift}&${analisa}&${evidence}`,
      { mode: "no-cors" }
    )
      .then((response) => {
        percentage += incremental;
        document.querySelector("button").textContent = `${percentage}%`;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

  Promise.all(promises)
    .then(() => {
      console.log("All promises done");
      document.querySelector("button").textContent = 'Done !';
      setTimeout(() => {
        reset()
    }, 500);
      
    })
    .catch((error) => {
      console.error("One or more promises failed:", error);
      alert('Terjadi Kesalahan')
    });
}

function reset() {
  document.querySelector("button").textContent = 'Submit';
  document.getElementById("file-input").value = "";
  document.querySelector("#table-container-1 tbody").innerHTML = "";
  document.querySelector("#table-container-2 tbody").innerHTML = "";
  document.querySelector("#ctr-tiket").textContent = '';
  document.querySelector("#ctr-cust").textContent = '';
}
