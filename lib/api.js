const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Login API
 * @param {string} email
 * @param {string} password
 */
export async function login(email, password) {
  const res = await fetch(`${API_URL}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login gagal");
  }

  return data;
}

/**
 * Logout API
 */
export async function logout(token) {
  const res = await fetch(`${API_URL}/api/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Logout gagal");
  }

  return data;
}
//devices
export async function getDevices(token) {
  const res = await fetch(`${API_URL}/api/devices`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil device");
  return data.data;
}
//suhu
export async function getSuhu(token) {
  const res = await fetch(`${API_URL}/api/temperature/1`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal mengambil data suhu");
  }

  return data;
}

