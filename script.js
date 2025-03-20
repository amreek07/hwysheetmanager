document.addEventListener("DOMContentLoaded", () => {
  //select box selection

  const selectBox = document.querySelector("#sheetName");
  const ambestContainer = document.querySelector(".ambestContainer");
  const taContainer = document.querySelector(".taContainer");
  const caseyContainer = document.querySelector(".caseyContainer");
  const sapBroContainer = document.querySelector(".sapBroContainer");
  const fleetContainer = document.querySelector(".fleetContainer");
  const raceContainer = document.querySelector(".raceContainer");

  selectBox.addEventListener("change", () => {
    console.log(selectBox.value);
    if (selectBox.value === "ambest") {
      ambestContainer.style.display = "block";
      taContainer.style.display = "none";
      caseyContainer.style.display = "none";
      sapBroContainer.style.display = "none";
      fleetContainer.style.display = "none";
      raceContainer.style.display = "none";
    } else if (selectBox.value === "ta-petro") {
      ambestContainer.style.display = "none";
      taContainer.style.display = "block";
      caseyContainer.style.display = "none";
      sapBroContainer.style.display = "none";
      fleetContainer.style.display = "none";
      raceContainer.style.display = "none";
    } else if (selectBox.value === "casey") {
      ambestContainer.style.display = "none";
      taContainer.style.display = "none";
      caseyContainer.style.display = "block";
      sapBroContainer.style.display = "none";
      fleetContainer.style.display = "none";
      raceContainer.style.display = "none";
    } else if (selectBox.value === "sapbros") {
      ambestContainer.style.display = "none";
      taContainer.style.display = "none";
      caseyContainer.style.display = "none";
      sapBroContainer.style.display = "block";
      fleetContainer.style.display = "none";
      raceContainer.style.display = "none";
    } else if (selectBox.value === "7-Fleet") {
      ambestContainer.style.display = "none";
      taContainer.style.display = "none";
      caseyContainer.style.display = "none";
      sapBroContainer.style.display = "none";
      fleetContainer.style.display = "block";
      raceContainer.style.display = "none";
    } else if (selectBox.value === "Ractrac") {
      ambestContainer.style.display = "none";
      taContainer.style.display = "none";
      caseyContainer.style.display = "none";
      sapBroContainer.style.display = "none";
      fleetContainer.style.display = "none";
      raceContainer.style.display = "block";
    }
  });

  //ambest js code
  const chooseFileAmbest = document.querySelector("#chooseFileAmbest");
  const inputFileAmbest = document.querySelector(".inputFileAmbest");
  const file = document.querySelector("#ambestSheet");
  const submitBtn = document.querySelector("#submitBtn");
  let jsonData;

  chooseFileAmbest.addEventListener("click", () => {
    file.click();
  });
  inputFileAmbest.addEventListener("click", () => {
    file.click();
  });

  file.addEventListener("change", () => {
    if (file.files.length > 0) {
      inputFileAmbest.value = file.files[0].name; // Displays selected file name in the text input
    }
  });

  file.addEventListener("change", (event) => {
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
  //ambest sheet calculations
  const ambestCalculation = (e) => {
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
  const taPetroFile = document.querySelector("#taSheet");
  const taSubmitBtn = document.querySelector("#taSubmitBtn");
  const chooseFilePetro = document.querySelector("#chooseFilePetro");
  const inputFilePetro = document.querySelector(".inputFilePetro");
  let taJsonData;

  chooseFilePetro.addEventListener("click", () => {
    taPetroFile.click();
  });
  inputFilePetro.addEventListener("click", () => {
    taPetroFile.click();
  });

  taPetroFile.addEventListener("change", () => {
    if (taPetroFile.files.length > 0) {
      inputFilePetro.value = taPetroFile.files[0].name;
    }
  });

  taPetroFile.addEventListener("change", (event) => {
    const uploadedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0]; // Get first sheet
      const sheet = workbook.Sheets[sheetName];
      taJsonData = XLSX.utils.sheet_to_json(sheet, { range: 6 }); // Convert sheet to JSON
    };
    reader.readAsArrayBuffer(uploadedFile); // Read the file
  });

  const taPetroCalculation = (e) => {
   
    let retail_price = Number(e.Price);
    let fuel_price = Number(e.Price_1);
    let saving_price = retail_price - fuel_price;
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
  };
  const taPetro = () => {
    let newTaPetroData = [];
    taJsonData.forEach((data) => {
      let calculatedData = taPetroCalculation(data);
      newTaPetroData.push(calculatedData);
    });
    downloadCSV(newTaPetroData, "Ta Petro");
  };

  //casey cost plus sheet functionality
  const CaseyFile = document.querySelector("#casheet");
  const caSubmitBtn = document.querySelector("#caSubmitBtn");
  const chooseFileCasey = document.querySelector("#chooseFileCasey");
  const inputFileCasey = document.querySelector(".inputFileCasey");
  let caJsonData;

  chooseFileCasey.addEventListener("click", () => {
    CaseyFile.click();
  });
  inputFileCasey.addEventListener("click", () => {
    CaseyFile.click();
  });

  CaseyFile.addEventListener("change", () => {
    if (CaseyFile.files.length > 0) {
      inputFileCasey.value = CaseyFile.files[0].name;
    }
  });

  CaseyFile.addEventListener("change", (event) => {
    const uploadedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0]; // Get first sheet
      const sheet = workbook.Sheets[sheetName];
      caJsonData = XLSX.utils.sheet_to_json(sheet, { range: 3 }); // Convert sheet to JSON
      caJsonData = caJsonData.filter(
        (row) =>
          row.Savings !== "N/A" &&
          row.Savings !== "" &&
          row.Savings !== null &&
          row.Savings !== undefined
      );
    };
    reader.readAsArrayBuffer(uploadedFile); // Read the file
  });

  const caseyCalculation = (e) => {
    const sheetSaving = Math.max(0, Number(e.Savings));
    const sheetRetail = Number(e["Retail Price"]);
    const hwyCostSaving = (7 / 10) * sheetSaving;
    const difference = (sheetRetail - hwyCostSaving).toFixed(3);
    const discount = (sheetRetail - difference).toFixed(3);
    return {
      travelcenter: e["Caseys Site #"],
      merchant: e["Rack ID"],
      price: sheetRetail.toFixed(3),
      difference: difference,
      state: e.State,
      discount: discount,
    };
  };
  const CaseyCost = () => {
    let newcaseyData = [];
    caJsonData.forEach((data) => {
      let calculatedData = caseyCalculation(data);
      newcaseyData.push(calculatedData);
    });
    downloadCSV(newcaseyData, "Caseys Cost");
  };

    // 7 Fleet sheet function
    const FleetFile = document.querySelector('#flsheet');
    const flSubmitBtn = document.querySelector('#flSubmitBtn');
    const chooseFileFleet = document.querySelector('#chooseFileFleet');
    const inputFileFleet = document.querySelector('.inputFileFleet');
    let FlJsonData;


    chooseFileFleet.addEventListener("click", () => {
      FleetFile.click();
    });
    inputFileFleet.addEventListener("click", () => {
      FleetFile.click();
    });
  
    FleetFile.addEventListener("change", () => {
      if (FleetFile.files.length > 0) {
        inputFileFleet.value = FleetFile.files[0].name;
      }
    });



    FleetFile.addEventListener("change", (event) => {
      const uploadedFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0]; // Get first sheet
        const sheet = workbook.Sheets[sheetName];
        FlJsonData = XLSX.utils.sheet_to_json(sheet, {range: 0}); // Convert sheet to JSON
      };
      reader.readAsArrayBuffer(uploadedFile); // Read the file
    });

    const fleetCalculation = (e) =>{
      
        const sheetSaving = Number(e["Savings/Gal"]);
        const sheetRetail = Number(e["Retail Price"]);
        const hwyCostSaving = (7 / 10) * sheetSaving;
        const difference = (sheetRetail - hwyCostSaving).toFixed(3);
        const discount = (sheetRetail - difference).toFixed(3);
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
        newfleetData.push(calculatedData);
      });
      downloadCSV(newfleetData, "7 Fleet");
    }

    //Ractrac sheet function
     const RaceFile = document.querySelector('#rcsheet');
     const chooseFileRace = document.querySelector('#chooseFileRace');
     const rcSubmitBtn = document.querySelector('#rcSubmitBtn');
     const inputFileRace = document.querySelector('.inputFileRace');
     let RcJsonData;


     chooseFileRace.addEventListener("click", () => {
      RaceFile.click();
    });
    inputFileFleet.addEventListener("click", () => {
      RaceFile.click();
    });
  
    RaceFile.addEventListener("change", () => {
      if (RaceFile.files.length > 0) {
        inputFileRace.value = RaceFile.files[0].name;
      }
    });

     RaceFile.addEventListener("change", (event) => {
       const uploadedFile = event.target.files[0];
       const reader = new FileReader();
       reader.onload = function (e) {
         const data = new Uint8Array(e.target.result);
         const workbook = XLSX.read(data, { type: "array" });
         const sheetName = workbook.SheetNames[0]; // Get first sheet
         const sheet = workbook.Sheets[sheetName];
         RcJsonData = XLSX.utils.sheet_to_json(sheet, {range: 4}); // Convert sheet to JSON
       };
       reader.readAsArrayBuffer(uploadedFile); // Read the file
     });

     const RaceCalculation = (e) =>{
      console.log(e);
      let retail_price = Number(e["Retail Price"]);
      let fuel_price = Number(e["Final Price"]);
      let saving_price = (retail_price - fuel_price );
      let hwyCostSaving = (7 / 10) * saving_price;
      let difference = (retail_price - hwyCostSaving).toFixed(3);
      let discount = (retail_price - difference).toFixed(3);
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
         newraceData.push(calculatedData);
       });
       downloadCSV(newraceData, "Racrtac");
     }

    //sap bros data function
      const sapBrosData = document.querySelector('#sapText');
      const sapBroProcess = document.querySelector('#sapBroProcess');
      let sappjsonData = [];

      sapBrosData.addEventListener('input', () => {
          processSapBrosData();
      });

      const processSapBrosData = () => {
          const sapBroInputText = sapBrosData.value.trim();
          if (!sapBroInputText) {
              return;
          }
          let lines = sapBroInputText.split("\n").map(line => line.trim()).filter(line => line);
          const headers = [
              "Location",
              "State",
              "Cost Plus Price",
              "Retail Minus Price",
              "Your Price",
              "Posted Retail",
              "Your Savings"
          ];
          sappjsonData = [];
          let dataStartIndex = 0;
          for (let i = 0; i < lines.length; i++) {
              if (lines[i] === "Your Savings") {
                  dataStartIndex = i + 1;
                  break;
              }
          }
          for (let i = dataStartIndex; i < lines.length; i += headers.length) {
              let row = lines.slice(i, i + headers.length);

              if (row.length === headers.length) {
                  let jsonRow = {};
                  headers.forEach((header, index) => {
                      jsonRow[header] = row[index] || "";
                  });
                  sappjsonData.push(jsonRow);
              }
          }
      };

      const SappCalculation = (e) =>{
        const merchantMapping = {
          "Clearfield": "SAPB101",
          "Cheyenne": "SAPB104",
          "Columbus": "SAPB114",
          "Council Bluffs": "SAPB110",
          "Denver": "SAPB102",
          "Fremont": "SAPB109",
          "Harrisonville": "SAPB117",
          "Junction City": "SAPB116",
          "Lincoln": "SAPB112",
          "Odessa": "SAPB111",
          "Ogallala": "SAPB107",
          "Omaha": "SAPB113",
          "Percival": "SAPB108",
          "Peru": "SAPB103",
          "Salt Lake City": "SAPB105",
          "Sidney": "SAPB106",
          "York": "SAPB115"
      };
        const merchantID = merchantMapping[e["Location"]] || "Unknown";
        const sheetSaving = Math.abs(Number(e["Your Savings"]));
        const sheetRetail = Number(e["Posted Retail"]);
        const hwyCostSaving = (7 / 10) * sheetSaving;
        const difference = (sheetRetail - hwyCostSaving).toFixed(3);
        const discount = (sheetRetail - difference).toFixed(3);
        console.log("discount==>",discount);
         return {
           travelcenter: e["Location"],
           merchant: merchantID,
           price: sheetRetail.toFixed(3),
           difference: difference,
           state: e.State,
           discount: discount,
         };
       }

      const Sapp = () => {
        let newSappData = [];
        sappjsonData.forEach((data) => {
          let calculatedData = SappCalculation(data);
          newSappData.push(calculatedData);
        });
        downloadCSV(newSappData, "Sapp Bros");
      }

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

  submitBtn.addEventListener("click", ambest);
  taSubmitBtn.addEventListener("click", taPetro);
  caSubmitBtn.addEventListener("click", CaseyCost);
  flSubmitBtn.addEventListener("click", fleet);
  rcSubmitBtn.addEventListener("click", racetrac);
  sapBroProcess.addEventListener("click", Sapp);
});
