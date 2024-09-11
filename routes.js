import { json, Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();

// const directoryPath = path.resolve("/home/sudheer/scripts/scrap_data/");
const directoryPath = path.resolve("../scripts/scrap_data/");
console.log(directoryPath);

// Function to format the date
function formatDate(dateString) {
  const year = dateString.slice(0, 4);
  const month = dateString.slice(4, 6);
  const day = dateString.slice(6, 8);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const formattedDate = `${day} ${months[parseInt(month, 10) - 1]} ${year}`;
  return formattedDate;
}

// Read the directory
fs.readdir(directoryPath, (err, files) => {
  if (err) {
    console.error("Error reading the directory:", err);
    return;
  }

  // Filter files that match the pattern Fja_*.json
  const jsonFiles = files.filter(
    (file) => file.startsWith("Fja_") && file.endsWith(".json")
  );

  // Extract the date from the filename and sort by date
  const sortedFiles = jsonFiles.sort((a, b) => {
    const dateA = new Date(
      a
        .match(/Fja_(\d{14})\.json/)[1]
        .replace(
          /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
          "$1-$2-$3T$4:$5:$6"
        )
    );
    const dateB = new Date(
      b
        .match(/Fja_(\d{14})\.json/)[1]
        .replace(
          /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
          "$1-$2-$3T$4:$5:$6"
        )
    );
    return dateB - dateA; // Sort in descending order
  });

  // Print the sorted array of filenames
  //   console.log(sortedFiles);

  // Define the route to serve the sorted filenames as HTML
  router.route("/").get((req, res) => {
    const fullDomain = req.headers.host; //with port
    const domain = req.headers.host.split(":")[0]; // if use port,  filter host
    console.log("requested host: " + fullDomain);
    const html = `
        <html>
          <head>
            <title>View FJA Dbase</title>
             <!-- Required meta tags -->
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">

            <!-- Bootstrap CSS -->
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
          </head>
          <body>
            

            <div class="container">
            <h1 class="text-center">Latest jobs Database</h1> <br>
             <div class="row justify-content-evenly">

              ${sortedFiles
                .slice(0, 3)
                .map((file) => {
                  const datePart = file.match(/Fja_(\d{14})\.json/)[1];
                  return `
                   <div class="card" style="width: 18rem;">
                        <svg class="bd-placeholder-img card-img-top" width="100%" height="180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Image cap" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#868e96"></rect><text x="30%" y="50%" fill="#dee2e6" dy=".3em">${formatDate(
                          datePart
                        )}</text></svg>

                        <div class="card-body">
                            <h5 class="card-title">${file.replace(
                              ".json",
                              ""
                            )}</h5>
                            <p class="card-text">You can preview data named ${file} file with complete assessment.</p>
                            <a href="${
                              "/data/" +
                              file.replace(".json", "").replace("Fja_", "")
                            }" class="btn btn-primary w-100">Preview Data</a>
                        </div>
                    </div>
                  `;
                })
                .join("")}

            </div>

           

            </div>

            

            <!-- Option 1: Bootstrap Bundle with Popper -->
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>

          </body>
        </html>
      `;
    res.status(200).send(html);
  });

  //preview data
  router.route("/data/:file").get((req, res) => {
    const { file } = req.params;
    console.log(directoryPath + "/" + file);
    const jsonFile = directoryPath + "/Fja_" + file + ".json";
    console.log(jsonFile);

    const htmlFile = fs.readFileSync("./previewData.html", "utf8");
    const data = fs.readFileSync(jsonFile);

    const finalHtml = htmlFile.replace("{{jsonUrl}}", file);

    res.status(200).send(finalHtml); // tests
  });
});

export default router;
