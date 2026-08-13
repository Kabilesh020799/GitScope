package server

import "testing"

func TestJWTRequiresStrongConfiguredSecret(t *testing.T) {
	if err := ConfigureJWT("short"); err == nil {
		t.Fatal("expected weak secret rejection")
	}
	if err := ConfigureJWT("01234567890123456789012345678901"); err != nil {
		t.Fatal(err)
	}
	if _, err := GenerateJWT("alice", 7); err != nil {
		t.Fatal(err)
	}
}

func TestCredentialValidation(t *testing.T) {
	if err := validate("alice", "password1"); err != nil {
		t.Fatal(err)
	}
	if err := validate("a", "short"); err == nil {
		t.Fatal("expected invalid credential lengths")
	}
}
