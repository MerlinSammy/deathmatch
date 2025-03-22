import { useEffect, useState } from "react";
import dumbell from "../assets/dumbbell.png";

export function UserPage() {
  //console.log("Re-Render");

  const serverGetUsers = () => {
    // Simple GET request using fetch
    fetch("http://localhost:3000/users")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setServerUsers(data);
        return data;
      });
  };

  const serverAddUser = (name: string, gewicht: string, pr: string) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Name: name, Gewicht: gewicht, PR: pr }),
    };
    fetch("http://localhost:3000/addUser", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        serverGetUsers();
      });
  };

  const serverDeleteUser = (userName: string) => {
    console.log(userName);

    // Simple DELETE request with fetch
    fetch("http://localhost:3000/deleteUser/" + userName, { method: "DELETE" }).then((data) => {
      console.log(data);
      serverGetUsers();
    });
  };

  const [serverUsers, setServerUsers] = useState([{}]);
  const [name, setName] = useState("");
  const [gewicht, setGewicht] = useState("");
  const [pr, setPR] = useState("");
  const headers = Object.keys(serverUsers[0]);

  const handleOnDelete = (event) => {
    serverDeleteUser(name);
  };

  const handleGetUser = (event) => {
    serverGetUsers();
  };

  const handleUserHinzufuegen = (event) => {
    if (!name || !gewicht || !pr) {
      alert("Bitte alle Felder ausfüllen!");
      return;
    }
    setName("");
    setGewicht("");
    setPR("");

    console.log(name, gewicht, pr);
    serverAddUser(name, gewicht, pr);
  };

  return (
    <>
      <h1 className="bg-primary-subtle p-3">
        <img src={dumbell} alt="Icon" width={50} height={50} className="me-3" />
        Teilnehmer
      </h1>

      <div className="p-2">
        <form className="">
          <div className="">
            <input
              type="text"
              className="form-control m-2"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              placeholder="Name eingeben"
            />
            <input
              type="number"
              className="form-control m-2"
              value={gewicht}
              onChange={(e) => setGewicht(e.target.value)}
              placeholder="Gewicht eingeben"
            />
            <input
              type="number"
              className="form-control m-2"
              value={pr}
              onChange={(e) => setPR(e.target.value)}
              placeholder="PR eingeben"
            />
          </div>
        </form>
        <div className="">
          <button onClick={handleUserHinzufuegen} className="btn btn-primary m-2">
            User hinzufügen
          </button>
          <button onClick={handleOnDelete} className="btn btn-primary m-2">
            User löschen
          </button>
          <button onClick={handleGetUser} className="btn btn-primary m-2">
            Get User
          </button>
        </div>
        <div className="">
          <table className="table table-hover w-100">
            <thead className="table-dark">
              <tr>
                {headers.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {serverUsers.map((row: any) => (
                <tr style={{ cursor: "pointer" }}>
                  <td>{row.Name}</td>
                  <td>{row.Gewicht}</td>
                  <td>{row.PR}</td>
                  <td>{row.Versuch1}</td>
                  <td>{row.Versuch2}</td>
                  <td>{row.Versuch3}</td>
                  <td>{row.Versuch4}</td>
                  <td>{row.Versuch5}</td>
                  <td>{row.Versuch6}</td>
                  <td>{row.Versuch7}</td>
                  <td>{row.Versuch8}</td>
                  <td>{row.Versuch9}</td>
                  <td>{row.Versuch10}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
