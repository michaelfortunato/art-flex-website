const ART_FLEX_URL = "https://api.art-flex.co";
const post = async (url, body) =>
  fetch(ART_FLEX_URL + url, {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
export default post;
