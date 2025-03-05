import NavBar from "./components/NavBar";
import "./App.css";
import { useState } from "react";
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
  const [lastSelectedCell, setLastSelectedCell] =
    useState<HTMLTableRowElement | null>(null);
  const [runde, setRunde] = useState(2);
  const [rowIndex, setRow] = useState(0);
  const [nextPerson, setNextPerson] = useState("");
  const [gewicht, setGewicht] = useState("");
  const [pr, setPr] = useState(null);
  const [lastSelectedCellBgColor, setLastSelectedCellBgColor] = useState("");
  const [fileName, setFileName] = useState("");
  const [csvData, setCsvData] = useState<any>([]);
  const [isVisible, setIsVisible] = useState(true);

  const resetValues = () => {
    setInputValue("");
    setCellInputValue("");
    setCurrentWeight("0");
    setSelectedCell(null);
    setLastSelectedCell(null);
    setRunde(2);
    setRow(0);
    setNextPerson(items[0].name);
    setGewicht(items[0].gew);
    setPr(items[0].pr);
    setLastSelectedCellBgColor("");
  };

  const handleChange = (event: any) => {
    setInputValue(event.target.value);
    console.log(event.target);
  };

  const handleCellChange = (event: any) => {
    setCellInputValue(event.target.value);
    console.log(event.target);
  };

  const handleSetWeight = () => {
    setCurrentWeight(inputValue);
  };

  const handleSetCell = () => {
    if (selectedCell) {
      selectedCell.style.backgroundColor = lastSelectedCellBgColor;
      selectedCell.innerText = cellInputValue;
    }
  };

  const handleCellClick = (event: any) => {
    console.log("last");
    console.log(lastSelectedCell);
    if (lastSelectedCell) {
      lastSelectedCell.style.backgroundColor = lastSelectedCellBgColor;
    }
    setSelectedCell(event.target); // Speichert die angeklickte Zelle
    console.log("color");
    //console.log(selectedCell);
    setLastSelectedCellBgColor(event.target.style.backgroundColor);
    console.log(lastSelectedCellBgColor);

    //selectedCell;
    event.target.style.backgroundColor = "lightgrey";
    setLastSelectedCell(event.target);
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

  const getTable = (): Element | null => {
    const table = document.querySelector("table tbody");
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

  const onBewertung = async (value: number) => {
    let nextRow;
    const table = getTable();
    const row = getRow(table);
    nextRow = getNextRow(table);

    if (!nextRow || !row) {
      return null;
    }

    let t = nextRow.getElementsByTagName("td")[1].innerHTML.toString();
    const cell = row.getElementsByTagName("td")[runde];

    if (!currentWeight) {
      alert("Es wurde kein Gewicht gesetzt!");
    } else {
      nextRow.style.fontWeight = "bold";
      row.style.fontWeight = "normal";
      if (cell) {
        if (value === 1) {
          cell.innerText = currentWeight;
          cell.style.backgroundColor = "lightgreen";
        }
        if (value === 0) {
          cell.innerText = "Skipped";
          cell.style.backgroundColor = "lightyellow";
        }
        if (value === 2) {
          cell.innerText = currentWeight;
          cell.style.backgroundColor = "lightcoral";
        }
      }
      if (rowIndex > items.length - 2) {
        setRunde(runde + 1);
        setRow(0);
      } else {
        setRow(rowIndex + 1);
      }
      getNextPerson(t);
    }
  };

  const handleRenderDataClick = (e: any) => {
    setIsVisible(false);
    const btn = e.target.innerHTML;

    if (btn === "Upload" && fileName) {
      setTblRendered(tableRealData);
      setItems(csvData);
      resetValues();
    } else if (btn === "DummyData") {
      setTblRendered(tableDummyData);
      setItems(dummy);
      resetValues();
    } else {
      alert("Es wurde keine Datei ausgewählt!");
    }
  };

  const [tblRendered, setTblRendered] = useState<any>();

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

      <div>
        <h1 className="p-2 bg-primary">
          Athlet: {nextPerson} | Gewicht: {gewicht}kg | Best PR: {pr}kg
        </h1>
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
                value={inputValue}
                onChange={handleChange}
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
                value={cellInputValue}
                onChange={handleCellChange}
              />
            </div>
          </div>
          <div className="col text-end">
            <div
              className="btn-group btn-group-lg btn-align d-flex"
              role="group"
            >
              <button
                className="btn btn-danger"
                onClick={() => {
                  onBewertung(2);
                }}
              >
                Ungültig
              </button>
              <button
                className="btn btn-warning"
                onClick={() => {
                  onBewertung(0);
                }}
              >
                Übersprungen
              </button>
              <button
                className="btn btn-success"
                onClick={() => {
                  onBewertung(1);
                }}
              >
                Gültig
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
