//ambest function
document.addEventListener("DOMContentLoaded", () => {
  const file = document.querySelector("#sheet");
  const submitBtn = document.querySelector("#submitBtn");
//   const downloadCSVBtn = document.querySelector('#downloadCSVBtn');
  let jsonData;

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
      
    };

    reader.readAsArrayBuffer(uploadedFile); // Read the file
  });

  const ambestCalculation = (e) => {
    // console.log();
    const sheetSaving = e.saving;
    const sheetRetail = Number(e.retail);
    const hwyCostSaving = (7 / 10) * sheetSaving;
    const difference = (sheetRetail - hwyCostSaving).toFixed(3);
    const discount = (sheetRetail - difference).toFixed(3);

    const cleanName = e.ts_name.replace(/'/g, ""); //remove ' from the name of travelcenters

    return {
      travelCenter: cleanName,
      merchant: e.xts_id,
      price: sheetRetail.toFixed(3),
      state: e.ts_state,
      difference: difference,
      discount: discount,
    };

    // console.log(`travel center : ${e.ts_name}, Merchant: ${e.xts_id}, Price: ${sheetRetail} state: ${e.ts_state}, difference : ${difference}, discount: ${discount}`)
  };

  const ambest = () => {
    let newAmbestSheet = [];
    jsonData.forEach((data) => {
      const CalculatedData = ambestCalculation(data);
      newAmbestSheet.push(CalculatedData);
    });

    downloadCSV(newAmbestSheet, "Ambest");
  };

  const downloadCSV = (processedData, fileName) => {
    // console.log()
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

  
  submitBtn.addEventListener("click", ambest);
});


//ta petero

