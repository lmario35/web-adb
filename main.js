import { AdbDaemonWebUsbDeviceManager } from "@yume-chan/adb-daemon-webusb";
import AdbWebCredentialStore from "@yume-chan/adb-credential-web";
import { Adb } from "@yume-chan/adb";
import { AdbDaemonTransport } from "@yume-chan/adb";

const Manager = AdbDaemonWebUsbDeviceManager.BROWSER;

class AdbController {
    constructor() {
        if (!Manager) {
            alert("WebUSB is not supported in this browser");
            return;
        }
        this.credentialStore = new AdbWebCredentialStore();
        this.connectButton = document.getElementById('connectButton');
        this.resultDiv = document.getElementById('result');
        this.connectButton.addEventListener("click", async () => {
            try {
                this.resultDiv.textContent = 'Recherche d\'appareils...';
                const device = await Manager.requestDevice();
                if (!device) {
                    alert("No device selected");
                    this.resultDiv.textContent = 'Aucun appareil sélectionné';
                    return;
                }
                console.log("Device serial:", device.serial);
                this.resultDiv.textContent = `Device serial: ${device.serial}`;
                this.resultDiv.textContent += '\nConnexion à l\'appareil...';
                const connection1 = await device.connect();
                const transport = await AdbDaemonTransport.authenticate({
                    serial: device.serial,
                    connection: connection1,
                    credentialStore: this.credentialStore,
                });
                console.log("Transport authentifié avec succès");
                const adb = new Adb(transport);
                console.log("Connexion ADB établie");
                const version = await adb.getProp("ro.build.version.release");
                console.log("Version Android : ", version);
                this.resultDiv.textContent = `Version Android : ${version}`;
            } catch (error) {
                this.resultDiv.textContent = `Erreur : ${error.message}`;
                console.error(error);
            }
        });
    }
}

new AdbController(); 