const background = chrome.extension.getBackgroundPage();

let gridData = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

let table = null;

chrome.storage.local.get(["gridData"], (result) => {
  gridData = result.gridData ? result.gridData : gridData;

  table = new Handsontable(document.getElementById("container"), {
    data: gridData,
    colWidths: 100,
    rowHeaders: true,
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
  });
});

window.addEventListener("unload", (event) => {
  background.chrome.storage.local.set({ gridData: table.getData() });
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
