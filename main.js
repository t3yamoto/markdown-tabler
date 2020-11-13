const background = chrome.extension.getBackgroundPage();

let table = null;

const defaultOptions = {
  data: [
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
  ],
  rowHeights: 25,
  colWidths: 120,
  manualColumnResize: true,
  manualRowResize: true,
  // rowHeaders: true,
  colHeaders: true,
  contextMenu: [
    "row_above",
    "row_below",
    "col_left",
    "col_right",
    "remove_row",
    "remove_col",
    // "alignment",
  ],
};
let container = document.getElementById("container");

chrome.storage.local.get(["gridData", "rowHeights", "colWidths"], (result) => {
  let options = JSON.parse(JSON.stringify(defaultOptions));
  options.data = result.gridData || options.data;
  options.rowHeights = result.rowHeights || options.rowHeights;
  options.colWidths = result.colWidths || options.colWidths;
  table = new Handsontable(container, options);
});

window.addEventListener("unload", (event) => {
  const rowHeights = Array.from(
    { length: table.countRows() },
    (_, i) => i
  ).map((i) => table.getRowHeight(i));

  const colWidths = Array.from(
    { length: table.countCols() },
    (_, i) => i
  ).map((i) => table.getColWidth(i));

  background.chrome.storage.local.set({
    gridData: table.getData(),
    rowHeights,
    colWidths,
  });
});

const saveToClipboard = (s) => {
  const textArea = document.createElement("textarea");
  document.body.appendChild(textArea);
  textArea.value = s;
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
};

document.getElementById("btnCopy").onclick = () => {
  const data = table.getData().map((row) =>
    row.map((cell) => {
      let r = cell === null ? "" : cell;
      return r.replace("\n", "<br>");
    })
  );
  const headerData = data[0];
  const bodyData = data.slice(1);
  saveToClipboard(json2md({ table: { headers: headerData, rows: bodyData } }));
  alert("Copied!");
};

document.getElementById("btnReset").onclick = () => {
  container.innerHTML = "";
  table = new Handsontable(
    container,
    JSON.parse(JSON.stringify(defaultOptions))
  );
};
