export function download_chart(chartImg, name) {
    let filename, link;
    filename = name
    link = document.createElement("a");
    link.setAttribute("href", chartImg);
    link.setAttribute("download", filename);
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);
  }