# Heimdall Api

|![](./.badges/badge-lines.svg) |![](./.badges/badge-statements.svg) | ![](./.badges/badge-branches.svg) | ![](./.badges/badge-functions.svg)| 
|--|--|--|--|


// Listar webs registradas
GET http://localhost:2104/v1/website

```json 
{
    "data": [
        {
            "_id": "638a720365c4e804d7751538",
            "webBaseUrl": "https://aj-derteano.github.io",
            "name": "porfolio",
            "description": "Web de portafolio",
            "expectResponseCode": 200,
            "deleted": false,
            "createdAt": "2022-12-02T21:45:39.209Z",
            "updatedAt": "2022-12-02T21:45:39.209Z"
        },
        {
            "_id": "638a720365c4e804d7751539",
            "webBaseUrl": "test.com",
            "name": "test",
            "description": "Web de prueba",
            "expectResponseCode": 500,
            "deleted": false,
            "createdAt": "2022-12-02T21:45:39.209Z",
            "updatedAt": "2022-12-02T21:45:39.209Z"
        },
        {
            "_id": "638a720365c4e804d775153a",
            "webBaseUrl": "https://gist.githubusercontent.com",
            "name": "Test 2",
            "description": "Web de prueba",
            "expectResponseCode": 200,
            "deleted": false,
            "createdAt": "2022-12-02T21:45:39.209Z",
            "updatedAt": "2022-12-02T21:45:39.209Z"
        }
    ]
}
```

http://localhost:2104/v1/monitor/website?daysAgo=90&webBaseUrl=https://aj-derteano.github.io

```json 
{
    "webBaseUrl": "https://aj-derteano.github.io",
    "description": "Web de portafolio",
    "globalStatus": "Operational",
    "statusDetail": [
        {
            "dateString": "2022-12-02",
            "averageResponseTimeMillis": 51.857142857142854,
            "incidentsCount": 0
        }
    ]
}
```

// Ver los resultados de los PING
GET http://localhost:2104/v1/monitor?daysAgo=90

```json
[
    {
        "webBaseUrl": "https://aj-derteano.github.io",
        "description": "Web de portafolio",
        "globalStatus": "Operational",
        "statusDetail": [
            {
                "dateString": "2022-12-02",
                "averageResponseTimeMillis": 55,
                "incidentsCount": 0
            }
        ]
    },
    {
        "webBaseUrl": "test.com",
        "description": "Web de prueba",
        "globalStatus": "Operational",
        "statusDetail": [
            {
                "dateString": "2022-12-02",
                "averageResponseTimeMillis": null,
                "incidentsCount": 6
            }
        ]
    },
    {
        "webBaseUrl": "https://gist.githubusercontent.com",
        "description": "Web de prueba",
        "globalStatus": "Operational",
        "statusDetail": [
            {
                "dateString": "2022-12-02",
                "averageResponseTimeMillis": 52,
                "incidentsCount": 0
            }
        ]
    }
]
```


curl -X POST -d '{"client_id":"admin-heimdall-client.apps.com", "client_secret":"changeme", "grant_type":"client_credentials"}' http://localhost:2104/v1/oauth2/token -H content-type:application/json


curl -X POST -d '{"username":"jane@acme.com", "secret":"changeme", "role": "read-today-detail"}' http://localhost:2104/v1/oauth2/subject -H content-type:application/json


curl -X PUT -d '{"identifier":"admin-heimdall-client.apps.com", "secret":"changeme2", "role": "admin"}' http://localhost:2104/v1/oauth2/subject -H content-type:application/json -H "Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0X2lkZW50aWZpZXIiOiJhZG1pbi1oZWltZGFsbC1jbGllbnQuYXBwcy5jb20iLCJ0eXBlIjoiYWNjIiwiaWF0IjoxNjcwODIwNDg1LCJleHAiOjE2NzA4MjQwODV9.FqgITHSyyY4M6VlIZJ2dGCi1zySvaRhwmXiLpXcBHbQ"



## Collections

| Collection | field       | type    | description |
| ---------- | ----------- | ------- | ----------- |
| webs       | webBaseUrl  | string  | endpoint for status request |
|            | name        | string  | Website name or alias |
|            | description | string  | Brief information or description of the web |
|            | expectResponseCode | number | expected response code |
| ping       | webBaseUrl  | string  | endpoint to which the query was made |
|            | timeString  | string  | Consultation time |
|            | dateString  | string  | Consultation date |
|            | responseTimeMillis | number | Response time |
|            | responseCode | string | Response code |