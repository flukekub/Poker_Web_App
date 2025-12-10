export default async function test() {
    try {
        const url = `http://localhost:8080/public/test`;
    const response = await fetch(url, {
      method: "GET",
        headers: {
            // ไม่ต้องใส่ Content-Type เพราะ browser จะจัดการให้
        },
    });
    return response;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}