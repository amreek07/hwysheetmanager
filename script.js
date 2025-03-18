//ambest function
document.addEventListener("DOMContentLoaded", () => {
  const file = document.querySelector("#sheet");
  const submitBtn = document.querySelector("#submitBtn");
  
//   const downloadCSVBtn = document.querySelector('#downloadCSVBtn');
  let jsonData;


  // fileSelectorInput.forEach((file)=>{
    file.addEventListener("change", (event) => {
      // console.log(event.target.files[0]);
      const uploadedFile = event.target.files[0];
  
      const reader = new FileReader();
      reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
  
        const sheetName = workbook.SheetNames[0]; // Get first sheet
        const sheet = workbook.Sheets[sheetName];
  
        jsonData = XLSX.utils.sheet_to_json(sheet); // Convert sheet to JSON
        // console.log(jsonData);
        
      };
  
      reader.readAsArrayBuffer(uploadedFile); // Read the file
    });
  // })

//ambest sheet calculations
  const ambestCalculation = (e) => {
    // console.log();
    const sheetSaving = e.saving;
    const sheetRetail = Number(e.retail);
    const hwyCostSaving = (7 / 10) * sheetSaving;
    const difference = (sheetRetail - hwyCostSaving).toFixed(3);
    const discount = (sheetRetail - difference).toFixed(3);

    const cleanName = e.ts_name.replace(/'/g, ""); //remove ' from the name of travelcenters

    return {
      travelcenter: cleanName,
      merchant: e.xts_id,
      price: sheetRetail.toFixed(3),
      difference: difference,
      state: e.ts_state,
      discount: discount,
    };
  };

  //ambest data
  const ambest = () => {
    let newAmbestSheet = [];
    jsonData.forEach((data) => {
      const CalculatedData = ambestCalculation(data);
      newAmbestSheet.push(CalculatedData);
    });

    downloadCSV(newAmbestSheet, "Ambest");
  };

//ta petro data sheet functionality

const taPetroFile = document.querySelector('#taSheet');

let taJsonData;

taPetroFile.addEventListener("change", (event) => {
  // console.log(event.target.files[0]);
  const uploadedFile = event.target.files[0];

  const reader = new FileReader();
  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    const sheetName = workbook.SheetNames[0]; // Get first sheet
    const sheet = workbook.Sheets[sheetName];

    taJsonData = XLSX.utils.sheet_to_json(sheet, {range: 6}); // Convert sheet to JSON
    // console.log(jsonData);
  };
  reader.readAsArrayBuffer(uploadedFile); // Read the file
});



const taPetroCalculation = (e) =>{
  console.log(e);

}


const taPetro = () => {
  let newTaPetroData = [];

  taJsonData.forEach((data) => {
    console.log(data);
    // const CalculatedData = taPetroCalculation(data);
    // newTaPetroData.push(CalculatedData);
  });
}



  const downloadCSV = (processedData, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(processedData); // Convert JSON data to a worksheet
    const csvContent = XLSX.utils.sheet_to_csv(worksheet); // Convert worksheet to CSV format
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    const newDate = new Date();
    const yyyy = newDate.getFullYear();
    const dd = newDate.getDate();
    const mm = newDate.getMonth() + 1;


    a.download = `${fileName} ${dd}-${mm}-${yyyy}.csv`; // File name
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };


  //all btn click functionality
  const taSubmitBtn = document.querySelector('#taSubmitBtn');


  submitBtn.addEventListener("click", ambest);
  taSubmitBtn.addEventListener("click", taPetro);
  
});




