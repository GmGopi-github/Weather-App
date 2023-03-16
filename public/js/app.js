console.log("client side JS is loading");

const weatherForm = document.querySelector("form");
const search = document.querySelector("input");
const messageOne = document.querySelector("#success");
const messageTwo = document.querySelector("#error");

weatherForm.addEventListener("submit", (e) => {
  e.preventDefault();
  messageOne.textContent = "Loading...";
  messageTwo.textContent = "";
  const location = search.value;
  console.log("Location: ", location);

  fetch(`http://localhost:3000/weather?address=${location}`).then(
    (response) => {
      response.json().then((data) => {
        if (data.error) {
          messageOne.textContent = data.error;
          console.log("error: ", data.error);
        } else {
          messageOne.textContent = `Location: ${data.location}`;
          messageTwo.textContent = `Forecast: ${data.forecast.forecast}`;
          console.log("data: ", data);
        }
      });
    }
  );
});
