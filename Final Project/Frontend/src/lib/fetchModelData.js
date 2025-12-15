const BASE_URL = "https://6zj2pc-8081.csb.app";

async function fetchModel(url, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error("fetchModel error:", err);
    return null;
  }
}

export default fetchModel;
