package server

import (
	"context"
	"errors"
	"strings"
	"time"

	authv1 "gitscope.com/backend-microservices/proto/auth/v1"
	dbv1 "gitscope.com/backend-microservices/proto/db/v1"
	"golang.org/x/crypto/bcrypt"
)

type AuthServer struct {
	authv1.UnimplementedAuthServiceServer
	db dbv1.DBServiceClient
}

func NewAuthServer(db dbv1.DBServiceClient) *AuthServer { return &AuthServer{db: db} }

func (s *AuthServer) Signup(ctx context.Context, req *authv1.SignupRequest) (*authv1.SignupResponse, error) {
	if err := validate(req.Username, req.Password); err != nil {
		return nil, err
	}
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()
	existsResp, err := s.db.ExistsUser(ctx, &dbv1.ExistsUserRequest{Username: req.Username})
	if err != nil {
		return nil, errors.New("database error")
	}
	if existsResp.Exists {
		return nil, errors.New("username already taken")
	}
	hashed, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, errors.New("hash error")
	}
	_, err = s.db.InsertUser(ctx, &dbv1.InsertUserRequest{Username: req.Username, Password: string(hashed)})
	if err != nil {
		return nil, errors.New("insert error")
	}
	return &authv1.SignupResponse{Message: "Signup successful!"}, nil
}

func (s *AuthServer) Login(ctx context.Context, req *authv1.LoginRequest) (*authv1.LoginResponse, error) {
	if err := validate(req.Username, req.Password); err != nil {
		return nil, errors.New("invalid credentials")
	}
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()
	credResp, err := s.db.GetUserCredentials(ctx, &dbv1.GetUserCredentialsRequest{Username: req.Username})
	if err != nil {
		return nil, errors.New("user not found")
	}
	if err := bcrypt.CompareHashAndPassword([]byte(credResp.Password), []byte(req.Password)); err != nil {
		return nil, errors.New("invalid password")
	}
	token, err := GenerateJWT(req.Username, int(credResp.UserID))
	if err != nil {
		return nil, errors.New("token error")
	}
	return &authv1.LoginResponse{Token: token}, nil
}

func validate(username, password string) error {
	username = strings.TrimSpace(username)
	if len(username) < 3 || len(username) > 64 || len(password) < 8 || len(password) > 128 {
		return errors.New("invalid username or password length")
	}
	return nil
}
