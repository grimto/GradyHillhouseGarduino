
#include "DHT.h"
#include <SPI.h>
#include <Wire.h>
#include "RTClib.h"
#include "SD.h"
#define DHTTYPE DHT22
#define ECHO_TO_SERIAL 1 //Sends datalogging to serial if 1, nothing if 0
#define LOG_INTERVAL 360000 //milliseconds between entries (6 minutes = 360000)

const int soilTempPin = A0;
const int soilMoisturePin = A1;
const int sunlightPin = A2;
const int dhtPin = 2;
const int chipSelect = 10;
const int LEDPinGreen = 6;
const int LEDPinRed = 7;
const int solenoidPin = 3;
const int wateringTime = 600000; //Set the watering time (10 min for a start)
const float wateringThreshold = 15; //Value below which the garden gets watered

DHT dht(dhtPin, DHTTYPE);
RTC_DS1307 rtc;

float soilTemp = 0; //Scaled value of soil temp (degrees F)
float soilMoistureRaw = 0; //Raw analog input of soil moisture sensor (volts)
float soilMoisture = 0; //Scaled value of volumetric water content in soil (percent)
float humidity = 0; //Relative humidity (%)
float airTemp = 0; //Air temp (degrees F)
float heatIndex = 0; //Heat index (degrees F)
float sunlight = 0; //Sunlight illumination in lux
bool watering = false;
bool wateredToday = false;
DateTime now;


void error(char *str)
{
  Serial.print("error: ");
  Serial.println(str);
  
  // red LED indicates error
  digitalWrite(LEDPinRed, HIGH);
  
  while(1);
}

void setup() {
  
  //Initialize serial connection
  Serial.begin(9600); //Just for testing
  Serial.println("Initializing SD card...");
  
  
  pinMode(chipSelect, OUTPUT); //Pin for writing to SD card
  pinMode(LEDPinGreen, OUTPUT); //LED green pint
  pinMode(LEDPinRed, OUTPUT); //LED red pin
  pinMode(solenoidPin, OUTPUT); //solenoid pin
  digitalWrite(solenoidPin, LOW); //Make sure the valve is off
  analogReference(EXTERNAL); //Sets the max voltage from analog inputs to whatever is connected to the Aref pin (should be 3.3v)
  
  //Establish connection with DHT sensor
  dht.begin();
  
  //Establish connection with real time clock
  Wire.begin();
  if (!rtc.begin()) {
    logfile.println("RTC failed");
#if ECHO_TO_SERIAL
    Serial.println("RTC failed");
#endif  //ECHO_TO_SERIAL
  }
  
  //Set the time and date on the real time clock if necessary
  if (! rtc.isrunning()) {
    // following line sets the RTC to the date & time this sketch was compiled
    rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
  }
  
  //Check if SD card is present and can be initialized
  if (!SD.begin(chipSelect)) {
    error("Card failed, or not present");        
  }
  
  Serial.println("Card initialized.");
  }
