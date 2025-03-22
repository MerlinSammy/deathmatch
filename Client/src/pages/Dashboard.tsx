import { useEffect, useState } from "react";
import dumbell from "../assets/dumbbell.png";
import UserAnzeige from "../components/UserAnzeige";
import { FaSave, FaWindowClose } from "react-icons/fa";

export function Dashboard() {
  const [teilnehmer, setTeilnehmer] = useState<Array<object>>([{}]);
  const [currentWeight, setCurrentWeight] = useState(0);
  const [editWeight, setEditWeight] = useState(0);
  const [selectedRow, setSelectedRow] = useState<HTMLTableRowElement>();
  const [selectedCell, setSelectedCell] = useState<HTMLTableElement>();
  const [currentRowNumber, setCurrentRowNumber] = useState(0);
  const [runde, setRunde] = useState(1);
  const [lastColor, setLastColor] = useState("");
  const [selectedUser, setSelectedUser] = useState(teilnehmer[0]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:3000/users");
      const data = await response.json();
      console.log("Daten geladen:", data);
      await setTeilnehmer(data);

      const table = getTable();
      const row = getRow(table);
      row.style.fontWeight = "bold";
    };

    fetchData();
  }, []);

  const headers = Object.keys(teilnehmer[0]);
  //console.log(selectedUser);

  const handleCellClick = (event: any) => {
    const data = event.target as HTMLTableElement;

    setSelectedCell(event.target);
    console.log("Ausgewählte Zelle: " + data.innerHTML);
    data.innerHTML = editWeight.toString();

    const inp = document.getElementById("editWeight");
    console.log(inp);
  };

  const getTable = (): Element | null => {
    const table = document.querySelector(".tbl tbody");
    if (!table) {
      console.error("Tabelle nicht gefunden!");
      return null;
    } else {
      return table;
    }
  };

  const getRow = (table: Element | null): HTMLTableRowElement | null => {
    if (!table) {
      console.error("Keine Tabelle in getRow mitgegeben");
      return null;
    } else {
      const row = table.getElementsByTagName("tr")[currentRowNumber];
      //console.log(table.getElementsByTagName("tr"));

      if (!row) {
        console.error(`Keine Zeile für Index ${currentRowNumber} gefunden!`);
        return null;
      } else {
        return row;
      }
    }
  };

  const getNextRow = (table: Element | null): HTMLTableRowElement | null => {
    if (!table) {
      return null;
    }
    let nextRow;
    let elem = table.getElementsByTagName("tr");
    let len = elem.length;

    if (currentRowNumber >= len - 1) {
      {
        nextRow = table.getElementsByTagName("tr")[0];
      }
    } else {
      nextRow = table.getElementsByTagName("tr")[currentRowNumber + 1];
    }

    return nextRow;
  };

  const setCircles = (bewertung: string) => {
    const circles = document.getElementsByClassName("circle");

    for (let index = 0; index < circles.length; index++) {
      const circle = circles[index];

      switch (bewertung) {
        case "Gültig":
          circle.className = "circle bg-light";
          break;
        case "Ungültig":
          circle.className = "circle bg-danger";
          break;
        case "Skipped":
          circle.className = "circle bg-primary";
          break;
        default:
          break;
      }
    }
  };

  const onBewertung = (bewertung: string) => {
    if (runde > 10) {
      setShowModal(true);
    }

    const table = getTable();
    //table ist die Tabelle //table?.children sind die Rows //table?.children[0].children sind die Spalten

    const row = getRow(table);
    const nextRow = getNextRow(table);
    const cell = row?.getElementsByTagName("td")[runde + 2];
    //console.log(row);
    //console.log(nextRow);
    //console.log(cell);

    if (!row || !nextRow || !cell) {
      return null;
    }

    nextRow.style.fontWeight = "bold";
    row.style.fontWeight = "normal";

    switch (bewertung) {
      case "Gültig":
        cell.innerText = currentWeight.toString();
        cell.style.backgroundColor = "lightgreen";

        break;
      case "Ungültig":
        cell.innerText = currentWeight.toString();
        cell.style.backgroundColor = "lightcoral";
        break;
      case "Skipped":
        cell.innerText = currentWeight.toString();
        cell.style.backgroundColor = "lightyellow";
        break;
      default:
        break;
    }

    //console.log("CurrentRowNumber:" + currentRowNumber);
    //console.log("TeilnehmerLength:" + teilnehmer.length);
    //console.log("Runde:" + runde);

    if (currentRowNumber > teilnehmer.length - 2) {
      setCurrentRowNumber(0);
      setSelectedUser(teilnehmer[0]);
      setRunde(runde + 1);
    } else {
      setCurrentRowNumber(currentRowNumber + 1);
      setSelectedUser(teilnehmer[currentRowNumber + 1]);
    }
  };

  const saveTable = async () => {
    const table = document.querySelector("table");
    if (!table) return;
    const htmlString = table.outerHTML;

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ htmlString }),
    };
    fetch("http://localhost:3000/saveTable", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  };

  const [ta, setTa] = useState();

  const loadTable = () => {
    // Simple GET request using fetch
    fetch("http://localhost:3000/loadTable")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setTa(data);
        return data;
      });
  };

  const [showModal, setShowModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <h1 className="bg-primary-subtle p-3">
        <img src={dumbell} alt="Icon" width={50} height={50} className="me-3" />
        Dashboard
      </h1>

      <div>
        <UserAnzeige cw={currentWeight} runde={runde} person={selectedUser.Name} pr={selectedUser.PR} />
      </div>

      <div className="p-2">
        <div>
          <table className="table table-hover w-100 tbl">
            <thead className="table-dark">
              <tr>
                {headers.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teilnehmer.map((row: any, index) => (
                <tr className="tbl" key={index} style={{ cursor: "pointer" }}>
                  <td onClick={handleCellClick}>{row.Name}</td>
                  <td onClick={handleCellClick}>{row.Gewicht}</td>
                  <td onClick={handleCellClick}>{row.PR}</td>
                  <td onClick={handleCellClick}>{row.Versuch1}</td>
                  <td onClick={handleCellClick}>{row.Versuch2}</td>
                  <td onClick={handleCellClick}>{row.Versuch3}</td>
                  <td onClick={handleCellClick}>{row.Versuch4}</td>
                  <td onClick={handleCellClick}>{row.Versuch5}</td>
                  <td onClick={handleCellClick}>{row.Versuch6}</td>
                  <td onClick={handleCellClick}>{row.Versuch7}</td>
                  <td onClick={handleCellClick}>{row.Versuch8}</td>
                  <td onClick={handleCellClick}>{row.Versuch9}</td>
                  <td onClick={handleCellClick}>{row.Versuch10}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="row">
          <div className="col">
            {!isVisible && (
              <div className="btn-group btn-align d-flex">
                <button
                  className="btn btn-success"
                  onClick={() => {
                    onBewertung("Gültig");
                    setCircles("Gültig");
                    setIsVisible(true);
                  }}
                >
                  Gültig
                </button>
                <button
                  className="btn btn-warning"
                  onClick={() => {
                    onBewertung("Skipped");
                    setCircles("Skipped");
                    setIsVisible(true);
                  }}
                >
                  Überspringen
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    onBewertung("Ungültig");
                    setCircles("Ungültig");
                    setIsVisible(true);
                  }}
                >
                  Ungültig
                </button>
              </div>
            )}
            {isVisible && (
              <div>
                <button
                  className="btn btn-primary w-100"
                  onClick={() => {
                    setIsVisible(false);
                  }}
                >
                  Nächster Athlet
                </button>
              </div>
            )}
            <div className="btn-group btn-align d-flex">
              <button
                className="btn btn-primary w-100 mt-2"
                onClick={() => {
                  saveTable();
                }}
              >
                Tabelle Speichern
              </button>
              <button
                className="btn btn-primary w-100 mt-2"
                onClick={() => {
                  loadTable();
                }}
              >
                Tabelle Laden
              </button>
            </div>
            <div>
              <button
                className="btn btn-primary w-100 mt-2"
                id="goButton"
                onClick={() => {
                  setSelectedUser(teilnehmer[0]);
                  const button = document.getElementById("goButton");
                  button?.classList.add("visually-hidden");
                }}
              >
                GO
              </button>
            </div>
          </div>
          <div className="col">
            <div className="input-group mb-3">
              <button className="btn btn-primary w-25" type="button" id="button-addon2" onClick={() => {}}>
                Setze Gewicht
              </button>
              <input
                type="text"
                className="form-control"
                value={currentWeight}
                onChange={(e) => {
                  setCurrentWeight(e.target.value);
                }}
              />
            </div>
            <div className="input-group mb-3">
              <button className="btn btn-primary w-25" type="button" id="button-addon2" onClick={() => {}}>
                Bearbeite Zelle
              </button>
              <input
                type="text"
                className="form-control"
                id="editWeight"
                value={editWeight}
                onChange={(e) => {
                  setEditWeight(e.target.value);
                }}
              />
            </div>
          </div>
        </div>

        <div>
          {showModal && (
            <div
              className="modal d-block"
              tabIndex={-1}
              role="dialog"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Ende der Runden erreicht!</h5>
                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                  </div>
                  <div className="modal-body">
                    <p>
                      Das Ende aller Runden ist erreicht. Möchtest du die aktuellen Ergebnisse der Tabelle
                      speichern?
                    </p>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-primary d-flex align-items-center justify-content-center gap-2"
                      onClick={() => {
                        setShowModal(false);
                        saveTable();
                      }}
                    >
                      <FaSave />
                      Ergebnis speichern
                    </button>
                    <button
                      className="btn btn-danger d-flex align-items-center justify-content-center gap-2"
                      onClick={() => {
                        setShowModal(false);
                      }}
                    >
                      <FaWindowClose />
                      Schließen
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <div dangerouslySetInnerHTML={{ __html: ta }} />
        </div>
      </div>
    </>
  );
}
