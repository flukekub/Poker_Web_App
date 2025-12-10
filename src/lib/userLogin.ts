export default async function userLogin(name: string, password: string) {
  const fd = new FormData();
  fd.append("name", name);
  fd.append("password", password); // หรือ "username"
  
  try {
    const url = `http://localhost:8080/api/auth/login`;
    const response = await fetch(url, {
      method: "POST",
      body: fd,
        headers: {
            // ไม่ต้องใส่ Content-Type เพราะ browser จะจัดการให้
        },
    });
    return response.json();
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}