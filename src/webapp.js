"use strict";

import MiBand from "./miband";
import { test_all, getHRMSingle, getHMRMultiple, HMRStop } from "./test";

import "./styles/index.less";

const bluetooth = navigator.bluetooth;

const output = document.querySelector("#output");

function log() {
  document.querySelector("main").style.display = "block";

  output.innerHTML += [...arguments].join(" ") + "\n";
}

async function scan() {
  if (!bluetooth) {
    log("WebBluetooth is not supported by your browser!");
    return;
  }

  try {
    log("Próba połączenia...");
    const device = await bluetooth.requestDevice({
      filters: [{ services: [MiBand.advertisementService] }],
      optionalServices: MiBand.optionalServices
    });

    device.addEventListener("gattserverdisconnected", () => {
      log("Rozłączono");
    });

    await device.gatt.disconnect();

    log("Łączenie z urządzeniem...");
    const server = await device.gatt.connect();
    log("Połączono");
    document.getElementById("singleHeartRate").disabled = false;
    let miband = new MiBand(server);

    await miband.init();
    document.getElementById("singleHeartRate").addEventListener("click", () => {
      getHRMSingle(miband, log);
    });

    document.getElementById("multiHeartRate").addEventListener("click", () => {
      getHMRMultiple(miband, log);
    });

    document.getElementById("stop").addEventListener("click", () => {
      HMRStop(miband, log);
    });

    document.getElementById("errors").addEventListener("click", () => {
      document.getElementsByClass("err-modal").classList.add('err-modal-visible');
    });

    // await test_all(miband, log);
  } catch (error) {
    log("Argh!", error);
  }
}

document.querySelector("#scanBtn").addEventListener("click", scan);








