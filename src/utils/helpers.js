import { ImageCompressor } from "image-compressor";

// convert words from mobile_phone to Mobile Phone
export function capitalizeAndJoin(words) {
  return words
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// format date to 01-01-2024 format
export function formatDateDDMMYYYY(date) {
  if (!date) {
    return "";
  }

  return `${date.$d.getDate().toString().padStart(2, "0")}-${(
    date.$d.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${date.$d.getFullYear()}`;
}

// format time to 19:27 format in 24 hrs format
export function formatTimeHHMM(date) {
  if (!date) {
    return "";
  }

  return `${date.$d.getHours()}:${date.$d.getMinutes()}`;
}

// convert date 2024-01-12T05:17:06.314Z to 12-Jan-2024
export function formatDateDDMMMYYYY(inputDate) {
  const date = new Date(inputDate);

  const day = ("0" + date.getDate()).slice(-2);

  // Array of month names
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthIndex = date.getMonth();
  const month = monthNames[monthIndex];
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

// convert date 07-01-2024 to 07-Jan-2024
export function convertDDMMYYYYtoDDMMMYYYY(inputDate) {
  // Split the input date into day, month, and year
  var dateComponents = inputDate.split("-");

  // Create a JavaScript Date object (months are 0-indexed, so we subtract 1 from the month)
  var inputDateObj = new Date(
    dateComponents[2],
    dateComponents[1] - 1,
    dateComponents[0]
  );

  // Format the date as a string in the desired output format
  var outputDate =
    inputDateObj.getDate() +
    "-" +
    getAbbreviatedMonth(inputDateObj.getMonth()) +
    "-" +
    inputDateObj.getFullYear();

  return outputDate;
}

function getAbbreviatedMonth(month) {
  // Array of abbreviated month names
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Return the abbreviated month name
  return months[month];
}

// convert time 19:07 to 07:07 PM
export function convert24To12HourFormat(time24) {
  // Split the input time into hours and minutes
  var timeComponents = time24.split(":");

  // Extract hours and minutes
  var hours = parseInt(timeComponents[0], 10);
  var minutes = timeComponents[1];

  // Determine AM or PM
  var period = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  hours = hours % 12 || 12;

  // Format the time as a string in the 12-hour format
  var outputTime = hours + ":" + minutes + " " + period;

  return outputTime;
}

// image compression

export const compressProfileImage = (file) => {
  return new Promise((resolve, reject) => {
    const imageCompressor = new ImageCompressor();

    const options = {
      quality: 0.6, // Adjust compression quality as needed (0.6 is just an example)
      maxWidth: 1080, // Max width of the output image
      maxHeight: 1920, // Max height of the output image
    };

    // Compress the file
    imageCompressor.run(file, options, (compressedFile) => {
      // Resolve the promise with the compressed file
      resolve(compressedFile);
    });
  });
};
