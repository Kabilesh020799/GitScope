module gitscope.com/backend-microservices/db-service

go 1.23.8

require (
	github.com/jackc/pgpassfile v1.0.0 // indirect
	github.com/jackc/pgservicefile v0.0.0-20240606120523-5a60cdf6a761 // indirect
	github.com/jackc/puddle/v2 v2.2.2 // indirect
	golang.org/x/crypto v0.33.0 // indirect
	golang.org/x/net v0.35.0 // indirect
	golang.org/x/sync v0.11.0 // indirect
	golang.org/x/sys v0.30.0 // indirect
	golang.org/x/text v0.22.0 // indirect
	google.golang.org/genproto/googleapis/rpc v0.0.0-20250218202821-56aae31c358a // indirect
	google.golang.org/protobuf v1.36.5 // indirect
)

require (
	github.com/golang/protobuf v1.5.4
	github.com/jackc/pgx/v5 v5.7.4
	gitscope.com/backend-microservices/proto v0.0.0
	google.golang.org/grpc v1.72.0
)

replace gitscope.com/backend-microservices/proto => ../proto
