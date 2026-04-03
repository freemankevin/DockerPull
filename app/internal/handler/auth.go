package handler

import (
	"database/sql"
	"docker-pull-manager/internal/middleware"
	"docker-pull-manager/internal/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type AuthHandler struct {
	db *sql.DB
}

func NewAuthHandler(db *sql.DB) *AuthHandler {
	return &AuthHandler{db: db}
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req models.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := h.getUserByUsername(req.Username)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid username or password"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid username or password"})
		return
	}

	token, err := middleware.GenerateToken(user.ID, user.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, models.LoginResponse{
		Token: token,
		User:  *user,
	})
}

func (h *AuthHandler) getUserByUsername(username string) (*models.User, error) {
	query := `SELECT id, username, password, created_at FROM users WHERE username = ?`
	var user models.User
	err := h.db.QueryRow(query, username).Scan(&user.ID, &user.Username, &user.Password, &user.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (h *AuthHandler) Me(c *gin.Context) {
	userID := c.GetInt64("user_id")
	username := c.GetString("username")

	c.JSON(http.StatusOK, models.User{
		ID:       userID,
		Username: username,
	})
}

func (h *AuthHandler) InitDefaultUser() error {
	var count int
	err := h.db.QueryRow(`SELECT COUNT(*) FROM users`).Scan(&count)
	if err != nil {
		return err
	}

	if count == 0 {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte("123456"), bcrypt.DefaultCost)
		if err != nil {
			return err
		}
		_, err = h.db.Exec(`INSERT INTO users (username, password) VALUES (?, ?)`, "admin", hashedPassword)
		if err != nil {
			return err
		}
	}

	return nil
}
