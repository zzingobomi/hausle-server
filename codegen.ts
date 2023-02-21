const { exec } = require("child_process");
const fs = require("fs");

const schema_source = "./src/rooms/schema";
const schema_output = "D:/Study/hausle/hausle-front/src/shared";

// Colyseus Schema
fs.readdir(schema_source, (error, files) => {
  console.log(files);

  files.forEach((filename) => {
    exec(
      `npx schema-codegen ${schema_source}/${filename} --ts --output ${schema_output}`
    );
  });
});

// Shared
const shared_source = "src\\shared";
const shared_output = "D:\\Study\\hausle\\hausle-front\\src\\shared";

exec(`copy ${shared_source}\\*.ts ${shared_output}`);
