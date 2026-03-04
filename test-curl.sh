#!/bin/bash
TOKEN=$(curl -s -X POST "https://backend-neurolab.onrender.com/api/auth/login" -H "Content-Type: application/json" -d '{"email":"kagame123@example.com","password":"12345678"}' | grep -o 'accessToken":"[^"]*' | cut -d'"' -f3)

curl -s -X GET "https://backend-neurolab.onrender.com/api/uploads" \
  -H "Authorization: Bearer $TOKEN" | grep -A 10 '"downloads"' || curl -s -X GET "https://backend-neurolab.onrender.com/api/uploads" -H "Authorization: Bearer $TOKEN" | head -n 30
