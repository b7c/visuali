package visuali

import (
	"errors"
	"io"
	"io/fs"
	"net/http"
	"path"

	"github.com/b7c/visuali/pkg/visuali/assets"
)

func serveSPAfile(w http.ResponseWriter, r *http.Request, fsys fs.FS, name string) {
	if name == "" || name == "/" {
		name = "index.html"
	}

	f, err := fsys.Open(name)
	if err != nil {
		if !errors.Is(err, fs.ErrNotExist) {
			ErrLog.Printf("[serveSPAfile] failed to open %q: %s", name, err)
			http.NotFound(w, r)
			return
		}
		if name == "index.html" {
			WarnLog.Println("[serveSPAfile] index.html does not exist")
			http.NotFound(w, r)
			return
		}
		serveSPAfile(w, r, fsys, "index.html")
		return
	}
	defer f.Close()

	fi, err := f.Stat()
	if err != nil {
		ErrLog.Printf("[serveSPAfile] failed to stat file %q: %s", name, err)
		http.NotFound(w, r)
		return
	}
	if fi.IsDir() {
		// prevent infinite recursion if `index.html` is a directory.
		if name == "index.html" {
			WarnLog.Println("[serveSPAfile] index.html is a directory")
			http.NotFound(w, r)
			return
		}
		serveSPAfile(w, r, fsys, "index.html")
		return
	}

	if rs, ok := f.(io.ReadSeeker); ok {
		http.ServeContent(w, r, name, fi.ModTime(), rs)
	} else {
		ErrLog.Printf("[serveSPAfile] %T does not implement seeker", f)
		http.NotFound(w, r)
	}
}

// Serves static files for a single-page application,
// serving the contents of `index.html` for any non-existent file.
func ServeSPA(fsys fs.FS) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		name := path.Join("/", r.URL.Path)[1:]
		serveSPAfile(w, r, assets.Dist, name)
	}
}
