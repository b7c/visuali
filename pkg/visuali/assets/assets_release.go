//go:build !dev

package assets

import (
	"embed"
	"fmt"
	"io/fs"
)

//go:embed dist
var dist embed.FS

func init() {
	var err error
	Dist, err = fs.Sub(dist, "dist")
	if err != nil {
		panic(fmt.Errorf("failed to init dist fs: %s", err))
	}
}
