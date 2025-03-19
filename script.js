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
    console.log('testing->');
    console.log(e);
    let retail_price = Number(e.Price);
    let fuel_price = Number(e.Price_1);
    let saving_price = (retail_price - fuel_price );
    let hwyCostSaving = (7 / 10) * saving_price;
    let difference = (retail_price - hwyCostSaving).toFixed(3);
    let discount = (retail_price - difference).toFixed(3);
    let travelcenter = e["Travel Center"];
    return {
      travelcenter: travelcenter,
      merchant: e["Merchant ID"],
      price: retail_price.toFixed(3),
      difference: difference,
      state: e.ST,
      discount: discount,
    };
  }
  const taPetro = () => {
    let newTaPetroData = [];
    taJsonData.forEach((data) => {
      let calculatedData = taPetroCalculation(data);
      newTaPetroData.push(calculatedData);
    });
    downloadCSV(newTaPetroData, "Ta Petro");
  }

  //casey cost plus sheet functionality
  const CaseyFile = document.querySelector('#casheet');
  let caJsonData;
  CaseyFile.addEventListener("change", (event) => {
    // console.log(event.target.files[0]);
    const uploadedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0]; // Get first sheet
      const sheet = workbook.Sheets[sheetName];
      caJsonData = XLSX.utils.sheet_to_json(sheet, {range: 3}); // Convert sheet to JSON
      caJsonData = caJsonData.filter(row => row.Savings !== "N/A" && row.Savings !== "" && row.Savings !== null && row.Savings !== undefined);
      // console.log("testing--------->");
      // console.log(caJsonData);
    };
    reader.readAsArrayBuffer(uploadedFile); // Read the file
  });

  const caseyCalculation = (e) =>{
    console.log('testing->');
    console.log(e);
      const sheetSaving = Math.max(0, Number(e.Savings));
      const sheetRetail = Number(e["Retail Price"]);
      const hwyCostSaving = (7 / 10) * sheetSaving;
      const difference = (sheetRetail - hwyCostSaving).toFixed(3);
      const discount = (sheetRetail - difference).toFixed(3);
      console.log("diff===>",discount);
      // const cleanName = e.ts_name.replace(/'/g, ""); //remove ' from the name of travelcenters
    return {
      travelcenter: e["Caseys Site #"],
      merchant: e["Rack ID"],
      price: sheetRetail.toFixed(3),
      difference: difference,
      state: e.State,
      discount: discount,
    };
  }
  const CaseyCost = () => {
    let newcaseyData = [];
    caJsonData.forEach((data) => {
      let calculatedData = caseyCalculation(data);
      newcaseyData.push(calculatedData);
    });
    downloadCSV(newcaseyData, "Caseys Cost");
  }

  // 7 Fleet sheet function
  const FleetFile = document.querySelector('#flsheet');
  let FlJsonData;
  FleetFile.addEventListener("change", (event) => {
    // console.log(event.target.files[0]);
    const uploadedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0]; // Get first sheet
      const sheet = workbook.Sheets[sheetName];
      FlJsonData = XLSX.utils.sheet_to_json(sheet, {range: 0}); // Convert sheet to JSON
      console.log(" fleet testing--------->");
      console.log(FlJsonData);
    };
    reader.readAsArrayBuffer(uploadedFile); // Read the file
  });

  const fleetCalculation = (e) =>{
    console.log('testing->');
    console.log(e);
      const sheetSaving = Number(e["Savings/Gal"]);
      const sheetRetail = Number(e["Retail Price"]);
      const hwyCostSaving = (7 / 10) * sheetSaving;
      const difference = (sheetRetail - hwyCostSaving).toFixed(3);
      const discount = (sheetRetail - difference).toFixed(3);
      console.log("discount--->",discount);
    //   // const cleanName = e.ts_name.replace(/'/g, ""); //remove ' from the name of travelcenters
    return {
      travelcenter: e["Store#"],
      merchant: e["Comdata"],
      price: sheetRetail.toFixed(3),
      difference: difference,
      state: e.State,
      discount: discount,
    };
  }
  const fleet = () => {
    let newfleetData = [];
    FlJsonData.forEach((data) => {
      let calculatedData = fleetCalculation(data);
      // console.log('calculated',calculatedData);
      newfleetData.push(calculatedData);
    });
    downloadCSV(newfleetData, "7 Fleet");
  }

  //Ractrac sheet function

   // 7 Fleet sheet function
   const RaceFile = document.querySelector('#rcsheet');
   let RcJsonData;
   RaceFile.addEventListener("change", (event) => {
     // console.log(event.target.files[0]);
     const uploadedFile = event.target.files[0];
     const reader = new FileReader();
     reader.onload = function (e) {
       const data = new Uint8Array(e.target.result);
       const workbook = XLSX.read(data, { type: "array" });
       const sheetName = workbook.SheetNames[0]; // Get first sheet
       const sheet = workbook.Sheets[sheetName];
       RcJsonData = XLSX.utils.sheet_to_json(sheet, {range: 4}); // Convert sheet to JSON
       console.log(" Racrtac testing--------->");
       console.log(RcJsonData);
     };
     reader.readAsArrayBuffer(uploadedFile); // Read the file
   });
 
   const RaceCalculation = (e) =>{
    console.log('testing->');
    console.log(e);
    let retail_price = Number(e["Retail Price"]);
    let fuel_price = Number(e["Final Price"]);
    let saving_price = (retail_price - fuel_price );
    let hwyCostSaving = (7 / 10) * saving_price;
    let difference = (retail_price - hwyCostSaving).toFixed(3);
    let discount = (retail_price - difference).toFixed(3);
    // console.log("diff--->",difference);
    // console.log('discount--->',discount);
     return {
       travelcenter: e["City"],
       merchant: e["Store ID"],
       price: retail_price.toFixed(3),
       difference: difference,
       state: e.State,
       discount: discount,
     };
   }
   const racetrac = () => {
     let newraceData = [];
     RcJsonData.forEach((data) => {
       let calculatedData = RaceCalculation(data);
      //  console.log('calculated',calculatedData);
       newraceData.push(calculatedData);
     });
     downloadCSV(newraceData, "Racrtac");
   }



  //sap bros data function
  // const sapBrosData = document.querySelector('#sapText');
  // sapBrosData.addEventListener('change', () => {
  //     const sapBroInputText = sapBrosData.value.trim();
  //     // console.log('test------>',sapBroInputText);
  //     if (!sapBroInputText) {
  //         console.log("No data entered!");
  //         return;
  //     }
  //     const headers = ["Location", "State", "Cost Plus Price", "Retail Minus Price", "Your Price", "Posted Retail", "Your Savings"];
  //     const csvToJson = (data) =>{
  //       data.split("\n").forEach((line)=>{
  //         const newData = line.trim();
  //         if (headers.includes(newData)) {
  //           console.log("not Matching one:", newData);
  //       }
  //         // console.log(typeof newData);
  //         console.log(newData);
  //       })
  //     }
  //     const jsonData = csvToJson(sapBroInputText);
  //     // console.log(jsonData); // Output JSON in the console
  // });


//download csv all files
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
  const casubmitbtn = document.querySelector('#caSubmitBtn');
  const flsubmitbtn = document.querySelector('#flSubmitBtn');
  const rcsubmitbtn = document.querySelector('#rcSubmitBtn');
  submitBtn.addEventListener("click", ambest);
  taSubmitBtn.addEventListener("click", taPetro);
  casubmitbtn.addEventListener("click", CaseyCost);
  flsubmitbtn.addEventListener("click", fleet);
  rcsubmitbtn.addEventListener("click", racetrac);
});




