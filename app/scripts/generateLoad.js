const { exec } = require('child_process');

const url = 'http://localhost:8080/users?page=2'; // The URL to test
const url1 = 'http://localhost:8080/moviews?year=2024'; // The URL to test
const numberOfRequests = 1000; // Total number of requests to perform
const concurrencyLevel = 100; // Number of multiple requests to make at a time

const command = `ab -n ${numberOfRequests} -c ${concurrencyLevel} ${url1}`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing ab: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`ab stderr: ${stderr}`);
    return;
  }
  console.log(`ab stdout:\n${stdout}`);
});