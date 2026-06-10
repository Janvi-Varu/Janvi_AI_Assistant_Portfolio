import { useEffect, useState } from "react";

function Admin() {
  const [data, setData] = useState({});

  useEffect(() => {
    fetch("http://localhost:5000/analytics/summary")
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Analytics</h1>

      {Object.keys(data).map((key) => (
        <p key={key}>
          {key}: {data[key]}
        </p>
      ))}
    </div>
  );
}

export default Admin;