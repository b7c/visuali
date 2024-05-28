//go:build dev

package assets

import "os"

func init() {
	distPath := os.Getenv("VISUALI_DIST_PATH")
	if distPath == "" {
		distPath = "./app/dist"
	}
	Dist = os.DirFS(distPath)
}
