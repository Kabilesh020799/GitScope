package server

import (
	"errors"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var jwtKey []byte

func ConfigureJWT(secret string) error {
	if len(strings.TrimSpace(secret)) < 32 {
		return errors.New("JWT_SECRET must contain at least 32 characters")
	}
	jwtKey = []byte(secret)
	return nil
}

type Claims struct {
	Username string `json:"username"`
	UserID   int    `json:"user_id"`
	jwt.RegisteredClaims
}

func GenerateJWT(username string, userID int) (string, error) {
	if len(jwtKey) == 0 {
		return "", errors.New("JWT signing key is not configured")
	}
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		Username: username,
		UserID:   userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()), Issuer: "gitscope", Audience: jwt.ClaimStrings{"gitscope-web"},
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtKey)
}
