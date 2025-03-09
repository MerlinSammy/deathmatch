import NavBar from "./components/NavBar";
import "./App.css";
import { useEffect, useState } from "react";
import { parse } from "papaparse";

function App() {
  const dummy = [
    { id: 1, name: "Merlin Sammetinger", pr: 260, gew: "+120" },
    { id: 2, name: "Florian Fink", pr: 310, gew: "+120" },
    { id: 3, name: "Markus Bauer", pr: 220, gew: "-100" },
    { id: 4, name: "Fabian Dick", pr: 320, gew: "-120" },
    { id: 5, name: "Dennis Kropf", pr: 220, gew: "-100" },
  ];

  const [items, setItems] = useState<any>(dummy);

  const [inputValue, setInputValue] = useState("");
  const [cellInputValue, setCellInputValue] = useState("");
  const [currentWeight, setCurrentWeight] = useState("0");
  const [selectedCell, setSelectedCell] = useState<HTMLTableRowElement | null>(
    null
  );
  const [runde, setRunde] = useState(2);
  const [rowIndex, setRow] = useState(0);
  const [nextPerson, setNextPerson] = useState("");
  const [gewicht, setGewicht] = useState("");
  const [pr, setPr] = useState(null);
  const [fileName, setFileName] = useState("");
  const [csvData, setCsvData] = useState<any>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [tblRendered, setTblRendered] = useState<any>();
  const [ausgeschiedene, setAusgeschiedene] = useState<string[]>([]);
  const [letzterAusgeschiedener, setLetzterAusgeschiedener] = useState("");

  let lastSelectedCell: HTMLElement;
  let lastSelectedCellBgColor: string;

  const resetValues = () => {
    setInputValue("");
    setCellInputValue("");
    setCurrentWeight("0");
    setSelectedCell(null);
    setRunde(2);
    setRow(0);
    setNextPerson(items[0].name);
    setGewicht(items[0].gew);
    setPr(items[0].pr);
  };

  const handleChange = (event: any) => {
    setInputValue(event.target.value);
  };

  //Wenn das Gewicht, oder die Zelle geändert werden und man auf ENTER drückt
  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      if (event.target.id === "inputZelleBearbeiten") {
        event.preventDefault();
        handleSetCell();
        event.target.value = "";
      }
      if (event.target.id === "inputSetzeGewicht") {
        event.preventDefault();
        setInputValue(event.target.value);
        handleSetWeight();
      }
    }
  };

  const handleCellChange = (event: any) => {
    setCellInputValue(event.target.value);
  };

  const handleSetWeight = () => {
    setCurrentWeight(inputValue);
    setInputValue("");
  };

  //Setze die Zelle auf die vorherige Farbe und ändere ihren Wert auf den angegebenen
  const handleSetCell = () => {
    if (selectedCell) {
      selectedCell.style.backgroundColor = lastSelectedCellBgColor;
      selectedCell.innerText = cellInputValue;
    }
  };

  //Wenn eine Zelle angeklickt wird, dann setze letzte Zelle und ändere ihren Hintergrund
  const handleCellClick = (event: any) => {
    //Wenn Zelle geklickt wird, kommt von Button Action
    const tableData = event.target as HTMLElement;
    console.log("SelectedCell");
    console.log(tableData);
    console.log("lastSelectedCell");
    console.log(lastSelectedCell);

    if (lastSelectedCell) {
      lastSelectedCell.style.backgroundColor = lastSelectedCellBgColor;
    }

    setSelectedCell(event.target); // Speichert die angeklickte Zelle

    lastSelectedCell = tableData;
    lastSelectedCellBgColor = tableData.style.backgroundColor;

    console.log("BackgroundColor: " + lastSelectedCellBgColor);

    tableData.style.backgroundColor = "lightgrey"; //setze aktuell geklickte Zelle auf Grau
  };

  const getNextRow = (table: Element | null): HTMLTableRowElement | null => {
    if (!table) {
      return null;
    }
    let nextRow;
    let elem = table.getElementsByTagName("tr");
    let len = elem.length;

    if (rowIndex >= len - 1) {
      {
        nextRow = table.getElementsByTagName("tr")[0];
      }
    } else {
      nextRow = table.getElementsByTagName("tr")[rowIndex + 1];
    }

    return nextRow;
  };

  const getRealNextRow = (row: HTMLTableRowElement) => {
    let nextRow;
    let t = getTable();

    if (!row || !t) {
      return null;
    }

    let elem = t.getElementsByTagName("tr");

    for (let index = 0; index < elem.length; index++) {
      const element = elem[index];
      if (row === element) {
        if (index + 1 > elem.length - 1) {
          nextRow = elem[0];
        } else {
          nextRow = elem[index + 1];
        }
      }
    }

    return nextRow;
  };

  const getTable = (): Element | null => {
    const table = document.querySelector("table tbody");
    if (!table) {
      console.error("Tabelle nicht gefunden!");
      return null;
    } else {
      return table;
    }
  };

  const getRows = () => {
    let table = getTable();
    let row = table?.getElementsByTagName("tr");
    return row;
  };

  const getRow = (table: Element | null): HTMLTableRowElement | null => {
    if (!table) {
      console.error("Keine Tabelle in getRow mitgegeben");
      return null;
    } else {
      const row = table.getElementsByTagName("tr")[rowIndex];
      if (!row) {
        console.error(`Keine Zeile für Index ${rowIndex} gefunden!`);
        return null;
      } else {
        return row;
      }
    }
  };

  const getNextPerson = (person: string) => {
    items.forEach((element: any) => {
      if (element.name === person) {
        setNextPerson(element.name);
        setGewicht(element.gew);
        setPr(element.pr);
      }
    });
  };

  const setCircles = (value: number, np: string) => {
    const circles = document.getElementsByClassName("circle");

    if (np) {
      getNextPerson(np);
    }

    for (let index = 0; index < circles.length; index++) {
      const circle = circles[index];

      if (value === 0) {
        circle.className = "circle bg-primary";
      }
      if (value === 1) {
        circle.className = "circle bg-light";
      }
      if (value === 2) {
        circle.className = "circle bg-danger";
      }
    }
  };

  const [nep, setNep] = useState<any>();

  //Beim Klick auf Bewertung
  const onBewertung = (value: number) => {
    let nextRow;
    const table = getTable();
    const row = getRow(table);
    nextRow = getNextRow(table);

    if (!nextRow || !row) {
      return null;
    }

    let t = nextRow.getElementsByTagName("td")[1].innerHTML;
    let aus = nextRow.getElementsByTagName("td")[1].innerHTML;
    const cell = row.getElementsByTagName("td")[runde];
    setNep(t);

    if (!currentWeight) {
      alert("Es wurde kein Gewicht gesetzt!");
    } else {
      if (aus.includes("Ausgeschieden")) {
        console.log(true);
      }

      nextRow.style.fontWeight = "bold";
      row.style.fontWeight = "normal";
      if (cell) {
        if (value === 1) {
          cell.innerText = currentWeight;
          cell.style.backgroundColor = "lightgreen";
          setCircles(1, "");
        }
        if (value === 0) {
          cell.innerText = "Skipped";
          cell.style.backgroundColor = "lightyellow";
          setCircles(3, "");
        }
        if (value === 2) {
          cell.innerText = currentWeight;
          cell.style.backgroundColor = "lightcoral";
          setCircles(2, "");

          let out = row.getElementsByTagName("td")[1].innerHTML;

          if (!out.includes("Ausgeschieden")) {
            //Wenn die Person noch im Renne ist, dann setzte sie zu ausgeschieden
            setLetzterAusgeschiedener(out);
            ausgeschiedene.push(out);
            row.getElementsByTagName("td")[1].innerHTML =
              out + " (Ausgeschieden)";
            markAusgeschiedeneRow();
          }
        }
      }

      let nr = getRealNextRow(nextRow);
      let foo = nr?.getElementsByTagName("td")[1].innerHTML;

      console.log("Aktuell: " + t + " Nächster: " + foo);

      if (rowIndex > items.length - 2) {
        setRunde(runde + 1);
        setRow(0);
      } else {
        setRow(rowIndex + 1);
      }
      //getNextPerson(t);
    }
  };

  const markAusgeschiedeneRow = () => {
    let rows = getRows();

    if (!rows) {
      return null;
    }

    for (let index = 0; index < rows.length; index++) {
      //gehe alle Reihen durch und gebe mir die Namen der Teilnehmer
      const element = rows[index];
      const teilnehmer = element.getElementsByTagName("td")[1].innerHTML;

      for (let jindex = 0; jindex < ausgeschiedene.length; jindex++) {
        //gehe alle Ausgeschiedenen durch
        const ausgeschiedener = ausgeschiedene[jindex];

        if (ausgeschiedener + " (Ausgeschieden)" === teilnehmer) {
          //console.log(ausgeschiedener);
          const reihe = element.getElementsByTagName("td");

          for (let kindex = 0; kindex < reihe.length; kindex++) {
            //färbe alle Zellen auf Grau um
            const zelle = reihe[kindex];
            zelle.style.backgroundColor = "lightgray";
          }
        }
      }
    }
  };

  const handleRenderDataClick = (e: any) => {
    const btn = e.target.innerHTML;

    if (btn === "Upload" && fileName) {
      setTblRendered(tableRealData);
      setItems(csvData);
      resetValues();
      setIsVisible(false);
    } else if (btn === "DummyData") {
      setTblRendered(tableDummyData);
      setItems(dummy);
      resetValues();
      setIsVisible(false);
    } else if (btn === "ResetData") {
      setIsVisible(true);
    } else {
      alert("Es wurde keine Datei ausgewählt!");
    }
  };

  const tableDummyData = (
    <table className="table table-hover tbl w-100">
      <thead className="table-dark">
        <tr>
          <th scope="col">Nummer</th>
          <th scope="col">Name</th>
          <th>Versuch 1</th>
          <th>Versuch 2</th>
          <th>Versuch 3</th>
          <th>Versuch 4</th>
          <th>Versuch 5</th>
          <th>Versuch 6</th>
          <th>Versuch 7</th>
          <th>Versuch 8</th>
          <th>Versuch 9</th>
        </tr>
      </thead>
      <tbody>
        {items.map((row: any) => (
          <tr
            key={row.id}
            id={row.id.toString()}
            //onClick={() => handleRowClick(row.id)}
            //className={selectedRow === row.id ? "table-secondary" : ""}
            style={{ cursor: "pointer" }}
          >
            <td onClick={handleCellClick}>{row.id}</td>
            <td onClick={handleCellClick}>{row.name}</td>
            <td onClick={handleCellClick}></td>
            <td onClick={handleCellClick}></td>
            <td onClick={handleCellClick}></td>
            <td onClick={handleCellClick}></td>
            <td onClick={handleCellClick}></td>
            <td onClick={handleCellClick}></td>
            <td onClick={handleCellClick}></td>
            <td onClick={handleCellClick}></td>
            <td onClick={handleCellClick}></td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const tableRealData = (
    <table className="table table-hover tbl w-100">
      <thead className="table-dark">
        <tr>
          <th scope="col">Nummer</th>
          <th scope="col">Name</th>
          <th>Versuch 1</th>
          <th>Versuch 2</th>
          <th>Versuch 3</th>
          <th>Versuch 4</th>
          <th>Versuch 5</th>
          <th>Versuch 6</th>
          <th>Versuch 7</th>
          <th>Versuch 8</th>
          <th>Versuch 9</th>
        </tr>
      </thead>
      <tbody>
        {csvData.map((row: any) => (
          <tr
            key={row.id}
            id={row.id.toString()}
            //onClick={() => handleRowClick(row.id)}
            //className={selectedRow === row.id ? "table-secondary" : ""}
            style={{ cursor: "pointer" }}
          >
            <td onClick={handleCellClick}>{row.id}</td>
            <td onClick={handleCellClick}>{row.name}</td>
            <td onClick={handleCellClick}></td>
            <td onClick={handleCellClick}></td>
            <td onClick={handleCellClick}></td>
            <td onClick={handleCellClick}></td>
            <td onClick={handleCellClick}></td>
            <td onClick={handleCellClick}></td>
            <td onClick={handleCellClick}></td>
            <td onClick={handleCellClick}></td>
            <td onClick={handleCellClick}></td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const [cookiee, cock] = useState("Test");

  //Setzen eines Cookies
  const setCookie = (name: string, value: string, days: number) => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // Expiration in days
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
  };

  setCookie("Test", "Merlin", 180);

  //Laden eines Cookies
  const getCookie = (name: string) => {
    const cookies = document.cookie.split("; ");
    for (const c of cookies) {
      const [cookieName, cookieValue] = c.split("=");
      if (cookieName === name) {
        cock(cookieValue);
        console.log(cookieValue);

        return cookieValue;
      }
    }
    return null;
  };

  const [nextAthlete, setNextAthlete] = useState(false);

  return (
    <>
      <div className="p-2">
        <NavBar></NavBar>
      </div>
      {isVisible && (
        <div className="d-flex p-2 upload">
          <div
            className="border h-2 w-25 p-2"
            onDragOver={(event) => {
              event.preventDefault();
            }}
            onDrop={(event) => {
              event.preventDefault();
              //console.log(event.dataTransfer.files);
              setFileName(event.dataTransfer.files[0].name);
              Array.from(event.dataTransfer.files).map(async (file) => {
                let text = await file.text();
                let result = parse(text, { header: true });
                setCsvData(result.data);
              });
            }}
          >
            Teilnehmer {fileName}
          </div>
          <button
            className="btn btn-primary m-2"
            onClick={handleRenderDataClick}
          >
            Upload
          </button>
          <button
            className="btn btn-primary m-2"
            onClick={handleRenderDataClick}
          >
            DummyData
          </button>
        </div>
      )}

      {!isVisible && (
        <div>
          <div className="bg-primary p-2 d-flex">
            <h1 className="athleteInfo p-2 bg-primary">
              Athlet: {nextPerson} | Gewicht: {gewicht}kg | Best PR: {pr}kg
            </h1>
            <div className="d-flex justify-content-center gap-2 ms-4 align-items-center">
              <div className="circle bg-primary"></div>
              <div className="circle bg-primary"></div>
              <div className="circle bg-primary"></div>
            </div>
          </div>
          <div className="p-4">
            <div>
              <h2>
                Aktuelles Gewicht: {currentWeight}kg | Runde: {runde - 1}
              </h2>
              {tblRendered}
            </div>

            <div className="row">
              <div className="col text-left">
                <div className="">
                  <button
                    type="submit"
                    className="btn btn-primary w-25 m-2"
                    onClick={handleSetWeight}
                  >
                    Setze Gewicht
                  </button>
                  <input
                    className="w-25"
                    id="inputSetzeGewicht"
                    value={inputValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div className="">
                  <button
                    type="submit"
                    className="btn btn-primary w-25 m-2"
                    onClick={handleSetCell}
                  >
                    Zelle bearbeiten
                  </button>
                  <input
                    className="w-25"
                    id="inputZelleBearbeiten"
                    value={cellInputValue}
                    onChange={handleCellChange}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div className="">
                  <button
                    type="submit"
                    className="btn btn-primary w-25 m-2"
                    onClick={handleRenderDataClick}
                  >
                    ResetData
                  </button>
                </div>
              </div>
              <div className="col text-end">
                {!nextAthlete && (
                  <div
                    className="btn-group btn-group-lg btn-align d-flex"
                    role="group"
                  >
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        onBewertung(2);
                        setNextAthlete(true);
                      }}
                    >
                      Ungültig
                    </button>
                    <button
                      className="btn btn-warning"
                      onClick={() => {
                        onBewertung(0);
                        setNextAthlete(true);
                      }}
                    >
                      Übersprungen
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={() => {
                        onBewertung(1);
                        setNextAthlete(true);
                      }}
                    >
                      Gültig
                    </button>
                  </div>
                )}

                {nextAthlete && (
                  <div>
                    <button
                      className="btn btn-primary w-100 p-2"
                      onClick={() => {
                        setNextAthlete(false);
                        setCircles(0, nep);
                      }}
                    >
                      Nächster Athlet
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
