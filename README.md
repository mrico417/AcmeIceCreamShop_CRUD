# TEST api/flavors with below curl commands

curl localhost:3000/api/flavors

curl localhost:3000/api/flavors/1 -X DELETE

curl localhost:3000/api/flavors -X POST -d '{"txt": "a new note", "ranking":3 }' -H 'Content-Type:application/json'

curl localhost:3000/api/flavors/2 -X PUT -d '{"txt": "updated note", "ranking":10 }' -H 'Content-Type:application/json'
