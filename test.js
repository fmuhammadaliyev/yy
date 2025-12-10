fetch("http://localhost:3000/url", {
  method: "POST",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    url: "https://kun.uz",
  }),
})
  .then((res) => {
    return res.text();
  })
  .then((res) => {
    console.log(res);
  });
