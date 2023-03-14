const json = parseCSV(csv)
//downloadJSONJSON.stringify(json[0]))

const fileName = 'students.json'
downloadJSON(json, fileName);



async function saveLetters(data) {
  let fileIndex = 0
    // Create a new instance of jsZip
    
    let zip = new JSZip();
    let promises = []
    // Loop through the data array
    for (const item of data) {
      let id = item.id;

      // Use the fetch API to get the letter content
      promises.push(fetchViaProxy(item.letterLink)
        .then(response => response.blob())
        .then(blob => {
          // Add the letter to the zip file with the id as the filename
          fileIndex++
          document.body.innerHTML=("Current file:<b>" + fileIndex +'</b><br> Total files:<b>'+data.length+'</b><br>'+Math.floor((fileIndex/data.length)*10000)/100+'% downloaded')
          zip.file(`${id}.pdf`, blob);
        })
        .catch(err => console.log(err))) // added catch here to handle errors
      }
      // wait for all the fetch requests to complete
      await Promise.all(promises)
      // Generate the zip file and download it as "students.zip"
      zip.generateAsync({ type: "blob" }).then(function(content) {
        saveAs(content, "students.zip");
      });
    }

    async function fetchViaProxy(url) {
      try {
        const proxyUrl = 'https://corsproxy.io/?';
        const targetUrl = url||"https://ueab.ac.ke/wp-content/uploads/2022/KUCCPS2022/Admissions%20letters%201.pdf"
        const proxiedUrl = proxyUrl + encodeURIComponent(targetUrl);
        //console.log(proxiedUrl)
        
        const response = await fetch(proxiedUrl);
        //const data = await response.text();
        return response;
      } catch (error) {
        console.error(error);
      }
    }

    let data = [{
      "name": "GITHAE ALVIN GACHANJA",
      "letterLink": "https://ueab.ac.ke/wp-content/uploads/2022/KUCCPS2022/Admissions%20letters%201.pdf",
      "major": "BACHELOR OF SCIENCE IN MATHEMATICS",
      "id": "SGITAL2311",
      "email": "sgital2311@ueab.ac.ke"
  }];
    saveLetters(json)
