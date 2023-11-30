// BLE variables
let SERVICE_UUID = "250b0d00-1b4f-4f16-9171-f63c733d15ab";

let mBLE;
let mCharacteristic;

let connectButton;

let readyToRead;

// project variables
let diamSmall = 17;
let diamLarge = 35;
let gridSize = 42;
let redAmount = 200;
let noiseOffset = 0;

function gotValue(error, value) {
  // BLE code
  if (error || value.charAt(0) != "{") {
    print("error: ", error || value);
    readyToRead = true;
    return;
  }

  // project code: read data from JSON
  let data = JSON.parse(value).data;
  let A0 = data.A0;
  let D2 = data.D2;

  // A0 adjusts ellipse size
  diamLarge = map(A0.value, 0, 4095, 25, 55);
  diamSmall = floor(0.5 * diamLarge);

  // D2 clicks change random seed
  if (D2.isPressed == 1) {
    noiseOffset += 0.1;
  }

  // D2 count changes red amount
  redAmount = map(D2.count % 10, 0, 9, 0, 255);

  readyToRead = true;
}

function gotCharacteristics(error, characteristics) {
  if (error) {
    print("error: ", error);
    return;
  }

  mCharacteristic = characteristics[0];
  readyToRead = true;
}

function connectToBle() {
  mBLE.connect(SERVICE_UUID, gotCharacteristics);
  connectButton.hide();
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  cBackgroundColor = 0;
  readyToRead = false;

  mBLE = new p5ble();

  connectButton = createButton("Connect To BLE");
  connectButton.position(width / 2, height / 2);
  connectButton.mousePressed(connectToBle);
}

function draw() {
  // BLE code
  if (readyToRead) {
    readyToRead = false;
    mBLE.read(mCharacteristic, "string", gotValue);
  }

  // project code
  background("white");
  randomSeed(1010);

  stroke(redAmount, 20, 20);
  fill(redAmount, 20, 20);

  for (let x = 0; x < width; x += gridSize) {
    for (let y = 0; y < height; y += gridSize) {
      if (random() < 0.6) {
        let xOffset = diamSmall * (2 * noise(x / 5, y / 5, noiseOffset) - 1);
        let yOffset = diamSmall * (2 * noise(y / 5, x / 5, noiseOffset) - 1);
        ellipse(x + xOffset, y + yOffset, diamLarge, diamLarge);
      } else {
        let xOffset = diamLarge * (2 * noise(x / 5, y / 5, noiseOffset) - 1);
        let yOffset = diamLarge * (2 * noise(y / 5, x / 5, noiseOffset) - 1);
        ellipse(x + xOffset, y + yOffset, diamSmall, diamSmall);
      }
    }
  }
}
