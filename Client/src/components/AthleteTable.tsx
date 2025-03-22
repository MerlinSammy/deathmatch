import { useState } from "react";

function AthleteTable(props: any) {
  return (
    <>
      <table className="table table-hover">
        <thead className="table-primary">
          <tr>
            <th scope="col">ID</th>
            <th>NAME</th>
            <th>Versuch 1</th>
            <th>Versuch 2</th>
            <th>Versuch 3</th>
            <th>Versuch 4</th>
            <th>Versuch 5</th>
            <th>Versuch 6</th>
            <th>Versuch 7</th>
            <th>Versuch 8</th>
            <th>Versuch 9</th>
            <th>Versuch 10</th>
          </tr>
        </thead>
        <tbody>
          {props.athletes.map((row: any) => (
            <tr className="athleteTableRow" key={row.id} id={row.id.toString()} style={{ cursor: "pointer" }}>
              <th>{row.id}</th>
              <th>{row.name}</th>
              <td onClick={getClickedCell}></td>
              <td onClick={getClickedCell}></td>
              <td onClick={getClickedCell}></td>
              <td onClick={getClickedCell}></td>
              <td onClick={getClickedCell}></td>
              <td onClick={getClickedCell}></td>
              <td onClick={getClickedCell}></td>
              <td onClick={getClickedCell}></td>
              <td onClick={getClickedCell}></td>
              <td onClick={getClickedCell}></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export const markNextAsActive = () => {
  const table = getTable();

  for (let index = 0; index < table.length; index++) {
    const element = table[index];

    if (index + 1 === table.length) {
      table[index].className = "athleteTableRow";
      table[0].className = "athleteTableRow table-active";
      return;
    }
    if (element.className === "athleteTableRow table-active") {
      table[index].className = "athleteTableRow";
      table[index + 1].className = "athleteTableRow table-active";
      return;
    }
  }
};

export const getActiveRow = () => {
  const active = document.getElementsByClassName("athleteTableRow table-active");
  return active[0];
};

export const setVersuchOnActiveRow = (runde: number, gewicht: string) => {
  const activeRow = getActiveRow();
  const dataEntries = activeRow.getElementsByTagName("td");
  let bg = "lightgreen";

  if (runde > 10) {
    console.error("Eingegebene Runden Anzahl übersteigt 10");
  } else {
    gewicht === "Failed" ? (bg = "lightcoral") : "lightgreen";
    gewicht === "Skipped" ? (bg = "lightyellow") : "lightgreen";
    dataEntries[runde - 1].innerHTML = gewicht.toString();
    dataEntries[runde - 1].style.backgroundColor = bg;
  }
};

export const setVersuchOnGiveneRow = (rowId: number, runde: number, gewicht: string) => {
  const tab = getTable();
  const dataEntries = tab[rowId - 1].getElementsByTagName("td");
  const tableLength = tab.length;

  if (rowId > tableLength) {
    console.error("Die mitgegebene RowId " + rowId + " ist größer als die Tabellen Länge " + tableLength);
  } else if (runde > 10) {
    console.error("Eingegebene Runden Anzahl übersteigt 10");
  } else {
    dataEntries[runde - 1].innerHTML = gewicht.toString();
  }
};

export const getTable = () => {
  const tab = document.getElementsByClassName("athleteTableRow");
  return tab;
};

export const getTableRows = (table: HTMLCollectionOf<Element>) => {
  for (let index = 0; index < table.length; index++) {
    const element = table[index];
  }
};

let c: HTMLElement;

export const getClickedCell = (event: any) => {
  getLastCLickedCell();
  const cell = event.target as HTMLElement;
  cell.style.backgroundColor = "lightgrey";
  cell.className = "lastClicked";
  c = cell;
  console.log(c);

  return cell;
};

export const setLastClickedCell = (text: string) => {
  const cell = c as HTMLElement;
  let bg = "lightgreen";
  text === "Failed" ? (bg = "lightcoral") : "lightgreen";
  text === "Skipped" ? (bg = "lightyellow") : "lightgreen";
  cell.innerHTML = text;
  cell.style.backgroundColor = bg;
};

export const unmarkClickedCell = () => {
  c.style.backgroundColor = "";
};

export const getLastCLickedCell = () => {
  const tab = getTable();
  for (let index = 0; index < tab.length; index++) {
    const element = tab[index];
    const rowElements = element.getElementsByTagName("td");
    for (let j = 0; j < rowElements.length; j++) {
      const e = rowElements[j];
      if (e.className === "lastClicked") {
        console.log(e);
        e.style.backgroundColor = "";
        e.className = "";
      }
    }
  }
};

export default AthleteTable;
