var htmlScanner;
var scanningActive = true;
var myqr = document.getElementById('qr-result');
var scannedItemsList = document.getElementById('scanned-items');
var scannedData = [];

function domReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

domReady(function() {
    function onScanSuccess(qrCodeMessage) {
        if (scanningActive && !scannedData.includes(qrCodeMessage)) {
            scannedData.push(qrCodeMessage);

            var qrData = qrCodeMessage.split(',');
            var surname = qrData[0];
            var idNumber = qrData[1];

            alert("Surname: " + surname + "\nID Number: " + idNumber);

            myqr.innerHTML = `You scanned ${scannedData.length} QR Code(s)`;
            scannedItemsList.innerHTML += `<li>Surname: ${surname}, ID Number: ${idNumber}</li>`;
        }
    }

    htmlScanner = new Html5QrcodeScanner(
        "my-qr-reader", {
            fps: 10,
            qrbox: 250
        }
    );

    htmlScanner.render(onScanSuccess);
});

document.getElementById('stop-scanning-btn').addEventListener('click', stopScanning);
document.getElementById('save-to-csv-btn').addEventListener('click', saveToCSV);

function stopScanning() {
    scanningActive = false;
    htmlScanner.stop();
}

function saveToCSV() {
    var csvContent = "data:text/csv;charset=utf-8,SURNAME,ID NUMBER\n";
    scannedData.forEach(function(item) {
        csvContent += item + "\n";
    });

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "scanned_qr_codes.csv");
    document.body.appendChild(link);

    link.click();
}
