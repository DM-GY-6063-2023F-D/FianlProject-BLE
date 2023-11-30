#include <ArduinoJson.h>

#include "EasyBLE.h"

// BLE code
String DEVICE_NAME("myBLE");
String SERVICE_UUID("250b0d00-1b4f-4f16-9171-f63c733d15ab");

EasyBLE mBLE;

// project variables
int a0Val = 0;
int d2Val = 0;
int d2ClickCount = 0;

int prevD2Val = 0;

void updateData() {
  StaticJsonDocument<128> resJson;
  JsonObject data = resJson.createNestedObject("data");
  JsonObject A0 = data.createNestedObject("A0");
  JsonObject D2 = data.createNestedObject("D2");

  A0["value"] = a0Val;
  D2["isPressed"] = d2Val;
  D2["count"] = d2ClickCount;

  String resTxt = "";
  serializeJson(resJson, resTxt);

  mBLE.setValue(resTxt);
}

void setup() {
  // BLE setup
  Serial.begin(9600);
  while (!Serial) {}
  mBLE.setup(DEVICE_NAME, SERVICE_UUID);

  // project setup
  pinMode(2, INPUT);
}

void loop() {
  // read pins
  a0Val = analogRead(A0);
  d2Val = digitalRead(2);

  // calculate if d2 was pressed, released, clicked, etc
  if (d2Val && d2Val != prevD2Val) {
    d2ClickCount++;
  }

  prevD2Val = d2Val;

  updateData();
  delay(2);
}
