# TEST api/flavors with below curl commands

curl localhost:3000/api/flavors

curl localhost:3000/api/flavors/1 -X DELETE

curl localhost:3000/api/flavors -X POST -d '{"name": "new flavor", "is_favorite": true }' -H 'Content-Type:application/json'

curl localhost:3000/api/flavors/2 -X PUT -d '{"name": "updated flavor", "is_favorite":true }' -H 'Content-Type:application/json'
