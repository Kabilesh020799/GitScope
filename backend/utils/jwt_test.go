package utils

import (
	"github.com/golang-jwt/jwt/v5"
	"testing"
)

func TestJWTConfigureRoundTripAndRejectAlgorithm(t *testing.T) {
	if err := ConfigureJWT("01234567890123456789012345678901"); err != nil {
		t.Fatal(err)
	}
	token, err := GenerateJWT("alice", 42)
	if err != nil {
		t.Fatal(err)
	}
	claims, err := VerifyJWT(token)
	if err != nil {
		t.Fatal(err)
	}
	if claims.Username != "alice" || claims.UserID != 42 {
		t.Fatalf("unexpected claims: %#v", claims)
	}
	bad := jwt.NewWithClaims(jwt.SigningMethodHS384, &Claims{Username: "alice"})
	signed, _ := bad.SignedString([]byte("01234567890123456789012345678901"))
	if _, err := VerifyJWT(signed); err == nil {
		t.Fatal("expected non-HS256 JWT rejection")
	}
}

func TestConfigureJWTRejectsWeakSecret(t *testing.T) {
	if err := ConfigureJWT("weak"); err == nil {
		t.Fatal("expected weak secret error")
	}
}
