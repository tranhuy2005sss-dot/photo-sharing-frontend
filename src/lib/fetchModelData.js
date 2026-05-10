async function fetchModel(url, method = "GET", bodyData = null) {
  const cleanUrl = url.replace(/^\/+/, "");
  const backendUrl = "https://y9c4tj-8081.csb.app";
  const fullUrl = `${backendUrl}/${cleanUrl}`;

  const options = {
    method: method,
    credentials: "include", // Lệnh này ép trình duyệt phải gửi kèm Cookie Session
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Nếu là POST và có dữ liệu, thêm nó vào body
  if (bodyData) {
    options.body = JSON.stringify(bodyData);
  }

  try {
    const response = await fetch(fullUrl, options);
    if (!response.ok) {
      const errorText = await response.text(); // Đọc lỗi từ server gửi về
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Lỗi fetchModel:", error);
    throw error;
  }
}

export default fetchModel;
