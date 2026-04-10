package handler

import (
	"docker-pull-manager/internal/config"
	"docker-pull-manager/internal/database"
	"docker-pull-manager/internal/docker"
	"docker-pull-manager/internal/models"
	"docker-pull-manager/internal/service"
	"net/http"
	"os"
	"path/filepath"
	"runtime"
	"strconv"
	"strings"

	"database/sql"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	imageService   *service.ImageService
	dockerService  *docker.DockerService
	webhookService *service.WebhookService
	cfg            *config.Config
	db             *sql.DB
}

func NewHandler(imageService *service.ImageService, dockerService *docker.DockerService, webhookService *service.WebhookService, cfg *config.Config, db *sql.DB) *Handler {
	return &Handler{
		imageService:   imageService,
		dockerService:  dockerService,
		webhookService: webhookService,
		cfg:            cfg,
		db:             db,
	}
}

func (h *Handler) ListImages(c *gin.Context) {
	images, err := h.imageService.GetImages()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, images)
}

func (h *Handler) CreateImage(c *gin.Context) {
	var req models.CreateImageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	image, err := h.imageService.CreateImage(&req)
	if err != nil {
		// Check if error is due to duplicate image
		if strings.Contains(err.Error(), "already exists") {
			c.JSON(http.StatusConflict, gin.H{"error": err.Error(), "duplicate": true})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, image)
}

func (h *Handler) DeleteImage(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	if err := h.imageService.DeleteImage(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "deleted"})
}

func (h *Handler) UpdateImage(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var req models.UpdateImageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	image, err := h.imageService.UpdateImage(id, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, image)
}

func (h *Handler) GetImageLogs(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	logs, err := h.imageService.GetImageLogs(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, logs)
}

func (h *Handler) PullImage(c *gin.Context) {
	_, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	go h.imageService.ProcessPendingImages()

	c.JSON(http.StatusOK, gin.H{"message": "pull started"})
}

func (h *Handler) ExportImage(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	path, err := h.imageService.ExportImage(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"path": path})
}

func (h *Handler) GetConfig(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"export_path":        toUnixPath(h.cfg.ExportPath),
		"retry_max_attempts": h.cfg.RetryMaxAttempts,
		"retry_interval_sec": h.cfg.RetryIntervalSec,
		"enable_webhook":     h.cfg.EnableWebhook,
		"webhook_url":        h.cfg.WebhookURL,
		"webhook_type":       h.cfg.WebhookType,
		"concurrent_pulls":   h.cfg.ConcurrentPulls,
		"default_platform":   h.cfg.DefaultPlatform,
		"gzip_compression":   h.cfg.GzipCompression,
		"ghcr_token":         h.cfg.GhcrToken,
	})
}

func (h *Handler) UpdateConfig(c *gin.Context) {
	var req models.UpdateConfigRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update local config
	if req.ExportPath != "" {
		h.cfg.ExportPath = fromUnixPath(req.ExportPath)
	}
	if req.RetryMaxAttempts >= 0 {
		h.cfg.RetryMaxAttempts = req.RetryMaxAttempts
	}
	if req.RetryIntervalSec > 0 {
		h.cfg.RetryIntervalSec = req.RetryIntervalSec
	}
	h.cfg.EnableWebhook = req.EnableWebhook
	if req.WebhookURL != "" {
		h.cfg.WebhookURL = req.WebhookURL
	}
	if req.WebhookType != "" {
		h.cfg.WebhookType = req.WebhookType
	}
	if req.ConcurrentPulls > 0 {
		h.cfg.ConcurrentPulls = req.ConcurrentPulls
	}
	if req.DefaultPlatform != "" {
		h.cfg.DefaultPlatform = req.DefaultPlatform
	}
	if req.GzipCompression > 0 && req.GzipCompression <= 9 {
		h.cfg.GzipCompression = req.GzipCompression
	}
	h.cfg.GhcrToken = req.GhcrToken

	// Save to database
	settings := &models.Settings{
		ExportPath:       h.cfg.ExportPath,
		RetryMaxAttempts: h.cfg.RetryMaxAttempts,
		RetryIntervalSec: h.cfg.RetryIntervalSec,
		EnableWebhook:    h.cfg.EnableWebhook,
		WebhookURL:       h.cfg.WebhookURL,
		WebhookType:      h.cfg.WebhookType,
		ConcurrentPulls:  h.cfg.ConcurrentPulls,
		DefaultPlatform:  h.cfg.DefaultPlatform,
		GzipCompression:  h.cfg.GzipCompression,
		GhcrToken:        h.cfg.GhcrToken,
	}

	if err := database.UpdateSettings(h.db, settings); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Return updated config (without database_path)
	c.JSON(http.StatusOK, gin.H{
		"export_path":        toUnixPath(h.cfg.ExportPath),
		"retry_max_attempts": h.cfg.RetryMaxAttempts,
		"retry_interval_sec": h.cfg.RetryIntervalSec,
		"enable_webhook":     h.cfg.EnableWebhook,
		"webhook_url":        h.cfg.WebhookURL,
		"webhook_type":       h.cfg.WebhookType,
		"concurrent_pulls":   h.cfg.ConcurrentPulls,
		"default_platform":   h.cfg.DefaultPlatform,
		"gzip_compression":   h.cfg.GzipCompression,
		"ghcr_token":         h.cfg.GhcrToken,
	})
}

func (h *Handler) TestWebhook(c *gin.Context) {
	if err := h.webhookService.TestWebhook(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "webhook test sent"})
}

