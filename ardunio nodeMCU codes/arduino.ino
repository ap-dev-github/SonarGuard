Arduino Code:
#include <Servo.h> 
const int trigPin = 10;
const int echoPin = 11;
const int buzzerPin = 8;  // Buzzer 1 control pin
const int laserPin = 7;   // Laser control pin
const int buzzerPin2 = 6; // Buzzer 2 control pin
long duration;
int distance;
Servo myServo1;
Servo myServo2;
void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(buzzerPin, OUTPUT);
  pinMode(buzzerPin2, OUTPUT);
  pinMode(laserPin, OUTPUT);
  Serial.begin(9600);
  myServo1.attach(12);
  myServo2.attach(9);
}
void loop() {
  for(int i = 15; i <= 165; i++) {  
    myServo1.write(i);
    myServo2.write(i);
    delay(30);
    distance = calculateDistance();
    Serial.print(i);
    Serial.print(",");
    Serial.print(distance);
    Serial.print(".");
    checkAlert(distance);
  }
  for(int i = 165; i >= 15; i--) {  
    myServo1.write(i);
    myServo2.write(i);
    delay(30);
    distance = calculateDistance();
    Serial.print(i);
    Serial.print(",");
    Serial.print(distance);
    Serial.print(".");
   checkAlert(distance);
  }
}
int calculateDistance() { 
  digitalWrite(trigPin, LOW); 
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH); 
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  duration = pulseIn(echoPin, HIGH);
  distance = duration * 0.034 / 2;
  return distance;
}
void checkAlert(int distance) {
  if (distance > 0 && distance <= 40) {  
    digitalWrite(buzzerPin, HIGH);  // Buzzer 1 ON
    digitalWrite(buzzerPin2, HIGH); // Buzzer 2 ON
    digitalWrite(laserPin, HIGH);   // Laser ON
    delay(100);
    digitalWrite(buzzerPin, LOW);   // Buzzer 1 OFF
    digitalWrite(buzzerPin2, LOW);  // Buzzer 2 OFF
  } else {
    digitalWrite(buzzerPin, LOW);   // Buzzer 1 OFF
    digitalWrite(buzzerPin2, LOW);  // Buzzer 2 OFF
    digitalWrite(laserPin, LOW);    // Laser OFF
  }
}