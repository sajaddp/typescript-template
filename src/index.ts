import "dotenv/config";

(async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(process.env.MY_SECRET);
})();