func (h *Handler) GetStats(c *gin.Context) {
	images, err := h.imageService.GetImages()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	var total, success, failed, pending int
	for _, img := range images {
		total++
		switch img.Status {
		case "success":
			success++
		case "failed":
			failed++
		case "pending", "pulling":
			pending++
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"total":   total,
		"success": success,
		"failed":  failed,
		"pending": pending,
	})
}

func (h *Handler) CheckPlatforms(c *gin.Context) {
	name := c.Query("name")
	tag := c.Query("tag")

	if name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "name is required"})
		return
	}

	if tag == "" {
		tag = "latest"
	}

	platforms, err := h.dockerService.GetImagePlatforms(name, tag)
	if err != nil {
		platforms, err = h.dockerService.GetImagePlatformsFromRegistry(name, tag)
		if err != nil {
			c.JSON(http.StatusOK, gin.H{"platforms": []string{"linux/amd64", "linux/arm64"}})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"platforms": platforms})
}

func toUnixPath(p string) string {
	p = strings.ReplaceAll(p, "\\", "/")
	if len(p) >= 2 && p[1] == ':' {
		drive := strings.ToLower(string(p[0]))
		p = "/" + drive + p[2:]
	}
	return p
}

func fromUnixPath(p string) string {
	if runtime.GOOS != "windows" {
		return p
	}
	// Convert /c/Users/... to C:\Users\...
	if len(p) >= 3 && p[0] == '/' && p[2] == '/' {
		drive := strings.ToUpper(string(p[1]))
		p = drive + ":" + p[2:]
	} else if len(p) == 2 && p[0] == '/' {
		// Handle /c case (just drive root)
		drive := strings.ToUpper(string(p[1]))
		p = drive + ":"
	}
	return strings.ReplaceAll(p, "/", "\\")
}

func getSpecialDirs() []map[string]interface{} {
	var specials []map[string]interface{}

	// Home directory
	home, err := os.UserHomeDir()
	if err == nil && home != "" {
		specials = append(specials, map[string]interface{}{
			"name": "Home",
			"path": toUnixPath(home),
			"icon": "home",
		})
	}

	// Desktop
	desktop := filepath.Join(home, "Desktop")
	if runtime.GOOS == "windows" {
		// Try to get Desktop from known folders on Windows
		if _, err := os.Stat(desktop); err != nil {
			desktop = filepath.Join(home, "桌面")
		}
	}
	if _, err := os.Stat(desktop); err == nil {
		specials = append(specials, map[string]interface{}{
			"name": "Desktop",
			"path": toUnixPath(desktop),
			"icon": "desktop",
		})
	}

	// Documents
	docs := filepath.Join(home, "Documents")
	if runtime.GOOS == "windows" {
		if _, err := os.Stat(docs); err != nil {
			docs = filepath.Join(home, "文档")
		}
	}
	if _, err := os.Stat(docs); err == nil {
		specials = append(specials, map[string]interface{}{
			"name": "Documents",
			"path": toUnixPath(docs),
			"icon": "documents",
		})
	}

	// Downloads
	downloads := filepath.Join(home, "Downloads")
	if runtime.GOOS == "windows" {
		if _, err := os.Stat(downloads); err != nil {
			downloads = filepath.Join(home, "下载")
		}
	}
	if _, err := os.Stat(downloads); err == nil {
		specials = append(specials, map[string]interface{}{
			"name": "Downloads",
			"path": toUnixPath(downloads),
			"icon": "downloads",
		})
	}

	// Root / System drives
	if runtime.GOOS != "windows" {
		specials = append(specials, map[string]interface{}{
			"name": "Root",
			"path": "/",
			"icon": "root",
		})
	}

	return specials
}

func (h *Handler) BrowseDirectory(c *gin.Context) {
	path := c.Query("path")
	if path == "" {
		path = "."
	}

	// Convert Unix style path to local path format
	localPath := fromUnixPath(path)
	absPath, err := filepath.Abs(localPath)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid path"})
		return
	}

	entries, err := os.ReadDir(absPath)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var dirs []map[string]interface{}
	for _, entry := range entries {
		if entry.IsDir() {
			info, err := entry.Info()
			modTime := ""
			if err == nil {
				modTime = info.ModTime().Format("2006-01-02 15:04")
			}
			dirs = append(dirs, map[string]interface{}{
				"name":    entry.Name(),
				"path":    filepath.Join(absPath, entry.Name()),
				"isDir":   true,
				"modTime": modTime,
			})
		}
	}

	parent := ""
	if absPath != "/" && !strings.HasSuffix(absPath, ":\\") {
		parent = filepath.Dir(absPath)
	}

	// Get path breadcrumbs (Unix style)
	breadcrumbs := []map[string]string{}
	parts := strings.Split(absPath, string(filepath.Separator))
	currentPath := ""
	for i, part := range parts {
		if part == "" {
			continue
		}
		if runtime.GOOS == "windows" && i == 0 && strings.HasSuffix(part, ":") {
			// Convert C: to /c
			currentPath = "/" + strings.ToLower(strings.TrimSuffix(part, ":"))
			breadcrumbs = append(breadcrumbs, map[string]string{
				"name": currentPath,
				"path": currentPath,
			})
		} else {
			currentPath = currentPath + "/" + part
			breadcrumbs = append(breadcrumbs, map[string]string{
				"name": part,
				"path": currentPath,
			})
		}
	}

	// Convert dirs paths to Unix style
	for i := range dirs {
		dirs[i]["path"] = toUnixPath(dirs[i]["path"].(string))
	}

	c.JSON(http.StatusOK, gin.H{
		"current":     toUnixPath(absPath),
		"parent":      toUnixPath(parent),
		"dirs":        dirs,
		"specials":    getSpecialDirs(),
		"breadcrumbs": breadcrumbs,
	})
}
