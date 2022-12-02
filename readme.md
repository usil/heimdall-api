# Heimdall Api

|![](./coverage/lines.svg) |![](./coverage/statements.svg) | ![](./coverage/branches.svg) | ![](./coverage/functions.svg)| 
|--|--|--|--|



// Listar webs registradas
GET http://localhost:3000/monitor/target

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

http://localhost:3000/monitor/target/result-sumary/web1?sinceDay=90&web=https://aj-derteano.github.io

```json 
[
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
]
```

// Ver los resultados de los PING
GET http://localhost:3000/monitor/target/result-sumary/webs?sinceDay=90

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