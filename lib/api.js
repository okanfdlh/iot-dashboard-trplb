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
// cahaya
export async function getCahaya(token, deviceId = "lamp-B001") {
  const res = await fetch(
    `${API_URL}/api/lighting/${deviceId}/status`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal ambil data cahaya");
  return data;
}

export async function setCahayaMode(token, deviceId, mode) {
  const res = await fetch(
    `${API_URL}/api/lighting/${deviceId}/mode`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ mode }),
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal set mode");
  return data;
}

export async function setCahayaManual(token, deviceId, command) {
  const res = await fetch(
    `${API_URL}/api/lighting/${deviceId}/manual`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ command }),
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal kontrol lampu");
  return data;
}

// terminal
export async function getTerminalStatus(token, terminalCode) {
  const res = await fetch(
    `${API_URL}/api/terminal/${terminalCode}/status`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Gagal mengambil status terminal");
  }

  return data.data;
}

export async function controlTerminal(token, terminalCode, payload) {
  const res = await fetch(
    `${API_URL}/api/terminal/${terminalCode}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Gagal mengontrol terminal");
  }

  return data;
}
