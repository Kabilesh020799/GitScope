package utils

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

func signingKey() ([]byte, error) {
	if len(jwtKey) == 0 {
		return nil, errors.New("JWT signing key is not configured")
	}
	return jwtKey, nil
}

type Claims struct {
	Username string `json:"username"`
	UserID   int    `json:"user_id"`
	jwt.RegisteredClaims
}

func GenerateJWT(username string, userId int) (string, error) {
	key, err := signingKey()
	if err != nil {
		return "", err
	}
	expirationTime := time.Now().Add(24 * time.Hour)

	claims := &Claims{
		Username: username,
		UserID:   userId,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime), IssuedAt: jwt.NewNumericDate(time.Now()),
			Issuer: "gitscope", Audience: jwt.ClaimStrings{"gitscope-web"},
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString(key)
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

func VerifyJWT(tokenString string) (*Claims, error) {
	key, err := signingKey()
	if err != nil {
		return nil, err
	}
	claims := &Claims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		if token.Method != jwt.SigningMethodHS256 {
			return nil, errors.New("unexpected JWT signing algorithm")
		}
		return key, nil
	}, jwt.WithValidMethods([]string{"HS256"}), jwt.WithIssuer("gitscope"), jwt.WithAudience("gitscope-web"))

	if err != nil || !token.Valid {
		return nil, err
	}

	return claims, nil
}
