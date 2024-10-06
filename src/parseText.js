const fs = require("fs");

// Function to convert text data (string) to a JSON object
const convertTextToJson = (textData) => {
  try {
    // Parse the string into a JSON object
    const jsonObject = JSON.parse(textData);
    return jsonObject; // Return the parsed JSON object
  } catch (error) {
    console.error("Error parsing text data:", error);
    return null; // Return null or handle error as needed
  }
};

// Function to read and format the JSON file
const formatJsonFile = async (filePath) => {
  try {
    // Read the JSON file
    const data = (await fs.promises.readFile(filePath, "utf8")).replaceAll("\r", '');

    // Extract the "Text" property which is a string representation of a JSON object/array
    const jsonData = JSON.parse(data)[0].Properties.Text;

    // Convert textData to a JSON object using the separate function
    const textArray = convertTextToJson(jsonData); // Now textArray is a JSON object

    // Check if conversion was successful
    if (!textArray) {
      console.error("Failed to convert text data into JSON.");
      return; // Exit if conversion failed
    }

    // Check if textArray is an array and has at least one element
    if (Array.isArray(textArray) && textArray.length > 0) {
      const textObject = textArray.slice(-2, -1); // Access the first element of the array

      // Convert the object to a string and remove the + signs
      const textString = JSON.stringify(textObject);

      console.log(JSON.parse(textString));
    } else {
      console.error("Invalid textArray format.");
    }
  } catch (error) {
    console.error("Error reading or formatting the JSON file:", error);
  }
};

// Specify the path to your JSON file
const filePath = "C:/Users/User/Downloads/fmodel/Output/Exports/M1/Content/Data/DataCenter/LocalizedString/M1StringSkillJson.json";

// Call the function to format the JSON file
formatJsonFile(filePath);