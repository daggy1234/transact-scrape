const fs = require('fs');
const path = require('path');

const textItemsFolderPath = path.join(__dirname, 'textItems');
const outputFilePath = path.join(__dirname, 'transact_data.json');

fs.readdir(textItemsFolderPath, (err, files) => {
  if (err) {
    console.error('Error reading the textItems folder:', err);
    return;
  }

  let combinedData = [];

  for (const file of files) {
    const filePath = path.join(textItemsFolderPath, file);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents).data;
    
    // Assuming each file contains an object with a property 'data' that is a list
    combinedData = combinedData.concat(data);
  }

  // Remove duplicates if necessary
  combinedData = Array.from(new Set(combinedData));

  fs.writeFileSync(outputFilePath, JSON.stringify({data: combinedData}, null, 2), 'utf8');
  console.log(`Combined data written to ${outputFilePath}`);
});
