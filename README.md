TODO:

- objToMap and mapToObj can obj.entries the data or for-in loop instead of doing each item manually

NODES:

- google maps
- text writing app
- finder window + search

````curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCGGlYZej80Ff9-fKytVp0W6scS7ufe2lM" \
  -H 'Content-Type: application/json' \
  -X POST \
  -d '{
    "contents": [
      {
        "parts": [
          {
            "text": "pretend you are my employer and i have just contacted you via whatsapp"
          }
        ]
      }
    ]
  }'```
````
