/*************************************************************
  Blynk is a platform with iOS and Android apps to control
  ESP32, Arduino, Raspberry Pi and the likes over the Internet.
  You can easily build mobile and web interfaces for any
  projects by simply dragging and dropping widgets.

    Downloads, docs, tutorials: https://www.blynk.io
    Sketch generator:           https://examples.blynk.cc
    Blynk community:            https://community.blynk.cc
    Follow us:                  https://www.fb.com/blynkapp
                                https://twitter.com/blynk_app

  Blynk library is licensed under MIT license
  This example code is in public domain.

 *************************************************************
  This example runs directly on ESP32 chip.

  NOTE: This requires ESP32 support package:
    https://github.com/espressif/arduino-esp32

  Please be sure to select the right ESP32 module
  in the Tools -> Board menu!

  Change WiFi ssid, pass, and Blynk auth token to run :)
  Feel free to apply it to any other example. It's simple!
 *************************************************************/

/* Comment this out to disable prints and save space */
//#define BLYNK_PRINT Serial

#define BLYNK_TEMPLATE_ID "TMPL3ZdhWBWZ0"
#define BLYNK_TEMPLATE_NAME "AgriNode"
#define BLYNK_AUTH_TOKEN "YC8igcH6u9M0RKexheZB2xk5aW8kt_9R"


#include <WiFi.h>
#include <WiFiClient.h>
#include <BlynkSimpleEsp32.h>
#include <LiquidCrystal_I2C.h>
#include <DHT.h>


#define COL 16
#define ROW 2
#define MOTOR 19

// Your WiFi credentials.
// Set password to "" for open networks.
char ssid[] = "Onichan";
char pass[] = "callme@9";

int Moist =  0;
int MotorState = 0; // Motor state
float temp = 0;
float humidity = 0;
double percentage;
// LCD config
LiquidCrystal_I2C lcd(0x27, COL, ROW);

DHT dht(26,DHT11);

// BlynkTimer to send all Data

BlynkTimer timer;

// Functions
void pushData();
void display_data();
void Motor_control();
void Moist_conv()
{
  percentage =  100.0 *((Moist - 1500) / (2835 - 1500));
    
}

BLYNK_WRITE(V3)
{
    MotorState = param.asInt();
    Motor_control();
}

void setup()
{
  // Debug
  Serial.begin(9600);

  Blynk.begin(BLYNK_AUTH_TOKEN, ssid, pass);

  // set the time interval of time
  timer.setInterval(1000L,pushData);

  // LCD init
  lcd.init();
  lcd.backlight();

  dht.begin();
  pinMode (MOTOR,OUTPUT);

  lcd.setCursor(0,0);
  lcd.print("Smart Agri");
  delay(3000);
  lcd.clear();

  timer.setInterval(1000L,pushData);
}

void loop()
{
  Blynk.run();

  //
  temp = dht.readTemperature();
  humidity = dht.readHumidity();
  Moist = analogRead(4);
  
  Moist_conv();
 
  lcd.print("T&H");
  lcd.print(temp);
  lcd.print("/");
  lcd.print(humidity);
  lcd.setCursor(0,1);
  lcd.print("Soil Moisture: ");
  lcd.print(percentage);
  delay(500);
  lcd.clear();
  timer.run();
}

void pushData()
{
  Blynk.virtualWrite(V0, Moist);
  Blynk.virtualWrite(V1, temp);
  Blynk.virtualWrite(V2, humidity);

}

void Motor_control()
{

  if(MotorState == 1)
  {
    digitalWrite(MOTOR,HIGH);
  }
  else
  {
    digitalWrite(MOTOR,LOW);
  }
}


